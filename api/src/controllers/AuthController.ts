import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserService from '../services/UserService';

const SECRET_KEY = process.env.JWT_SECRET || 'default_secret_key';

class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const { name, email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await UserService.createUser({ name, email, password: hashedPassword, role });

      return res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      return res.status(400).json({ message: 'Error registering user', error: (error as Error).message });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    try {
      const user = await UserService.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      return res.status(400).json({ message: 'Error logging in', error: (error as Error).message });
    }
  }
}

export default new AuthController();