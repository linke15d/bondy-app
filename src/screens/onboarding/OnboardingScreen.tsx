import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet,
    FlatList, Dimensions, ListRenderItem, Image, Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import GradientButton from '../../components/GradientButton';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const bounceAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(bounceAnim, {
                    toValue: -12,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.timing(bounceAnim, {
                    toValue: 0,
                    duration: 600,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const SLIDES = [
        {
            key: 'privacy',
            emoji: require('./images/emoji1.png'),
            title: t('onboarding.privacy.title'),
            desc: t('onboarding.privacy.desc'),
            features: [
                { icon: require('./images/icon1.png'), title: t('onboarding.privacy.localFirst'), sub: t('onboarding.privacy.localFirstSub') },
                { icon: require('./images/icon2.png'), title: t('onboarding.privacy.encryption'), sub: t('onboarding.privacy.encryptionSub') },
                { icon: require('./images/icon3.png'), title: t('onboarding.privacy.noAds'), sub: t('onboarding.privacy.noAdsSub') },
            ],
        },
        {
            key: 'sync',
            emoji: require('./images/emoji2.png'),
            title: t('onboarding.sync.title'),
            desc: t('onboarding.sync.desc'),
            features: [
                { icon: require('./images/icon4.png'), title: t('onboarding.sync.feature1'), sub: '' },
                { icon: require('./images/icon5.png'), title: t('onboarding.sync.feature2'), sub: '' },
            ],
        },
        {
            key: 'ai',
            emoji: require('./images/emoji3.png'),
            title: t('onboarding.ai.title'),
            desc: t('onboarding.ai.desc'),
            features: [],
        },
        {
            key: 'ready',
            emoji: require('./images/emoji4.png'),
            title: t('onboarding.ready.title'),
            desc: t('onboarding.ready.desc'),
            features: [],
        },
    ];

    const goNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate('Register');
        }
    };

    const renderSlide: ListRenderItem<typeof SLIDES[0]> = ({ item }) => {
        if (item.key === 'sync') {
            return <SyncSlide item={item} bounceAnim={bounceAnim} t={t} />;
        }
        if (item.key === 'ai') {
            return <AiSlide item={item} bounceAnim={bounceAnim} t={t} />;
        }
        return <DefaultSlide item={item} bounceAnim={bounceAnim} />;
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={item => item.key}
                horizontal
                pagingEnabled
                scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={event => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />
            <View style={styles.footer}>
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => (
                        <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
                    ))}
                </View>
                <GradientButton
                    text={currentIndex === SLIDES.length - 1 ? t('onboarding.startNow') : t('onboarding.nextStep')}
                    onPress={goNext}
                />
            </View>
        </View>
    );
}

// ── 默认 Slide（privacy + ready）──
function DefaultSlide({ item, bounceAnim }: any) {
    return (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                <Animated.Image
                    source={item.emoji}
                    style={{ width: 72, height: 72, marginBottom: 20, transform: [{ translateY: bounceAnim }] }}
                    resizeMode="contain"
                />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDesc}>{item.desc}</Text>
                <View style={styles.featureList}>
                    {item.features.map((f: any, i: number) => (
                        <View key={i} style={styles.featureItem}>
                            <Image source={f.icon} style={{ width: 22, height: 22 }} resizeMode="contain" />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.featureTitle}>{f.title}</Text>
                                {!!f.sub && <Text style={styles.featureSub}>{f.sub}</Text>}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ── 双人同步 Slide ──
function SyncSlide({ item, bounceAnim, t }: any) {
    return (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                <Animated.Image
                    source={item.emoji}
                    style={{ width: 72, height: 72, marginBottom: 20, transform: [{ translateY: bounceAnim }] }}
                    resizeMode="contain"
                />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDesc}>{item.desc}</Text>

                {/* 双人头像卡片 */}
                <View style={syncStyles.coupleCard}>
                    <View style={syncStyles.avatarCol}>
                        <Image source={require('./images/girl.png')} style={{ width: 48, height: 48 }} />
                        <Text style={syncStyles.onlineText}>● {t('common.online')}</Text>
                    </View>

                    <View style={syncStyles.centerCol}>
                        <Image source={require('./images/hart.png')} style={{ width: 43, height: 25 }} />
                    </View>

                    <View style={syncStyles.avatarCol}>
                        <Image source={require('./images/boy.png')} style={{ width: 48, height: 48 }} />
                        <Text style={syncStyles.onlineText}>● {t('common.online')}</Text>
                    </View>
                </View>

                {/* feature 列表 */}
                <View style={styles.featureList}>
                    {item.features.map((f: any, i: number) => (
                        <View key={i} style={styles.featureItem}>
                            <Image source={f.icon} style={{ width: 22, height: 22 }} resizeMode="contain" />
                            <Text style={styles.featureTitle}>{f.title}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ── AI 洞察 Slide ──
function AiSlide({ item, bounceAnim, t }: any) {
    const bars = [
        { h: 0.45, opacity: 0.3 },
        { h: 0.60, opacity: 0.5 },
        { h: 1.00, opacity: 1.0 },
        { h: 0.90, opacity: 0.6 },
        { h: 0.70, opacity: 0.4 },
        { h: 0.85, opacity: 0.55 },
        { h: 0.95, opacity: 1.0 },
    ];
    return (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                <Animated.Image
                    source={item.emoji}
                    style={{ width: 72, height: 72, marginBottom: 20, transform: [{ translateY: bounceAnim }] }}
                    resizeMode="contain"
                />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDesc}>{item.desc}</Text>

                {/* AI 聊天气泡 */}
                <View style={{ width: '100%', gap: 10, marginBottom: 12 }}>
                    <View style={aiStyles.aiBubbleRow}>
                        <LinearGradient
                            colors={['#7C3AED', '#3B82F6']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={aiStyles.aiAvatar}>
                            <Image source={require('./images/emoji3.png')} style={{ width: 14, height: 14 }} />
                        </LinearGradient>
                        <View style={aiStyles.aiBubble}>
                            <Text style={aiStyles.aiBubbleText}>
                                {t('onboarding.ai.chatMsg1Before')}
                                <Text style={{ color: '#FF6B9D', fontWeight: '700' }}>40%</Text>
                                {t('onboarding.ai.chatMsg1Mid')}
                                <Text style={{ color: '#FF6B9D', fontWeight: '700' }}>A+</Text> 🎉
                            </Text>
                        </View>
                    </View>
                    <View style={aiStyles.userBubbleRow}>
                        <LinearGradient
                            colors={['#FF6B9D', '#7C3AED']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={aiStyles.userBubble}>
                            <Text style={aiStyles.userBubbleText}>{t('onboarding.ai.chatMsg2')}</Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* 柱状图卡片 */}
                <View style={aiStyles.chartCard}>
                    <Text style={aiStyles.chartLabel}>{t('onboarding.ai.chartLabel')}</Text>
                    <View style={aiStyles.chartBars}>
                        {bars.map((b: any, i) => (
                            <View
                                key={i}
                                style={[
                                    aiStyles.bar,
                                    {
                                        height: b.h * 40,
                                        backgroundColor: `rgba(255, 107, 157, ${b.opacity})`,
                                    }
                                ]}
                            />
                        ))}
                    </View>
                </View>
            </View>
        </View>
    );
}

// ── 公共样式 ──
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    slide: { width, flex: 1, paddingHorizontal: 28, paddingTop: 60 },
    slideContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    slideTitle: { fontSize: 24, fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: 12 },
    slideDesc: { fontSize: 14, color: '#C4B5D4', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
    featureList: { width: '100%', gap: 10 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 14, padding: 14 },
    featureTitle: { fontSize: 13, fontWeight: '600', color: 'white' },
    featureSub: { fontSize: 11, color: '#7A6A8A', marginTop: 2 },
    footer: { paddingHorizontal: 28, paddingBottom: 40 },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2D1A42' },
    dotActive: { width: 20, backgroundColor: Colors.primary },
});

// ── Sync 样式 ──
const syncStyles = StyleSheet.create({
    coupleCard: {
        width: '100%',
        backgroundColor: '#1A1128',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    avatarCol: { alignItems: 'center', gap: 6 },
    avatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
    avatarEmoji: { fontSize: 24 },
    avatarName: { fontSize: 12, color: '#C4B5D4' },
    onlineText: { fontSize: 10, color: '#10B981' },
    centerCol: { alignItems: 'center', gap: 8 },
    lineRow: { flexDirection: 'row', gap: 3 },
    lineLeft: { width: 20, height: 2, backgroundColor: '#FF6B9D', borderRadius: 1 },
    lineRight: { width: 20, height: 2, backgroundColor: '#7C3AED', borderRadius: 1 },
});

// ── AI 样式 ──
const aiStyles = StyleSheet.create({
    aiBubbleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
    aiAvatar: {
        width: 28, height: 28, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    aiBubble: {
        flex: 1,
        backgroundColor: '#1A1128',
        borderRadius: 12, borderTopLeftRadius: 2,
        padding: 10,
    },
    aiBubbleText: { fontSize: 12, color: '#C4B5D4', lineHeight: 18 },
    userBubbleRow: { width: '100%', flexDirection: 'row', justifyContent: 'flex-end', },
    userBubble: {
        maxWidth: '70%', minWidth: 132, overflow: 'hidden', height: 40,
        justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20,
        borderBottomLeftRadius: 20, borderBottomRightRadius: 5
    },
    userBubbleText: { fontSize: 12, color: 'white', lineHeight: 18 },
    chartCard: { width: '100%', backgroundColor: '#1A1128', borderRadius: 14, padding: 14 },
    chartLabel: { fontSize: 12, color: '#7A6A8A', marginBottom: 8 },
    chartBars: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: 40 },
    bar: { flex: 1, backgroundColor: '#FF6B9D', borderRadius: 3 },
});