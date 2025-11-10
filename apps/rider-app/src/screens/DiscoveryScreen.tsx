import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService, Campaign } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type DiscoveryScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const DiscoveryScreen: React.FC = () => {
  const navigation = useNavigation<DiscoveryScreenNavigationProp>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
      // For demo purposes, set mock data
      setCampaigns([
        {
          id: '1',
          merchantId: 'm1',
          merchantName: 'Manipal Masala',
          title: 'FREE ₹150 Ride + 10% Off',
          description: 'Get free ride reimbursement and discount on food',
          discount: 10,
          rideReimbursement: 150,
          location: {
            latitude: 13.3501,
            longitude: 74.7949,
            address: 'MIT Campus, Manipal',
          },
        },
        {
          id: '2',
          merchantId: 'm2',
          merchantName: 'Campus Cafe',
          title: 'FREE ₹100 Ride + 15% Off Coffee',
          description: 'Visit us and save on your coffee',
          discount: 15,
          rideReimbursement: 100,
          location: {
            latitude: 13.3520,
            longitude: 74.7930,
            address: 'Tiger Circle, Manipal',
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderCampaignCard = ({ item }: { item: Campaign }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.merchantName}>{item.merchantName}</Text>
        <View style={styles.reimbursementBadge}>
          <Text style={styles.reimbursementText}>₹{item.rideReimbursement}</Text>
        </View>
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
      <View style={styles.cardFooter}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discount}% OFF</Text>
        </View>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.locationText}>{item.location.address}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Discover Deals</Text>
        <TouchableOpacity
          onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
        >
          <Ionicons
            name={viewMode === 'list' ? 'map-outline' : 'list-outline'}
            size={28}
            color="#FF6B35"
          />
        </TouchableOpacity>
      </View>

      {viewMode === 'list' ? (
        <FlatList
          data={campaigns}
          renderItem={renderCampaignCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={loadCampaigns}
        />
      ) : (
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map" size={64} color="#ccc" />
          <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
          <Text style={styles.mapSubText}>
            Will display merchant locations with interactive pins
          </Text>
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  reimbursementBadge: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  reimbursementText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  discountBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#999',
    marginTop: 16,
  },
  mapSubText: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DiscoveryScreen;
