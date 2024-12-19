import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../password';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by Id

router.get('/users/:id', async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching users: ', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create user

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // const userDetails = await req.body;
    const { email, name, passwordHash, role } = req.body;
    const hashedPassword = await hashPassword(passwordHash);
    const user = await prisma.user.create({
      data: {
        email: email,
        name: name,
        passwordHash: hashedPassword,
        role: role,
      },
    });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error creating user: ', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.delete(
  '/users/:id',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const deleteData = await prisma.user.delete({
        where: { id: Number(id) },
      });
      res.status(200).json(deleteData);
    } catch (error) {
      console.error('Error fetching users: ', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }
);

export default router;
