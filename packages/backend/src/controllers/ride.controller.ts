/**
 * Ride Controller
 * Handles ride booking and QR generation
 */

import { Request, Response } from 'express';
import { Ride, Campaign } from '../models/postgres';
import { generateRideQRCode } from '../utils/qrcode';

/**
 * POST /api/rides/book
 * Book a deal and generate QR code
 */
export const bookDeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, campaignId } = req.body;

    if (!userId || !campaignId) {
      res.status(400).json({
        success: false,
        message: 'User ID and Campaign ID are required',
      });
      return;
    }

    // Fetch campaign details
    const campaign = await Campaign.findByPk(campaignId, {
      include: ['merchant'],
    });

    if (!campaign || campaign.status !== 'active') {
      res.status(404).json({
        success: false,
        message: 'Campaign not found or inactive',
      });
      return;
    }

    // Create ride record
    const ride = await Ride.create({
      userId,
      campaignId,
      merchantId: campaign.merchantId,
      qrCode: '', // Will be updated
      status: 'pending_scan',
      rideAmount: campaign.rideReimbursement,
    });

    // Generate QR code
    const { qrCode, qrDataUrl } = await generateRideQRCode(ride.id);
    
    // Update ride with QR code
    await ride.update({ qrCode });

    res.status(201).json({
      success: true,
      ride: {
        id: ride.id,
        qrCode,
        qrDataUrl,
        campaignId: campaign.id,
        merchantName: (campaign as any).merchant.businessName,
        rideReimbursement: campaign.rideReimbursement,
        discount: campaign.discountPercentage,
      },
    });
  } catch (error) {
    console.error('Book deal error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

/**
 * GET /api/rides/:rideId
 * Get ride details
 */
export const getRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rideId } = req.params;

    const ride = await Ride.findByPk(rideId, {
      include: ['campaign', 'merchant', 'user'],
    });

    if (!ride) {
      res.status(404).json({
        success: false,
        message: 'Ride not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      ride,
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
