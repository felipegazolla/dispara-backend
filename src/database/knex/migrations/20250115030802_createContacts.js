export const up = knex =>
  knex.schema.createTable('contacts', table => {
    table.increments('id')
    table.text('name').notNullable()
    table.string('whatsapp_number').notNullable().unique()
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE') // Apaga contatos do usuário ao deletar o usuário
    table
      .integer('campaign_id')
      .references('id')
      .inTable('campaigns')
      .onDelete('SET NULL') // Desvincula campanha ao deletar a campanha
    table.timestamp('created_at').defaultTo(knex.fn.now())
  })

export const down = knex => knex.schema.dropTable('contacts')
