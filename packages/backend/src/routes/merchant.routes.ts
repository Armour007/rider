import { Router } from 'express';

const router = Router();

// Merchant routes will be implemented here
// For now, placeholder routes

router.get('/', async (req, res) => {
  res.json({ message: 'Merchant routes' });
});

export default router;
