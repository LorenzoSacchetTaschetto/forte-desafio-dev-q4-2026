import { Model, snakeCaseMappers } from 'objection';

type LoanStatus = 'emprestado' | 'devolvido' | 'extraviado';

class Loan extends Model {
  static tableName = 'loans';

  static columnNameMappers = snakeCaseMappers();

  id!: number;
  userId!: number;
  bookId!: number;
  status!: LoanStatus;
  fine!: number;
  loanDate!: Date | string;
  returnDate!: Date | string;
  actualReturnDate?: Date | string;
  createdAt!: Date;
  updatedAt!: Date;

  static jsonSchema = {
    type: 'object',
    required: ['userId', 'bookId', 'loanDate', 'returnDate'],
    properties: {
      id: { type: 'integer' },
      userId: { type: 'integer' },
      bookId: { type: 'integer' },
      status: { type: 'string', enum: ['emprestado', 'devolvido', 'extraviado'] },
      fine: { type: 'number', default: 0 },
      loanDate: { type: 'string', format: 'date-time' },
      returnDate: { type: 'string', format: 'date-time' },
      actualReturnDate: { type: ['string', 'null'], format: 'date-time' },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  };

  static relationMappings = () => ({
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./User').default,
      join: {
        from: 'loans.user_id',
        to: 'users.id',
      },
    },
    book: {
      relation: Model.BelongsToOneRelation,
      modelClass: require('./Book').default,
      join: {
        from: 'loans.book_id',
        to: 'books.id',
      },
    },
  });
}

export default Loan;
export type { LoanStatus };
