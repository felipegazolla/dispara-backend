import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import dayjs from 'dayjs'

export class CampaignsController {
  async create(req, res) {
    const { name, description, contact_ids } = req.body
    const user_id = req.user.id

    if (!name || !description || !contact_ids || contact_ids.length === 0) {
      throw new AppError(
        'Os campos "name", "description" e "contact_ids" são obrigatórios. Pelo menos um contato deve ser associado à campanha.',
        400
      )
    }

    try {
      // Verifica se todos os contatos existem e pertencem ao usuário
      const contacts = await connection('contacts')
        .whereIn('id', contact_ids)
        .andWhere({ user_id })
        .select('id')

      if (contacts.length !== contact_ids.length) {
        throw new AppError(
          'Alguns contatos fornecidos não existem ou não pertencem ao usuário.',
          400
        )
      }

      // Cria a campanha
      const [campaign_id] = await connection('campaigns').insert({
        name,
        description,
        user_id,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })

      // Associa os contatos à campanha
      await connection('contacts')
        .whereIn('id', contact_ids)
        .update({ campaign_id })

      return res
        .status(201)
        .json({ campaign_id, message: 'Campanha criada com sucesso.' })
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

      // Recupera os contatos associados
      const contacts = await connection('contacts')
        .where({ campaign_id: id })
        .select('id', 'name', 'whatsapp_number')

      return res.status(200).json({ ...campaign, contacts })
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
