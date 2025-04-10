import { Context, Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rafael1717/common";
import { BlogRateLimiter } from "../lib/rateLimiter";

const blogRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

// blogRoutes.use(async (c, next) => {
//   const rateLimit = BlogRateLimiter.getInstance(c as Context);
//   const ip = c.req.raw.headers.get("CF-Connecting-IP");
//   const { success } = await rateLimit.limit(ip ?? "anonymous");
//   if(success) {
//     await next();
//   } else {
//     return c.json({message : "Too many requests"}, 429)
//   }
// });

blogRoutes.use("/*", async (c, next) => {
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

blogRoutes.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = createBlogInput.safeParse(await c.req.json());

  if (!success) {
    c.status(400);
    return c.json({ error: "Your input is too low" });
  }

  const body = await c.req.json();

  try {
    const post = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: c.get("userId"),
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.put("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = updateBlogInput.safeParse(await c.req.json());

  if (!success) {
    c.status(400);
    return c.json({ error: "Your input is too low" });
  }

  const body = await c.req.json();

  try {
    const post = await prisma.post.update({
      where: {
        id: body.id,
      },
      data: {
        title: body.title,
        content: body.content,
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.put("/publish", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { id } = await c.req.json();

  try {
    const isContent = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    if (isContent?.content && typeof isContent.content === "object") {
      if (Object.keys(isContent.content as object).length === 0) {
        c.status(404);
        return c.json({ error: "Content not found" });
      }
    }
    const post = await prisma.post.update({
      where: {
        id: id,
      },
      data: {
        published: true,
      },
    });
    return c.json({
      id: post.id,
    });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.get("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findMany({
      where: {
        authorId: c.get("userId"),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ post });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.get("/all", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        votes: {
          select: {
            userId: true,
            voteType: true,
          },
        },
      },
    });
    if (!posts) {
      return c.json({ error: "Blog not found" }, 404);
    }

    const formattedPosts = posts.map((post) => {
      let upvotes = 0;
      let downvotes = 0;

      post.votes.forEach((vote) => {
        if (vote.voteType === "UP") {
          upvotes++;
        } else if (vote.voteType === "DOWN") {
          downvotes++;
        }
      });

      const { votes, ...rest } = post;

      return {
        ...rest,
        upvotes,
        downvotes,
      };
    });

    return c.json({ posts: formattedPosts });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.get("/draft", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findMany({
      where: {
        authorId: c.get("userId"),
        published: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ post });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.get("/published", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findMany({
      where: {
        authorId: c.get("userId"),
        published: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return c.json({ post });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.get("/:id", async (c) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            name: true,
          },
        },
        votes: {
          select: {
            userId: true,
            voteType: true,
          },
        },
      },
    });

    if (!post) {
      return c.json({ error: "Blog not found" }, 404);
    }

    let upvotes = 0;
    let downvotes = 0;

    post?.votes.forEach((vote) => {
      if (vote.voteType === "UP") {
        upvotes++;
      } else if (vote.voteType === "DOWN") {
        downvotes++;
      }
    });

    const { votes, ...rest } = post;

    return c.json({
      post: {
        ...rest,
        upvotes,
        downvotes,
      },
    });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.post.delete({
      where: {
        id: id,
      },
    });
    return c.json({ message: "Deleted successfully" });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

blogRoutes.post("/upvote", async (c) => {
  const { id } = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.vote.upsert({
      where: {
        userId_postId: {
          userId: c.get("userId"),
          postId: id as string,
        },
      },
      update: {
        voteType: "UP",
      },
      create: {
        userId: c.get("userId"),
        postId: id,
        voteType: "UP",
      },
    });

    const upvote = await prisma.vote.count({
      where: {
        postId: id,
        voteType: "UP",
      },
    });

    return c.json(upvote);
  } catch (e) {
    return c.json({ error: "Error while upvoting" + e }, 400);
  }
});

blogRoutes.post("/downvote", async (c) => {
  const { id } = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.vote.upsert({
      where: {
        userId_postId: {
          userId: c.get("userId"),
          postId: id as string,
        },
      },
      update: {
        voteType: "DOWN",
      },
      create: {
        userId: c.get("userId"),
        postId: id,
        voteType: "DOWN",
      },
    });

    const downvote = await prisma.vote.count({
      where: {
        postId: id,
        voteType: "DOWN",
      },
    });

    return c.json(downvote);
  } catch (e) {
    return c.json({ error: "Error while downvoting" }, 400);
  }
});

blogRoutes.post("/views", async (c) => {
  const { id } = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findFirst({
      where: {
        id: id,
      },
    });
    if (post) {
      await prisma.view.upsert({
        where: {
          userId_postId: {
            userId: c.get("userId"),
            postId: id as string,
          },
        },
        update: {
          count: {
            increment: 1,
          },
        },
        create: {
          userId: c.get("userId"),
          postId: id,
          count: 1,
        },
      });
    }
    return c.json({ message: "views updated" });
  } catch (err) {
    c.json({
      error: "Something went wrong",
    });
  }
});

export default blogRoutes;
