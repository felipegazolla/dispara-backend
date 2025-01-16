export const up = knex =>
  knex.schema.createTable('credits', table => {
    table.increments('id')
    table
      .integer('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.integer('credits').notNullable().defaultTo(0)
    table.timestamp('updated_at').defaultTo(knex.fn.now())
  })

export const down = knex => knex.schema.dropTable('credits')
