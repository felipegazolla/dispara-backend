import { Router } from 'express'
import { MessagesController } from '../controllers/MessagesController.js'

export const messagesRoutes = Router()

const messagesController = new MessagesController()

messagesRoutes.post('/send', messagesController.send)
messagesRoutes.get('/', messagesController.list)
messagesRoutes.get('/:id', messagesController.show)
messagesRoutes.delete('/:id', messagesController.delete)
