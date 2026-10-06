import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router } from 'expo-router';

import { FONT } from '@/constants/typography';

export default function PaymentMethodsScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </AnimatedPressable>

        <Text style={styles.title}>Payment Methods</Text>
        <Text style={styles.subtitle}>Saved Payment methods</Text>
      </View>

      <View style={styles.headerDivider} />

      <View style={styles.contentContainer}>
        <AnimatedPressable style={styles.card}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="credit-card-outline" size={22} color="#64748B" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Credit/Debit Card</Text>
            <Text style={styles.cardSubtitle}>**** **** 4242</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable style={styles.card}>
          <View style={styles.iconContainer}>
            <Octicons name="device-mobile" size={20} color="#64748B" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Bank Transfer</Text>
          </View>
        </AnimatedPressable>

        <AnimatedPressable style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="wallet-outline" size={20} color="#64748B" />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>USSD Code</Text>
          </View>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 14,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  cardInfo: {
    justifyContent: 'center',
    gap: 4,
  },
  cardTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '400',
  },
});
