import { connection } from '../database/knex/knex.js'

export class CampaignsController {
  async create(req, res) {
    const { name, description, criadoPor } = req.body

    try {
      const [id] = await connection('campaigns').insert({
        name,
        description,
        user_id: criadoPor,
        created_at: new Date(),
      })

      return res
        .status(201)
        .json({ id, message: 'Campanha criada com sucesso.' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar campanha.' })
    }
  }

  async list(req, res) {
    try {
      const campaigns = await connection('campaigns').select('*')
      return res.status(200).json(campaigns)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar campanhas.' })
    }
  }

  async show(req, res) {
    const { id } = req.params

    try {
      const campaign = await connection('campaigns').where({ id }).first()
      if (!campaign) {
        return res.status(404).json({ error: 'Campanha não encontrada.' })
      }

      return res.status(200).json(campaign)
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar campanha.' })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      const rows = await connection('campaigns').where({ id }).del()
      if (!rows) {
        return res.status(404).json({ error: 'Campanha não encontrada.' })
      }

      return res.status(200).json({ message: 'Campanha deletada com sucesso.' })
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar campanha.' })
    }
  }
}
