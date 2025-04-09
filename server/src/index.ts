import { Hono } from "hono";
import { cors } from "hono/cors";
import mainRoute from "./Routes";


const app = new Hono();

app.use(
  "/api/*",
  cors({
    origin: ["https://medium-by-pritam.vercel.app", "http://localhost:5173"],
    allowMethods: ["POST", "GET", "DELETE", "PUT"],
    exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
    maxAge: 600,
    credentials: true,
  })
);

app.route("/api/v1", mainRoute);

export default app;
