import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const userRoutes = new Hono<{
    Bindings : {
        DATABASE_URL : string
    }
}>();

userRoutes.post("/signup", (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  return c.text("Hello World");
});

userRoutes.post("/signin", (c) => {
  return c.text("Hello World");
});

export default userRoutes;
