import { Api } from './Api';
import { AuthService } from './AuthService';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export const UserService = {
  getUserById: async (userId: number): Promise<User> => {
    const token = AuthService.getToken();
    try {
      const response = await Api.get(`/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Erro ao buscar usuário:', error.response?.data || error.message);
      throw error;
    }
  },
};
