import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import DiscoveryScreen from '../screens/DiscoveryScreen';
import MissionsScreen from '../screens/MissionsScreen';
import WalletScreen from '../screens/WalletScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import RideBookingScreen from '../screens/RideBookingScreen';
import QRCodeScreen from '../screens/QRCodeScreen';

export type RootStackParamList = {
  Main: undefined;
  CampaignDetail: { campaignId: string };
  RideBooking: { campaignId: string };
  QRCode: { rideId: string };
};

export type MainTabParamList = {
  Discovery: undefined;
  Missions: undefined;
  Wallet: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Discovery') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Missions') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Discovery" component={DiscoveryScreen} />
      <Tab.Screen name="Missions" component={MissionsScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Main" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="CampaignDetail" 
          component={CampaignDetailScreen}
          options={{ title: 'Deal Details' }}
        />
        <Stack.Screen 
          name="RideBooking" 
          component={RideBookingScreen}
          options={{ title: 'Book Ride' }}
        />
        <Stack.Screen 
          name="QRCode" 
          component={QRCodeScreen}
          options={{ title: 'Your QR Code' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
