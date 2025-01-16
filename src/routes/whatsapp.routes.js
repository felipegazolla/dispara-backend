import { Router } from 'express'
import {
  initializeClient,
  getClientInstance,
  getQrEmitter,
} from '../whatsapp/client.js'
import QRCode from 'qrcode'

export const whatsappRoutes = Router()

whatsappRoutes.get('/auth', (req, res) => {
  const client = initializeClient()

  if (client?.info?.wid) {
    return res.status(200).json({ message: 'Cliente já autenticado.' })
  }

  const qrEmitter = getQrEmitter()
  qrEmitter.once('qr', async qr => {
    try {
      const qrCodeImage = await QRCode.toBuffer(qr)

      res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': qrCodeImage.length,
      })
      res.end(qrCodeImage)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
      res.status(500).json({ error: 'Erro ao gerar QR Code.' })
    }
  })
})

whatsappRoutes.get('/status', (req, res) => {
  const client = getClientInstance()

  if (client?.info) {
    return res.status(200).json({
      message: 'Cliente autenticado.',
      wid: client.info.wid._serialized,
    })
  }

  return res.status(401).json({ message: 'Cliente não está autenticado.' })
})
