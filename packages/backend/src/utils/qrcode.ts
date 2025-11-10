/**
 * QR Code generation utility
 */

import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique QR code for a ride
 */
export const generateRideQRCode = async (
  rideId: string
): Promise<{ qrCode: string; qrDataUrl: string }> => {
  // Create unique QR data
  const qrCode = `UMA-RIDE-${uuidv4()}`;
  
  // Generate QR code as data URL
  const qrDataUrl = await QRCode.toDataURL(qrCode, {
    errorCorrectionLevel: 'H',
    type: 'image/png',
    width: 300,
    margin: 1,
  });

  return { qrCode, qrDataUrl };
};

/**
 * Validate QR code format
 */
export const validateQRCode = (qrCode: string): boolean => {
  return qrCode.startsWith('UMA-RIDE-');
};
