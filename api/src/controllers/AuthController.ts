import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/UserService';
import UserRepository from '../repositories/UserRepository';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const userCreated = await UserService.createUser({ name, email, password: hashedPassword });
      
      const userByEmail = await UserRepository.findByEmail(email);
      const role = userByEmail?.role || 'user';

      const token = jwt.sign({ id: userCreated.id, role }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(201).json({ 
        message: 'Usuário registrado com sucesso', 
        token,
        user: {
          id: userCreated.id,
          name: userCreated.name,
          email: userCreated.email,
          role,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao registrar usuário', error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const userByEmail = await UserRepository.findByEmail(email);
      if (!userByEmail) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }

      const isPasswordValid = await bcrypt.compare(password, userByEmail.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }

      const token = jwt.sign({ id: userByEmail.id, role: userByEmail.role }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({ 
        message: 'Login bem-sucedido', 
        token,
        user: {
          id: userByEmail.id,
          name: userByEmail.name,
          email: userByEmail.email,
          role: userByEmail.role,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao fazer login', error: (error as Error).message });
    }
  }
}

export default new AuthController();