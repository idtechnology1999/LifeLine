import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable, Platform } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
import { FONT } from '@/constants/typography';

export default function PaymentSuccessScreen({
  title = 'Payment Successful!',
  subtitle = 'Ambulance is on the way',
}) {
  const circleScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(12);
  const buttonOpacity = useSharedValue(0);
  const buttonTranslateY = useSharedValue(12);

  useEffect(() => {
    circleScale.value = withSpring(1, {
      damping: 9,
      stiffness: 120,
      mass: 0.6,
    });

    checkOpacity.value = withDelay(
      180,
      withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
    );

    textOpacity.value = withDelay(
      380,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) })
    );
    textTranslateY.value = withDelay(
      380,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) })
    );

    buttonOpacity.value = withDelay(
      600,
      withTiming(1, { duration: 350, easing: Easing.out(Easing.ease) })
    );
    buttonTranslateY.value = withDelay(
      600,
      withTiming(0, { duration: 350, easing: Easing.out(Easing.ease) })
    );
  }, []);

  const circleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ translateY: buttonTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Animated.View style={[styles.iconCircle, circleStyle]}>
          <Animated.View style={checkStyle}>
            <Ionicons name="medkit" size={48} color="#1FA855" />
          </Animated.View>
        </Animated.View>

        <Animated.View style={textStyle}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View style={buttonStyle}>
          <AnimatedPressable
            onPress={() => router.replace('/requester/request')}
            style={styles.viewRequestBtn}
          >
            <Text style={styles.viewRequestText}>View Request</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </AnimatedPressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    position: 'absolute',
    top: '32%',
    width,
    alignItems: 'center',
  },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: '#E4F9EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  viewRequestBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D1B2A',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginTop: 40,
  },
  viewRequestText: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
