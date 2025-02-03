import { Hono } from "hono"
import userRoutes from "./userRoutes";
import blogRoutes from "./blogRoutes";


const mainRoute = new Hono();

mainRoute.route('/user', userRoutes)
mainRoute.route('/blog', blogRoutes)

export default mainRoute;