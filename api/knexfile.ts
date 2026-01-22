import { Knex } from 'knex';

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: 'database', 
      user: 'admin',
      password: 'admin',
      database: 'admin', 
      port: 5432,
    },
    migrations: {
      directory: './src/database/migrations', 
    },
  },
};

export default config;
