import { AppError } from '../utils/AppError.js'

export function formatNumber(req, res, next) {
  if (!req.body.numbers) {
    return next()
  }

  try {
    req.body.numbers = req.body.numbers
      .split(',')
      .map(num => {
        let cleaned = num.replace(/\D/g, '')
        if (cleaned.length === 13 && cleaned.substring(4, 5) === '9') {
          cleaned = cleaned.substring(0, 4) + cleaned.substring(5)
        }
        return cleaned
      })
      .filter(num => num.length > 0)
      .join(',')

    next()
  } catch (error) {
    console.error('Erro ao formatar números:', error)
    throw new AppError('Erro ao formatar os números de telefone.', 400)
  }
}
