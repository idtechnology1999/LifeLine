import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

export type RideType = 'bicycle' | 'bike' | 'tricycle' | 'car';

const RIDE_TYPES: { id: RideType; label: string }[] = [
  { id: 'bicycle', label: 'Bicycle' },
  { id: 'bike', label: 'Bike' },
  { id: 'tricycle', label: 'Tricycle' },
  { id: 'car', label: 'Car' },
];

export default function RideDetailsScreen() {
  const insets = useSafeAreaInsets();
  const [rideType, setRideType] = useState<RideType | null>(null);

  const handleContinue = () => {
    if (!rideType) return;
    router.push({
      pathname: '/dispatcher/document-upload',
      params: { rideType },
    });
  };

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Ride Details</Text>
        <Text style={styles.subtitle}>Choose which Ride you use</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {RIDE_TYPES.map((type) => {
          const active = rideType === type.id;
          return (
            <AnimatedPressable
              key={type.id}
              onPress={() => setRideType(type.id)}
              style={[styles.optionRow, active && styles.optionRowActive]}
            >
              <View style={[styles.radioOuter, active && styles.radioOuterActive]}>
                {active && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.optionLabel}>{type.label}</Text>
            </AnimatedPressable>
          );
        })}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, gap: 12 }]}>
        <PrimaryButton label="Continue" onPress={handleContinue} disabled={!rideType} />
        <SecondaryButton label="Back" onPress={() => router.back()} />
      </View>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  optionRowActive: {
    borderColor: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: '#0F172A',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#0F172A',
  },
  optionLabel: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  continueBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueText: {
    fontFamily: FONT,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backOutlineBtn: {
    borderWidth: 1,
    borderColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  backOutlineText: {
    fontFamily: FONT,
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  },
});
