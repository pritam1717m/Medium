import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rafael1717/common";

const blogRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();

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
      error : "Something went wrong"
    })
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
      error : "Something went wrong"
    })
  }
});

blogRoutes.put("/publish", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const {id} = await c.req.json();

  try {
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
      error : "Something went wrong"
    })
  }
});

blogRoutes.get("/", async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findMany({
      where : {
        authorId: c.get('userId')
      },
      orderBy : {
        createdAt : 'desc'
      },
    });
  
    return c.json({ post });
  } catch (err) {
    c.json({
      error : "Something went wrong"
    })
  }
}); 

blogRoutes.get("/all", async (c) => {

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.post.findMany({
      where : {
        published: true
      },
      orderBy : {
        createdAt : 'desc'
      },
      include : {
        author: {
          select: {
            name: true,
          }
        }
      }
    });
  
    return c.json({ post });
  } catch (err) {
    c.json({
      error : "Something went wrong"
    })
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
    });
  
    return c.json({ post });
  } catch (err) {
    c.json({
      error : "Something went wrong"
    })
  }
}); 

export default blogRoutes;
