import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import FadeSlideIn from '@/components/FadeSlideIn';
import SuccessPop from '@/components/SuccessPop';

import { FONT } from '@/constants/typography';

export default function ProductAddedScreen() {
  const params = useLocalSearchParams<{ name: string }>();
  const name = params.name ?? 'Product';

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/driver/store/inventory');
    }, 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <FadeSlideIn style={styles.root}>
      <SuccessPop style={styles.iconCircle}>
        <Ionicons name="pricetag-outline" size={44} color="#16A34A" />
      </SuccessPop>
      <Text style={styles.title}>Product Added!</Text>
      <Text style={styles.subtitle}>{name} is now available in your inventory</Text>
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
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});
