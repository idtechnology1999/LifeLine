import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, ScrollView, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

export default function DispatcherWithdrawEarningsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ amount: string }>();
  const amount = params.amount ?? '0';

  const [accountName, setAccountName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const canConfirm = Boolean(accountName.trim() && bankName.trim() && accountNumber.trim());
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    if (!canConfirm || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      router.replace({ pathname: '/dispatcher/payment-processed', params: { amount } });
    }, 900);
  };

  return (
    <FadeSlideIn style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>

        <Text style={styles.title}>Withdraw Earnings</Text>
        <Text style={styles.subtitle}>Confirm Details below</Text>
        <View style={styles.divider} />

        <View style={styles.field}>
          <Text style={styles.label}>Account Name</Text>
          <TextInput
            style={styles.input}
            value={accountName}
            onChangeText={setAccountName}
            placeholder="John Doe"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Bank Name</Text>
          <TextInput
            style={styles.input}
            value={bankName}
            onChangeText={setBankName}
            placeholder="Access Bank"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Account Number</Text>
          <TextInput
            style={styles.input}
            value={accountNumber}
            onChangeText={setAccountNumber}
            placeholder="0840389293"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
          />
        </View>

        <PrimaryButton
          variant="success"
          label="Confirm"
          onPress={handleConfirm}
          disabled={!canConfirm}
          loading={submitting}
          loadingLabel="Confirming…"
          style={{ marginTop: 12 }}
        />
      </ScrollView>

      </KeyboardAvoidingView>
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
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 20,
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
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -20,
    marginTop: 18,
    marginBottom: 22,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  input: {
    fontFamily: FONT,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 15,
    fontSize: 15,
    color: '#0F172A',
  },
  confirmBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  confirmBtnDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
