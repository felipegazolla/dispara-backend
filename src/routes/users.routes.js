import { response, Router } from 'express'
import { UserController } from '../controllers/UserController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'
import multer from 'multer'
import { MULTER } from '../configs/upload.js'
import { UserAvatarController } from '../controllers/UserAvatarController.js'

export const usersRoutes = Router()
const upload = multer(MULTER)

const userController = new UserController()
const userAvatarController = new UserAvatarController()

usersRoutes.post('/', userController.create)
usersRoutes.put('/', ensureAuthenticated, userController.update)
usersRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
)
