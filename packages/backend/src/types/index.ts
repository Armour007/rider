// Core types for UMA Platform

export interface User {
  id: string;
  phoneNumber: string;
  firebaseUid: string;
  wallet: number;
  strikeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Merchant {
  id: string;
  businessName: string;
  phoneNumber: string;
  email: string;
  wallet: number;
  subscriptionPlan: 'basic' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Campaign {
  id: string;
  merchantId: string;
  offerTitle: string;
  discountPercentage: number;
  rideReimbursement: number; // Max cashback amount
  cptFee: number; // Cost per trip fee
  cpaEnabled: boolean;
  cpaPremium: number; // Bonus for new customers
  adBoostEnabled: boolean;
  adBoostCost: number;
  schedule?: {
    days: string[]; // ['Monday', 'Friday']
    startTime: string; // '16:00'
    endTime: string; // '19:00'
  };
  status: 'active' | 'paused' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Ride {
  id: string;
  userId: string;
  campaignId: string;
  merchantId: string;
  qrCode: string;
  status: 'pending_scan' | 'completed' | 'expired';
  ondcOrderId?: string;
  rideAmount: number;
  createdAt: Date;
  updatedAt: Date;
  scannedAt?: Date;
}

export interface Transaction {
  id: string;
  type: 'ride_reimbursement' | 'cpt_fee' | 'cpa_premium' | 'ad_boost' | 'wallet_credit' | 'wallet_debit';
  userId?: string;
  merchantId?: string;
  rideId?: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: Date;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  steps: MissionStep[];
  totalSavings: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface MissionStep {
  order: number;
  type: 'ride' | 'commerce' | 'deal';
  provider: string; // 'Namma Yatri', 'Chalo', 'Magicpin'
  description: string;
  savings: number;
}

export interface ONDCRequest {
  context: ONDCContext;
  message: any;
}

export interface ONDCContext {
  domain: string;
  country: string;
  city: string;
  action: string;
  core_version: string;
  bap_id: string;
  bap_uri: string;
  transaction_id: string;
  message_id: string;
  timestamp: string;
}

export interface HandshakeRequest {
  qrData: string;
}

export interface HandshakeResponse {
  success: boolean;
  apply_discount?: string;
  message: string;
  cashbackAmount?: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  rewardAmount: number;
}

export interface UserBadge {
  userId: string;
  badgeId: string;
  unlockedAt: Date;
}
