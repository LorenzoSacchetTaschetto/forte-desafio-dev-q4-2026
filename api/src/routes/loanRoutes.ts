import { Router } from 'express';
import LoanController from '../controllers/LoanController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/', LoanController.getAllLoans);

router.get('/status', LoanController.getLoansByStatus);

router.get('/user/:userId', LoanController.getLoansByUserId);

router.get('/:id', LoanController.getLoanById);

router.post('/', LoanController.createLoan);

router.put('/:id/return', LoanController.returnLoan);

router.put('/:id/lost', LoanController.markAsLost);

router.put('/:id', LoanController.updateLoan);

router.delete('/:id', LoanController.deleteLoan);

export default router;
