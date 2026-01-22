import knex from 'knex';
import { Model } from 'objection';
import config from '../../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knexInstance = knex(config[environment]);

Model.knex(knexInstance);

export default knexInstance;
