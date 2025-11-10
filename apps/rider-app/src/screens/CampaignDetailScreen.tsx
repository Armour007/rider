import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService, Campaign } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type CampaignDetailRouteProp = RouteProp<RootStackParamList, 'CampaignDetail'>;
type CampaignDetailNavigationProp = StackNavigationProp<RootStackParamList, 'CampaignDetail'>;

const CampaignDetailScreen: React.FC = () => {
  const route = useRoute<CampaignDetailRouteProp>();
  const navigation = useNavigation<CampaignDetailNavigationProp>();
  const { campaignId } = route.params;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, []);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCampaign(campaignId);
      setCampaign(data);
    } catch (error) {
      console.error('Failed to load campaign:', error);
      // Mock data
      setCampaign({
        id: campaignId,
        merchantId: 'm1',
        merchantName: 'Manipal Masala',
        title: 'FREE ₹150 Ride + 10% Off',
        description: 'Get free ride reimbursement and discount on food. Visit us for authentic Indian cuisine!',
        discount: 10,
        rideReimbursement: 150,
        location: {
          latitude: 13.3501,
          longitude: 74.7949,
          address: 'MIT Campus, Manipal',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBookDeal = () => {
    if (campaign) {
      navigation.navigate('RideBooking', { campaignId: campaign.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  if (!campaign) {
    return (
      <View style={styles.centerContainer}>
        <Text>Campaign not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.merchantName}>{campaign.merchantName}</Text>
        <Text style={styles.title}>{campaign.title}</Text>
      </View>

      <View style={styles.benefitsCard}>
        <View style={styles.benefitRow}>
          <View style={styles.benefitItem}>
            <Ionicons name="car-sport" size={32} color="#FF6B35" />
            <Text style={styles.benefitValue}>₹{campaign.rideReimbursement}</Text>
            <Text style={styles.benefitLabel}>Ride Cashback</Text>
          </View>
          <View style={styles.benefitDivider} />
          <View style={styles.benefitItem}>
            <Ionicons name="pricetag" size={32} color="#4CAF50" />
            <Text style={styles.benefitValue}>{campaign.discount}%</Text>
            <Text style={styles.benefitLabel}>Discount</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How it Works</Text>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>1</Text>
          </View>
          <Text style={styles.stepText}>Book this deal to get your unique QR code</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>2</Text>
          </View>
          <Text style={styles.stepText}>Take a ride to the restaurant (via any service)</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>3</Text>
          </View>
          <Text style={styles.stepText}>Show QR code to merchant at arrival</Text>
        </View>
        <View style={styles.step}>
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>4</Text>
          </View>
          <Text style={styles.stepText}>Get instant cashback + enjoy your discount!</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <View style={styles.locationCard}>
          <Ionicons name="location" size={24} color="#FF6B35" />
          <Text style={styles.locationText}>{campaign.location.address}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{campaign.description}</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookDeal}>
          <Text style={styles.bookButtonText}>Book This Deal</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  merchantName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    color: '#666',
  },
  benefitsCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitRow: {
    flexDirection: 'row',
  },
  benefitItem: {
    flex: 1,
    alignItems: 'center',
  },
  benefitDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 20,
  },
  benefitValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  benefitLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  bookButton: {
    backgroundColor: '#FF6B35',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default CampaignDetailScreen;
