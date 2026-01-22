import { Book } from '../models/Book';

export class BookRepository {
  async findAll(): Promise<Book[]> {
    return Book.query();
  }

  async findById(id: number): Promise<Book | undefined> {
    return Book.query().findById(id);
  }

  async create(bookData: Partial<Book>): Promise<Book> {
    return Book.query().insert(bookData);
  }

  async update(id: number, bookData: Partial<Book>): Promise<Book> {
    return Book.query().patchAndFetchById(id, bookData);
  }

  async delete(id: number): Promise<number> {
    return Book.query().deleteById(id);
  }
}
