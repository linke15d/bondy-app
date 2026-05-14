import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Image,
    TextInput, ScrollView, KeyboardAvoidingView, Platform,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../theme/colors';
import GradientButton from '../../components/GradientButton';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';

type Gender = 'female' | 'male' | 'other';

// 密码规则：大小写字母 + 数字 + 特殊符号 + 最少8位
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
//邮箱格式规则
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function RegisterScreen() {
    const { register, isLoading } = useAuthStore();
    const navigation = useNavigation<any>();
    const { t } = useTranslation();

    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [gender, setGender] = useState<Gender>('female');
    const [agreed, setAgreed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // 密码强度检测
    const getPasswordStrength = (pwd: string): { level: number; label: string; color: string } => {
        if (pwd.length === 0) return { level: 0, label: '', color: 'transparent' };
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[a-z]/.test(pwd)) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) score++;

        if (score <= 2) return { level: 1, label: t('auth.passwordWeak'), color: '#EF4444' };
        if (score <= 3) return { level: 2, label: t('auth.passwordMedium'), color: '#F59E0B' };
        if (score <= 4) return { level: 3, label: t('auth.passwordStrong'), color: '#10B981' };
        return { level: 4, label: t('auth.passwordVeryStrong'), color: '#10B981' };
    };

    const strength = getPasswordStrength(password);

    const genderOptions: { key: Gender; label: string; emoji: any }[] = [
        { key: 'female', label: t('auth.female'), emoji: require('./images/woman.png') },
        { key: 'male', label: t('auth.male'), emoji: require('./images/man.png') },
        { key: 'other', label: t('auth.other'), emoji: require('./images/rainbow.png') },
    ];

    const handleRegister = async () => {
        if (!nickname.trim()) {
            Toast.show({ type: 'error', text1: t('auth.nicknamePlaceholder'), position: 'top' });
            return;
        }
        if (!email.trim()) {
            Toast.show({ type: 'error', text1: t('auth.phonePlaceholder'), position: 'top' });
            return;
        }
        if (!EMAIL_REGEX.test(email.trim())) {
            Toast.show({ type: 'error', text1: t('auth.errorEmailFormat'), position: 'top' });
            return;
        }
        if (!PASSWORD_REGEX.test(password)) {
            Toast.show({ type: 'error', text1: t('auth.errorPasswordFormat'), position: 'top' });
            return;
        }
        if (password !== confirmPassword) {
            Toast.show({ type: 'error', text1: t('auth.errorPasswordNotMatch'), position: 'top' });
            return;
        }
        if (!agreed) {
            Toast.show({ type: 'error', text1: t('auth.errorAgree'), position: 'top' });
            return;
        }
        try {
            await register({ nickname, email, password, gender });
            navigation.navigate('Main');
        } catch (error: any) {
            Toast.show({ type: 'error', text1: error.message || t('auth.errorRegister') });
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
                    <Text style={styles.topTitle}>{t('auth.register')}</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled">

                    {/* 顶部图标 */}
                    <View style={styles.logoArea}>
                        <Image source={require('../onboarding/images/emoji4.png')} style={styles.logoEmoji} />
                        <Text style={styles.logoSubtitle}>{t('auth.createSubtitle')}</Text>
                    </View>

                    {/* 昵称 */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>{t('auth.nickname')}</Text>
                        <View style={styles.inputRow}>
                            <Image source={require('./images/user.png')} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={nickname}
                                onChangeText={setNickname}
                                placeholder={t('auth.nicknamePlaceholder')}
                                placeholderTextColor={Colors.text.placeholder}
                            />
                        </View>
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

                        {/* 密码强度条 */}
                        {password.length > 0 && (
                            <View style={styles.strengthArea}>
                                <View style={styles.strengthBars}>
                                    {[1, 2, 3, 4].map(i => (
                                        <View
                                            key={i}
                                            style={[
                                                styles.strengthBar,
                                                { backgroundColor: i <= strength.level ? strength.color : Colors.surfaceElevated }
                                            ]}
                                        />
                                    ))}
                                </View>
                                <Text style={[styles.strengthLabel, { color: strength.color }]}>
                                    {strength.label}
                                </Text>
                            </View>
                        )}

                        {/* 密码规则提示 */}
                        <Text style={styles.passwordHint}>{t('auth.passwordHint')}</Text>
                    </View>

                    {/* 确认密码 */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>{t('auth.confirmPassword')}</Text>
                        <View style={[
                            styles.inputRow,
                            confirmPassword.length > 0 && password !== confirmPassword && styles.inputRowError,
                        ]}>
                            <Image source={require('./images/pass.png')} style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                placeholder={t('auth.confirmPasswordPlaceholder')}
                                placeholderTextColor={Colors.text.placeholder}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword
                                    ? <Image source={require('./images/eye-close.png')} style={styles.eyeIcon} />
                                    : <Image source={require('./images/eye-open.png')} style={styles.eyeIcon} />
                                }
                            </TouchableOpacity>
                        </View>
                        {confirmPassword.length > 0 && password !== confirmPassword && (
                            <Text style={styles.errorText}>{t('auth.errorPasswordNotMatch')}</Text>
                        )}
                    </View>

                    {/* 性别选择 */}
                    <View style={styles.fieldGroup}>
                        <Text style={styles.fieldLabel}>{t('auth.gender')}</Text>
                        <View style={styles.genderRow}>
                            {genderOptions.map((opt: any) => (
                                <TouchableOpacity
                                    key={opt.key}
                                    style={[
                                        styles.genderBtn,
                                        gender === opt.key && styles.genderBtnActive,
                                    ]}
                                    onPress={() => setGender(opt.key)}
                                    activeOpacity={0.8}>
                                    <Image
                                        source={opt.emoji}
                                        style={{ width: 20, height: 20, marginRight: 6 }}
                                        resizeMode="contain"
                                    />
                                    <Text style={[
                                        styles.genderText,
                                        gender === opt.key && styles.genderTextActive,
                                    ]}>
                                        {opt.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* 同意条款 */}
                    <TouchableOpacity
                        style={styles.agreeRow}
                        onPress={() => setAgreed(!agreed)}
                        activeOpacity={0.8}>
                        <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
                            {agreed && <Text style={styles.checkmark}>✓</Text>}
                        </View>
                        <Text style={styles.agreeText}>
                            {t('auth.agreeTerms')}{' '}
                            <Text style={styles.agreeLink}>{t('auth.privacyPolicy')}</Text>
                            {' '}{t('auth.and')}{' '}
                            <Text style={styles.agreeLink}>{t('auth.terms')}</Text>
                            ，{t('auth.ageConfirm')}
                        </Text>
                    </TouchableOpacity>

                    {/* 创建账号按钮 */}
                    <GradientButton
                        text={isLoading ? t('common.loading') : `🚀 ${t('auth.createAccount')}`}
                        onPress={handleRegister}
                    />
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
    logoArea: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
    logoEmoji: { width: 36, height: 36, marginBottom: 10 },
    logoSubtitle: { fontSize: 13, color: Colors.text.muted },
    fieldGroup: { marginBottom: 14 },
    fieldLabel: { fontSize: 12, color: Colors.text.muted, marginBottom: 6, paddingLeft: 4 },
    inputRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.surfaceElevated,
        borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
        paddingHorizontal: 14, height: 50, gap: 10,
    },
    inputRowError: {
        borderColor: '#EF4444',
        borderWidth: 1.5,
    },
    inputIcon: { width: 16, height: 16 },
    input: { flex: 1, color: 'white', fontSize: 15 },
    eyeIcon: { width: 16, height: 16 },
    strengthArea: {
        flexDirection: 'row', alignItems: 'center',
        gap: 8, marginTop: 8, paddingHorizontal: 4,
    },
    strengthBars: { flexDirection: 'row', gap: 4, flex: 1 },
    strengthBar: { flex: 1, height: 3, borderRadius: 2 },
    strengthLabel: { fontSize: 11, fontWeight: '600' },
    passwordHint: {
        fontSize: 11, color: Colors.text.muted,
        marginTop: 6, paddingHorizontal: 4, lineHeight: 16,
    },
    errorText: { fontSize: 11, color: '#EF4444', marginTop: 6, paddingLeft: 4 },
    genderRow: { flexDirection: 'row', gap: 8 },
    genderBtn: {
        flex: 1, paddingVertical: 10,
        backgroundColor: Colors.surfaceElevated,
        borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
        alignItems: 'center', flexDirection: 'row', justifyContent: 'center',
    },
    genderBtnActive: {
        backgroundColor: 'rgba(255,107,157,0.15)',
        borderWidth: 1.5, borderColor: Colors.primary,
    },
    genderText: { fontSize: 13, color: Colors.text.muted, fontWeight: '600' },
    genderTextActive: { color: Colors.primary },
    agreeRow: {
        flexDirection: 'row', alignItems: 'flex-start',
        gap: 8, paddingHorizontal: 4, marginBottom: 20, marginTop: 4,
    },
    checkbox: {
        width: 18, height: 18, borderRadius: 4,
        borderWidth: 1.5, borderColor: Colors.text.placeholder,
        alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1,
    },
    checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    checkmark: { fontSize: 11, color: 'white', fontWeight: '700' },
    agreeText: { flex: 1, fontSize: 11, color: Colors.text.muted, lineHeight: 18 },
    agreeLink: { color: Colors.primary },
});