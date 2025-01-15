import { Router } from 'express'
import {
  initializeClient,
  getClientInstance,
  getQrEmitter,
} from '../whatsapp/client.js'
import { connection } from '../database/knex/knex.js'
import QRCode from 'qrcode'

export const whatsappRoutes = Router()

whatsappRoutes.get('/sessions', async (req, res) => {
  try {
    const sessions = await connection('sessions').select('*')
    return res.status(200).json(sessions)
  } catch (error) {
    console.error('Erro ao listar sessões:', error)
    return res.status(500).json({ error: 'Erro ao listar sessões.' })
  }
})

whatsappRoutes.get('/auth', (req, res) => {
  initializeClient()

  const client = getClientInstance()

  if (client?.info?.wid) {
    return res.status(200).json({ message: 'Cliente já está autenticado.' })
  }

  const qrEmitter = getQrEmitter()
  qrEmitter.once('qr', async qr => {
    try {
      const qrCodeImage = await QRCode.toDataURL(qr)
      const imageBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64')

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': imageBuffer.length,
      })
      res.end(imageBuffer)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      res.status(500).json({ error: 'Erro ao gerar QR Code.' })
    }
  })
})

whatsappRoutes.get('/status', (req, res) => {
  const client = getClientInstance()

  if (client?.info?.wid) {
    return res.status(200).json({
      message: 'Cliente autenticado.',
      wid: client.info.wid,
    })
  }

  return res.status(401).json({ message: 'Cliente não está autenticado.' })
})
