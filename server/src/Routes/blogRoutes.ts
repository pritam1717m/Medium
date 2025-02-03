import { Hono } from "hono";

const blogRoutes = new Hono();

blogRoutes.post('/blog', (c) => {
    return c.text("Hello wofksf")
})

blogRoutes.put('/blog', (c) => {
    return c.text("dsfsdf")
})

blogRoutes.get('/blog/:id', (c) => {
    return c.text("sdgsg")
})

export default blogRoutes