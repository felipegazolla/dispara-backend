import { AppError } from '../utils/AppError.js'
import { sqliteConnection } from '../database/sqlite/sqlite.js'
import pkg from 'bcryptjs'
const { hash } = pkg

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

    const hashedPassword = await hash(password, 8)

    await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ])

    return res.status(201).json()
  }

  async update(req, res) {
    const { name, email } = req.body
    const { id } = req.params

    const db = await sqliteConnection()
    const user = await db.get('SELECT * FROM users WHERE id = (?)', [id])

    if (!user) {
      throw new AppError('Usuário não encontrado.')
    }

    const userWithUpdatedEmail = await db.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.')
    }

    user.name = name
    user.email = email

    await db.run(
      // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
      `UPDATE users SET name = ?, email = ?, updated_at = ? WHERE id = ?`,
      [user.name, user.email, new Date(), id]
    )

    return res.json()
  }
}
