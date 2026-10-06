import AnimatedPressable from '@/components/AnimatedPressable';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Path } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { setSeenOnboarding } from '@/services/onboarding';

const { width, height } = Dimensions.get('window');

// ── Assets ────────────────────────────────────────────────────
const heroAmbulance     = require('../assets/images/d3ed25b449f6673cf08f82108ed3ffdbee42496f.png');
const heroTracking      = require('../assets/images/ee39c96b23a1269999acebcb915bd1f78cfb7d9d.png');
const heroTrackingNew   = require('../assets/images/tracking-removebg-preview.png');
const badgeAmbulanceImg = require('../assets/images/55db5697e48e0f4725005acd74c31ccf1a5fc473 (1).png');
const badgeLocationImg  = require('../assets/images/location.png');

// ── Slides ────────────────────────────────────────────────────
const SLIDES = [
  {
    key: 'ambulance',
    titleParts: ['Call an ', 'Ambulance', ' in Minutes'],
    body: 'Quickly request emergency medical transport from nearby providers.',
    heroImage: heroAmbulance,
    aspectRatio: 494 / 505,
    badgeLeft:  { image: badgeLocationImg,  label: 'Nearby' },
    badgeRight: { image: badgeAmbulanceImg, label: 'Ready' },
    accent: Colors.primary,
  },
  {
    key: 'tracking',
    titleParts: ['', 'Track', ' Help in Real Time'],
    body: 'See when your ambulance will arrive and stay informed every step.',
    heroImage: heroTrackingNew,
    aspectRatio: 577 / 433,
    badgeLeft:  { image: badgeLocationImg,  label: 'Live' },
    badgeRight: { image: badgeAmbulanceImg, label: 'En Route' },
    accent: Colors.success,
  },
  {
    key: 'tracking2',
    titleParts: ['Track ', 'Help', ' Every Step'],
    body: 'Monitor your ambulance in real time from dispatch to arrival.',
    heroImage: heroTracking,
    aspectRatio: 612 / 408,
    badgeLeft:  null,
    badgeRight: null,
    accent: Colors.warning,
  },
];

const DOT_GRID = Array.from({ length: 40 }, (_, i) => ({
  cx: (i * 37) % 400,
  cy: ((i * 53) % 260) + 20,
}));

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  const contentOpacity = useSharedValue(1);
  const contentY       = useSharedValue(0);
  const translateX     = useSharedValue(0);
  const slideX         = useSharedValue(0);
  const float1         = useSharedValue(0);
  const float2         = useSharedValue(0);
  const btnScale       = useSharedValue(1);
  const dw0            = useSharedValue(20);
  const dw1            = useSharedValue(7);
  const dw2            = useSharedValue(7);

  useEffect(() => {
    float1.value = withRepeat(
      withSequence(
        withTiming(-8, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,  { duration: 1600, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
    float2.value = withRepeat(
      withSequence(
        withTiming(8,  { duration: 1900, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,  { duration: 1900, easing: Easing.inOut(Easing.sin) })
      ), -1, true
    );
  }, [float1, float2]);

  const animateDots = (next: number) => {
    dw0.value = withTiming(next === 0 ? 20 : 7, { duration: 250 });
    dw1.value = withTiming(next === 1 ? 20 : 7, { duration: 250 });
    dw2.value = withTiming(next === 2 ? 20 : 7, { duration: 250 });
  };

  const goTo = (next: number) => {
    if (next < 0 || next > SLIDES.length - 1) return;
    const direction = next > index ? -1 : 1;

    slideX.value = withTiming(direction * width, { duration: 280, easing: Easing.inOut(Easing.cubic) }, () => {
      runOnJS(setIndex)(next);
      runOnJS(animateDots)(next);
      slideX.value = direction * -width;
      slideX.value = withTiming(0, { duration: 280, easing: Easing.inOut(Easing.cubic) });
    });
  };

  const handleNext = () => {
    btnScale.value = withSequence(
      withTiming(0.95, { duration: 80 }),
      withSpring(1, { damping: 8 })
    );
    if (index < SLIDES.length - 1) {
      goTo(index + 1);
    } else {
      setSeenOnboarding();
      router.replace('/main');
    }
  };

  const handleSkip = () => {
    setSeenOnboarding();
    router.replace('/main');
  };

  const pan = Gesture.Pan()
    .onUpdate((e) => { translateX.value = e.translationX * 0.35; })
    .onEnd((e) => {
      translateX.value = withSpring(0, { damping: 18 });
      if (e.translationX < -60) runOnJS(goTo)(index + 1);
      if (e.translationX > 60)  runOnJS(goTo)(index - 1);
    });

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
    transform: [
      { translateX: translateX.value + slideX.value },
      { translateY: contentY.value },
    ],
  }));
  const float1Style = useAnimatedStyle(() => ({ transform: [{ translateY: float1.value }] }));
  const float2Style = useAnimatedStyle(() => ({ transform: [{ translateY: float2.value }] }));
  const btnStyle    = useAnimatedStyle(() => ({ transform: [{ scale: btnScale.value }] }));
  const dot0Style   = useAnimatedStyle(() => ({ width: dw0.value }));
  const dot1Style   = useAnimatedStyle(() => ({ width: dw1.value }));
  const dot2Style   = useAnimatedStyle(() => ({ width: dw2.value }));
  const dotStyles   = [dot0Style, dot1Style, dot2Style];

  const slide = SLIDES[index];

  return (
    <View style={[styles.root, { paddingTop: insets.top + 40 }]}>
      <StatusBar style="light" />

      {/* dot-grid backdrop */}
      <Svg style={StyleSheet.absoluteFill} width={width} height={height * 0.6} viewBox="0 0 400 300">
        {DOT_GRID.map((d, i) => (
          <Circle key={i} cx={d.cx} cy={d.cy} r={1.4} fill={Colors.border} opacity={0.4} />
        ))}
      </Svg>

      {/* skip — top right, hide on last slide */}
      {index < SLIDES.length - 1 && (
        <AnimatedPressable style={[styles.skipBtn, { top: insets.top + 16 }]} onPress={handleSkip} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </AnimatedPressable>
      )}

      {/* back arrow — slide 2 and 3 only */}
      {index > 0 && (
        <AnimatedPressable style={[styles.backBtn, { top: insets.top + 16 }]} onPress={() => goTo(index - 1)} hitSlop={12}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M19 12H5M5 12L11 6M5 12L11 18"
              stroke={Colors.text}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </AnimatedPressable>
      )}

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.hero, contentStyle]}>

          <View style={[styles.figureWrap, { aspectRatio: slide.aspectRatio }]}>
            <Image source={slide.heroImage} style={styles.heroImage} resizeMode="contain" />

            {slide.badgeLeft && (
              <Animated.View style={[styles.badge, styles.badgeLeft, float1Style]}>
                <BlurView intensity={50} tint="light" style={styles.badgeBlur}>
                  <Image source={slide.badgeLeft.image} style={styles.badgeImage} resizeMode="cover" />
                  <Text style={styles.badgeLabel}>{slide.badgeLeft.label}</Text>
                </BlurView>
              </Animated.View>
            )}

            {slide.badgeRight && (
              <Animated.View style={[styles.badge, styles.badgeRight, float2Style]}>
                <BlurView intensity={50} tint="light" style={styles.badgeBlur}>
                  <Image source={slide.badgeRight.image} style={styles.badgeImage} resizeMode="cover" />
                  <Text style={styles.badgeLabel}>{slide.badgeRight.label}</Text>
                </BlurView>
              </Animated.View>
            )}
          </View>

          <Text style={styles.heading}>
            {slide.titleParts[0]}
            <Text style={[styles.headingAccent, { color: slide.accent }]}>
              {slide.titleParts[1]}
            </Text>
            {slide.titleParts[2]}
          </Text>

          <Text style={styles.body}>{slide.body}</Text>
        </Animated.View>
      </GestureDetector>

      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 8 }]}>
        {/* pagination */}
        <View style={styles.pagination}>
          {SLIDES.map((s, i) => (
            <Animated.View
              key={s.key}
              style={[
                styles.pageDot,
                dotStyles[i],
                i === index && { backgroundColor: slide.accent },
              ]}
            />
          ))}
        </View>

        {/* CTA button */}
        <Animated.View style={btnStyle}>
          <AnimatedPressable
            style={styles.nextBtn}
            onPress={handleNext}
          >
            <LinearGradient
              colors={[Colors.primary, '#1a7ad4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.nextBtnGradient}
            >
              <Text style={styles.nextBtnText}>
                {index === SLIDES.length - 1 ? 'Get Started' : 'Next'}
              </Text>
            </LinearGradient>
          </AnimatedPressable>
        </Animated.View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  skipBtn: {
    position: 'absolute',
    right: 24,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: Colors.subtext,
    fontWeight: '600',
    fontSize: 14,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 24,
    zIndex: 10,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  figureWrap: {
    width: width * 0.9,
    maxHeight: height * 0.38,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  badgeBlur: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  badgeImage: {
    width: 32,
    height: 32,
    borderRadius: 9,
  },
  badgeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  badgeLeft: {
    top: '12%',
    left: -14,
  },
  badgeRight: {
    top: '4%',
    right: -14,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 34,
    marginTop: 12,
  },
  headingAccent: {
    color: Colors.primary,
  },
  body: {
    fontSize: 15,
    color: Colors.subtext,
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  bottomArea: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 8,
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 6,
    alignItems: 'center',
  },
  pageDot: {
    height: 7,
    width: 7,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  nextBtn: {
    width: width - 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  nextBtnGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  nextBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

});
