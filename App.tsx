import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import './src/i18n';
import Navigation from './src/navigation';
import { useAuthStore } from './src/store/authStore';

export default function App() {
    const loadFromStorage = useAuthStore(s => s.loadFromStorage);

    useEffect(() => {
        loadFromStorage();
    }, []);

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