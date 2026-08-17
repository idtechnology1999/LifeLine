import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors } from '@/constants/colors';
import { RoleOption } from '@/types';

interface RoleCardProps {
  option: RoleOption;
  isSelected: boolean;
  onPress: () => void;
}

export default function RoleCard({ option, isSelected, onPress }: RoleCardProps) {
  const scale = useSharedValue(1);

  useEffect(() => {}, [isSelected]);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        {
          borderColor: isSelected ? Colors.primary : Colors.border,
          borderWidth: isSelected ? 2 : 1,
          backgroundColor: isSelected ? Colors.secondary : Colors.white,
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => { scale.value = withSpring(0.97, { damping: 12 }); }}
        onPressOut={() => { scale.value = withSpring(1, { damping: 10 }); }}
        style={styles.inner}
      >
        <View style={[styles.iconWrap, { backgroundColor: isSelected ? Colors.primary + '22' : '#F0F4FF' }]}>
          {option.icon}
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, isSelected && { color: Colors.primary }]}>
            {option.title}
          </Text>
          <Text style={styles.description}>{option.description}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkWrap}>
            <Svg width={18} height={18} viewBox="0 0 24 24">
              <Circle cx="12" cy="12" r="10" fill={Colors.primary} />
              <Path
                d="M7 12.5l3.5 3.5 6.5-7"
                stroke={Colors.white}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    gap: 18,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrap: {
    flex: 1,
    gap: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  description: {
    fontSize: 14,
    color: Colors.subtext,
    lineHeight: 20,
  },
  checkWrap: {
    marginLeft: 4,
  },
});
