import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT } from '@/constants/typography';

export default function OrderSecurePaymentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const orderType = (params.type as string) || 'supplies';
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      router.replace({ pathname: '/order-payment-success', params: { type: orderType } });
    }, 1200);
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.headerTitle}>Secure Payment</Text>
      <Text style={styles.headerSubtitle}>Complete payment to activate service</Text>

      <View style={styles.headerDivider} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>N13,300</Text>
          <Text style={styles.amountSubtitle}>Final negotiated price</Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.methodsList}>
          <AnimatedPressable
            style={[styles.methodCard, selectedMethod === 'card' && styles.selectedMethodCard]}
            onPress={() => setSelectedMethod('card')}
          >
            <View style={styles.methodLeft}>
              <View style={[styles.methodIconWrapper, { backgroundColor: '#2563EB' }]}>
                <MaterialCommunityIcons name="credit-card-outline" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.methodName}>Credit/Debit Card</Text>
                <Text style={styles.methodDetails}>**** **** 4242</Text>
              </View>
            </View>
            {selectedMethod === 'card' && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.methodCard, selectedMethod === 'bank' && styles.selectedMethodCard]}
            onPress={() => setSelectedMethod('bank')}
          >
            <View style={styles.methodLeft}>
              <View style={styles.methodIconWrapper}>
                <Octicons name="device-mobile" size={18} color="#64748B" />
              </View>
              <Text style={styles.methodName}>Bank Transfer</Text>
            </View>
            {selectedMethod === 'bank' && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.methodCard, selectedMethod === 'ussd' && styles.selectedMethodCard]}
            onPress={() => setSelectedMethod('ussd')}
          >
            <View style={styles.methodLeft}>
              <View style={styles.methodIconWrapper}>
                <Ionicons name="wallet-outline" size={18} color="#64748B" />
              </View>
              <Text style={styles.methodName}>USSD Code</Text>
            </View>
            {selectedMethod === 'ussd' && <Ionicons name="checkmark-circle" size={22} color="#2563EB" />}
          </AnimatedPressable>

          <AnimatedPressable style={styles.addMethodBtn}>
            <Text style={styles.addMethodText}>+ Add New Payment Method</Text>
          </AnimatedPressable>
        </View>

        <View style={styles.securityNoticeCard}>
          <Feather name="shield" size={18} color="#10B981" style={styles.securityIcon} />
          <View style={styles.securityInfo}>
            <Text style={styles.securityTitle}>Secure Payment</Text>
            <Text style={styles.securityDescription}>
              Your payment information is encrypted and secure. We never store your full card details.
            </Text>
          </View>
        </View>

        <AnimatedPressable
          style={[styles.confirmBtn, isProcessing && styles.confirmBtnDisabled]}
          onPress={handleConfirm}
          disabled={isProcessing}
        >
          <Text style={styles.confirmBtnText}>
            {isProcessing ? 'Processing…' : 'Confirm Payment – N13,300'}
          </Text>
        </AnimatedPressable>

        <Text style={styles.termsNote}>By confirming, you agree to our terms of service</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16 },
  headerTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 4 },
  headerSubtitle: { fontFamily: FONT, fontSize: 14, color: '#64748B' },
  headerDivider: { height: 1, backgroundColor: '#F1F5F9', marginBottom: 4 },
  scrollContent: { paddingBottom: 40, paddingTop: 12 },
  amountCard: { backgroundColor: '#EFF6FF', borderRadius: 16, alignItems: 'center', paddingVertical: 24, marginBottom: 24 },
  amountLabel: { fontFamily: FONT, fontSize: 13, color: '#475569', marginBottom: 4 },
  amountValue: { fontFamily: FONT, fontSize: 34, fontWeight: '900', color: '#0F172A', letterSpacing: -0.5, marginBottom: 4 },
  amountSubtitle: { fontFamily: FONT, fontSize: 12, color: '#64748B' },
  sectionTitle: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  methodsList: { gap: 12, marginBottom: 16 },
  methodCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' },
  selectedMethodCard: { borderColor: '#2563EB', borderWidth: 1.5 },
  methodLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  methodIconWrapper: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  methodName: { fontFamily: FONT, fontSize: 14, fontWeight: '600', color: '#0F172A' },
  methodDetails: { fontFamily: FONT, fontSize: 12, color: '#64748B', marginTop: 2 },
  addMethodBtn: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingVertical: 14, alignItems: 'center', backgroundColor: '#FFFFFF' },
  addMethodText: { fontFamily: FONT, color: '#2563EB', fontSize: 14, fontWeight: '600' },
  securityNoticeCard: { flexDirection: 'row', backgroundColor: '#F8FAFC', borderRadius: 14, borderWidth: 1, borderColor: '#F1F5F9', padding: 14, alignItems: 'flex-start', marginBottom: 20 },
  securityIcon: { marginTop: 2, marginRight: 10 },
  securityInfo: { flex: 1 },
  securityTitle: { fontFamily: FONT, fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 4 },
  securityDescription: { fontFamily: FONT, fontSize: 12, color: '#64748B', lineHeight: 17 },
  confirmBtn: { backgroundColor: '#0F172A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginBottom: 10 },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmBtnText: { fontFamily: FONT, color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  termsNote: { fontFamily: FONT, textAlign: 'center', fontSize: 11, color: '#64748B', marginBottom: 8 },
});
