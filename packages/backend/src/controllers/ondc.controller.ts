/**
 * ONDC Controller
 * Handles ONDC BAP requests and callbacks
 */

import { Request, Response } from 'express';
import { ONDCGatewayService } from '../services/ondc-gateway.service';

const ondcService = new ONDCGatewayService();

/**
 * POST /api/ondc/search
 * Search for rides on ONDC network
 */
export const searchRides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pickupLocation, dropLocation } = req.body;

    if (!pickupLocation || !dropLocation) {
      res.status(400).json({
        success: false,
        message: 'Pickup and drop locations are required',
      });
      return;
    }

    const result = await ondcService.search({
      pickupLocation,
      dropLocation,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('ONDC search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search for rides',
    });
  }
};

/**
 * POST /api/ondc/select
 * Select a ride option
 */
export const selectRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId, bppId, bppUri, itemId, fulfillmentId } = req.body;

    const result = await ondcService.select({
      transactionId,
      bppId,
      bppUri,
      itemId,
      fulfillmentId,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('ONDC select error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to select ride',
    });
  }
};

/**
 * POST /api/ondc/init
 * Initialize ride booking
 */
export const initRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId, bppId, bppUri, itemId, fulfillmentId, customerDetails } = req.body;

    const result = await ondcService.init({
      transactionId,
      bppId,
      bppUri,
      itemId,
      fulfillmentId,
      customerDetails,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('ONDC init error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize booking',
    });
  }
};

/**
 * POST /api/ondc/confirm
 * Confirm ride booking
 */
export const confirmRide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { transactionId, bppId, bppUri, orderId } = req.body;

    const result = await ondcService.confirm({
      transactionId,
      bppId,
      bppUri,
      orderId,
    });

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('ONDC confirm error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to confirm booking',
    });
  }
};

/**
 * ONDC Callback handlers
 */
export const onSearch = async (req: Request, res: Response): Promise<void> => {
  await ondcService.handleCallback('on_search', req.body);
  res.status(200).json({ message: { ack: { status: 'ACK' } } });
};

export const onSelect = async (req: Request, res: Response): Promise<void> => {
  await ondcService.handleCallback('on_select', req.body);
  res.status(200).json({ message: { ack: { status: 'ACK' } } });
};

export const onInit = async (req: Request, res: Response): Promise<void> => {
  await ondcService.handleCallback('on_init', req.body);
  res.status(200).json({ message: { ack: { status: 'ACK' } } });
};

export const onConfirm = async (req: Request, res: Response): Promise<void> => {
  await ondcService.handleCallback('on_confirm', req.body);
  res.status(200).json({ message: { ack: { status: 'ACK' } } });
};

export const onStatus = async (req: Request, res: Response): Promise<void> => {
  await ondcService.handleCallback('on_status', req.body);
  res.status(200).json({ message: { ack: { status: 'ACK' } } });
};
