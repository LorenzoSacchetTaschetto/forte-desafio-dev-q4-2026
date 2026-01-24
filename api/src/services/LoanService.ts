import LoanRepository from '../repositories/LoanRepository';
import Loan from '../models/Loan';
import { LoanStatus } from '../models/Loan';
import { LoanRequestDTO, LoanResponseDTO } from '../dtos/LoanDTO';
import BookService from './BookService';

class LoanService {
  private mapToResponse(loan: Loan): LoanResponseDTO {
    const loanDateStr = typeof loan.loanDate === 'string' ? loan.loanDate : loan.loanDate.toISOString();
    const returnDateStr = typeof loan.returnDate === 'string' ? loan.returnDate : loan.returnDate.toISOString();
    const actualReturnDateStr = loan.actualReturnDate 
      ? (typeof loan.actualReturnDate === 'string' ? loan.actualReturnDate : loan.actualReturnDate.toISOString())
      : undefined;
    
    return {
      id: loan.id,
      userId: loan.userId,
      bookId: loan.bookId,
      status: loan.status,
      fine: loan.fine || 0,
      loanDate: loanDateStr,
      returnDate: returnDateStr,
      actualReturnDate: actualReturnDateStr,
    };
  }

  calculateReturnDate(loanDate: Date): Date {
    // Cria uma cópia para não modificar a data original
    const returnDate = new Date(loanDate);
    
    // Adiciona 30 dias
    returnDate.setDate(returnDate.getDate() + 30);

    // Se cair em sábado (6) ou domingo (0), move para próxima segunda
    const dayOfWeek = returnDate.getDay();
    if (dayOfWeek === 6) {
      // Sábado -> segunda (+2 dias)
      returnDate.setDate(returnDate.getDate() + 2);
    } else if (dayOfWeek === 0) {
      // Domingo -> segunda (+1 dia)
      returnDate.setDate(returnDate.getDate() + 1);
    }

    // Reseta a hora para meia-noite para consistência
    returnDate.setHours(0, 0, 0, 0);

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

    // Parse da data local sem conversão de timezone
    // Entrada: "2026-01-24" -> cria Date para esse dia em horário local
    const parts = loanDTO.loanDate.split('T')[0].split('-');
    const loanDate = new Date(
      parseInt(parts[0]),
      parseInt(parts[1]) - 1,
      parseInt(parts[2]),
      0, 0, 0, 0
    );
    
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

  async updateLoan(id: number, loanData: any): Promise<LoanResponseDTO> {
    const loanRecord = await LoanRepository.findById(id);
    if (!loanRecord) {
      throw new Error('Empréstimo não encontrado');
    }

    const updateData: any = {};
    
    // Atualizar status
    if (loanData.status !== undefined) {
      if (!['emprestado', 'devolvido', 'extraviado'].includes(loanData.status)) {
        throw new Error('Status inválido');
      }
      updateData.status = loanData.status;
    }
    
    // Atualizar userId
    if (loanData.userId !== undefined) updateData.userId = loanData.userId;
    
    // Atualizar bookId
    if (loanData.bookId !== undefined) {
      const book = await BookService.getBookById(loanData.bookId);
      if (!book) {
        throw new Error('Livro não encontrado');
      }
      updateData.bookId = loanData.bookId;
    }
    
    // Atualizar loanDate
    if (loanData.loanDate !== undefined) {
      const parts = loanData.loanDate.split('T')[0].split('-');
      updateData.loanDate = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2]),
        0, 0, 0, 0
      ).toISOString();
    }
    
    // Atualizar returnDate
    if (loanData.returnDate !== undefined) {
      const parts = loanData.returnDate.split('T')[0].split('-');
      updateData.returnDate = new Date(
        parseInt(parts[0]),
        parseInt(parts[1]) - 1,
        parseInt(parts[2]),
        0, 0, 0, 0
      ).toISOString();
    }
    
    // Atualizar actualReturnDate
    if (loanData.actualReturnDate !== undefined) {
      updateData.actualReturnDate = new Date(loanData.actualReturnDate).toISOString();
    }
    
    // Calcular multa se mudando para "devolvido"
    if (loanData.status === 'devolvido' && updateData.actualReturnDate) {
      const returnDateObj = typeof loanRecord.returnDate === 'string' ? new Date(loanRecord.returnDate) : loanRecord.returnDate;
      const actualReturnDateObj = new Date(updateData.actualReturnDate);
      
      let fine = 0;
      if (actualReturnDateObj > returnDateObj) {
        fine = this.calculateFine(returnDateObj, actualReturnDateObj);
      }
      updateData.fine = fine;
    } else if (loanData.fine !== undefined) {
      // Se foi enviada multa manualmente, usar esse valor
      updateData.fine = loanData.fine;
    }

    const loan = await LoanRepository.update(id, updateData);
    return this.mapToResponse(loan);
  }

  async deleteLoan(id: number): Promise<number> {
    return LoanRepository.delete(id);
  }

  async getUserLoans(userId: number): Promise<LoanResponseDTO[]> {
    const loans = await LoanRepository.findByUserId(userId);
    return loans.map(loan => this.mapToResponse(loan));
  }
}

export default new LoanService();