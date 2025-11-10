import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService, Campaign } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type CampaignsScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const CampaignsScreen: React.FC = () => {
  const navigation = useNavigation<CampaignsScreenNavigationProp>();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

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
      // Mock data
      setCampaigns([
        {
          id: '1',
          title: 'FREE ₹150 Ride + 10% Off',
          description: 'Weekday lunch special',
          discount: 10,
          rideReimbursement: 150,
          cptFee: 20,
          cpaEnabled: true,
          cpaFee: 50,
          active: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCampaignStatus = async (campaignId: string, currentStatus: boolean) => {
    try {
      await apiService.updateCampaign(campaignId, { active: !currentStatus });
      loadCampaigns();
    } catch (error) {
      console.error('Failed to update campaign:', error);
    }
  };

  const renderCampaignCard = ({ item }: { item: Campaign }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CampaignForm', { campaignId: item.id })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Switch
          value={item.active}
          onValueChange={() => toggleCampaignStatus(item.id, item.active)}
          trackColor={{ false: '#ccc', true: '#FF6B35' }}
          thumbColor={item.active ? '#fff' : '#f4f3f4'}
        />
      </View>

      <Text style={styles.description}>{item.description}</Text>

      <View style={styles.detailsRow}>
        <View style={styles.detailItem}>
          <Ionicons name="car-sport" size={16} color="#FF6B35" />
          <Text style={styles.detailText}>₹{item.rideReimbursement}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="pricetag" size={16} color="#4CAF50" />
          <Text style={styles.detailText}>{item.discount}%</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="cash" size={16} color="#2196F3" />
          <Text style={styles.detailText}>₹{item.cptFee} CPT</Text>
        </View>
      </View>

      {item.cpaEnabled && (
        <View style={styles.cpaBadge}>
          <Text style={styles.cpaText}>CPA Enabled (₹{item.cpaFee})</Text>
        </View>
      )}
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
        <Text style={styles.headerTitle}>My Campaigns</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CampaignForm', {})}
        >
          <Ionicons name="add-circle" size={32} color="#FF6B35" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={campaigns}
        renderItem={renderCampaignCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={loading}
        onRefresh={loadCampaigns}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="megaphone-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No campaigns yet</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('CampaignForm', {})}
            >
              <Text style={styles.createButtonText}>Create Your First Campaign</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  addButton: {
    padding: 4,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  cpaBadge: {
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  cpaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CampaignsScreen;
