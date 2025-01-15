import jsonwebtoken from 'jsonwebtoken'
const { verify } = jsonwebtoken
import { AppError } from '../utils/AppError.js'
import { jwtConfig } from '../configs/auth.js'

export function ensureAuthenticated(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError('JWT Token não informado.', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: user_id } = verify(token, jwtConfig.jwt.secret)

    req.user = {
      id: Number(user_id),
    }

    return next()
  } catch {
    throw new AppError('JWT Token inválido.', 401)
  }
}
