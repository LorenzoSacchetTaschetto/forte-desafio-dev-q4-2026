import { Router, Request, Response } from 'express';
import UserRepository from '../repositories/UserRepository';
import { authenticate } from '../middlewares/authMiddleware';
import { logger } from '../logger';

const router = Router();

router.use(authenticate);

// Obter usuário por ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await UserRepository.findById(Number(id));

    if (!user) {
      res.status(404).json({ error: 'Usuário não encontrado' });
      return;
    }

    logger.info(`User ${id} retrieved`);
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    logger.error(`Error retrieving user: ${error}`);
    res.status(500).json({ error: 'Erro ao obter usuário' });
  }
});

export default router;
