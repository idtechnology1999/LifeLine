import React, { useEffect } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface FadeSlideInProps {
  children: React.ReactNode;
  delay?: number;
  distance?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function FadeSlideIn({
  children,
  delay = 0,
  distance = 14,
  duration = 380,
  style,
}: FadeSlideInProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(distance);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);
    opacity.value = withDelay(delay, withTiming(1, { duration, easing }));
    translateY.value = withDelay(delay, withTiming(0, { duration, easing }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>;
}
