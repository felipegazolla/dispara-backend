import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import dayjs from 'dayjs'

export class MessagesController {
  async send(req, res) {
    const { number, message } = req.body
    const user_id = req.user.id

    if (!number || !message) {
      throw new AppError('O número e a mensagem são obrigatórios.', 400)
    }

    try {
      await connection('messages').insert({
        destination_number: number,
        message,
        status: 'send',
        user_id,
        sended_at: dayjs().format('HH:mm DD/MM/YY'),
      })

      return res
        .status(201)
        .json({ message: 'Mensagem enviada e registrada com sucesso.' })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw new AppError(
        'Erro ao enviar mensagem. Tente novamente mais tarde.',
        500
      )
    }
  }

  async list(req, res) {
    const user_id = req.user.id

    try {
      const messages = await connection('messages')
        .where({ user_id })
        .select('*')

      return res.status(200).json(messages)
    } catch (error) {
      console.error('Erro ao listar mensagens:', error)
      throw new AppError(
        'Erro ao listar mensagens. Tente novamente mais tarde.',
        500
      )
    }
  }

  async show(req, res) {
    const { id } = req.params
    const user_id = req.user.id

    if (!id) {
      throw new AppError('O campo "id" é obrigatório.', 400)
    }

    try {
      const message = await connection('messages')
        .where({ id, user_id })
        .first()

      if (!message) {
        throw new AppError('Mensagem não encontrada.', 404)
      }

      return res.status(200).json(message)
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error)
      throw new AppError(
        'Erro ao buscar mensagem. Tente novamente mais tarde.',
        500
      )
    }
  }

  async delete(req, res) {
    const { id } = req.params
    const user_id = req.user.id

    if (!id) {
      throw new AppError('O campo "id" é obrigatório.', 400)
    }

    try {
      const rows = await connection('messages').where({ id, user_id }).del()

      if (!rows) {
        throw new AppError('Mensagem não encontrada.', 404)
      }

      return res.status(200).json({ message: 'Mensagem deletada com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      throw new AppError(
        'Erro ao deletar mensagem. Tente novamente mais tarde.',
        500
      )
    }
  }
}
