import LoanRepository from '../repositories/LoanRepository';
import Loan from '../models/Loan';

class LoanService {
  async getLoanById(id: number): Promise<Loan | undefined> {
    return LoanRepository.findById(id);
  }

  async getAllLoans(): Promise<Loan[]> {
    return LoanRepository.findAll();
  }

  async createLoan(loanData: Partial<Loan>): Promise<Loan> {
    return LoanRepository.create(loanData);
  }

  async updateLoan(id: number, loanData: Partial<Loan>): Promise<Loan> {
    return LoanRepository.update(id, loanData);
  }

  async deleteLoan(id: number): Promise<number> {
    return LoanRepository.delete(id);
  }
}

export default new LoanService();