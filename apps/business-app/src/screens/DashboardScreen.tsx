import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { apiService, Analytics, Transaction } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';

const DashboardScreen: React.FC = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    loadData();
  }, [timeframe]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [analyticsData, transactions] = await Promise.all([
        apiService.getAnalytics(timeframe),
        apiService.getTransactions(5),
      ]);
      setAnalytics(analyticsData);
      setRecentTransactions(transactions);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Mock data
      setAnalytics({
        totalVisits: 156,
        totalSpend: 28450,
        newCustomers: 89,
        returningCustomers: 67,
        averageCostPerCustomer: 182,
        roi: 3.2,
      });
      setRecentTransactions([
        {
          id: '1',
          userId: 'u1',
          userName: 'John Doe',
          amount: 170,
          type: 'cpt',
          timestamp: new Date().toISOString(),
          isNewCustomer: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B35" />
      </View>
    );
  }

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [45, 52, 38, 67, 71, 89, 95],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>ROI Dashboard</Text>
        <View style={styles.timeframeSelector}>
          <TouchableOpacity
            style={[styles.timeframeButton, timeframe === 'day' && styles.timeframeButtonActive]}
            onPress={() => setTimeframe('day')}
          >
            <Text style={[styles.timeframeText, timeframe === 'day' && styles.timeframeTextActive]}>
              Day
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeframeButton, timeframe === 'week' && styles.timeframeButtonActive]}
            onPress={() => setTimeframe('week')}
          >
            <Text style={[styles.timeframeText, timeframe === 'week' && styles.timeframeTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.timeframeButton, timeframe === 'month' && styles.timeframeButtonActive]}
            onPress={() => setTimeframe('month')}
          >
            <Text style={[styles.timeframeText, timeframe === 'month' && styles.timeframeTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={32} color="#FF6B35" />
          <Text style={styles.statValue}>{analytics?.totalVisits}</Text>
          <Text style={styles.statLabel}>Total Visits</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="cash" size={32} color="#4CAF50" />
          <Text style={styles.statValue}>₹{analytics?.totalSpend}</Text>
          <Text style={styles.statLabel}>Total Spend</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="person-add" size={32} color="#2196F3" />
          <Text style={styles.statValue}>{analytics?.newCustomers}</Text>
          <Text style={styles.statLabel}>New Customers</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="repeat" size={32} color="#9C27B0" />
          <Text style={styles.statValue}>{analytics?.returningCustomers}</Text>
          <Text style={styles.statLabel}>Returning</Text>
        </View>
      </View>

      <View style={styles.roiCard}>
        <Text style={styles.roiLabel}>Average Cost Per Customer</Text>
        <Text style={styles.roiValue}>₹{analytics?.averageCostPerCustomer}</Text>
        <Text style={styles.roiComparison}>
          vs Zomato (₹350) - You Save 48%! 🎉
        </Text>
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Visits Trend</Text>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 64}
          height={200}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>{transaction.userName}</Text>
              <Text style={styles.transactionTime}>
                {new Date(transaction.timestamp).toLocaleString()}
              </Text>
            </View>
            <View style={styles.transactionAmount}>
              <Text style={styles.transactionValue}>₹{transaction.amount}</Text>
              {transaction.isNewCustomer && (
                <Text style={styles.newCustomerBadge}>NEW</Text>
              )}
            </View>
          </View>
        ))}
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
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  timeframeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  timeframeButtonActive: {
    backgroundColor: '#FF6B35',
  },
  timeframeText: {
    color: '#666',
    fontWeight: '600',
  },
  timeframeTextActive: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  roiCard: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roiLabel: {
    fontSize: 14,
    color: '#666',
  },
  roiValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF6B35',
    marginVertical: 8,
  },
  roiComparison: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  transactionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionIcon: {
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  transactionTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  transactionValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  newCustomerBadge: {
    fontSize: 10,
    color: '#fff',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
});

export default DashboardScreen;
