import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import zod from 'zod'
const userRoutes = new Hono<{
    Bindings : {
        DATABASE_URL : string
    }
}>();

const signUpBody = zod.object({
    name : zod.string().min(1),
    email : zod.string().email(),
    password : zod.string().min(6),
})

userRoutes.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  await prisma.user.create({
    data: {
        name : "Pritam",
        email : "pritam123@gmail.com",
        password : "pritam@123"
    }
  })

  return c.text("Hello World");
});

userRoutes.post("/signin", (c) => {
  return c.text("Hello World");
});

export default userRoutes;
