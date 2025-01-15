export const up = knex =>
  knex.schema.createTable('campaigns', table => {
    table.increments('id')
    table.string('name').notNullable()
    table.text('description')
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE') // Apaga campanhas do usuário ao deletar o usuário
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

export const down = knex => knex.schema.dropTable('campaigns')
