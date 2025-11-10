import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

export class User extends Model {
  public id!: string;
  public phoneNumber!: string;
  public firebaseUid!: string;
  public wallet!: number;
  public strikeCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    firebaseUid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    wallet: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
    },
    strikeCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
  }
);

export class Merchant extends Model {
  public id!: string;
  public businessName!: string;
  public phoneNumber!: string;
  public email!: string;
  public wallet!: number;
  public subscriptionPlan!: 'basic' | 'pro' | 'enterprise';
  public subscriptionStatus!: 'active' | 'inactive';
  public location!: {
    lat: number;
    lng: number;
    address: string;
  };
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Merchant.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    wallet: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
      allowNull: false,
    },
    subscriptionPlan: {
      type: DataTypes.ENUM('basic', 'pro', 'enterprise'),
      defaultValue: 'basic',
      allowNull: false,
    },
    subscriptionStatus: {
      type: DataTypes.ENUM('active', 'inactive'),
      defaultValue: 'active',
      allowNull: false,
    },
    location: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'merchants',
    timestamps: true,
  }
);

export class Campaign extends Model {
  public id!: string;
  public merchantId!: string;
  public offerTitle!: string;
  public discountPercentage!: number;
  public rideReimbursement!: number;
  public cptFee!: number;
  public cpaEnabled!: boolean;
  public cpaPremium!: number;
  public adBoostEnabled!: boolean;
  public adBoostCost!: number;
  public schedule!: {
    days: string[];
    startTime: string;
    endTime: string;
  } | null;
  public status!: 'active' | 'paused' | 'completed';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Campaign.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'merchants',
        key: 'id',
      },
    },
    offerTitle: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rideReimbursement: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    cptFee: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 20,
      allowNull: false,
    },
    cpaEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    cpaPremium: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    adBoostEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    adBoostCost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    schedule: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'paused', 'completed'),
      defaultValue: 'active',
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'campaigns',
    timestamps: true,
  }
);

export class Ride extends Model {
  public id!: string;
  public userId!: string;
  public campaignId!: string;
  public merchantId!: string;
  public qrCode!: string;
  public status!: 'pending_scan' | 'completed' | 'expired';
  public ondcOrderId!: string | null;
  public rideAmount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public scannedAt!: Date | null;
}

Ride.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id',
      },
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'merchants',
        key: 'id',
      },
    },
    qrCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM('pending_scan', 'completed', 'expired'),
      defaultValue: 'pending_scan',
      allowNull: false,
    },
    ondcOrderId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    rideAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    scannedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'rides',
    timestamps: true,
  }
);

export class Transaction extends Model {
  public id!: string;
  public type!: 'ride_reimbursement' | 'cpt_fee' | 'cpa_premium' | 'ad_boost' | 'wallet_credit' | 'wallet_debit';
  public userId!: string | null;
  public merchantId!: string | null;
  public rideId!: string | null;
  public amount!: number;
  public balanceBefore!: number;
  public balanceAfter!: number;
  public description!: string;
  public readonly createdAt!: Date;
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('ride_reimbursement', 'cpt_fee', 'cpa_premium', 'ad_boost', 'wallet_credit', 'wallet_debit'),
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    merchantId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'merchants',
        key: 'id',
      },
    },
    rideId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'rides',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balanceBefore: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'transactions',
    timestamps: true,
    updatedAt: false,
  }
);

// Setup associations
Merchant.hasMany(Campaign, { foreignKey: 'merchantId' });
Campaign.belongsTo(Merchant, { foreignKey: 'merchantId' });

User.hasMany(Ride, { foreignKey: 'userId' });
Ride.belongsTo(User, { foreignKey: 'userId' });

Campaign.hasMany(Ride, { foreignKey: 'campaignId' });
Ride.belongsTo(Campaign, { foreignKey: 'campaignId' });

Merchant.hasMany(Ride, { foreignKey: 'merchantId' });
Ride.belongsTo(Merchant, { foreignKey: 'merchantId' });

export { sequelize };
