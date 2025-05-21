import { Router } from 'express'
import paymentRouter from './payment.routes'
import healthRouter from './health.routes'

const routes = Router()

routes.use('/', paymentRouter)
routes.use('/health', healthRouter)

export default routes
