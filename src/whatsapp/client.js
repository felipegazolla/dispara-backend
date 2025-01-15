import pkg from 'whatsapp-web.js'
import { connection } from '../database/knex/knex.js'
import { EventEmitter } from 'node:events'

const { Client, LocalAuth } = pkg

let client
const qrEmitter = new EventEmitter()

export function initializeClient() {
  if (!client) {
    client = new Client({
      authStrategy: new LocalAuth({
        dataPath: './.wwebjs_auth',
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
      },
    })
    client.on('qr', qr => {
      console.log('QR Code gerado. Envie uma solicitação para visualizar.')
      qrEmitter.emit('qr', qr)
    })

    client.on('ready', async () => {
      try {
        if (!client.info) {
          console.error(
            'Cliente não está pronto. Tentando novamente em 5 segundos...'
          )
          setTimeout(() => client.emit('ready'), 5000)
          return
        }

        console.log('Cliente WhatsApp está pronto!')

        const { wid } = client.info
        const userId = wid.user

        await connection('sessions').insert({
          user_id: userId,
          wid: wid._serialized,
          status: 'authenticated',
          created_at: new Date(),
        })

        console.log('Sessão salva no banco de dados com sucesso.')
      } catch (error) {
        console.error('Erro ao salvar a sessão ou acessar client.info:', error)

        if (!connection) {
          console.error('Erro de conexão ao banco de dados.')
        }
        if (!client.info) {
          console.error('client.info ainda está nulo ou indefinido.')
        }
      }
    })

    client.on('message', async msg => {
      try {
        if (!msg.fromMe) {
          console.log(`Mensagem recebida de ${msg.from}, ignorada: ${msg.body}`)
          return
        }

        const numeroDestinatario = msg.to
        const conteudoMensagem = msg.body

        console.log(
          `Mensagem enviada para ${numeroDestinatario}: ${conteudoMensagem}`
        )

        await connection('messages').insert({
          destination_number: numeroDestinatario,
          message: conteudoMensagem,
          status: 'delivered',
          sended_at: new Date(),
        })

        console.log('Mensagem enviada salva no banco de dados com sucesso.')
      } catch (error) {
        console.error(
          'Erro ao salvar mensagem enviada no banco de dados:',
          error
        )
      }
    })

    client.on('disconnected', reason => {
      console.error('Cliente desconectado:', reason)
      client = null
    })

    client.initialize()
  }
}

export function getClientInstance() {
  if (!client) {
    console.error(
      'Cliente não está inicializado. Chame initializeClient() primeiro.'
    )
  }
  return client
}

export function getQrEmitter() {
  return qrEmitter
}

export default client
