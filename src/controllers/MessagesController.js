import { AppError } from '../utils/AppError.js'
import { sendMessage } from '../whatsapp/sendMessage.js'
import { getClientInstance } from '../whatsapp/client.js'

export class MessagesController {
  async send(req, res) {
    const { number, message, campaign_id } = req.body
    const user_id = req.user.id

    if (!number || !message) {
      throw new AppError('O número e a mensagem são obrigatórios.', 400)
    }

    try {
      const client = getClientInstance()

      if (!client || !client.info || !client.info.wid) {
        throw new AppError('Cliente WhatsApp não está autenticado.', 401)
      }

      const messageData = await sendMessage({
        numero: number,
        mensagem: message,
        user_id,
        campaign_id,
      })

      return res.status(201).json({
        message: 'Mensagem enviada com sucesso.',
        data: messageData,
      })
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      throw new AppError(
        'Erro ao enviar mensagem. Tente novamente mais tarde.',
        500
      )
    }
  }
}
