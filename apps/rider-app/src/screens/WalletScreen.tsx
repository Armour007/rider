import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { apiService, UserProfile, Badge } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const WalletScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userProfile, userBadges] = await Promise.all([
        apiService.getUserProfile(),
        apiService.getBadges(),
      ]);
      setProfile(userProfile);
      setBadges(userBadges);
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      // Mock data
      setProfile({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        wallet: 450,
        strikes: 0,
      });
      setBadges([
        {
          id: '1',
          name: 'Coffee Hopper',
          description: 'Visit 3 cafes',
          icon: 'cafe',
          reward: 50,
          unlocked: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderBadge = ({ item }: { item: Badge }) => (
    <View style={[styles.badgeCard, !item.unlocked && styles.badgeCardLocked]}>
      <Ionicons
        name={item.icon as any || 'trophy'}
        size={32}
        color={item.unlocked ? '#FF6B35' : '#ccc'}
      />
      <Text style={[styles.badgeName, !item.unlocked && styles.textLocked]}>
        {item.name}
      </Text>
      <Text style={[styles.badgeReward, !item.unlocked && styles.textLocked]}>
        ₹{item.reward}
      </Text>
    </View>
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
        <Text style={styles.headerTitle}>Wallet & Rewards</Text>
      </View>

      <View style={styles.walletCard}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletLabel}>Available Balance</Text>
          <Ionicons name="wallet" size={24} color="#FF6B35" />
        </View>
        <Text style={styles.walletAmount}>₹{profile?.wallet || 0}</Text>
        <TouchableOpacity style={styles.withdrawButton}>
          <Text style={styles.withdrawButtonText}>Withdraw to Bank</Text>
        </TouchableOpacity>
      </View>

      {profile && profile.strikes > 0 && (
        <View style={styles.strikeCard}>
          <Ionicons name="warning" size={24} color="#FF6B35" />
          <View style={styles.strikeTextContainer}>
            <Text style={styles.strikeText}>
              You have {profile.strikes} strike{profile.strikes > 1 ? 's' : ''}
            </Text>
            <Text style={styles.strikeSubtext}>
              3 strikes will result in temporary ban
            </Text>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Badges & Achievements</Text>
        <FlatList
          data={badges}
          renderItem={renderBadge}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.badgeList}
        />
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
  header: {
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
  walletCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletLabel: {
    fontSize: 14,
    color: '#666',
  },
  walletAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: '#FF6B35',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  strikeCard: {
    backgroundColor: '#FFF3E0',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  strikeTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  strikeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  strikeSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  section: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  badgeList: {
    paddingRight: 16,
  },
  badgeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 12,
    width: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeCardLocked: {
    opacity: 0.5,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
  badgeReward: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: 'bold',
  },
  textLocked: {
    color: '#999',
  },
});

export default WalletScreen;
