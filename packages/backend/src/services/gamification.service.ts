/**
 * Gamification Service
 * 
 * This service handles:
 * 1. Strike system for incomplete bookings
 * 2. Badge system for achievements
 * 3. Mission synthesis from ONDC deals
 */

import cron from 'node-cron';
import { Op } from 'sequelize';
import { User, Ride, Transaction, sequelize } from '../models/postgres';
import { Mission, Badge, UserBadge } from '../models/mongodb';
import { ONDCGatewayService } from './ondc-gateway.service';
import { sendPushNotification } from '../utils/notifications';

export class GamificationService {
  private ondcService: ONDCGatewayService;

  constructor() {
    this.ondcService = new ONDCGatewayService();
  }

  /**
   * Initialize cron jobs
   */
  initCronJobs(): void {
    // Run strike checker every hour
    cron.schedule('0 * * * *', async () => {
      await this.processExpiredRides();
    });

    // Run mission synthesizer every night at 2 AM
    cron.schedule('0 2 * * *', async () => {
      await this.synthesizeMissions();
    });

    console.log('Gamification cron jobs initialized');
  }

  /**
   * Process expired rides and apply strikes
   */
  async processExpiredRides(): Promise<void> {
    const transaction = await sequelize.transaction();

    try {
      // Find rides pending scan for more than 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const expiredRides = await Ride.findAll({
        where: {
          status: 'pending_scan',
          createdAt: {
            [Op.lt]: twentyFourHoursAgo,
          },
        },
        include: [{ model: User, as: 'user' }],
        transaction,
      });

      for (const ride of expiredRides) {
        // Update ride status
        await ride.update({ status: 'expired' }, { transaction });

        // Increment user strike count
        const user = (ride as any).user;
        const newStrikeCount = user.strikeCount + 1;
        
        await user.update(
          { strikeCount: newStrikeCount },
          { transaction }
        );

        // Send notification
        await sendPushNotification(user.id, {
          title: 'Strike Warning ⚠️',
          body: `You have ${newStrikeCount} of 3 strikes. Complete your booked deals within 24 hours.`,
          data: {
            type: 'strike_warning',
            strikeCount: newStrikeCount.toString(),
          },
        });

        // If user reaches 3 strikes, send ban notification
        if (newStrikeCount >= 3) {
          await sendPushNotification(user.id, {
            title: 'Account Temporarily Restricted',
            body: 'You have reached 3 strikes. Complete pending deals to restore access.',
            data: {
              type: 'account_ban',
            },
          });
        }
      }

      await transaction.commit();
      console.log(`Processed ${expiredRides.length} expired rides`);
    } catch (error) {
      await transaction.rollback();
      console.error('Error processing expired rides:', error);
    }
  }

  /**
   * Check and unlock badges for a user
   */
  async checkBadges(userId: string): Promise<void> {
    try {
      const user = await User.findByPk(userId);
      if (!user) return;

      // Get all badges
      const allBadges = await Badge.find();
      
      // Get user's unlocked badges
      const unlockedBadgeIds = (await UserBadge.find({ userId }))
        .map(ub => ub.badgeId);

      for (const badge of allBadges) {
        // Skip if already unlocked
        if (unlockedBadgeIds.includes(badge.id)) continue;

        // Check if user qualifies for this badge
        const qualifies = await this.checkBadgeRequirement(userId, badge.requirement);

        if (qualifies) {
          // Unlock badge
          await UserBadge.create({
            userId,
            badgeId: badge.id,
            unlockedAt: new Date(),
          });

          // Award bonus if applicable
          if (badge.rewardAmount > 0) {
            const balanceBefore = parseFloat(user.wallet as any);
            const balanceAfter = balanceBefore + badge.rewardAmount;

            await user.update({ wallet: balanceAfter });

            await Transaction.create({
              type: 'wallet_credit',
              userId: user.id,
              amount: badge.rewardAmount,
              balanceBefore,
              balanceAfter,
              description: `Badge unlocked: ${badge.name}`,
            });
          }

          // Send notification
          await sendPushNotification(userId, {
            title: `Badge Unlocked: ${badge.name}! 🏆`,
            body: badge.rewardAmount > 0 
              ? `${badge.description} You earned ₹${badge.rewardAmount}!`
              : badge.description,
            data: {
              type: 'badge_unlocked',
              badgeId: badge.id,
            },
          });
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  }

  /**
   * Check if user meets badge requirement
   */
  private async checkBadgeRequirement(userId: string, requirement: string): Promise<boolean> {
    try {
      // Parse requirement string (e.g., "visit_3_cafes", "complete_10_missions")
      const [action, count, type] = requirement.split('_');

      switch (action) {
        case 'visit':
          const visitCount = await Ride.count({
            where: {
              userId,
              status: 'completed',
            },
          });
          return visitCount >= parseInt(count);

        case 'complete':
          // Additional logic for missions
          return false; // Placeholder

        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking badge requirement:', error);
      return false;
    }
  }

  /**
   * Synthesize missions from ONDC deals
   * This is the AI-powered mission creator
   */
  async synthesizeMissions(): Promise<void> {
    try {
      console.log('Starting mission synthesis...');

      // In a real implementation, this would:
      // 1. Query ONDC for available deals from different BPPs
      // 2. Use AI to find logical combinations
      // 3. Create compelling mission narratives
      // 4. Store as Mission documents in MongoDB

      // Example mission creation
      const exampleMission = await Mission.create({
        title: 'THE FRIDAY NIGHT MISSION',
        description: 'Complete a perfect Friday evening with free rides and amazing deals!',
        steps: [
          {
            order: 1,
            type: 'ride',
            provider: 'Chalo',
            description: 'Get a FREE Chalo bus ride to City Center',
            savings: 30,
          },
          {
            order: 2,
            type: 'commerce',
            provider: 'Magicpin',
            description: 'Get 20% off at The Book Nook cafe',
            savings: 100,
          },
          {
            order: 3,
            type: 'ride',
            provider: 'Namma Yatri',
            description: 'Get a FREE Namma Yatri ride to Manipal Masala',
            savings: 150,
          },
          {
            order: 4,
            type: 'deal',
            provider: 'UMA',
            description: 'Get 15% off your dinner',
            savings: 120,
          },
        ],
        totalSavings: 400,
        status: 'active',
      });

      console.log('Mission synthesized:', exampleMission.title);
    } catch (error) {
      console.error('Error synthesizing missions:', error);
    }
  }

  /**
   * Initialize default badges
   */
  async initializeBadges(): Promise<void> {
    const defaultBadges = [
      {
        name: 'Coffee Hopper',
        description: 'Visit 3 different cafes',
        icon: '☕',
        requirement: 'visit_3_cafes',
        rewardAmount: 50,
      },
      {
        name: 'Night Owl',
        description: 'Complete 3 missions after 9 PM',
        icon: '🦉',
        requirement: 'complete_3_night',
        rewardAmount: 75,
      },
      {
        name: 'Manipal Pro',
        description: 'Visit 10 unique venues',
        icon: '🏆',
        requirement: 'visit_10_unique',
        rewardAmount: 100,
      },
      {
        name: 'First Timer',
        description: 'Complete your first UMA deal',
        icon: '🎯',
        requirement: 'visit_1_any',
        rewardAmount: 25,
      },
      {
        name: 'Deal Hunter',
        description: 'Complete 5 deals in a week',
        icon: '🎯',
        requirement: 'complete_5_week',
        rewardAmount: 150,
      },
    ];

    for (const badgeData of defaultBadges) {
      await Badge.findOneAndUpdate(
        { name: badgeData.name },
        badgeData,
        { upsert: true, new: true }
      );
    }

    console.log('Default badges initialized');
  }
}
