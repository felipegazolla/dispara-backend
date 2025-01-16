import dayjs from 'dayjs'
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

    const result = await db.run(
      'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, dayjs().format('HH:mm DD-MM-YYYY')]
    )

    const userId = result.lastID

    await db.run(
      'INSERT INTO credits (user_id, credits, updated_at) VALUES (?, ?, ?)',
      [userId, 10, dayjs().format('HH:mm DD-MM-YYYY')]
    )

    return res.status(201).json({ message: 'Usuário criado com sucesso.' })
  }

  async update(req, res) {
    const { name, email, password, old_password } = req.body
    const user_id = req.user.id

    const db = await sqliteConnection()

    const user = await db.get('SELECT * FROM users WHERE id = (?)', [user_id])

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
        updated_at = ?
      WHERE id = ?`,
      [
        user.name,
        user.email,
        user.password,
        dayjs().format('HH:mm DD-MM-YYYY'),
        user_id,
      ]
    )

    return res.status(200).json({ message: 'Usuário atualizado com sucesso.' })
  }
}
