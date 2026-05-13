import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    FlatList, Dimensions, ListRenderItem, Image, Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Colors } from '../../theme/colors';
import GradientButton from '../../components/GradientButton';

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
            features: [
                { icon: '📊', title: t('onboarding.ai.feature1'), sub: '' },
                { icon: '💡', title: t('onboarding.ai.feature2'), sub: '' },
            ],
        },
        {
            key: 'ready',
            emoji: '🚀',
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

    const goPrev = () => {
        if (currentIndex > 0) {
            flatListRef.current?.scrollToIndex({ index: currentIndex - 1 });
            setCurrentIndex(currentIndex - 1);
        } else {
            navigation.goBack(); // 回到 Splash 页
        }
    };

    const renderSlide: ListRenderItem<typeof SLIDES[0]> = ({ item }) => (
        <View style={styles.slide}>
            <View style={styles.slideContent}>
                {/* <Image source={item.emoji} style={{ width: 54, height: 54, marginBottom: 46 }} /> */}
                <Animated.Image
                    source={item.emoji}
                    style={{
                        width: 54,
                        height: 54,
                        marginBottom: 46,
                        transform: [{ translateY: bounceAnim }],
                    }}
                    resizeMode="contain"
                />
                <Text style={styles.slideTitle}>{item.title}</Text>
                <Text style={styles.slideDesc}>{item.desc}</Text>
                <View style={styles.featureList}>
                    {item.features.map((f, i) => (
                        <View key={i} style={styles.featureItem}>
                            <Image source={f.icon} style={{ width: 18, height: 18 }} />
                            <View>
                                <Text style={styles.featureTitle}>{f.title}</Text>
                                {!!f.sub && <Text style={styles.featureSub}>{f.sub}</Text>}
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={SLIDES}
                renderItem={renderSlide}
                keyExtractor={item => item.key}
                horizontal pagingEnabled scrollEnabled={true}
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={event => {
                    const index = Math.round(event.nativeEvent.contentOffset.x / width);
                    setCurrentIndex(index);
                }}
            />
            <View style={styles.footer}>
                {/* 进度点 */}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    slide: { width, flex: 1, paddingHorizontal: 28, paddingTop: 60 },
    slideContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    slideEmoji: { fontSize: 72, marginBottom: 20 },
    slideTitle: { fontSize: 24, fontWeight: '800', color: 'white', textAlign: 'center', marginBottom: 12 },
    slideDesc: { fontSize: 14, color: '#C4B5D4', textAlign: 'center', lineHeight: 24, marginBottom: 24 },
    featureList: { width: '100%', gap: 10 },
    featureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: 14, padding: 14 },
    featureIcon: { fontSize: 22 },
    featureTitle: { fontSize: 13, fontWeight: '600', color: 'white' },
    featureSub: { fontSize: 11, color: '#7A6A8A', marginTop: 2 },
    footer: { paddingHorizontal: 28, paddingBottom: 40 },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 20 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2D1A42' },
    dotActive: { width: 20, backgroundColor: Colors.primary },
    backBtn: { alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4, marginBottom: 8, },
    backText: { fontSize: 22, color: Colors.primary, },
});