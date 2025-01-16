import { Router } from 'express'
import { MessagesController } from '../controllers/MessagesController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'
import { formatNumber } from '../middlewares/formatNumber.js'

export const messagesRoutes = Router()

const messagesController = new MessagesController()

messagesRoutes.use(ensureAuthenticated)

messagesRoutes.post('/send', formatNumber, (req, res) =>
  messagesController.send(req, res)
)
messagesRoutes.get('/', (req, res) => messagesController.list(req, res))
messagesRoutes.get('/:id', (req, res) => messagesController.show(req, res))
messagesRoutes.delete('/:id', (req, res) => messagesController.delete(req, res))
