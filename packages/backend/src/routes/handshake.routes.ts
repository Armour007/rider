import { Router } from 'express';
import { executeHandshake } from '../controllers/handshake.controller';

const router = Router();

/**
 * POST /api/handshake/execute
 * Execute the reimbursement handshake
 */
router.post('/execute', executeHandshake);

export default router;
