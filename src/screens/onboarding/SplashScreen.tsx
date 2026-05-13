import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import GradientButton from '../../components/GradientButton';

export default function SplashScreen() {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <View style={styles.logoBox}>
                <Image
                    source={require('../../assets/images/logo.png')}
                    style={{ width: 136, height: 136 }}
                    resizeMode="contain"
                />
            </View>
            <Text style={styles.title}>Bondy</Text>
            <Text style={styles.subtitle}>{t('onboarding.splash.subtitle')}</Text>

            <View style={styles.btnGroup}>
                <GradientButton
                    text={t('onboarding.getStarted')}
                    onPress={() => navigation.navigate('OnboardingPrivacy')}
                />
                <TouchableOpacity
                    style={styles.btnGhost}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.btnGhostText}>{t('onboarding.alreadyHaveAccount')}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.badgeRow}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{t('onboarding.splash.badge1')}</Text>
                </View>
                <View style={[styles.badge, styles.badgePurple]}>
                    <Text style={[styles.badgeText, styles.badgeTextPurple]}>{t('onboarding.splash.badge2')}</Text>
                </View>
                <View style={[styles.badge, styles.badgeGreen]}>
                    <Text style={[styles.badgeText, styles.badgeTextGreen]}>{t('onboarding.splash.badge3')}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    logoBox: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 38, fontWeight: '900',
        color: 'white', marginBottom: 8,
    },
    subtitle: {
        fontSize: 15, color: '#C4B5D4',
        textAlign: 'center', lineHeight: 26,
        marginBottom: 44,
    },
    badgeRow: {
        flexDirection: 'row', flexWrap: 'wrap',
        justifyContent: 'center', gap: 8,
        marginTop: 28,
    },
    badge: {
        paddingHorizontal: 10, paddingVertical: 4,
        backgroundColor: 'rgba(255,107,157,0.15)',
        borderRadius: 20,
        borderWidth: 1, borderColor: 'rgba(255,107,157,0.3)',
    },
    badgePurple: {
        backgroundColor: 'rgba(124,58,237,0.15)',
        borderColor: 'rgba(124,58,237,0.3)',
    },
    badgeGreen: {
        backgroundColor: 'rgba(16,185,129,0.12)',
        borderColor: 'rgba(16,185,129,0.25)',
    },
    badgeText: { fontSize: 12, color: Colors.primary },
    badgeTextPurple: { color: '#A78BFA' },
    badgeTextGreen: { color: '#10B981' },
    btnGroup: { width: '100%', gap: 12 },
    btnPrimary: {
        height: 50, borderRadius: 25,
        backgroundColor: Colors.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    btnPrimaryText: { color: 'white', fontSize: 16, fontWeight: '700' },
    btnGhost: {
        height: 50, borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    btnGhostText: { color: '#C4B5D4', fontSize: 15, fontWeight: '600' },
});