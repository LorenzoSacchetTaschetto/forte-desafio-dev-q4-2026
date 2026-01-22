import User from '../models/User';

class UserRepository {
  async findById(id: number): Promise<User | undefined> {
    return User.query().findById(id);
  }

  async findAll(): Promise<User[]> {
    return User.query();
  }

  async create(userData: Partial<User>): Promise<User> {
    return User.query().insert(userData);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    return User.query().patchAndFetchById(id, userData);
  }

  async delete(id: number): Promise<number> {
    return User.query().deleteById(id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return User.query().findOne({ email });
  }
}

export default new UserRepository();