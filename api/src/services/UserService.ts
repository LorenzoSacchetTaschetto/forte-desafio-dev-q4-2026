import UserRepository from '../repositories/UserRepository';
import User from '../models/User';

class UserService {
  async getUserById(id: number): Promise<User | undefined> {
    return UserRepository.findById(id);
  }

  async getAllUsers(): Promise<User[]> {
    return UserRepository.findAll();
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return UserRepository.create(userData);
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    return UserRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<number> {
    return UserRepository.delete(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return UserRepository.findByEmail(email); 
  }
}

export default new UserService();