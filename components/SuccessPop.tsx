import React, { useEffect } from 'react';
import { ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

interface SuccessPopProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function SuccessPop({ children, style }: SuccessPopProps) {
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.12, { damping: 9, stiffness: 180 }),
      withSpring(1, { damping: 12, stiffness: 200 })
    );
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}
