import { Request, Response } from 'express';
import LoanService from '../services/LoanService';
import { logger } from '../logger';

class LoanController {
  async getAllLoans(req: Request, res: Response): Promise<void> {
    try {
      const loans = await LoanService.getAllLoans();
      logger.info('Retrieved all loans');
      res.json(loans);
    } catch (error) {
      logger.error(`Error retrieving loans: ${error}`);
      res.status(500).json({ error: 'Erro ao listar empréstimos' });
    }
  }

  async getLoanById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const loan = await LoanService.getLoanById(Number(id));

      if (!loan) {
        res.status(404).json({ error: 'Empréstimo não encontrado' });
        return;
      }

      res.json(loan);
    } catch (error) {
      logger.error(`Error retrieving loan: ${error}`);
      res.status(500).json({ error: 'Erro ao obter empréstimo' });
    }
  }

  async getLoansByUserId(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const loans = await LoanService.getLoansByUserId(Number(userId));
      logger.info(`Retrieved loans for user ${userId}`);
      res.json(loans);
    } catch (error) {
      logger.error(`Error retrieving user loans: ${error}`);
      res.status(500).json({ error: 'Erro ao listar empréstimos do usuário' });
    }
  }

  async getLoansByStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.query;

      if (!status || !['emprestado', 'devolvido', 'extraviado'].includes(status as string)) {
        res.status(400).json({ error: 'Status inválido' });
        return;
      }

      const loans = await LoanService.getLoansByStatus(status as any);
      logger.info(`Retrieved loans with status ${status}`);
      res.json(loans);
    } catch (error) {
      logger.error(`Error retrieving loans by status: ${error}`);
      res.status(500).json({ error: 'Erro ao filtrar empréstimos' });
    }
  }

  async createLoan(req: Request, res: Response): Promise<void> {
    try {
      const { userId, bookId, loanDate } = req.body;

      if (!userId || !bookId) {
        res.status(400).json({ error: 'userId e bookId são obrigatórios' });
        return;
      }

      const loan = await LoanService.createLoan({
        userId,
        bookId,
        loanDate: loanDate || new Date().toISOString(),
      });

      logger.info(`Loan created: ${loan.id} for user ${userId} with book ${bookId}`);
      res.status(201).json(loan);
    } catch (error) {
      logger.error(`Error creating loan: ${error}`);
      res.status(500).json({ error: 'Erro ao criar empréstimo' });
    }
  }

  async returnLoan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const body = req.body || {};
      const { actualReturnDate, status } = body;

      if (!id) {
        res.status(400).json({ error: 'ID do empréstimo é obrigatório' });
        return;
      }

      const loanStatus = status || 'devolvido';
      if (!['devolvido', 'extraviado'].includes(loanStatus)) {
        res.status(400).json({ error: 'Status inválido' });
        return;
      }

      const loan = await LoanService.returnLoan(
        Number(id),
        actualReturnDate ? new Date(actualReturnDate) : new Date(),
        loanStatus
      );

      logger.info(`Loan ${id} returned with status ${loanStatus}`);
      res.json(loan);
    } catch (error) {
      logger.error(`Error returning loan: ${error}`);
      res.status(500).json({ error: 'Erro ao devolver empréstimo' });
    }
  }

  async markAsLost(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do empréstimo é obrigatório' });
        return;
      }

      const loan = await LoanService.markAsLost(Number(id));
      logger.info(`Loan ${id} marked as lost`);
      res.json(loan);
    } catch (error) {
      logger.error(`Error marking loan as lost: ${error}`);
      res.status(500).json({ error: 'Erro ao marcar empréstimo como extraviado' });
    }
  }

  async updateLoan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const loanData = req.body;

      if (!id) {
        res.status(400).json({ error: 'ID do empréstimo é obrigatório' });
        return;
      }

      const loan = await LoanService.updateLoan(Number(id), loanData);
      logger.info(`Loan ${id} updated`);
      res.json(loan);
    } catch (error) {
      logger.error(`Error updating loan: ${error}`);
      res.status(500).json({ error: 'Erro ao atualizar empréstimo' });
    }
  }

  async deleteLoan(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ error: 'ID do empréstimo é obrigatório' });
        return;
      }

      await LoanService.deleteLoan(Number(id));
      logger.info(`Loan ${id} deleted`);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting loan: ${error}`);
      res.status(500).json({ error: 'Erro ao excluir empréstimo' });
    }
  }

  async getUserLoans(req: Request, res: Response): Promise<void> {
    try {
      console.log('getUserLoans - req.user:', (req.user as any));
      const userId = (req.user as any)?.id;
      console.log('getUserLoans - userId:', userId);

      if (!userId) {
        console.error('getUserLoans - userId não encontrado');
        res.status(401).json({ error: 'Usuário não autenticado' });
        return;
      }

      console.log('getUserLoans - Chamando LoanService.getUserLoans com userId:', userId);
      const loans = await LoanService.getUserLoans(userId);
      console.log('getUserLoans - Loans retornados:', loans);
      logger.info(`Retrieved loans for authenticated user ${userId}`);
      res.json(loans);
    } catch (error) {
      console.error('getUserLoans - Erro:', error);
      logger.error(`Error retrieving user loans: ${error}`);
      res.status(500).json({ error: 'Erro ao listar empréstimos do usuário', details: (error as any).message });
    }
  }
}

export default new LoanController();
