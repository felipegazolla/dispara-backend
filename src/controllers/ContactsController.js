import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import dayjs from 'dayjs'

export class ContactsController {
  async create(req, res) {
    const { name, whatsapp_number, campaign_id } = req.body
    const user_id = req.user.id

    if (!name || !whatsapp_number) {
      throw new AppError(
        'Os campos "name" e "whatsapp_number" são obrigatórios.',
        400
      )
    }

    try {
      const [id] = await connection('contacts').insert({
        name,
        whatsapp_number,
        user_id,
        campaign_id: campaign_id || null,
        created_at: dayjs().format('YYYY-MM-DD HH:mm'),
      })

      return res
        .status(201)
        .json({ id, message: 'Contato criado com sucesso.' })
    } catch (error) {
      console.error('Erro ao criar contato:', error)
      throw new AppError(
        'Erro ao criar contato. Tente novamente mais tarde.',
        500
      )
    }
  }

  async list(req, res) {
    const user_id = req.user.id

    try {
      const contacts = await connection('contacts')
        .where({ user_id })
        .select('*')

      return res.status(200).json(contacts)
    } catch (error) {
      console.error('Erro ao listar contatos:', error)
      throw new AppError(
        'Erro ao listar contatos. Tente novamente mais tarde.',
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
      const contact = await connection('contacts')
        .where({ id, user_id })
        .first()

      if (!contact) {
        throw new AppError('Contato não encontrado.', 404)
      }

      return res.status(200).json(contact)
    } catch (error) {
      console.error('Erro ao buscar contato:', error)
      throw new AppError(
        'Erro ao buscar contato. Tente novamente mais tarde.',
        500
      )
    }
  }

  async updateCampaign(req, res) {
    const { id } = req.params
    const { campaign_id } = req.body
    const user_id = req.user.id

    try {
      const contact = await connection('contacts')
        .where({ id, user_id })
        .first()

      if (!contact) {
        throw new AppError('Contato não encontrado.', 404)
      }

      await connection('contacts')
        .where({ id, user_id })
        .update({ campaign_id })

      return res
        .status(200)
        .json({ message: 'Campanha associada ao contato com sucesso.' })
    } catch (error) {
      console.error('Erro ao associar campanha ao contato:', error)
      throw new AppError(
        'Erro ao associar campanha ao contato. Tente novamente mais tarde.',
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
      const rows = await connection('contacts').where({ id, user_id }).del()

      if (!rows) {
        throw new AppError('Contato não encontrado.', 404)
      }

      return res.status(200).json({ message: 'Contato deletado com sucesso.' })
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
      throw new AppError(
        'Erro ao deletar contato. Tente novamente mais tarde.',
        500
      )
    }
  }
}
