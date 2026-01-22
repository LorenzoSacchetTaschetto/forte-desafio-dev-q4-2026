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
      const user = await UserService.createUser({ name, email, password: hashedPassword });

      return res.status(201).json({ message: 'Usuário registrado com sucesso', user });
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
      return res.status(200).json({ message: 'Login bem-sucedido', token });
    } catch (error) {
      return res.status(400).json({ message: 'Erro ao fazer login', error: (error as Error).message });
    }
  }
}

export default new AuthController();