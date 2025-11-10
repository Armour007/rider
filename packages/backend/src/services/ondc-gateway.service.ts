/**
 * ONDC Gateway Service
 * 
 * This service handles all communication with the ONDC network as a BAP (Buyer Network Participant).
 * It orchestrates mobility services from BPPs like Namma Yatri and Chalo.
 */

import axios, { AxiosInstance } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ONDCRequest, ONDCContext } from '../types';

export class ONDCGatewayService {
  private ondcGatewayUrl: string;
  private bapId: string;
  private bapUri: string;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.ondcGatewayUrl = process.env.ONDC_GATEWAY_URL || 'https://gateway.ondc.org';
    this.bapId = process.env.ONDC_BAP_ID || 'uma.ondc.in';
    this.bapUri = process.env.ONDC_BAP_URI || 'https://api.uma.com';
    
    this.axiosInstance = axios.create({
      baseURL: this.ondcGatewayUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Create ONDC context for requests
   */
  private createContext(action: string, transactionId?: string): ONDCContext {
    return {
      domain: 'nic2004:60212', // Mobility domain
      country: 'IND',
      city: 'std:080', // Bangalore/Manipal
      action,
      core_version: '1.0.0',
      bap_id: this.bapId,
      bap_uri: this.bapUri,
      transaction_id: transactionId || uuidv4(),
      message_id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Search for mobility options (autos, buses)
   */
  async search(params: {
    pickupLocation: { lat: number; lng: number };
    dropLocation: { lat: number; lng: number };
    transactionId?: string;
  }): Promise<any> {
    const context = this.createContext('search', params.transactionId);
    
    const request: ONDCRequest = {
      context,
      message: {
        intent: {
          fulfillment: {
            start: {
              location: {
                gps: `${params.pickupLocation.lat},${params.pickupLocation.lng}`,
              },
            },
            end: {
              location: {
                gps: `${params.dropLocation.lat},${params.dropLocation.lng}`,
              },
            },
          },
        },
      },
    };

    try {
      const response = await this.axiosInstance.post('/search', request);
      return {
        transactionId: context.transaction_id,
        messageId: context.message_id,
        response: response.data,
      };
    } catch (error) {
      console.error('ONDC search error:', error);
      throw new Error('Failed to search for rides');
    }
  }

  /**
   * Select a specific ride option
   */
  async select(params: {
    transactionId: string;
    bppId: string;
    bppUri: string;
    itemId: string;
    fulfillmentId: string;
  }): Promise<any> {
    const context = this.createContext('select', params.transactionId);
    context.bap_id = params.bppId;

    const request: ONDCRequest = {
      context,
      message: {
        order: {
          items: [
            {
              id: params.itemId,
            },
          ],
          fulfillments: [
            {
              id: params.fulfillmentId,
            },
          ],
        },
      },
    };

    try {
      const response = await this.axiosInstance.post('/select', request);
      return {
        transactionId: context.transaction_id,
        messageId: context.message_id,
        response: response.data,
      };
    } catch (error) {
      console.error('ONDC select error:', error);
      throw new Error('Failed to select ride');
    }
  }

  /**
   * Initialize the order with customer details
   */
  async init(params: {
    transactionId: string;
    bppId: string;
    bppUri: string;
    itemId: string;
    fulfillmentId: string;
    customerDetails: {
      name: string;
      phone: string;
    };
  }): Promise<any> {
    const context = this.createContext('init', params.transactionId);

    const request: ONDCRequest = {
      context,
      message: {
        order: {
          items: [
            {
              id: params.itemId,
            },
          ],
          fulfillments: [
            {
              id: params.fulfillmentId,
              customer: {
                person: {
                  name: params.customerDetails.name,
                },
                contact: {
                  phone: params.customerDetails.phone,
                },
              },
            },
          ],
        },
      },
    };

    try {
      const response = await this.axiosInstance.post('/init', request);
      return {
        transactionId: context.transaction_id,
        messageId: context.message_id,
        response: response.data,
      };
    } catch (error) {
      console.error('ONDC init error:', error);
      throw new Error('Failed to initialize order');
    }
  }

  /**
   * Confirm the booking
   */
  async confirm(params: {
    transactionId: string;
    bppId: string;
    bppUri: string;
    orderId: string;
  }): Promise<any> {
    const context = this.createContext('confirm', params.transactionId);

    const request: ONDCRequest = {
      context,
      message: {
        order: {
          id: params.orderId,
        },
      },
    };

    try {
      const response = await this.axiosInstance.post('/confirm', request);
      return {
        transactionId: context.transaction_id,
        messageId: context.message_id,
        response: response.data,
      };
    } catch (error) {
      console.error('ONDC confirm error:', error);
      throw new Error('Failed to confirm booking');
    }
  }

  /**
   * Get status of a booking
   */
  async status(params: {
    transactionId: string;
    bppId: string;
    bppUri: string;
    orderId: string;
  }): Promise<any> {
    const context = this.createContext('status', params.transactionId);

    const request: ONDCRequest = {
      context,
      message: {
        order_id: params.orderId,
      },
    };

    try {
      const response = await this.axiosInstance.post('/status', request);
      return response.data;
    } catch (error) {
      console.error('ONDC status error:', error);
      throw new Error('Failed to get booking status');
    }
  }

  /**
   * Callback handler for ONDC responses (on_search, on_select, etc.)
   */
  async handleCallback(action: string, payload: any): Promise<void> {
    // Store callback data for retrieval by the frontend
    console.log(`ONDC Callback: ${action}`, payload);
    
    // In a real implementation, you would:
    // 1. Validate the callback signature
    // 2. Store the response in cache/database
    // 3. Notify the waiting frontend via WebSocket/SSE
    // 4. Process the response based on action type
  }
}
