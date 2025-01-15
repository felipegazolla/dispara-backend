export const up = knex =>
  knex.schema.createTable('reports', table => {
    table.increments('id')
    table.integer('total_messages').notNullable()
    table.integer('delivered_messages').notNullable()
    table.integer('fail_messages').notNullable()
    table
      .integer('campaign_id')
      .references('id')
      .inTable('campaigns')
      .onDelete('CASCADE') 
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE') 
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

export const down = knex => knex.schema.dropTable('reports')
