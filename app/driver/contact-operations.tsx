import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';
import { useWizardGuard } from '@/components/useWizardGuard';
import { scrollFieldIntoView } from '@/utils';

import { FONT } from '@/constants/typography';

const asString = (v: string | string[] | undefined, fallback = '') =>
  Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;

type Availability = '24_7' | 'scheduled';

export default function ContactOperationsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.businessName));

  const [fullName, setFullName] = useState(asString(params.fullName));
  const [role, setRole] = useState(asString(params.role));
  const [phone, setPhone] = useState(asString(params.phone));
  const [email, setEmail] = useState(asString(params.email));
  const [availability, setAvailability] = useState<Availability>(
    (params.availability as Availability) || 'scheduled'
  );
  const [startTime, setStartTime] = useState(asString(params.startTime));
  const [endTime, setEndTime] = useState(asString(params.endTime));
  const [backupPhone, setBackupPhone] = useState(asString(params.backupPhone));
  const [backupEmail, setBackupEmail] = useState(asString(params.backupEmail));

  const roleRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const startTimeRef = useRef<TextInput>(null);
  const endTimeRef = useRef<TextInput>(null);
  const backupPhoneRef = useRef<TextInput>(null);
  const backupEmailRef = useRef<TextInput>(null);

  const canContinue = Boolean(
    fullName.trim() &&
    role.trim() &&
    phone.trim() &&
    email.trim() &&
    (availability === '24_7' || (startTime.trim() && endTime.trim()))
  );

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: '/driver/review-submit',
      params: {
        ...params,
        fullName,
        role,
        phone,
        email,
        availability,
        startTime,
        endTime,
        backupPhone,
        backupEmail,
      },
    });
  };

  if (!params.businessName) return null;

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Contact and Operations</Text>
        <Text style={styles.subtitle}>How can users reach you</Text>
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
            <Ionicons name="person-outline" size={18} color="#0F172A" />
            <Text style={styles.cardTitle}>Primary Contact Person</Text>
          </View>

          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            placeholder="John Doe"
            placeholderTextColor="#94A3B8"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => roleRef.current?.focus()}
            blurOnSubmit={false}
          />

          <Text style={styles.label}>Position / Role</Text>
          <TextInput
            ref={roleRef}
            style={styles.input}
            value={role}
            onChangeText={setRole}
            placeholder="Driver"
            placeholderTextColor="#94A3B8"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Feather name="phone" size={18} color="#0F172A" />
            <Text style={styles.cardTitle}>Contact Information</Text>
          </View>

          <Text style={styles.label}>Phone Number</Text>
          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              ref={phoneRef}
              style={styles.inputWithIcon}
              value={phone}
              onChangeText={setPhone}
              placeholder="0814 345 4321"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <Text style={styles.hint}>Primary contact number for emergency requests</Text>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              ref={emailRef}
              style={styles.inputWithIcon}
              value={email}
              onChangeText={setEmail}
              placeholder="johndoe@gmail.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() =>
                (availability === 'scheduled' ? startTimeRef : backupPhoneRef).current?.focus()
              }
              blurOnSubmit={false}
            />
          </View>
        </View>

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
            <Text style={[styles.selectTitle, availability === '24_7' && styles.selectTitleActive]}>
              24/7 Emergency Service
            </Text>
            <Text style={styles.selectSubtitle}>Available at all times</Text>
          </AnimatedPressable>

          <AnimatedPressable
            onPress={() => setAvailability('scheduled')}
            style={[styles.selectCard, availability === 'scheduled' && styles.selectCardActive]}
          >
            <Text style={[styles.selectTitle, availability === 'scheduled' && styles.selectTitleActive]}>
              Scheduled Hours Only
            </Text>
            <Text style={styles.selectSubtitle}>Available during specific hours</Text>
          </AnimatedPressable>

          {availability === 'scheduled' && (
            <>
              <Text style={styles.label}>Operating Hours</Text>
              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.subLabel}>Start Time</Text>
                  <TextInput
                    ref={startTimeRef}
                    style={styles.input}
                    value={startTime}
                    onChangeText={setStartTime}
                    placeholder="9:00 AM"
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
                    placeholder="6:00 PM"
                    placeholderTextColor="#94A3B8"
                    onFocus={scrollFieldIntoView}
                    returnKeyType="next"
                    onSubmitEditing={() => backupPhoneRef.current?.focus()}
                    blurOnSubmit={false}
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

        <View style={styles.card}>
          <Text style={styles.cardTitleNoIcon}>Backup Contact</Text>
          <Text style={styles.hint}>Optional - Secondary contact for emergencies</Text>

          <Text style={[styles.label, { marginTop: 14 }]}>Backup Phone Number</Text>
          <View style={styles.inputRow}>
            <Ionicons name="call-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              ref={backupPhoneRef}
              style={styles.inputWithIcon}
              value={backupPhone}
              onChangeText={setBackupPhone}
              placeholder="0806-987-6543"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() => backupEmailRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>

          <Text style={styles.label}>Backup Email</Text>
          <View style={styles.inputRow}>
            <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              ref={backupEmailRef}
              style={styles.inputWithIcon}
              value={backupEmail}
              onChangeText={setBackupEmail}
              placeholder="backup@example.com"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={scrollFieldIntoView}
              returnKeyType="done"
            />
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Why we need this: </Text>
            Contact information helps us connect you with customers quickly during
            emergencies. All information is verified and kept secure.
          </Text>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, gap: 12 }]}>
        <PrimaryButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
        <SecondaryButton label="Back" onPress={() => router.back()} />
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
    fontSize: 24,
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
  cardTitleNoIcon: {
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  inputWithIcon: {
    flex: 1,
    fontFamily: FONT,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  hint: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  selectCard: {
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
    backgroundColor: '#F8FAFC',
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
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  infoBold: {
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
