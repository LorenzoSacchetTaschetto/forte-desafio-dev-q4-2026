import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); 
    table.string('name').notNullable(); 
    table.string('email').notNullable().unique(); 
    table.string('password').notNullable(); 
    table
      .enum('role', ['user', 'admin'])
      .notNullable()
      .defaultTo('user');
    table.timestamps(true, true); 
  });

  await knex.schema.createTable('loans', (table) => {
    table.increments('id').primary(); 
    table.string('title').notNullable(); 
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE'); 
    table.decimal('fine', 8, 2).defaultTo(0); 
    table.date('loan_date').defaultTo(knex.fn.now()).notNullable();
    table.date('return_date').notNullable(); 
    table.date('actual_return_date').nullable(); 
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('loans');
  await knex.schema.dropTable('users');
}