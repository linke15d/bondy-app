import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import './src/i18n';
import Navigation from './src/navigation';
import { useAuthStore } from './src/store/authStore';

const toastConfig: ToastConfig = {
    error: (props) => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: '#EF4444',
                borderLeftWidth: 0,
                backgroundColor: '#7C3AED',
                borderRadius: 12,
                height: 'auto',
                paddingVertical: 12,
                marginHorizontal: 16,
            }}
            contentContainerStyle={{
                paddingHorizontal: 14,
            }}
            text1Style={{
                fontSize: 14,
                fontWeight: '600',
                color: 'white',
            }}
            text2Style={{
                fontSize: 12,
                color: '#C4B5D4',
            }}
        />
    ),
    success: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#10B981',
                borderLeftWidth: 0,
                backgroundColor: '#FF6B9D',
                borderRadius: 12,
                height: 'auto',
                paddingVertical: 12,
                marginHorizontal: 16,
            }}
            contentContainerStyle={{
                paddingHorizontal: 14,
            }}
            text1Style={{
                fontSize: 14,
                fontWeight: '600',
                color: 'white',
            }}
            text2Style={{
                fontSize: 12,
                color: '#C4B5D4',
            }}
        />
    ),
    info: (props) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#FF6B9D',
                borderLeftWidth: 0,
                backgroundColor: '#1A1128',
                borderRadius: 12,
                height: 'auto',
                paddingVertical: 12,
                marginHorizontal: 16,
            }}
            contentContainerStyle={{
                paddingHorizontal: 14,
            }}
            text1Style={{
                fontSize: 14,
                fontWeight: '600',
                color: 'white',
            }}
            text2Style={{
                fontSize: 12,
                color: '#C4B5D4',
            }}
        />
    ),
};

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
                <Toast config={toastConfig} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}