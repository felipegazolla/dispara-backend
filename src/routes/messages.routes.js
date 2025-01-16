import { Router } from 'express'
import { MessagesController } from '../controllers/MessagesController.js'
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated.js'
import multer from 'multer'

const upload = multer()
export const messagesRoutes = Router({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Apenas arquivos de imagem são permitidos.'))
    }
  },
})

const messagesController = new MessagesController()

messagesRoutes.use(ensureAuthenticated)

messagesRoutes.post('/send', upload.single('file'), (req, res) =>
  messagesController.send(req, res)
)
messagesRoutes.get('/', (req, res) => messagesController.list(req, res))
messagesRoutes.get('/:id', (req, res) => messagesController.show(req, res))
messagesRoutes.delete('/:id', (req, res) => messagesController.delete(req, res))
