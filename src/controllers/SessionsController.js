import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import bcrypt from 'bcryptjs';
const { compare } = bcrypt;

export class SessionsController {
  async create(req, res) {
    const { email, password } = req.body

    const user = await connection('users').where({ email }).first()

    if (!user) {
      throw new AppError('E-mail e/ou senha incorreta.', 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError('E-mail e/ou senha incorreta.', 401)
    }

    return res.json({ user })
  }
}
