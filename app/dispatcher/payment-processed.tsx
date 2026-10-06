import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import FadeSlideIn from '@/components/FadeSlideIn';
import SuccessPop from '@/components/SuccessPop';

import { FONT } from '@/constants/typography';

export default function DispatcherPaymentProcessedScreen() {
  const params = useLocalSearchParams<{ amount: string }>();
  const amount = Number(params.amount ?? '0');

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/dispatcher/dashboard/profile');
    }, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <FadeSlideIn style={styles.root}>
      <SuccessPop style={styles.iconCircle}>
        <Ionicons name="wallet-outline" size={56} color="#16A34A" />
      </SuccessPop>
      <Text style={styles.title}>Payment Processed</Text>
      <Text style={styles.amount}>N{amount.toLocaleString('en-US')}</Text>
      <Text style={styles.subtitle}>You will be credited to your local bank shortly</Text>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  amount: {
    fontFamily: FONT,
    fontSize: 34,
    fontWeight: '800',
    color: '#16A34A',
    marginTop: 8,
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});
