import { Request, Response } from 'express';
import BookService from '../services/BookService';
import { logger } from '../logger';

class BookController {
  async getAllBooks(req: Request, res: Response): Promise<void> {
    try {
      const books = await BookService.getAllBooks();
      logger.info('Retrieved all books');
      res.json(books);
    } catch (error) {
      logger.error('Error retrieving books:', error);
      res.status(500).json({ error: 'Erro ao listar livros' });
    }
  }

  async getBookById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do livro é obrigatório' });
        return;
      }

      const book = await BookService.getBookById(Number(id));
      if (!book) {
        res.status(404).json({ error: 'Livro não encontrado' });
        return;
      }

      res.json(book);
    } catch (error) {
      logger.error('Error fetching book by ID:', error);
      res.status(500).json({ error: 'Erro ao buscar livro' });
    }
  }

  async createBook(req: Request, res: Response): Promise<void> {
    try {
      const { title, author, isbn, quantity } = req.body;

      if (!title || !author) {
        res.status(400).json({ error: 'title e author são obrigatórios' });
        return;
      }

      const book = await BookService.createBook({
        title,
        author,
        isbn,
        quantity: quantity || 1,
      });

      logger.info(`Book created: ${book.id}`);
      res.status(201).json(book);
    } catch (error) {
      logger.error('Error creating book:', error);
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async updateBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, author, isbn, quantity } = req.body;

      if (!id) {
        res.status(400).json({ error: 'ID do livro é obrigatório' });
        return;
      }

      const book = await BookService.updateBook(Number(id), {
        title,
        author,
        isbn,
        quantity,
      });

      logger.info(`Book updated: ${book.id}`);
      res.json(book);
    } catch (error) {
      logger.error('Error updating book:', error);
      res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  }

  async deleteBook(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do livro é obrigatório' });
        return;
      }

      await BookService.deleteBook(Number(id));
      logger.info(`Book deleted: ${id}`);
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting book:', error);
      res.status(500).json({ error: 'Erro ao deletar livro' });
    }
  }
}

export default new BookController();
