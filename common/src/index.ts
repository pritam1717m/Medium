import zod from "zod";

export const signUpBody = zod.object({
  name: zod.string().min(1),
  email: zod.string().email(),
  password: zod.string().min(6),
});

export const signInBody = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});

export const createBlogInput = zod.object({
    title : zod.string(),
    content : zod.string()
})

export const updateBlogInput = zod.object({
    title : zod.string(),
    content : zod.string(),
    id: zod.string()
})

export type SignUpInput = zod.infer<typeof signUpBody>
export type SignInInput = zod.infer<typeof signInBody>
export type CreateBlogInput = zod.infer<typeof createBlogInput>
export type UpdateBlogInput = zod.infer<typeof updateBlogInput>
