import { AppError } from '../utils/AppError.js'
import { sqliteConnection } from '../database/sqlite/sqlite.js'
import pkg from 'bcryptjs'
const { hash, compare } = pkg

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
    const { name, email, password, old_password } = req.body
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

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (password && !old_password) {
      throw new AppError('A senha antiga é necessária.')
    }

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)

      if (!checkOldPassword) {
        throw new AppError('Senha antiga não confere.')
      }

      user.password = await hash(password, 8)
    }

    await db.run(
      `UPDATE users SET 
      name = ?, 
      email = ?,
      password = ?,
      updated_at = DATETIME('now') 
      WHERE id = ?`,
      [user.name, user.email, user.password, id]
    )

    return res.json()
  }
}
