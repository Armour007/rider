import axios from 'axios';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' 
  : 'https://api.uma.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  // TODO: Get token from secure storage
  const token = ''; // Replace with actual token retrieval
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Types
export interface Campaign {
  id: string;
  title: string;
  description: string;
  discount: number;
  rideReimbursement: number;
  cptFee: number;
  cpaEnabled: boolean;
  cpaFee: number;
  active: boolean;
}

export interface Analytics {
  totalVisits: number;
  totalSpend: number;
  newCustomers: number;
  returningCustomers: number;
  averageCostPerCustomer: number;
  roi: number;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  type: 'cpt' | 'cpa' | 'reimbursement';
  timestamp: string;
  isNewCustomer: boolean;
}

export interface MerchantProfile {
  id: string;
  businessName: string;
  email: string;
  phone: string;
  wallet: number;
  subscription: 'free' | 'pro' | 'enterprise';
}

// API Methods
export const apiService = {
  // Handshake endpoint
  async executeHandshake(qrData: string): Promise<any> {
    const response = await api.post('/api/handshake/execute', { qrData });
    return response.data;
  },

  // Campaign endpoints
  async getCampaigns(): Promise<Campaign[]> {
    const response = await api.get('/api/campaigns');
    return response.data;
  },

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await api.post('/api/campaigns', campaign);
    return response.data;
  },

  async updateCampaign(id: string, campaign: Partial<Campaign>): Promise<Campaign> {
    const response = await api.put(`/api/campaigns/${id}`, campaign);
    return response.data;
  },

  async deleteCampaign(id: string): Promise<void> {
    await api.delete(`/api/campaigns/${id}`);
  },

  // Analytics endpoints
  async getAnalytics(timeframe: 'day' | 'week' | 'month'): Promise<Analytics> {
    const response = await api.get(`/api/analytics?timeframe=${timeframe}`);
    return response.data;
  },

  async getTransactions(limit?: number): Promise<Transaction[]> {
    const response = await api.get(`/api/transactions${limit ? `?limit=${limit}` : ''}`);
    return response.data;
  },

  // Merchant endpoints
  async getMerchantProfile(): Promise<MerchantProfile> {
    const response = await api.get('/api/merchant/profile');
    return response.data;
  },

  async addFunds(amount: number): Promise<void> {
    await api.post('/api/merchant/add-funds', { amount });
  },
};

export default api;
