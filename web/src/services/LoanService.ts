import { Api } from './Api';
import { AuthService } from './AuthService';

export interface LoanData {
  id: number;
  userId: number;
  bookId: number;
  status: 'emprestado' | 'devolvido' | 'extraviado';
  fine: number;
  loanDate: string;
  returnDate: string;
  actualReturnDate?: string;
}

export const LoanService = {
  getUserLoans: async (): Promise<LoanData[]> => {
    const token = AuthService.getToken();
    console.log('LoanService - Token:', token);
    
    if (!token) {
      console.error('LoanService - Token não encontrado!');
      throw new Error('Token não disponível');
    }

    try {
      console.log('LoanService - Fazendo requisição para /loans/me com token');
      const response = await Api.get('/loans/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('LoanService - Resposta recebida:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('LoanService - Erro na requisição:', error.response?.data || error.message);
      throw error;
    }
  },

  getAllLoans: async (): Promise<LoanData[]> => {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Token não disponível');
    }

    try {
      const response = await Api.get('/loans', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar todos os empréstimos:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteLoan: async (loanId: number): Promise<void> => {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Token não disponível');
    }

    try {
      await Api.delete(`/loans/${loanId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Erro ao deletar empréstimo:', error.response?.data || error.message);
      throw error;
    }
  },

  updateLoanStatus: async (loanId: number, status: 'emprestado' | 'devolvido' | 'extraviado', actualReturnDate?: string): Promise<LoanData> => {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Token não disponível');
    }

    try {
      const payload: any = { status };
      if (actualReturnDate) {
        payload.actualReturnDate = actualReturnDate;
      }
      
      const response = await Api.put(`/loans/${loanId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao atualizar status do empréstimo:', error.response?.data || error.message);
      throw error;
    }
  },
};
