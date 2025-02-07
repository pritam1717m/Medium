import { Hono } from 'hono'
import mainRoute from './Routes'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())
app.route('/api/v1', mainRoute)


export default app
