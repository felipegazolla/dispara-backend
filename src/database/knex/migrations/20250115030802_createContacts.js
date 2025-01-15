export const up = knex =>
  knex.schema.createTable('contacts', table => {
    table.increments('id')
    table.text('name').notNullable()
    table.string('whatsapp_number').notNullable().unique()
    table.integer('user_id').references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

export const down = knex => knex.schema.dropTable('contacts')
