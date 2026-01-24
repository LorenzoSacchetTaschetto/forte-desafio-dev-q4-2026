export interface LoanRequestDTO {
  userId: number;
  bookId: number;
  loanDate: string;
  returnDate?: string;
}

export interface LoanResponseDTO {
  id: number;
  userId: number;
  bookId: number;
  status: 'emprestado' | 'devolvido' | 'extraviado';
  fine: number;
  loanDate: string;
  returnDate: string;
  actualReturnDate?: string;
}