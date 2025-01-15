import { Router } from 'express'
import { CampaignsController } from '../controllers/CampaignsController.js'

export const campaignsRoutes = Router()

const campaignsController = new CampaignsController()

campaignsRoutes.post('/', campaignsController.create)
campaignsRoutes.get('/', campaignsController.list)
campaignsRoutes.get('/:id', campaignsController.show)
campaignsRoutes.delete('/:id', campaignsController.delete)
