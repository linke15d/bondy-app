import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    TextInput, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import GradientButton from '../../components/GradientButton';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginScreen() {
    const { login, isLoading } = useAuthStore();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email.trim()) {
            Toast.show({ type: 'error', text1: t('auth.phonePlaceholder'), position: 'top' });
            return;
        }
        if (!EMAIL_REGEX.test(email.trim())) {
            Toast.show({ type: 'error', text1: t('auth.passPlaceholder'), position: 'top' });
            return;
        }
        if (!password.trim()) {
            Toast.show({ type: 'error', text1: t('auth.errorPasswordEmpty'), position: 'top' });
            return;
        }
        try {
            await login(email, password);
            navigation.navigate('Main');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error.message || t('auth.errorLogin') });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

                {/* 顶部导航栏 */}
                <View style={styles.topBar}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Text style={styles.backText}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.topTitle}>{t('auth.login')}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    {/* 顶部 Logo 区域 */}
                    <View style={styles.logoArea}>
                        <Image
                            source={require('../onboarding/images/emoji4.png')}
                            style={styles.logoImage}
                        />
                        <Text style={styles.logoTitle}>Bondy</Text>
                        <Text style={styles.logoSubtitle}>{t('auth.loginSubtitle')}</Text>
                    </View>

                    {/* 邮箱 */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>{t('auth.phone')}</Text>
                        <View style={styles.inputRow}>
                            <Image source={require('./images/email.png')} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmail}
                                placeholder={t('auth.phonePlaceholder')}
                                placeholderTextColor={Colors.text.placeholder}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {/* 密码 */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>{t('auth.password')}</Text>
                        <View style={styles.inputRow}>
                            <Image source={require('./images/pass.png')} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPassword}
                                placeholder={t('auth.passPlaceholder')}
                                placeholderTextColor={Colors.text.placeholder}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword
                                    ? <Image source={require('./images/eye-close.png')} style={styles.eyeIcon} />
                                    : <Image source={require('./images/eye-open.png')} style={styles.eyeIcon} />
                                }
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* 忘记密码 */}
                    <TouchableOpacity
                        style={styles.forgotRow}
                        onPress={() => {
                            // TODO: 忘记密码页面
                        }}>
                        <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                    </TouchableOpacity>

                    {/* 登录按钮 */}
                    <GradientButton
                        text={isLoading ? t('common.loading') : `🔓 ${t('auth.loginBtn')}`}
                        onPress={handleLogin}
                    />

                    {/* 分割线 */}
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>{t('auth.or')}</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* 生物识别登录 */}
                    <TouchableOpacity style={styles.biometricBtn} activeOpacity={0.8}>
                        <Text style={styles.biometricText}>{t('auth.biometric')}</Text>
                    </TouchableOpacity>

                    {/* 注册跳转 */}
                    <View style={styles.registerRow}>
                        <Text style={styles.registerHint}>{t('auth.noAccount')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.registerLink}>{t('auth.registerNow')}</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    topBar: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16, height: 52,
    },
    backBtn: { padding: 6 },
    backText: { fontSize: 22, color: Colors.primary },
    topTitle: { fontSize: 17, fontWeight: '700', color: 'white' },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
    logoArea: { alignItems: 'center', marginBottom: 32, marginTop: 8 },
    logoImage: { width: 56, height: 56, marginBottom: 12 },
    logoTitle: { fontSize: 22, fontWeight: '800', color: 'white', marginBottom: 4 },
    logoSubtitle: { fontSize: 13, color: Colors.text.muted },
    fieldGroup: { marginBottom: 14 },
    fieldLabel: { fontSize: 12, color: Colors.text.muted, marginBottom: 6, paddingLeft: 4 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.surfaceElevated,
        borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
        paddingHorizontal: 14, height: 50, gap: 10,
    },
    inputIcon: { width: 16, height: 16 },
    input: { flex: 1, color: 'white', fontSize: 15 },
    eyeIcon: { width: 16, height: 16 },
    forgotRow: { alignItems: 'flex-end', marginBottom: 24, paddingRight: 4 },
    forgotText: { fontSize: 12, color: Colors.primary },
    dividerRow: {
        flexDirection: 'row', alignItems: 'center',
        gap: 12, marginVertical: 12,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.08)' },
    dividerText: { fontSize: 12, color: Colors.text.placeholder },
    biometricBtn: {
        height: 50, borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center', justifyContent: 'center',
    },
    biometricText: { fontSize: 15, fontWeight: '600', color: '#C4B5D4' },
    registerRow: {
        flexDirection: 'row', justifyContent: 'center',
        alignItems: 'center', marginTop: 24, gap: 4,
    },
    registerHint: { fontSize: 13, color: Colors.text.muted },
    registerLink: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
});