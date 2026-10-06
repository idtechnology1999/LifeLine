import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';
import SuccessPop from '@/components/SuccessPop';

import { FONT } from '@/constants/typography';

export default function ProgressSavedScreen() {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.gradient}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <FadeSlideIn style={[styles.container, { paddingBottom: 24 + insets.bottom }]}>
        <SuccessPop style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={56} color="#34C759" />
        </SuccessPop>

        <Text style={styles.title}>Progress Saved!</Text>
        <Text style={styles.subtitle}>
          Your application progress has been saved. We've sent you an email with a link to
          continue your verification process.
        </Text>

        <View style={styles.emailCard}>
          <View style={styles.emailCardHeaderRow}>
            <Ionicons name="mail-outline" size={18} color="#2563EB" />
            <Text style={styles.emailCardTitle}>Check Your Email</Text>
          </View>
          <Text style={styles.emailCardBody}>
            We've sent a secure link to continue where you left off. The link will be valid
            for 7 days.
          </Text>
        </View>

        <AnimatedPressable style={styles.primaryBtn} onPress={() => router.replace('/driver/dashboard')}>
          <Text style={styles.primaryBtnText}>Return to Home</Text>
        </AnimatedPressable>

        <AnimatedPressable onPress={() => router.push('/driver/review-submit')} hitSlop={8}>
          <Text style={styles.link}>Continue Application Now</Text>
        </AnimatedPressable>
      </FadeSlideIn>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 100,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E4F8EA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: FONT,
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
    paddingHorizontal: 8,
  },
  emailCard: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 18,
    marginTop: 28,
  },
  emailCardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emailCardTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#2563EB',
  },
  emailCardBody: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#334155',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 20,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  primaryBtnText: {
    fontFamily: FONT,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  link: {
    fontFamily: FONT,
    color: '#64748B',
    fontSize: 14.5,
    marginTop: 18,
    fontWeight: '600',
  },
});
