import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { apiService, Campaign } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

type CampaignFormRouteProp = RouteProp<RootStackParamList, 'CampaignForm'>;

const CampaignFormScreen: React.FC = () => {
  const route = useRoute<CampaignFormRouteProp>();
  const navigation = useNavigation();
  const { campaignId } = route.params || {};

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [discount, setDiscount] = useState('');
  const [rideReimbursement, setRideReimbursement] = useState('');
  const [cptFee, setCptFee] = useState('20');
  const [cpaEnabled, setCpaEnabled] = useState(false);
  const [cpaFee, setCpaFee] = useState('50');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
    }
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      const campaigns = await apiService.getCampaigns();
      const campaign = campaigns.find(c => c.id === campaignId);
      if (campaign) {
        setTitle(campaign.title);
        setDescription(campaign.description);
        setDiscount(campaign.discount.toString());
        setRideReimbursement(campaign.rideReimbursement.toString());
        setCptFee(campaign.cptFee.toString());
        setCpaEnabled(campaign.cpaEnabled);
        setCpaFee(campaign.cpaFee.toString());
        setActive(campaign.active);
      }
    } catch (error) {
      console.error('Failed to load campaign:', error);
    }
  };

  const handleSave = async () => {
    if (!title || !description || !discount || !rideReimbursement) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const campaignData: Partial<Campaign> = {
      title,
      description,
      discount: parseInt(discount),
      rideReimbursement: parseInt(rideReimbursement),
      cptFee: parseInt(cptFee),
      cpaEnabled,
      cpaFee: parseInt(cpaFee),
      active,
    };

    try {
      setLoading(true);
      if (campaignId) {
        await apiService.updateCampaign(campaignId, campaignData);
        Alert.alert('Success', 'Campaign updated successfully');
      } else {
        await apiService.createCampaign(campaignData);
        Alert.alert('Success', 'Campaign created successfully');
      }
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save campaign:', error);
      Alert.alert('Error', 'Failed to save campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!campaignId) return;

    Alert.alert(
      'Delete Campaign',
      'Are you sure you want to delete this campaign?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiService.deleteCampaign(campaignId);
              Alert.alert('Success', 'Campaign deleted successfully');
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete campaign');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>Campaign Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., FREE ₹150 Ride + 10% Off"
          value={title}
          onChangeText={setTitle}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Describe your offer..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.section, styles.halfWidth]}>
          <Text style={styles.label}>Discount (%) *</Text>
          <TextInput
            style={styles.input}
            placeholder="10"
            value={discount}
            onChangeText={setDiscount}
            keyboardType="numeric"
          />
        </View>

        <View style={[styles.section, styles.halfWidth]}>
          <Text style={styles.label}>Ride Cashback (₹) *</Text>
          <TextInput
            style={styles.input}
            placeholder="150"
            value={rideReimbursement}
            onChangeText={setRideReimbursement}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Cost Per Trip (₹)</Text>
        <TextInput
          style={styles.input}
          placeholder="20"
          value={cptFee}
          onChangeText={setCptFee}
          keyboardType="numeric"
        />
        <Text style={styles.helperText}>
          Fee charged per verified visit
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text style={styles.label}>Cost Per Acquisition (CPA)</Text>
            <Text style={styles.helperText}>
              Bonus fee for new customers
            </Text>
          </View>
          <Switch
            value={cpaEnabled}
            onValueChange={setCpaEnabled}
            trackColor={{ false: '#ccc', true: '#FF6B35' }}
          />
        </View>
        {cpaEnabled && (
          <TextInput
            style={[styles.input, styles.marginTop]}
            placeholder="50"
            value={cpaFee}
            onChangeText={setCpaFee}
            keyboardType="numeric"
          />
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.switchRow}>
          <Text style={styles.label}>Campaign Active</Text>
          <Switch
            value={active}
            onValueChange={setActive}
            trackColor={{ false: '#ccc', true: '#FF6B35' }}
          />
        </View>
      </View>

      <View style={styles.estimateCard}>
        <Text style={styles.estimateTitle}>Estimated Cost Per Customer</Text>
        <Text style={styles.estimateValue}>
          ₹{parseInt(cptFee || '0') + parseInt(rideReimbursement || '0') + (cpaEnabled ? parseInt(cpaFee || '0') : 0)}
        </Text>
        <Text style={styles.estimateBreakdown}>
          CPT (₹{cptFee || 0}) + Cashback (₹{rideReimbursement || 0})
          {cpaEnabled && ` + CPA (₹${cpaFee || 0})`}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.saveButton, loading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveButtonText}>
          {campaignId ? 'Update Campaign' : 'Create Campaign'}
        </Text>
      </TouchableOpacity>

      {campaignId && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#f44336" />
          <Text style={styles.deleteButtonText}>Delete Campaign</Text>
        </TouchableOpacity>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    paddingHorizontal: 16,
  },
  halfWidth: {
    flex: 1,
    marginHorizontal: 0,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    flex: 1,
  },
  marginTop: {
    marginTop: 12,
  },
  estimateCard: {
    backgroundColor: '#E8F5E9',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  estimateTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  estimateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 8,
  },
  estimateBreakdown: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#FF6B35',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f44336',
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});

export default CampaignFormScreen;
