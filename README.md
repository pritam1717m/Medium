# @rafael1717/common
This package provides Zod validation schemas for authentication and blog-related operations. It ensures that API inputs meet the required structure and types before processing.

# Installation

```js
npm i @rafael1717/common
```
# Validation Schemas
+ Validates user signup details:
```js
const result = signUpBody.safeParse({
  name: "John Doe",
  email: "john@example.com",
  password: "securePassword123",
});
```
+ Validates user login details:
```js
const result = signInBody.safeParse({
  email: "john@example.com",
  password: "securePassword123",
});
```
+ Validates blog creation input:
```js
const result = createBlogInput.safeParse({
  title: "My First Blog",
  content: "This is my first blog post."
});
```
+ Validates blog update input:
```js
const result = updateBlogInput.safeParse({
  id: "123",
  title: "Updated Blog Title",
  content: "Updated blog content."
});
```
# TypeScript Support
+ This package provides TypeScript types inferred from Zod schemas:
```ts
type SignUpInput = zod.infer<typeof signUpBody>;
type SignInInput = zod.infer<typeof signInBody>;
type CreateBlogInput = zod.infer<typeof createBlogInput>;
type UpdateBlogInput = zod.infer<typeof updateBlogInput>;
```
