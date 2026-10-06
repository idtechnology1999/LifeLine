import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useStore } from '@/components/StoreContext';
import FadeSlideIn from '@/components/FadeSlideIn';
import SuccessPop from '@/components/SuccessPop';

import { FONT } from '@/constants/typography';

export default function DeliveryCompleteScreen() {
  const params = useLocalSearchParams<{ id: string; total: string }>();
  const { completeDelivery } = useStore();
  const total = Number(params.total ?? '0');

  useEffect(() => {
    if (params.id) completeDelivery(params.id);
    const t = setTimeout(() => {
      router.replace('/driver/store' as any);
    }, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FadeSlideIn style={styles.root}>
      <SuccessPop style={styles.iconCircle}>
        <Ionicons name="cube-outline" size={56} color="#16A34A" />
      </SuccessPop>
      <Text style={styles.title}>Delivery Complete!</Text>
      <Text style={styles.amount}>N{total.toLocaleString('en-US')}</Text>
      <Text style={styles.subtitle}>Added to your earnings</Text>
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
