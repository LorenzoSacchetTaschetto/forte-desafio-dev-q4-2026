import Loan from '../models/Loan';
import { LoanStatus } from '../models/Loan';

class LoanRepository {
  async findById(id: number): Promise<Loan | undefined> {
    return Loan.query().findById(id);
  }

  async findAll(): Promise<Loan[]> {
    return Loan.query();
  }

  async findByUserId(userId: number): Promise<Loan[]> {
    return Loan.query().where('user_id', userId);
  }

  async findByStatus(status: LoanStatus): Promise<Loan[]> {
    return Loan.query().where('status', status);
  }

  async findByBookId(bookId: number): Promise<Loan[]> {
    return Loan.query().where('book_id', bookId);
  }

  async create(loanData: Partial<Loan>): Promise<Loan> {
    return Loan.query().insert(loanData);
  }

  async update(id: number, loanData: Partial<Loan>): Promise<Loan> {
    return Loan.query().patchAndFetchById(id, loanData);
  }

  async delete(id: number): Promise<number> {
    return Loan.query().deleteById(id);
  }
}

export default new LoanRepository();