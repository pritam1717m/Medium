import zod from "zod";
export declare const signUpBody: zod.ZodObject<{
    name: zod.ZodString;
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    name: string;
    email: string;
    password: string;
}, {
    name: string;
    email: string;
    password: string;
}>;
export declare const signInBody: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const createBlogInput: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodAny;
}, "strip", zod.ZodTypeAny, {
    title: string;
    content?: any;
}, {
    title: string;
    content?: any;
}>;
export declare const updateBlogInput: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodAny;
    id: zod.ZodString;
}, "strip", zod.ZodTypeAny, {
    title: string;
    id: string;
    content?: any;
}, {
    title: string;
    id: string;
    content?: any;
}>;
export type SignUpInput = zod.infer<typeof signUpBody>;
export type SignInInput = zod.infer<typeof signInBody>;
export type CreateBlogInput = zod.infer<typeof createBlogInput>;
export type UpdateBlogInput = zod.infer<typeof updateBlogInput>;
