import { Router } from 'express'
import { UserController } from '../controllers/UserController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'

export const usersRoutes = Router()

const userController = new UserController()

usersRoutes.post('/', userController.create)
usersRoutes.put('/', ensureAuthenticated, userController.update)
