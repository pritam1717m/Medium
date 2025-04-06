import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { signUpBody, signInBody } from "@rafael1717/common";
import { sign, verify } from "hono/jwt";
import bcrypt from "bcryptjs";

const authRoutes = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

authRoutes.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = signUpBody.safeParse(await c.req.json());

  if (!success) {
    c.status(400);
    return c.json({ error: "Your input is too low" });
  }
  const body = await c.req.json();

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (existingUser) {
      c.status(409);
      return c.json({ error: "User already exist" });
    }
  } catch (err) {
    return c.json({ error: "Somthing went wrong" });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({ user, token });
  } catch (err) {
    return c.json({ error: "Somthing went wrong" });
  }
});

authRoutes.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { success } = signInBody.safeParse(await c.req.json());

  if (!success) {
    c.status(400);
    return c.json({ error: "Your input is too low" });
  }
  const body = await c.req.json();

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      c.status(400);
      return c.json({ error: "User is not registered" });
    }

    try {
      const isMatched = await bcrypt.compare(body.password, user.password);
      if (!isMatched) {
        c.status(401);
        return c.json({ error: "Please enter correct password" });
      }

      const token = await sign({ id: user.id }, c.env.JWT_SECRET);
      return c.json({ user, token });
    } catch (err) {
      c.status(403);
      return c.json({ error: "Something went wrong", err });
    }
  } catch (err) {
    return c.json({ error: "Somthing went wrong" });
  }
});

authRoutes.put("/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const {name, about, links} = await c.req.json();

  try {
    const header = c.req.header("Authorization") || "";
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

    const updatedUser = await prisma.user.update({
      where : {
        id : user?.id as string
      },
      data : {
        name : name,
        about : about,
        links : links
      },
      omit : {
        password : true
      }
    })

    return c.json({updatedUser})

  } catch (e) {
    return c.json({error : "Something went wrong"}, 403)
  }
});

export default authRoutes;
