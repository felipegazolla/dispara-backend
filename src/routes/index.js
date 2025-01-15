import { Router } from 'express'
import { usersRoutes } from './users.routes.js'
import { messagesRoutes } from './messages.routes.js'
import { campaignsRoutes } from './campaigns.routes.js'
import { whatsappRoutes } from './whatsapp.routes.js'

export const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/messages', messagesRoutes)
routes.use('/campaigns', campaignsRoutes)
routes.use('/whatsapp', whatsappRoutes)
