import { Router } from 'express';

const router = Router();

// Campaign routes will be implemented here
// For now, placeholder routes

router.get('/', async (req, res) => {
  res.json({ message: 'Campaign routes' });
});

export default router;
