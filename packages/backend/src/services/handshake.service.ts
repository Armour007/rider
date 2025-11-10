/**
 * Handshake Engine - The Core IP
 * 
 * This service handles the "Reimbursement Handshake" flow.
 * When a merchant scans a rider's QR code, this service:
 * 1. Validates the QR code
 * 2. Debits the merchant's wallet
 * 3. Credits the rider's wallet
 * 4. Updates the ride status
 * 5. Logs the transaction
 * 6. Sends push notification to the rider
 */

import { Transaction as DBTransaction } from 'sequelize';
import { User, Merchant, Campaign, Ride, Transaction, sequelize } from '../models/postgres';
import { HandshakeRequest, HandshakeResponse } from '../types';
import { sendPushNotification } from '../utils/notifications';

export class HandshakeEngine {
  /**
   * Execute the handshake transaction
   * This is the core business logic of the UMA platform
   */
  async executeHandshake(request: HandshakeRequest): Promise<HandshakeResponse> {
    const transaction: DBTransaction = await sequelize.transaction();

    try {
      // Step 1: Validate QR code and fetch ride details
      const ride = await Ride.findOne({
        where: {
          qrCode: request.qrData,
          status: 'pending_scan',
        },
        include: [
          { model: User, as: 'user' },
          { model: Campaign, as: 'campaign' },
          { model: Merchant, as: 'merchant' },
        ],
        transaction,
        lock: true, // Pessimistic locking to prevent race conditions
      });

      if (!ride) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Invalid QR code or QR already used',
        };
      }

      // Check if ride is expired (24 hours)
      const now = new Date();
      const rideAge = now.getTime() - ride.createdAt.getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (rideAge > twentyFourHours) {
        await ride.update({ status: 'expired' }, { transaction });
        await transaction.commit();
        return {
          success: false,
          message: 'QR code has expired',
        };
      }

      const user = (ride as any).user;
      const campaign = (ride as any).campaign;
      const merchant = (ride as any).merchant;

      // Step 2: Check if this is a new customer (for CPA bonus)
      const isNewCustomer = await this.isNewCustomer(user.id, merchant.id, transaction);
      
      // Calculate total merchant charges
      let totalCharge = campaign.rideReimbursement + campaign.cptFee;
      
      if (campaign.cpaEnabled && isNewCustomer) {
        totalCharge += campaign.cpaPremium;
      }

      // Step 3: Debit merchant wallet
      const merchantBalanceBefore = parseFloat(merchant.wallet);
      
      if (merchantBalanceBefore < totalCharge) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Insufficient merchant wallet balance',
        };
      }

      const merchantBalanceAfter = merchantBalanceBefore - totalCharge;
      
      await merchant.update(
        { wallet: merchantBalanceAfter },
        { transaction }
      );

      // Log merchant transactions
      await Transaction.create({
        type: 'ride_reimbursement',
        merchantId: merchant.id,
        rideId: ride.id,
        amount: -campaign.rideReimbursement,
        balanceBefore: merchantBalanceBefore,
        balanceAfter: merchantBalanceBefore - campaign.rideReimbursement,
        description: `Ride reimbursement for ${user.phoneNumber}`,
      }, { transaction });

      await Transaction.create({
        type: 'cpt_fee',
        merchantId: merchant.id,
        rideId: ride.id,
        amount: -campaign.cptFee,
        balanceBefore: merchantBalanceBefore - campaign.rideReimbursement,
        balanceAfter: merchantBalanceAfter,
        description: 'Cost Per Trip fee',
      }, { transaction });

      if (campaign.cpaEnabled && isNewCustomer) {
        await Transaction.create({
          type: 'cpa_premium',
          merchantId: merchant.id,
          rideId: ride.id,
          amount: -campaign.cpaPremium,
          balanceBefore: merchantBalanceAfter,
          balanceAfter: merchantBalanceAfter - campaign.cpaPremium,
          description: 'New customer acquisition bonus',
        }, { transaction });
      }

      // Step 4: Credit rider wallet
      const userBalanceBefore = parseFloat(user.wallet);
      const userBalanceAfter = userBalanceBefore + campaign.rideReimbursement;
      
      await user.update(
        { wallet: userBalanceAfter },
        { transaction }
      );

      await Transaction.create({
        type: 'wallet_credit',
        userId: user.id,
        rideId: ride.id,
        amount: campaign.rideReimbursement,
        balanceBefore: userBalanceBefore,
        balanceAfter: userBalanceAfter,
        description: `Cashback from ${merchant.businessName}`,
      }, { transaction });

      // Step 5: Update ride status
      await ride.update(
        {
          status: 'completed',
          scannedAt: now,
        },
        { transaction }
      );

      // Commit the transaction
      await transaction.commit();

      // Step 6: Send push notification (async, don't wait)
      this.sendHandshakeNotification(user.id, campaign.rideReimbursement, merchant.businessName);

      // Step 7: Return success response
      return {
        success: true,
        apply_discount: `${campaign.discountPercentage}%`,
        message: `Verified! Apply ${campaign.discountPercentage}% discount`,
        cashbackAmount: campaign.rideReimbursement,
      };

    } catch (error) {
      await transaction.rollback();
      console.error('Handshake execution error:', error);
      throw error;
    }
  }

  /**
   * Check if this is a new customer for the merchant
   */
  private async isNewCustomer(
    userId: string,
    merchantId: string,
    transaction: DBTransaction
  ): Promise<boolean> {
    const previousVisits = await Ride.count({
      where: {
        userId,
        merchantId,
        status: 'completed',
      },
      transaction,
    });

    return previousVisits === 0;
  }

  /**
   * Send push notification to rider
   */
  private async sendHandshakeNotification(
    userId: string,
    amount: number,
    merchantName: string
  ): Promise<void> {
    try {
      await sendPushNotification(userId, {
        title: 'Cashback Received! 🎉',
        body: `Success! ₹${amount} cashback from ${merchantName} is now in your wallet.`,
        data: {
          type: 'handshake_success',
          amount: amount.toString(),
        },
      });
    } catch (error) {
      console.error('Failed to send push notification:', error);
      // Don't throw - notification failure shouldn't break the handshake
    }
  }
}
