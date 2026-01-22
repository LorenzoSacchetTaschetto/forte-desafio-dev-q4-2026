import LoanRepository from '../repositories/LoanRepository';
import Loan from '../models/Loan';
import { LoanStatus } from '../models/Loan';
import { LoanRequestDTO, LoanResponseDTO } from '../dtos/LoanDTO';
import BookService from './BookService';

class LoanService {
  private mapToResponse(loan: Loan): LoanResponseDTO {
    const loanDateStr = typeof loan.loanDate === 'string' ? loan.loanDate : loan.loanDate.toISOString();
    const returnDateStr = typeof loan.returnDate === 'string' ? loan.returnDate : loan.returnDate.toISOString();
    
    return {
      id: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      loanDate: loanDateStr,
      returnDate: returnDateStr,
    };
  }

  calculateReturnDate(loanDate: Date): Date {
    const returnDate = new Date(loanDate);
    returnDate.setDate(returnDate.getDate() + 30);

    const dayOfWeek = returnDate.getDay();
    if (dayOfWeek === 6) {
      returnDate.setDate(returnDate.getDate() + 2);
    } else if (dayOfWeek === 0) {
      returnDate.setDate(returnDate.getDate() + 1);
    }

    return returnDate;
  }

  calculateFine(returnDate: Date, actualReturnDate: Date): number {
    const diffMs = actualReturnDate.getTime() - returnDate.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      return 0;
    }

    return (diffDays - 1) * 0.5;
  }

  async getLoanById(id: number): Promise<LoanResponseDTO | undefined> {
    const loan = await LoanRepository.findById(id);
    return loan ? this.mapToResponse(loan) : undefined;
  }

  async getAllLoans(): Promise<LoanResponseDTO[]> {
    const loans = await LoanRepository.findAll();
    return loans.map(loan => this.mapToResponse(loan));
  }

  async getLoansByUserId(userId: number): Promise<LoanResponseDTO[]> {
    const loans = await LoanRepository.findByUserId(userId);
    return loans.map(loan => this.mapToResponse(loan));
  }

  async getLoansByStatus(status: LoanStatus): Promise<LoanResponseDTO[]> {
    const loans = await LoanRepository.findByStatus(status);
    return loans.map(loan => this.mapToResponse(loan));
  }

  async createLoan(loanDTO: LoanRequestDTO): Promise<LoanResponseDTO> {
    const book = await BookService.getBookById(loanDTO.bookId);
    if (!book) {
      throw new Error('Livro não encontrado');
    }

    const loanDate = new Date(loanDTO.loanDate);
    const returnDate = this.calculateReturnDate(loanDate);

    const loan = await LoanRepository.create({
      userId: loanDTO.userId,
      bookId: loanDTO.bookId,
      status: 'emprestado',
      loanDate: loanDate.toISOString(),
      returnDate: returnDate.toISOString(),
      fine: 0,
    });

    return this.mapToResponse(loan);
  }

  async returnLoan(
    id: number,
    actualReturnDate: Date = new Date(),
    status: LoanStatus = 'devolvido'
  ): Promise<LoanResponseDTO> {
    const loanData = await LoanRepository.findById(id);
    if (!loanData) {
      throw new Error('Empréstimo não encontrado');
    }

    let fine = 0;
    const returnDateObj = typeof loanData.returnDate === 'string' ? new Date(loanData.returnDate) : loanData.returnDate;
    if (status === 'devolvido' && actualReturnDate > returnDateObj) {
      fine = this.calculateFine(returnDateObj, actualReturnDate);
    }

    const loan = await LoanRepository.update(id, {
      status,
      actualReturnDate: actualReturnDate.toISOString(),
      fine,
    });

    return this.mapToResponse(loan);
  }

  async markAsLost(id: number): Promise<LoanResponseDTO> {
    const loan = await LoanRepository.update(id, {
      status: 'extraviado',
    });
    return this.mapToResponse(loan);
  }

  async updateLoan(id: number, loanDTO: Partial<LoanRequestDTO>): Promise<LoanResponseDTO> {
    const updateData: any = {};
    
    if (loanDTO.userId !== undefined) updateData.userId = loanDTO.userId;
    if (loanDTO.bookId !== undefined) {
      const book = await BookService.getBookById(loanDTO.bookId);
      if (!book) {
        throw new Error('Livro não encontrado');
      }
      updateData.bookId = loanDTO.bookId;
    }
    if (loanDTO.loanDate !== undefined) updateData.loanDate = new Date(loanDTO.loanDate);
    if (loanDTO.returnDate !== undefined) updateData.returnDate = new Date(loanDTO.returnDate);

    const loan = await LoanRepository.update(id, updateData);
    return this.mapToResponse(loan);
  }

  async deleteLoan(id: number): Promise<number> {
    return LoanRepository.delete(id);
  }
}

export default new LoanService();