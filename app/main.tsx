import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { Role } from '@/types';
import RoleCard from '@/components/RoleCard';

const ICON_SIZE = 26;

interface RoleOption {
  key: Role;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    key: 'requester',
    title: 'I need emergency help',
    description: 'Request ambulance services, order medical supplies and drugs for delivery',
    icon: (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
        <Path
          d="M12 20 C 7 16, 3 12.5, 3 8.5 C 3 5.5, 5.5 3.5, 8.2 3.5 C 9.8 3.5, 11.1 4.3, 12 5.6 C 12.9 4.3, 14.2 3.5, 15.8 3.5 C 18.5 3.5, 21 5.5, 21 8.5 C 21 12.5, 17 16, 12 20 Z"
          stroke={Colors.text}
          strokeWidth={1.8}
          fill="none"
          strokeLinejoin="round"
        />
      </Svg>
    ),
  },
  {
    key: 'driver',
    title: 'I provide emergency services',
    description: 'Ambulance driver or medical supplier ready to help those in need',
    icon: (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
        <Rect x="2" y="9" width="13" height="7" rx="1.5" stroke={Colors.text} strokeWidth={1.6} fill="none" />
        <Path d="M15 11h3.5L21 14v2h-6z" stroke={Colors.text} strokeWidth={1.6} fill="none" strokeLinejoin="round" />
        <Circle cx="6.5" cy="17.5" r="1.6" stroke={Colors.text} strokeWidth={1.6} fill="none" />
        <Circle cx="17.5" cy="17.5" r="1.6" stroke={Colors.text} strokeWidth={1.6} fill="none" />
        <Path d="M6.5 11v3M4.5 12.5h4" stroke={Colors.text} strokeWidth={1.4} strokeLinecap="round" />
      </Svg>
    ),
  },
  {
    key: 'dispatcher',
    title: 'I Help dispatch Medical Supplies',
    description: 'Either with a bike, car or tricycle, help deliver medical supplies to patients',
    icon: (
      <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24">
        <Circle cx="7" cy="17.5" r="2" stroke={Colors.text} strokeWidth={1.6} fill="none" />
        <Circle cx="17" cy="17.5" r="2" stroke={Colors.text} strokeWidth={1.6} fill="none" />
        <Path
          d="M7 17.5h6l2-6h4M11 11.5l2 3M4 11.5h5l1 3"
          stroke={Colors.text}
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path d="M15 5.5l2 2-2 2" stroke={Colors.text} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    ),
  },
];

export default function MainPage() {
  const insets = useSafeAreaInsets();

  const handleSelect = (key: Role) => {
    if (key === 'requester') {
      router.push('/auth');
    } else if (key === 'driver') {
      router.push({ pathname: '/auth', params: { redirectTo: '/driver' } });
    } else {
      router.push({ pathname: '/auth', params: { redirectTo: '/dispatcher/ride-details' } });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]}
      showsVerticalScrollIndicator={false}
    >
      <StatusBar style="dark" />

      <Text style={styles.title}>Welcome to Lifeline</Text>
      <Text style={styles.subtitle}>Rapid Response, Reliable care</Text>

      <View style={styles.optionsWrap}>
        {ROLE_OPTIONS.map((option) => (
          <RoleCard
            key={option.key}
            option={option}
            isSelected={false}
            onPress={() => handleSelect(option.key)}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginTop: 6,
    marginBottom: 32,
  },
  optionsWrap: {
    gap: 14,
  },
});
