import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../theme/colors';

import SplashScreen from '../screens/onboarding/SplashScreen';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
    <Text style={{ color: Colors.text.primary, fontSize: 18 }}>{name}</Text>
  </View>
);

export type RootStackParamList = {
  Splash: undefined;
  OnboardingPrivacy: undefined;
  Register: undefined;
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Calendar: undefined;
  NewRecord: undefined;
  Insights: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(26,17,40,0.98)',
          borderTopColor: 'rgba(255,255,255,0.06)',
          height: 76,
          paddingBottom: 16,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.text.placeholder,
        tabBarLabelStyle: { fontSize: 10 },
      }}>
      <Tab.Screen name="Home" component={() => <PlaceholderScreen name="首页" />}
        options={{ tabBarLabel: t('tabBar.home'), tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text> }} />
      <Tab.Screen name="Calendar" component={() => <PlaceholderScreen name="日历" />}
        options={{ tabBarLabel: t('tabBar.calendar'), tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📅</Text> }} />
      <Tab.Screen name="NewRecord" component={() => <PlaceholderScreen name="新建记录" />}
        options={{
          tabBarLabel: '',
          tabBarIcon: () => (
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: -20 }}>
              <Text style={{ fontSize: 24, color: 'white' }}>＋</Text>
            </View>
          ),
        }} />
      <Tab.Screen name="Insights" component={() => <PlaceholderScreen name="洞察" />}
        options={{ tabBarLabel: t('tabBar.insights'), tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📊</Text> }} />
      <Tab.Screen name="Profile" component={() => <PlaceholderScreen name="我的" />}
        options={{ tabBarLabel: t('tabBar.profile'), tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text> }} />
    </Tab.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="OnboardingPrivacy" component={OnboardingScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Login" component={() => <PlaceholderScreen name="登录" />} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}