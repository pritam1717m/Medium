import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

const userRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

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
      return c.json({ error: "Unauthorized" }, 403);
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
              }
            }
          }
        },
        following: {
          select: {
            follower: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      },
      omit: {
        password: true,
      },
    });
    return c.json({user});
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
            followingId:c.get("userId"),
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
    if (id != c.get("userId")) {
      const user = await prisma.follower.findUnique({
        where: {
          followerId_followingId: {
            followerId: id,
            followingId:c.get("userId"),
          },
        },
      });
      if(user) {
        return c.json({followed : true})
      } else {
        return c.json({followed : false})
      }
    }
  } catch (e) {
    return c.json({ error: "Something went wrong, try again" }, 403);
  }
});

userRoutes.post("/get-follower", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.follower.findMany({
      where: {
        followingId: c.get("userId"),
      },
      include: {
        follower: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  } catch (e) {
    return c.json({ error: "Something went wrong, try again" }, 403);
  }
});

export default userRoutes;
