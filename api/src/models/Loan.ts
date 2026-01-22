import { Model } from 'objection';
import User from './User';

class Loan extends Model {
  static tableName = 'loans';

  id!: number;

  title!: string;

  userId!: number;

  fine!: number;

  loanDate!: Date;

  returnDate!: Date;

  actualReturnDate?: Date;

  static jsonSchema = {
    type: 'object',
    required: ['title', 'userId', 'loanDate', 'returnDate'],
    properties: {
      id: { type: 'integer' },
      title: { type: 'string', minLength: 1 },
      userId: { type: 'integer' },
      fine: { type: 'number', default: 0 },
      loanDate: { type: 'string', format: 'date' },
      returnDate: { type: 'string', format: 'date' },
      actualReturnDate: { type: ['string', 'null'], format: 'date' },
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'loans.user_id',
        to: 'users.id',
      },
    },
  };
}

export default Loan;
