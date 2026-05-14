import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import './src/i18n'; // 初始化 i18n
import Navigation from './src/navigation';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <Navigation />
        <Toast /> 
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}