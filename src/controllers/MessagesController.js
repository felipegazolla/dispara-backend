import { AppError } from '../utils/AppError.js'
import { getClientInstance } from '../whatsapp/client.js'
import { connection } from '../database/knex/knex.js'
import pkg from 'whatsapp-web.js'
import dayjs from 'dayjs'

const { MessageMedia } = pkg

export class MessagesController {
  async send(req, res) {
    const { numbers, message, campaign_id } = req.body
    const user_id = req.user.id

    if (!numbers || !message) {
      throw new AppError('Os números e a mensagem são obrigatórios.', 400)
    }

    const client = getClientInstance()
    if (!client || !client.info || !client.info.wid) {
      throw new AppError('Cliente WhatsApp não autenticado.', 401)
    }

    const userCredits = await connection('credits').where({ user_id }).first()

    if (!userCredits || userCredits.credits <= 0) {
      throw new AppError('Créditos insuficientes para enviar mensagens.', 403)
    }

    const numberList = numbers.split(',').map(num => num.trim())
    const totalNumbers = numberList.length

    if (userCredits.credits < totalNumbers) {
      throw new AppError(
        `Você tem apenas ${userCredits.credits} crédito(s) disponível(is), mas tentou enviar para ${totalNumbers} número(s).`,
        403
      )
    }

    let media = null
    if (req.file) {
      const { mimetype, originalname, buffer } = req.file
      media = new MessageMedia(
        mimetype,
        buffer.toString('base64'),
        originalname
      )
    }

    const results = []
    let successCount = 0

    for (const number of numberList) {
      try {
        const numeroComCodigo = `${number}@c.us`

        if (media) {
          await client.sendMessage(numeroComCodigo, media, { caption: message })
        } else {
          await client.sendMessage(numeroComCodigo, message)
        }

        const messageData = {
          destination_number: number,
          message,
          status: 'send',
          user_id,
          campaign_id: campaign_id || null,
          sended_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }

        await connection('messages').insert(messageData)
        successCount++
        results.push({ number, status: 'success', data: messageData })
      } catch (error) {
        results.push({ number, status: 'error', error: error.message })
      }
    }

    if (successCount > 0) {
      await connection('credits')
        .where({ user_id })
        .decrement('credits', successCount)
    }

    return res.status(200).json({
      message: 'Envio processado.',
      successCount,
      totalNumbers,
      remainingCredits: userCredits.credits - successCount,
      results,
    })
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

      return res.status(200).json({
        message: 'Mensagem recuperada com sucesso.',
        data: message,
      })
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
