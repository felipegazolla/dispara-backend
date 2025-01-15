export const up = knex =>
  knex.schema.createTable('sessions', table => {
    table.increments('id')
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('wid').notNullable().unique()
    table.string('status').notNullable().defaultTo('none')
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').nullable()
  })

export const down = knex => knex.schema.dropTable('sessions')
