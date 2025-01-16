import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import { DiskStorage } from '../providers/DiskStorage.js'

export class UserAvatarController {
  async update(req, res) {
    const user_id = req.user.id
    const avatarFilename = req.file.filename
    const diskStorage = new DiskStorage()

    const user = await connection('users').where({ id: user_id }).first()

    if (!user) {
      throw new AppError('Usuário não autenticado.', 401)
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar)
    }

    const filename = await diskStorage.saveFile(avatarFilename)
    user.avatar = filename

    await connection('users').update(user).where({ id: user_id })

    return res.json(user)
  }
}
