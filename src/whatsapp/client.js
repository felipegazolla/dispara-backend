import pkg from 'whatsapp-web.js'
import EventEmitter from 'node:events'

const { Client, LocalAuth } = pkg

const qrEmitter = new EventEmitter()
let clientInstance = null

export const initializeClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = new Client({
    authStrategy: new LocalAuth({ clientId: 'default' }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  })

  clientInstance.on('qr', qr => {
    console.log('QR Code recebido. Escaneie para autenticar.')
    qrEmitter.emit('qr', qr)
  })

  clientInstance.on('authenticated', () => {
    console.log('Cliente autenticado com sucesso.')
  })

  clientInstance.on('ready', () => {
    console.log('Cliente WhatsApp pronto!')
  })

  clientInstance.on('auth_failure', message => {
    console.error('Falha na autenticação:', message)
    clientInstance = null
  })

  clientInstance.on('disconnected', reason => {
    console.log(`Cliente desconectado: ${reason}`)
    clientInstance = null
  })

  clientInstance.initialize()
  return clientInstance
}

export const getClientInstance = () => clientInstance
export const getQrEmitter = () => qrEmitter
