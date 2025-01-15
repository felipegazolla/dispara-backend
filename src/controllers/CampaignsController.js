import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import dayjs from 'dayjs'

export class CampaignsController {
  async create(req, res) {
    const { name, description } = req.body
    const user_id = req.user.id

    if (!name || !description) {
      throw new AppError(
        'Os campos "name" e "description" são obrigatórios.',
        400
      )
    }

    try {
      const [id] = await connection('campaigns').insert({
        name,
        description,
        user_id,
        created_at: dayjs().format('HH:mm DD/MM/YY'),
      })

      return res
        .status(201)
        .json({ id, message: 'Campanha criada com sucesso.' })
    } catch (error) {
      console.error('Erro ao criar campanha:', error)
      throw new AppError(
        'Erro ao criar campanha. Tente novamente mais tarde.',
        500
      )
    }
  }

  async list(req, res) {
    const user_id = req.user.id

    try {
      const campaigns = await connection('campaigns')
        .where({ user_id })
        .select('*')

      return res.status(200).json(campaigns)
    } catch (error) {
      console.error('Erro ao listar campanhas:', error)
      throw new AppError(
        'Erro ao listar campanhas. Tente novamente mais tarde.',
        500
      )
    }
  }

  async show(req, res) {
    const { id } = req.params
    const user_id = req.user.id

    if (!id) {
      throw new AppError('O campo "id" é obrigatório.', 400)
    }

    try {
      const campaign = await connection('campaigns')
        .where({ id, user_id })
        .first()

      if (!campaign) {
        throw new AppError('Campanha não encontrada.', 404)
      }

      return res.status(200).json(campaign)
    } catch (error) {
      console.error('Erro ao buscar campanha:', error)
      throw new AppError(
        'Erro ao buscar campanha. Tente novamente mais tarde.',
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
      const rows = await connection('campaigns').where({ id, user_id }).del()

      if (!rows) {
        throw new AppError('Campanha não encontrada.', 404)
      }

      return res.status(200).json({ message: 'Campanha deletada com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar campanha:', error)
      throw new AppError(
        'Erro ao deletar campanha. Tente novamente mais tarde.',
        500
      )
    }
  }
}
