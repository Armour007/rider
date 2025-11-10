import { Router } from 'express';
import { bookDeal, getRide } from '../controllers/ride.controller';

const router = Router();

/**
 * POST /api/rides/book
 * Book a deal and generate QR code
 */
router.post('/book', bookDeal);

/**
 * GET /api/rides/:rideId
 * Get ride details
 */
router.get('/:rideId', getRide);

export default router;
