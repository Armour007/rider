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
  merchantId: string;
  merchantName: string;
  title: string;
  description: string;
  discount: number;
  rideReimbursement: number;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export interface Ride {
  id: string;
  qrCode: string;
  qrDataUrl: string;
  campaignId: string;
  merchantName: string;
  rideReimbursement: number;
  discount: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  campaigns: Campaign[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  reward: number;
  unlocked: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  wallet: number;
  strikes: number;
}

// API Methods
export const apiService = {
  // Campaign endpoints
  async getCampaigns(): Promise<Campaign[]> {
    const response = await api.get('/api/campaigns');
    return response.data;
  },

  async getCampaign(id: string): Promise<Campaign> {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },

  // Ride endpoints
  async bookRide(userId: string, campaignId: string): Promise<Ride> {
    const response = await api.post('/api/rides/book', { userId, campaignId });
    return response.data.ride;
  },

  async getRide(rideId: string): Promise<Ride> {
    const response = await api.get(`/api/rides/${rideId}`);
    return response.data;
  },

  // Mission endpoints
  async getMissions(): Promise<Mission[]> {
    const response = await api.get('/api/missions');
    return response.data;
  },

  // Badge endpoints
  async getBadges(): Promise<Badge[]> {
    const response = await api.get('/api/badges');
    return response.data;
  },

  // User endpoints
  async getUserProfile(): Promise<UserProfile> {
    const response = await api.get('/api/user/profile');
    return response.data;
  },

  // ONDC endpoints
  async searchRides(pickupLocation: any, dropLocation: any) {
    const response = await api.post('/api/ondc/search', {
      pickupLocation,
      dropLocation,
    });
    return response.data;
  },
};

export default api;
