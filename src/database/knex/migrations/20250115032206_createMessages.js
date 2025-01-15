export const up = knex =>
  knex.schema.createTable('messages', table => {
    table.increments('id')
    table.text('message').notNullable()
    table.string('destination_number').notNullable()
    table.enu('status', ['send', 'fail', 'delivered']).defaultTo('send')
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.timestamp('sended_at').defaultTo(knex.fn.now())
  })

export const down = knex => knex.schema.dropTable('messages')
