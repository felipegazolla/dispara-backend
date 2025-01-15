import { connection } from '../database/knex/knex.js'
import { AppError } from '../utils/AppError.js'
import dayjs from 'dayjs'

export class ReportsController {
  async create(req, res) {
    const { total_messages, delivered_messages, fail_messages, campaign_id } =
      req.body

    if (
      total_messages === undefined ||
      delivered_messages === undefined ||
      fail_messages === undefined ||
      !campaign_id
    ) {
      throw new AppError(
        'Os campos "total_messages", "delivered_messages", "fail_messages" e "campaign_id" são obrigatórios.',
        400
      )
    }

    try {
      const campaignExists = await connection('campaigns')
        .where({ id: campaign_id })
        .first()

      if (!campaignExists) {
        throw new AppError('Campanha não encontrada.', 404)
      }

      const [id] = await connection('reports').insert({
        total_messages,
        delivered_messages,
        fail_messages,
        campaign_id,
        created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      })

      return res.status(201).json({
        id,
        message: 'Relatório criado com sucesso.',
      })
    } catch (error) {
      console.error('Erro ao criar relatório:', error)
      throw new AppError(
        'Erro ao criar relatório. Tente novamente mais tarde.',
        500
      )
    }
  }

  async list(req, res) {
    const user_id = req.user.id

    try {
      const reports = await connection('reports')
        .join('campaigns', 'reports.campaign_id', '=', 'campaigns.id')
        .where('campaigns.user_id', user_id)
        .select(
          'reports.id',
          'reports.total_messages',
          'reports.delivered_messages',
          'reports.fail_messages',
          'reports.created_at',
          'campaigns.name as campaign_name'
        )

      return res.status(200).json(reports)
    } catch (error) {
      console.error(
        `Erro ao listar relatórios para o usuário ${user_id}:`,
        error
      )
      throw new AppError(
        'Erro ao listar relatórios. Tente novamente mais tarde.',
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
      const report = await connection('reports')
        .join('campaigns', 'reports.campaign_id', '=', 'campaigns.id')
        .where('reports.id', id)
        .andWhere('campaigns.user_id', user_id)
        .select(
          'reports.id',
          'reports.total_messages',
          'reports.delivered_messages',
          'reports.fail_messages',
          'reports.created_at',
          'campaigns.name as campaign_name'
        )
        .first()

      if (!report) {
        throw new AppError('Relatório não encontrado.', 404)
      }

      return res.status(200).json(report)
    } catch (error) {
      console.error(
        `Erro ao buscar relatório ${id} para o usuário ${user_id}:`,
        error
      )
      throw new AppError(
        'Erro ao buscar relatório. Tente novamente mais tarde.',
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
      const rows = await connection('reports')
        .join('campaigns', 'reports.campaign_id', '=', 'campaigns.id')
        .where('reports.id', id)
        .andWhere('campaigns.user_id', user_id)
        .del()

      if (!rows) {
        throw new AppError('Relatório não encontrado.', 404)
      }

      return res
        .status(200)
        .json({ message: 'Relatório deletado com sucesso.' })
    } catch (error) {
      console.error(
        `Erro ao deletar relatório ${id} para o usuário ${user_id}:`,
        error
      )
      throw new AppError(
        'Erro ao deletar relatório. Tente novamente mais tarde.',
        500
      )
    }
  }
}
