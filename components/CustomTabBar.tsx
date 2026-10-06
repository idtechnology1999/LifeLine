import React, { useEffect } from 'react';
import { View, Pressable, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const triggerHaptic = () => {
  if (Platform.OS !== 'web') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
};

import { FONT } from '@/constants/typography';

type TabIconName = 'home' | 'create' | 'cube' | 'archive' | 'person';

const ICONS: Record<string, TabIconName> = {
  index: 'home',
  request: 'create',
  order: 'cube',
  inventory: 'archive',
  profile: 'person',
};

const ACTIVE_GRADIENT: [string, string] = ['#0F2E1D', '#1D6B3E'];
const INACTIVE_COLOR = '#9CA3AF';
const ACTIVE_TEXT_COLOR = '#FFFFFF';

function TabItem({
  iconName,
  label,
  isFocused,
  onPress,
}: {
  iconName: TabIconName;
  label: string;
  isFocused: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.85);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.85, { damping: 12, stiffness: 260 });
  }, [isFocused, scale]);

  const pillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (isFocused) {
    return (
      <Pressable onPress={onPress} style={styles.tabItem}>
        <Animated.View style={pillStyle}>
          <LinearGradient
            colors={ACTIVE_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.activePill}
          >
            <Ionicons name={iconName} size={18} color={ACTIVE_TEXT_COLOR} />
            <Text style={styles.activeLabel}>{label}</Text>
          </LinearGradient>
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <View style={styles.inactiveContent}>
        <Ionicons name={`${iconName}-outline`} size={20} color={INACTIVE_COLOR} />
        <Text style={styles.inactiveLabel}>{label}</Text>
      </View>
    </Pressable>
  );
}

export default function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  if (!state || !state.routes) return null;

  return (
    <View style={[styles.safeArea, { paddingBottom: insets.bottom }]}>
      <View style={styles.container}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
                ? options.title
                : route.name;

          const isFocused = state.index === index;
          const iconName = ICONS[route.name] ?? 'home';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              triggerHaptic();
              navigation.navigate(route.name);
            }
          };

          return (
            <TabItem
              key={route.key}
              iconName={iconName}
              label={label}
              isFocused={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  activeLabel: {
    fontFamily: FONT,
    color: ACTIVE_TEXT_COLOR,
    fontSize: 13,
    fontWeight: '600',
  },
  inactiveContent: {
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  inactiveLabel: {
    fontFamily: FONT,
    color: INACTIVE_COLOR,
    fontSize: 11,
    fontWeight: '500',
  },
});
