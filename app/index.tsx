import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as SplashScreenExpo from 'expo-splash-screen';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

SplashScreenExpo.preventAutoHideAsync();

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const scale      = useSharedValue(0);
  const opacity    = useSharedValue(0);
  const rotate     = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textY       = useSharedValue(16);

  const hideNative = useCallback(() => {
    SplashScreenExpo.hideAsync();
  }, []);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.back(1.6)) });
    opacity.value = withTiming(1, { duration: 400 });

    rotate.value = withDelay(
      650,
      withSequence(
        withTiming(-8,  { duration: 60 }),
        withTiming(8,   { duration: 60 }),
        withTiming(-6,  { duration: 55 }),
        withTiming(6,   { duration: 55 }),
        withTiming(-3,  { duration: 50 }),
        withTiming(3,   { duration: 50 }),
        withTiming(0,   { duration: 40 }),
      )
    );

    textOpacity.value = withDelay(1100, withTiming(1, { duration: 450 }));
    textY.value       = withDelay(1100, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }));

    const t = setTimeout(() => {
      runOnJS(hideNative)();
      router.replace('/onboarding');
    }, 2600);
    return () => clearTimeout(t);
  }, [scale, opacity, rotate, textOpacity, textY, hideNative]);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <View style={[styles.root, { paddingTop: insets.top + 40 }]}>
      <StatusBar style="light" />

      <Animated.View style={[styles.logoWrap, logoStyle]}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.appName, textStyle]}>
        Lifeline
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#101828',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    marginTop: 20,
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
