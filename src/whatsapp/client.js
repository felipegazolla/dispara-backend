import pkg from 'whatsapp-web.js'
import EventEmitter from 'node:events'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const { Client, LocalAuth } = pkg

const qrEmitter = new EventEmitter()
let clientInstance = null
let isQrEmitted = false
let isClientReady = false

export const initializeClient = async () => {
  if (clientInstance) {
    console.log('Cliente já inicializado.')
    return clientInstance
  }

  clientInstance = new Client({
    authStrategy: new LocalAuth({ clientId: 'default' }),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
  })

  clientInstance.on('qr', qr => {
    if (!isClientReady && !isQrEmitted) {
      console.log('QR Code recebido. Escaneie para autenticar.')
      qrEmitter.emit('qr', qr)
      isQrEmitted = true
    }
  })

  clientInstance.on('authenticated', () => {
    console.log('Cliente autenticado com sucesso.')
    isClientReady = true
    isQrEmitted = false
    qrEmitter.removeAllListeners('qr')
  })

  clientInstance.on('ready', () => {
    console.log('Cliente WhatsApp pronto!')
    isClientReady = true

    setInterval(async () => {
      try {
        await clientInstance.getState()
      } catch (error) {
        console.error('Erro ao verificar estado do cliente:', error.message)
      }
    }, 60000)
  })

  clientInstance.on('auth_failure', message => {
    console.error('Falha na autenticação:', message)
    isClientReady = false
    clientInstance = null
  })

  clientInstance.on('disconnected', async reason => {
    console.log(`Cliente desconectado: ${reason}`)
    isClientReady = false
    clientInstance = null

    try {
      const authPath = path.resolve(
        __dirname,
        '../.wwebjs_auth/session-default'
      )
      if (fs.existsSync(authPath)) {
        await fs.promises.rm(authPath, { recursive: true, force: true })
        console.log('Diretório de autenticação limpo com sucesso.')
      }
    } catch (error) {
      console.error(
        'Erro ao limpar o diretório de autenticação:',
        error.message
      )
    }
  })

  try {
    await clientInstance.initialize()
  } catch (error) {
    console.error('Erro ao inicializar o cliente:', error.message)
    throw new Error('Falha ao inicializar o cliente WhatsApp.')
  }

  return clientInstance
}

export const getClientInstance = () => clientInstance
export const getQrEmitter = () => qrEmitter
