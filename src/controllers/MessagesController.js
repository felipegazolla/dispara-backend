import { connection } from '../database/knex/knex.js'

export class MessagesController {
  async send(req, res) {
    const { number, message, sendBy } = req.body

    if (!number || !message || !sendBy) {
      return res.status(400).json({
        error: 'Os campos "numero", "message" e "enviadoPor" são obrigatórios.',
      })
    }

    try {
      await connection('messages').insert({
        destination_number: number,
        message,
        status: 'send',
        user_id: sendBy,
        sended_at: new Date(),
      })

      return res
        .status(201)
        .json({ message: 'Mensagem enviada e registrada com sucesso.' })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      return res
        .status(500)
        .json({ error: 'Erro ao enviar mensagem. Tente novamente mais tarde.' })
    }
  }

  async list(req, res) {
    try {
      const messages = await connection('messages').select('*')
      return res.status(200).json(messages)
    } catch (error) {
      console.error('Erro ao listar mensagens:', error)
      return res.status(500).json({
        error: 'Erro ao listar mensagens. Tente novamente mais tarde.',
      })
    }
  }

  async show(req, res) {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'O campo "id" é obrigatório.' })
    }

    try {
      const message = await connection('messages').where({ id }).first()

      if (!message) {
        return res.status(404).json({ error: 'Mensagem não encontrada.' })
      }

      return res.status(200).json(message)
    } catch (error) {
      console.error('Erro ao buscar mensagem:', error)
      return res
        .status(500)
        .json({ error: 'Erro ao buscar mensagem. Tente novamente mais tarde.' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    if (!id) {
      return res.status(400).json({ error: 'O campo "id" é obrigatório.' })
    }

    try {
      const rows = await connection('messages').where({ id }).del()

      if (!rows) {
        return res.status(404).json({ error: 'Mensagem não encontrada.' })
      }

      return res.status(200).json({ message: 'Mensagem deletada com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error)
      return res.status(500).json({
        error: 'Erro ao deletar mensagem. Tente novamente mais tarde.',
      })
    }
  }
}
