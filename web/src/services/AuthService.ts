import { Api } from './Api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export const AuthService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    try {
      console.log('Tentando fazer login com:', data.email);
      const response = await Api.post('/auth/login', data);
      console.log('Resposta do login:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Token e usuário salvos no localStorage');
      }
      return response.data;
    } catch (error: any) {
      console.error('Erro no login:', error.response?.data || error.message);
      throw error;
    }
  },

  signup: async (data: SignUpRequest): Promise<AuthResponse> => {
    try {
      console.log('Tentando cadastrar:', data.email);
      const response = await Api.post('/auth/register', data);
      console.log('Resposta do signup:', response.data);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('Token e usuário salvos no localStorage');
      }
      return response.data;
    } catch (error: any) {
      console.error('Erro no signup:', error.response?.data || error.message);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('token'),

  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user && user !== 'undefined' ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};
