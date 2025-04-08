import { Context, Env, Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rafael1717/common";
import { Ratelimit } from "@upstash/ratelimit";
import { BlankInput } from "hono/types";
import { env } from "hono/adapter";
import { Redis } from "@upstash/redis/cloudflare";

const blogRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
  };
  Variables: {
    userId: string;
    rateLimit: Ratelimit;
  };
}>();

const cache = new Map();

class RedisRateLimiter {
  static instance: Ratelimit;

  static getInstance(c: Context<Env, "/api/v1", BlankInput>) {
    if (!this.instance) {
      const { UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN } = env<{
        UPSTASH_REDIS_REST_URL: string;
        UPSTASH_REDIS_REST_TOKEN: string;
      }>(
        c as Context<{
          Bindings: {
            UPSTASH_REDIS_REST_URL: string;
            UPSTASH_REDIS_REST_TOKEN: string;
          };
        }>
      );

      const redisClient = new Redis({
        url: UPSTASH_REDIS_REST_URL,
        token: UPSTASH_REDIS_REST_TOKEN,
      });

      const rateLimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(15, "60 s"),
        ephemeralCache: cache,
      });

      this.instance = rateLimit;
      return this.instance;
    } else {
      return this.instance;
    }
  }
}

blogRoutes.use(async (c, next) => {
  const rateLimit = RedisRateLimiter.getInstance(c as Context);
  c.set("rateLimit", rateLimit as Ratelimit);
  await next();
});

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
      return c.json({ error: "Unauthorized" }, 403);
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

  const rateLimit = c.get("rateLimit");
  const ip = c.req.raw.headers.get("CF-Connecting-IP");

  const { success } = await rateLimit.limit(ip ?? "anonymous");

  if (success) {
    try {
      const post = await prisma.post.findMany({
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
        },
      });

      return c.json({ post });
    } catch (err) {
      c.json({
        error: "Something went wrong",
      });
    }
  } else {
    return c.json({message : "Too many requests"}, 429)
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
      },
    });

    return c.json({ post });
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
          userId: c.get("userId"),
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
