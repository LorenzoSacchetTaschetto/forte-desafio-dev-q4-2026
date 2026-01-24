import { Api } from './Api';
import { AuthService } from './AuthService';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
}

export interface CreateLoanRequest {
  bookId: number;
  loanDate?: string;
}

export const BookService = {
  getAllBooks: async (): Promise<Book[]> => {
    const token = AuthService.getToken();
    try {
      const response = await Api.get('/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar livros:', error.response?.data || error.message);
      throw error;
    }
  },

  createBook: async (data: { title: string; author: string; isbn?: string; quantity?: number }): Promise<Book> => {
    const token = AuthService.getToken();
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await Api.post('/books', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Livro criado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar livro:', error.response?.data || error.message);
      throw error;
    }
  },
};

export const CreateLoanService = {
  createLoan: async (data: CreateLoanRequest) => {
    const token = AuthService.getToken();
    const user = AuthService.getUser();

    if (!token || !user) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await Api.post(
        '/loans',
        {
          userId: user.id,
          bookId: data.bookId,
          loanDate: data.loanDate || new Date().toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Empréstimo criado:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Erro ao criar empréstimo:', error.response?.data || error.message);
      throw error;
    }
  },
};
