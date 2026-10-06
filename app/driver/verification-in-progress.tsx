import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';
import SuccessPop from '@/components/SuccessPop';
import { useWizardGuard } from '@/components/useWizardGuard';

import { FONT } from '@/constants/typography';

type StepStatus = 'done' | 'active' | 'pending';

const STEPS: { key: string; title: string; body: string; status: StepStatus }[] = [
  {
    key: 'received',
    title: 'Application Received',
    body: "We've received all your documents",
    status: 'done',
  },
  {
    key: 'doc_verification',
    title: 'Document Verification',
    body: 'Our team is reviewing your licenses and permits',
    status: 'active',
  },
  {
    key: 'background',
    title: 'Background Check',
    body: 'Standard compliance verification',
    status: 'pending',
  },
  {
    key: 'approval',
    title: 'Final Approval',
    body: 'Account activation',
    status: 'pending',
  },
];

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') {
    return (
      <View style={[styles.stepIcon, { backgroundColor: '#2563EB' }]}>
        <Ionicons name="checkmark" size={16} color="#fff" />
      </View>
    );
  }
  if (status === 'active') {
    return (
      <View style={[styles.stepIcon, { backgroundColor: '#FF9F0A' }]}>
        <Ionicons name="time-outline" size={16} color="#fff" />
      </View>
    );
  }
  return (
    <View style={[styles.stepIcon, { backgroundColor: '#E4E7EC' }]}>
      <Ionicons name="checkmark" size={16} color="#9AA2B1" />
    </View>
  );
}

export default function VerificationInProgressScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ serviceType: string }>();
  useWizardGuard(Boolean(params.serviceType));
  const homePath = params.serviceType === 'supplier' ? '/driver/store' : '/driver/dashboard';

  if (!params.serviceType) return null;

  return (
    <LinearGradient colors={['#EAF1FB', '#FFFFFF']} style={styles.gradient}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <FadeSlideIn style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: 24 + insets.bottom }]}>
        <SuccessPop style={styles.iconWrap}>
          <View style={styles.iconCircle}>
            <Ionicons name="shield-outline" size={44} color="#2563EB" />
          </View>
          <View style={styles.badge}>
            <Ionicons name="time-outline" size={16} color="#fff" />
          </View>
        </SuccessPop>

        <Text style={styles.title}>Verification in Progress</Text>
        <Text style={styles.subtitle}>
          Thank you for submitting your provider application. Our verification team is
          reviewing your information.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens next?</Text>
          {STEPS.map((step, idx) => (
            <FadeSlideIn key={step.key} delay={150 + idx * 100} style={[styles.stepRow, idx !== 0 && { marginTop: 16 }]}>
              <StepIcon status={step.status} />
              <View style={styles.stepTextWrap}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepBody}>{step.body}</Text>
              </View>
            </FadeSlideIn>
          ))}
        </View>

        <View style={styles.etaBanner}>
          <Text style={styles.etaText}>
            <Text style={styles.etaBold}>Estimated completion: </Text>
            24-48 hours
          </Text>
        </View>

        <AnimatedPressable style={styles.primaryBtn} onPress={() => router.replace(homePath as any)}>
          <Text style={styles.primaryBtnText}>Return to Home</Text>
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
    paddingTop: 70,
  },
  iconWrap: {
    marginBottom: 20,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCE9FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF9F0A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
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
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginTop: 28,
  },
  cardTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTextWrap: {
    marginLeft: 14,
    flex: 1,
  },
  stepTitle: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepBody: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  etaBanner: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 18,
  },
  etaText: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#334155',
  },
  etaBold: {
    fontWeight: '700',
    color: '#2563EB',
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  primaryBtnText: {
    fontFamily: FONT,
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
