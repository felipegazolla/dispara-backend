import { getClientInstance } from './client.js'
import { connection } from '../database/knex/knex.js'
import dayjs from 'dayjs'

export async function sendMessage({ numero, mensagem, user_id, campaign_id }) {
  try {
    if (!numero || !mensagem || !user_id) {
      throw new Error(
        'Os campos "numero", "mensagem" e "user_id" são obrigatórios.'
      )
    }

    const numeroComCodigo = `${numero}@c.us`
    const client = getClientInstance()

    if (!client || !client.info || !client.info.wid) {
      throw new Error('Cliente WhatsApp não inicializado ou autenticado.')
    }

    await client.sendMessage(numeroComCodigo, mensagem)
    console.log(`Mensagem enviada para ${numero}: "${mensagem}"`)

    const messageData = {
      destination_number: numero,
      message: mensagem,
      status: 'send',
      user_id,
      campaign_id: campaign_id || null,
      sended_at: dayjs().format('HH:mm YYYY-MM-DD'),
    }

    await connection('messages').insert(messageData)
    console.log('Mensagem registrada no banco de dados com sucesso.')

    return messageData
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)

    const failedData = {
      destination_number: numero,
      message: mensagem || 'Mensagem não fornecida',
      status: 'falha',
      user_id,
      campaign_id: campaign_id || null,
      sended_at: dayjs().format('HH:mm YYYY-MM-DD'),
    }

    try {
      await connection('messages').insert(failedData)
      console.log('Falha registrada no banco de dados.')
    } catch (dbError) {
      console.error('Erro ao registrar falha no banco de dados:', dbError)
    }

    throw error
  }
}
