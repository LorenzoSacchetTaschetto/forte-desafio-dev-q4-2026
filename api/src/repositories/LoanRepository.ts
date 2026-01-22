import Loan from '../models/Loan';
import { LoanStatus } from '../models/Loan';

class LoanRepository {
  async findById(id: number): Promise<Loan | undefined> {
    return Loan.query().findById(id).withGraphFetched('[user, book]');
  }

  async findAll(): Promise<Loan[]> {
    return Loan.query().withGraphFetched('[user, book]');
  }

  async findByUserId(userId: number): Promise<Loan[]> {
    return Loan.query().where('user_id', userId).withGraphFetched('[user, book]');
  }

  async findByStatus(status: LoanStatus): Promise<Loan[]> {
    return Loan.query().where('status', status).withGraphFetched('[user, book]');
  }

  async findByBookId(bookId: number): Promise<Loan[]> {
    return Loan.query().where('book_id', bookId).withGraphFetched('[user, book]');
  }

  async create(loanData: Partial<Loan>): Promise<Loan> {
    return Loan.query().insert(loanData).withGraphFetched('[user, book]');
  }

  async update(id: number, loanData: Partial<Loan>): Promise<Loan> {
    return Loan.query().patchAndFetchById(id, loanData).withGraphFetched('[user, book]');
  }

  async delete(id: number): Promise<number> {
    return Loan.query().deleteById(id);
  }
}

export default new LoanRepository();