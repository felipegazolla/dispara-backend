import { Router } from 'express'
import { CampaignsController } from '../controllers/CampaignsController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

export const campaignsRoutes = Router()

const campaignsController = new CampaignsController()

campaignsRoutes.use(ensureAuthenticated)

campaignsRoutes.post('/', campaignsController.create)
campaignsRoutes.get('/', campaignsController.list)
campaignsRoutes.get('/:id', campaignsController.show)
campaignsRoutes.delete('/:id', campaignsController.delete)
