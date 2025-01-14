import { AppError } from '../utils/AppError.js'
import { sqliteConnection } from '../database/sqlite/sqlite.js'

export class UserController {
  async create(req, res) {
    const { name, email, password } = req.body
    const db = await sqliteConnection()
    const checkUserExists = await db.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (checkUserExists) {
      throw new AppError('Este e-mail já está em uso.')
    }

    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      password,
    ])

    return res.status(201).json()
  }
}
