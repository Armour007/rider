import { Router } from 'express';

const router = Router();

// User routes will be implemented here
// For now, placeholder routes

router.get('/', async (req, res) => {
  res.json({ message: 'User routes' });
});

export default router;
