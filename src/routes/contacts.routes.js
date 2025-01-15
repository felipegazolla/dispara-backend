import { Router } from 'express'
import { ContactsController } from '../controllers/ContactsController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

export const contactsRoutes = Router()

const contactsController = new ContactsController()

contactsRoutes.use(ensureAuthenticated)

contactsRoutes.post('/', contactsController.create)
contactsRoutes.get('/', contactsController.list)
contactsRoutes.get('/:id', contactsController.show)
contactsRoutes.patch('/:id/campaign', contactsController.updateCampaign)
contactsRoutes.delete('/:id', contactsController.delete)
