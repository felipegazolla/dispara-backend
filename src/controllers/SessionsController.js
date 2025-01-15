import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import bcrypt from 'bcryptjs'
const { compare } = bcrypt
import { jwtConfig } from '../configs/auth.js'
import jsonwebtoken from 'jsonwebtoken'
const { sign } = jsonwebtoken

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

    const { secret, expiresIn } = jwtConfig.jwt
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    })

    return res.json({ user, token })
  }
}
