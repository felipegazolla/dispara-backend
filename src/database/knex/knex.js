import knexConfig from '../../../knexfile.js'
import { knex } from 'knex'

export const connection = knex(knexConfig.development)