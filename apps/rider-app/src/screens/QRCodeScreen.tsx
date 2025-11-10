import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Share,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService, Ride } from '../services/api';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

type QRCodeRouteProp = RouteProp<RootStackParamList, 'QRCode'>;

const QRCodeScreen: React.FC = () => {
  const route = useRoute<QRCodeRouteProp>();
  const { rideId } = route.params;

  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRide();
  }, []);

  const loadRide = async () => {
    try {
      setLoading(true);
      const data = await apiService.getRide(rideId);
      setRide(data);
    } catch (error) {
      console.error('Failed to load ride:', error);
      // Mock data
      setRide({
        id: rideId,
        qrCode: `UMA-RIDE-${rideId}`,
        qrDataUrl: '',
        campaignId: 'campaign-123',
        merchantName: 'Manipal Masala',
        rideReimbursement: 150,
        discount: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (!ride) return;

    try {
      await Share.share({
        message: `Check out this amazing deal at ${ride.merchantName}! Get ₹${ride.rideReimbursement} cashback + ${ride.discount}% off!`,
      });
    } catch (error) {
      console.error('Failed to share:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.centerContainer}>
        <Text>Ride not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successCard}>
          <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          <Text style={styles.successTitle}>Booking Confirmed!</Text>
          <Text style={styles.successText}>
            Show this QR code to the merchant upon arrival
          </Text>
        </View>

        <View style={styles.qrCard}>
          <View style={styles.qrContainer}>
            <QRCode
              value={ride.qrCode}
              size={200}
              backgroundColor="white"
              color="black"
            />
          </View>
          <Text style={styles.qrCodeText}>{ride.qrCode}</Text>
        </View>

        <View style={styles.dealInfo}>
          <Text style={styles.merchantName}>{ride.merchantName}</Text>
          <View style={styles.benefitsRow}>
            <View style={styles.benefit}>
              <Text style={styles.benefitValue}>₹{ride.rideReimbursement}</Text>
              <Text style={styles.benefitLabel}>Cashback</Text>
            </View>
            <View style={styles.benefitDivider} />
            <View style={styles.benefit}>
              <Text style={styles.benefitValue}>{ride.discount}%</Text>
              <Text style={styles.benefitLabel}>Discount</Text>
            </View>
          </View>
        </View>

        <View style={styles.warningCard}>
          <Ionicons name="time-outline" size={24} color="#FF6B35" />
          <View style={styles.warningTextContainer}>
            <Text style={styles.warningTitle}>24 Hour Validity</Text>
            <Text style={styles.warningText}>
              Visit the merchant and scan this QR within 24 hours to avoid a strike
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={20} color="#FF6B35" />
          <Text style={styles.shareButtonText}>Share Deal</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  successCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  successText: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  qrCodeText: {
    fontSize: 12,
    color: '#666',
    marginTop: 16,
    fontFamily: 'monospace',
  },
  dealInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  merchantName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 16,
  },
  benefitsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  benefit: {
    alignItems: 'center',
    flex: 1,
  },
  benefitDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  benefitValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  benefitLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 20,
  },
  warningTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 14,
    color: '#666',
  },
  shareButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  shareButtonText: {
    color: '#FF6B35',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default QRCodeScreen;
