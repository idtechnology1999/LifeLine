import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';
import { useWizardGuard } from '@/components/useWizardGuard';
import { scrollFieldIntoView } from '@/utils';
import { setVerified } from '@/services/verification';

import { FONT } from '@/constants/typography';

const asString = (v: string | string[] | undefined, fallback = '') =>
  Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;

type Availability = '24_7' | 'scheduled';

export default function AvailabilityHoursScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.rideRegNumber), '/dispatcher/ride-details');

  const [availability, setAvailability] = useState<Availability>(
    (params.availability as Availability) || 'scheduled'
  );
  const [startTime, setStartTime] = useState(asString(params.startTime));
  const [endTime, setEndTime] = useState(asString(params.endTime));

  const endTimeRef = useRef<TextInput>(null);

  const canContinue = Boolean(
    availability === '24_7' || (startTime.trim() && endTime.trim())
  );

  const [submitting, setSubmitting] = useState(false);

  const handleContinue = () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setTimeout(async () => {
      await setVerified('dispatcher');
      router.replace('/dispatcher/dashboard');
    }, 700);
  };

  if (!params.rideRegNumber) return null;

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Availability Hours</Text>
        <Text style={styles.subtitle}>Provide your service operation hours</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="time-outline" size={18} color="#0F172A" />
            <Text style={styles.cardTitle}>Operating Hours</Text>
          </View>

          <Text style={styles.label}>Emergency Availability</Text>

          <AnimatedPressable
            onPress={() => setAvailability('24_7')}
            style={[styles.selectCard, availability === '24_7' && styles.selectCardActive]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.selectTitle, availability === '24_7' && styles.selectTitleActive]}>
                24/7 Emergency Service
              </Text>
              <Text style={styles.selectSubtitle}>Available at all times</Text>
            </View>
            {availability === '24_7' && <Ionicons name="checkmark" size={20} color="#0F172A" />}
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => setAvailability('scheduled')}
            style={[styles.selectCard, availability === 'scheduled' && styles.selectCardActive]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.selectTitle, availability === 'scheduled' && styles.selectTitleActive]}>
                Scheduled Hours Only
              </Text>
              <Text style={styles.selectSubtitle}>Available during specific hours</Text>
            </View>
            {availability === 'scheduled' && <Ionicons name="checkmark" size={20} color="#0F172A" />}
          </AnimatedPressable>

          {availability === 'scheduled' && (
            <>
              <Text style={styles.label}>Operating Hours</Text>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.subLabel}>Start Time</Text>
                  <TextInput
                    style={styles.input}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholderTextColor="#94A3B8"
                    onFocus={scrollFieldIntoView}
                    returnKeyType="next"
                    onSubmitEditing={() => endTimeRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.subLabel}>End Time</Text>
                  <TextInput
                    ref={endTimeRef}
                    style={styles.input}
                    value={endTime}
                    onChangeText={setEndTime}
                    placeholderTextColor="#94A3B8"
                    onFocus={scrollFieldIntoView}
                    returnKeyType="done"
                  />
                </View>
              </View>

              <View style={styles.weekendBox}>
                <Text style={styles.weekendTitle}>Weekend Availability</Text>
                <Text style={styles.weekendBody}>Available on Saturdays and Sundays</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, gap: 12 }]}>
        <PrimaryButton
          label="Continue"
          onPress={handleContinue}
          disabled={!canContinue}
          loading={submitting}
          loadingLabel="Verifying…"
        />
        <SecondaryButton label="Back" onPress={() => router.back()} disabled={submitting} />
      </View>
      </KeyboardAvoidingView>
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
  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  label: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 14,
  },
  subLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginBottom: 6,
  },
  input: {
    fontFamily: FONT,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selectCardActive: {
    borderColor: '#0F172A',
    borderWidth: 1.5,
    backgroundColor: '#EFF6FF',
  },
  selectTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  selectTitleActive: {
    color: '#0F172A',
  },
  selectSubtitle: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  weekendBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  weekendTitle: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  weekendBody: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
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
