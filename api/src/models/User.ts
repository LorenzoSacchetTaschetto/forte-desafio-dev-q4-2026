import { Model } from 'objection';
import Loan from './Loan';

class User extends Model {
  static tableName = 'users';

  id!: number;

  name!: string;

  email!: string;

  password!: string;

  role!: string;

  static jsonSchema = {
    type: 'object',
    required: ['name', 'email', 'password', 'role'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string', minLength: 1 },
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 6 },
      role: { type: 'string', enum: ['admin', 'user'], default: 'user' },
    },
  };

  static relationMappings = {
    loans: {
      relation: Model.HasManyRelation,
      modelClass: Loan,
      join: {
        from: 'users.id',
        to: 'loans.user_id',
      },
    },
  };
}

export default User;
