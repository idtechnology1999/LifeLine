import React from 'react';
import { Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressableBase = Animated.createAnimatedComponent(Pressable);

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  scaleTo?: number;
  haptic?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedPressable({
  scaleTo = 0.96,
  haptic = true,
  onPressIn,
  onPressOut,
  onPress,
  style,
  children,
  disabled,
  ...rest
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressableBase
      disabled={disabled}
      onPressIn={(e) => {
        if (!disabled) scale.value = withSpring(scaleTo, { damping: 15, stiffness: 400 });
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        scale.value = withSpring(1, { damping: 12, stiffness: 300 });
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic && !disabled && Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
        onPress?.(e);
      }}
      style={[animatedStyle, style]}
      {...rest}
    >
      {children}
    </AnimatedPressableBase>
  );
}
