import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

type Entry = { id: string; patient: string; type: string; amount: number };

const ENTRIES: Entry[] = [
  { id: 'e1', patient: 'Sarah Johnson', type: 'Basic Life Support', amount: 6500 },
  { id: 'e2', patient: 'David Okafor', type: 'Advanced Life Support', amount: 9500 },
  { id: 'e3', patient: 'Amaka Bello', type: 'Basic Life Support', amount: 5000 },
  { id: 'e4', patient: 'Chinedu Eze', type: 'Emergency Response', amount: 8000 },
  { id: 'e5', patient: 'Grace Adebayo', type: 'Basic Life Support', amount: 5000 },
];

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

export default function EarningsScreen() {
  const insets = useSafeAreaInsets();
  const total = ENTRIES.reduce((sum, e) => sum + e.amount, 0);

  return (
    <FadeSlideIn style={styles.root}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16 }]} showsVerticalScrollIndicator={false}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>

        <Text style={styles.title}>Earnings</Text>
        <Text style={styles.subtitle}>Check your earnings so far and withdraw</Text>
        <View style={styles.divider} />

        {ENTRIES.map((entry, i) => (
          <FadeSlideIn
            key={entry.id}
            delay={i * 60}
            style={[styles.row, i < ENTRIES.length - 1 && styles.rowBorder]}
          >
            <View style={styles.rowTop}>
              <Text style={styles.patientName}>{entry.patient}</Text>
              <Text style={styles.amount}>+{formatNaira(entry.amount)}</Text>
            </View>
            <Text style={styles.type}>{entry.type}</Text>
          </FadeSlideIn>
        ))}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: 20 + insets.bottom }]}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Earnings</Text>
          <Text style={styles.totalValue}>{formatNaira(total)}</Text>
        </View>
        <PrimaryButton
          variant="success"
          label="Withdraw Earnings"
          onPress={() => router.push({ pathname: '/driver/withdraw-earnings', params: { amount: String(total) } })}
        />
      </View>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
  },
  backBtn: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: FONT,
    fontSize: 30,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -20,
    marginTop: 18,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 16,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  patientName: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  amount: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '800',
    color: '#16A34A',
  },
  type: {
    fontFamily: FONT,
    fontSize: 14.5,
    color: '#64748B',
    marginTop: 2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  totalValue: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '800',
    color: '#16A34A',
  },
  withdrawBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  withdrawText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
