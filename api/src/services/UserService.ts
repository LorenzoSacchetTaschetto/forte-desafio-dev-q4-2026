import UserRepository from '../repositories/UserRepository';
import User from '../models/User';
import { UserRequestDTO, UserResponseDTO } from '../dtos/UserDTO';

class UserService {
  private mapToResponse(user: User): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async getUserById(id: number): Promise<UserResponseDTO | undefined> {
    const user = await UserRepository.findById(id);
    return user ? this.mapToResponse(user) : undefined;
  }

  async getAllUsers(): Promise<UserResponseDTO[]> {
    const users = await UserRepository.findAll();
    return users.map(user => this.mapToResponse(user));
  }

  async createUser(userDTO: UserRequestDTO): Promise<UserResponseDTO> {
    const user = await UserRepository.create(userDTO);
    return this.mapToResponse(user);
  }

  async updateUser(id: number, userDTO: Partial<UserRequestDTO>): Promise<UserResponseDTO> {
    const user = await UserRepository.update(id, userDTO);
    return this.mapToResponse(user);
  }

  async deleteUser(id: number): Promise<number> {
    return UserRepository.delete(id);
  }

  async getUserByEmail(email: string): Promise<UserResponseDTO | undefined> {
    const user = await UserRepository.findByEmail(email);
    return user ? this.mapToResponse(user) : undefined;
  }
}

export default new UserService();