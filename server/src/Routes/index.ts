import { Hono } from "hono"
import authRoutes from "./authRoutes";
import blogRoutes from "./blogRoutes";
import userRoutes from "./userRoutes";


const mainRoute = new Hono();

mainRoute.route("/auth", authRoutes)
mainRoute.route('/user', userRoutes)
mainRoute.route('/blog', blogRoutes)

export default mainRoute;