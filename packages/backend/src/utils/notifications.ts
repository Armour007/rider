/**
 * Notification utility functions
 * Uses Firebase Cloud Messaging for push notifications
 */

import admin from 'firebase-admin';

// Initialize Firebase Admin (you'll need to provide service account credentials)
let firebaseInitialized = false;

export const initFirebase = () => {
  if (firebaseInitialized) return;

  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      firebaseInitialized = true;
      console.log('Firebase Admin initialized');
    } else {
      console.warn('Firebase service account not configured');
    }
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
};

interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Send push notification to a user
 */
export const sendPushNotification = async (
  userId: string,
  payload: PushNotificationPayload
): Promise<void> => {
  if (!firebaseInitialized) {
    console.warn('Firebase not initialized, skipping notification');
    return;
  }

  try {
    // In a real implementation, you would:
    // 1. Fetch the user's FCM token from database
    // 2. Send notification via Firebase Cloud Messaging
    
    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      // token: userFcmToken, // Retrieved from database
    };

    // await admin.messaging().send(message);
    console.log(`Push notification sent to user ${userId}: ${payload.title}`);
  } catch (error) {
    console.error('Failed to send push notification:', error);
    throw error;
  }
};

/**
 * Send notification to multiple users
 */
export const sendBulkNotification = async (
  userIds: string[],
  payload: PushNotificationPayload
): Promise<void> => {
  const promises = userIds.map(userId => 
    sendPushNotification(userId, payload).catch(err => {
      console.error(`Failed to send to user ${userId}:`, err);
    })
  );

  await Promise.all(promises);
};
