import { Router } from 'express';
import BookController from '../controllers/BookController';
import { authenticate, authorize } from '../middlewares/authMiddleware';

const router = Router();

// Rotas públicas (apenas autenticadas)
router.get('/', authenticate, BookController.getAllBooks);

router.get('/:id', authenticate, BookController.getBookById);

// Rotas restritas (apenas admin)
router.post('/', authenticate, authorize(['admin']), BookController.createBook);

router.put('/:id', authenticate, authorize(['admin']), BookController.updateBook);

router.delete('/:id', authenticate, authorize(['admin']), BookController.deleteBook);

export default router;
