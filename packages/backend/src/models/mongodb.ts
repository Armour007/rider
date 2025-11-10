import mongoose, { Schema, Document } from 'mongoose';

// Mission Schema for MongoDB
export interface IMission extends Document {
  title: string;
  description: string;
  steps: Array<{
    order: number;
    type: 'ride' | 'commerce' | 'deal';
    provider: string;
    description: string;
    savings: number;
  }>;
  totalSavings: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema = new Schema<IMission>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    steps: [
      {
        order: { type: Number, required: true },
        type: { type: String, enum: ['ride', 'commerce', 'deal'], required: true },
        provider: { type: String, required: true },
        description: { type: String, required: true },
        savings: { type: Number, required: true },
      },
    ],
    totalSavings: { type: Number, required: true },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);

// Badge Schema for MongoDB
export interface IBadge extends Document {
  name: string;
  description: string;
  icon: string;
  requirement: string;
  rewardAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    requirement: { type: String, required: true },
    rewardAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Badge = mongoose.model<IBadge>('Badge', BadgeSchema);

// UserBadge Schema for MongoDB
export interface IUserBadge extends Document {
  userId: string;
  badgeId: string;
  unlockedAt: Date;
}

const UserBadgeSchema = new Schema<IUserBadge>({
  userId: { type: String, required: true },
  badgeId: { type: String, required: true },
  unlockedAt: { type: Date, default: Date.now },
});

UserBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

export const UserBadge = mongoose.model<IUserBadge>('UserBadge', UserBadgeSchema);

// ONDC Cache Schema for MongoDB (for caching ONDC responses)
export interface IONDCCache extends Document {
  cacheKey: string;
  data: any;
  expiresAt: Date;
  createdAt: Date;
}

const ONDCCacheSchema = new Schema<IONDCCache>({
  cacheKey: { type: String, required: true, unique: true },
  data: { type: Schema.Types.Mixed, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

ONDCCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const ONDCCache = mongoose.model<IONDCCache>('ONDCCache', ONDCCacheSchema);
