import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Hono } from "hono";
import { verify } from "hono/jwt";
import { UserRateLimiter } from "../lib/rateLimiter";

const userRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

userRoutes.use(async (c, next) => {
  const rateLimit = UserRateLimiter.getInstance(c as Context);
  const ip = c.req.raw.headers.get("CF-Connecting-IP");
  const { success } = await rateLimit.limit(ip ?? "anonymous");
  if(success) {
    await next();
  } else {
    return c.json({message : "Too many requests"}, 429)
  }
});

userRoutes.use("/*", async (c, next) => {
  try {
    const header = c.req.header("authorization") || "";
    if (!header.startsWith("Bearer ")) {
      return c.json({ error: "Missing or invalid authorization header" }, 401);
    }

    const token = header.split(" ")[1];
    if (!token) {
      return c.json({ error: "Token not provided" }, 401);
    }

    const user = await verify(token, c.env.JWT_SECRET);
    if (!user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    c.set("userId", user.id as string);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid or expired token" }, 401);
  }
});

userRoutes.get("/me", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: c.get("userId"),
      },
      include: {
        followers: {
          select: {
            following: {
              select: {
                id: true,
                name: true,
                about: true,
              },
            },
          },
        },
        following: {
          select: {
            follower: {
              select: {
                id: true,
                name: true,
                about: true,
              },
            },
          },
        },
      },
      omit: {
        password: true,
      },
    });
    return c.json({ user });
  } catch (e) {
    return c.json({ error: "Error while fetching user" }, 403);
  }
});

userRoutes.put("/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { name, about, links } = await c.req.json();

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: c.get("userId"),
      },
      data: {
        name: name,
        about: about,
        links: links,
      },
      omit: {
        password: true,
      },
    });

    return c.json({ updatedUser });
  } catch (e) {
    return c.json({ error: "Something went wrong" }, 403);
  }
});

userRoutes.post("/follow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { id } = await c.req.json();
    const currentUserId = c.get("userId");

    if (id !== currentUserId) {
      const existingFollow = await prisma.follower.findUnique({
        where: {
          followerId_followingId: {
            followerId: id,
            followingId: currentUserId,
          },
        },
      });

      if (!existingFollow) {
        await prisma.follower.create({
          data: {
            followerId: id,
            followingId: currentUserId,
          },
        });
      }
    }
    return c.json({ message: "Follower added" });
  } catch (e) {
    return c.json({ error: "Something went wrong, try again" + e }, 403);
  }
});

userRoutes.post("/unfollow", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { id } = await c.req.json();
    if (id != c.get("userId")) {
      await prisma.follower.delete({
        where: {
          followerId_followingId: {
            followerId: id,
            followingId: c.get("userId"),
          },
        },
      });
    }
  } catch (e) {
    return c.json({ error: "Something went wrong, try again" }, 403);
  }
});

userRoutes.post("/check-followed", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { id } = await c.req.json();
    const currentUserId = c.get("userId");

    if (!id || !currentUserId) {
      return c.json({ error: "Missing user ID(s)" }, 400);
    }

    if (id === currentUserId) {
      return c.json({ followed: false });
    }

    const user = await prisma.follower.findUnique({
      where: {
        followerId_followingId: {
          followerId: id,
          followingId: currentUserId,
        },
      },
    });
    return c.json({ followed: !!user });
  } catch (e) {
    return c.json({ error: "Something went wrong, try again" }, 403);
  }
});

userRoutes.post("/check-voted", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const { id } = await c.req.json();
    const currentUserId = c.get("userId");

    if (!id || !currentUserId) {
      return c.json({ error: "Missing user ID(s)" }, 400);
    }

    const vote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: c.get("userId"),
          postId: id,
        },
      },
    });
    if(!vote) {
      return c.json({message: "Not voted yet"})
    }
    return c.json({ vote: vote?.voteType });

  } catch (e) {
    return c.json({ error: "Something went wrong, try again" }, 403);
  }
});

export default userRoutes;
