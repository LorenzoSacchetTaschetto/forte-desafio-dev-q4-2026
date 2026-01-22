import { Model } from 'objection';
import Loan from './Loan';

export class Book extends Model {
  static tableName = 'books';

  id!: number;
  title!: string;
  author!: string;
  isbn?: string;
  quantity!: number;
  created_at!: Date;
  updated_at!: Date;

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['title', 'author', 'quantity'],
      properties: {
        id: { type: 'integer' },
        title: { type: 'string' },
        author: { type: 'string' },
        isbn: { type: 'string' },
        quantity: { type: 'integer' },
        created_at: { type: 'string', format: 'date-time' },
        updated_at: { type: 'string', format: 'date-time' },
      },
    };
  }

  static relationMappings = () => ({
    loans: {
      relation: Model.HasManyRelation,
      modelClass: Loan,
      join: {
        from: 'books.id',
        to: 'loans.book_id',
      },
    },
  });
}
