import { Router } from 'express'
import { ReportsController } from '../controllers/ReportsController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

export const reportsRoutes = Router()

const reportsController = new ReportsController()

reportsRoutes.use(ensureAuthenticated)

reportsRoutes.post('/', reportsController.create)
reportsRoutes.get('/', reportsController.list)
reportsRoutes.get('/:id', reportsController.show)
reportsRoutes.delete('/:id', reportsController.delete)
