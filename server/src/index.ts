import { Hono } from 'hono'
import mainRoute from './Routes'


const app = new Hono()

app.route('/api/v1', mainRoute)


export default app
