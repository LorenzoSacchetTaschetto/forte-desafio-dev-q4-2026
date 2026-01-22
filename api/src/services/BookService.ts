import { BookRepository } from '../repositories/BookRepository';
import { Book } from '../models/Book';
import { BookRequestDTO, BookResponseDTO } from '../dtos/BookDTO';

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  private mapToResponse(book: Book): BookResponseDTO {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      quantity: book.quantity,
    };
  }

  async getAllBooks(): Promise<BookResponseDTO[]> {
    const books = await this.bookRepository.findAll();
    return books.map((book: Book) => this.mapToResponse(book));
  }

  async getBookById(id: number): Promise<BookResponseDTO | undefined> {
    const book = await this.bookRepository.findById(id);
    return book ? this.mapToResponse(book) : undefined;
  }

  async createBook(bookDTO: BookRequestDTO): Promise<BookResponseDTO> {
    const book = await this.bookRepository.create(bookDTO);
    return this.mapToResponse(book);
  }

  async updateBook(id: number, bookDTO: Partial<BookRequestDTO>): Promise<BookResponseDTO> {
    const book = await this.bookRepository.update(id, bookDTO);
    return this.mapToResponse(book);
  }

  async deleteBook(id: number): Promise<number> {
    return this.bookRepository.delete(id);
  }
}

export default new BookService();