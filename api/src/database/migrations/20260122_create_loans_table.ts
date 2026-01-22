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

  await knex.schema.createTable('books', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('author').notNullable();
    table.string('isbn').unique();
    table.integer('quantity').notNullable().defaultTo(1);
    table.timestamps(true, true);
  });

  await knex.schema.createTable('loans', (table) => {
    table.increments('id').primary();

    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');

    table
      .integer('book_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('books')
      .onDelete('CASCADE');

    table
      .enum('status', ['emprestado', 'devolvido', 'extraviado'])
      .notNullable()
      .defaultTo('emprestado');

    table.decimal('fine', 8, 2).defaultTo(0);
    table.dateTime('loan_date').defaultTo(knex.fn.now()).notNullable();
    table.dateTime('return_date').notNullable();
    table.dateTime('actual_return_date').nullable();

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('loans');
  await knex.schema.dropTableIfExists('books');
  await knex.schema.dropTableIfExists('users');
}
