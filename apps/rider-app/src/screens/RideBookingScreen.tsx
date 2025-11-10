import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type RideBookingRouteProp = RouteProp<RootStackParamList, 'RideBooking'>;
type RideBookingNavigationProp = StackNavigationProp<RootStackParamList, 'RideBooking'>;

const RideBookingScreen: React.FC = () => {
  const route = useRoute<RideBookingRouteProp>();
  const navigation = useNavigation<RideBookingNavigationProp>();
  const { campaignId } = route.params;

  const [loading, setLoading] = useState(false);

  const handleBookRide = async () => {
    try {
      setLoading(true);
      // Mock user ID - in real app, get from auth context
      const userId = 'user-123';
      const ride = await apiService.bookRide(userId, campaignId);
      
      // Navigate to QR code screen
      navigation.navigate('QRCode', { rideId: ride.id });
    } catch (error) {
      console.error('Failed to book ride:', error);
      Alert.alert('Error', 'Failed to book deal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="qr-code" size={80} color="#FF6B35" />
        </View>

        <Text style={styles.title}>Book Your Deal</Text>
        <Text style={styles.description}>
          By booking this deal, you agree to visit the merchant location within 24 hours.
          You'll receive a unique QR code that must be scanned by the merchant upon arrival.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={24} color="#FF6B35" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>24 Hour Validity</Text>
              <Text style={styles.infoText}>
                QR code expires in 24 hours from booking
              </Text>
            </View>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoRow}>
            <Ionicons name="warning-outline" size={24} color="#FF6B35" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Strike System</Text>
              <Text style={styles.infoText}>
                Not scanning within 24 hours = 1 strike (max 3)
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBookRide}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.bookButtonText}>Confirm Booking</Text>
              <Ionicons name="checkmark-circle" size={24} color="#fff" />
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  bookButtonDisabled: {
    opacity: 0.6,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default RideBookingScreen;
