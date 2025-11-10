/**
 * Handshake Controller
 * Handles the core handshake API endpoint
 */

import { Request, Response } from 'express';
import { HandshakeEngine } from '../services/handshake.service';
import { HandshakeRequest } from '../types';

const handshakeEngine = new HandshakeEngine();

/**
 * POST /api/handshake/execute
 * Execute the reimbursement handshake when merchant scans QR
 */
export const executeHandshake = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrData } = req.body as HandshakeRequest;

    if (!qrData) {
      res.status(400).json({
        success: false,
        message: 'QR data is required',
      });
      return;
    }

    const result = await handshakeEngine.executeHandshake({ qrData });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Handshake execution error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
