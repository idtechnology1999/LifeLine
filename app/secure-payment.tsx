import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';

const FONT = Platform.select({ ios: 'System', default: 'System' });

type PaymentMethodId = 'card' | 'apple_pay' | 'google_pay';

type PaymentMethod = {
  id: PaymentMethodId;
  label: string;
  sublabel?: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'card', label: 'Credit/Debit Card', sublabel: '•••• 4242', icon: 'card' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'logo-apple' },
  { id: 'google_pay', label: 'Google Pay', icon: 'wallet' },
];

function formatCurrency(value: number) {
  return `N${Math.round(value).toLocaleString('en-NG')}`;
}

export default function SecurePaymentScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const amount = Number(params.amount) || 2800;
  const driverName = (params.driverName as string) || undefined;
  const vehicleCode = (params.vehicleCode as string) || undefined;

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = useCallback(() => {
    setIsProcessing(true);
    // Simulated payment processing — wire this up to your real payment
    // provider (Stripe, Paystack, Flutterwave, etc.) here.
    setTimeout(() => {
      setIsProcessing(false);
      router.replace('/payment-success');
    }, 1200);
  }, [amount]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </Pressable>
        <Text style={styles.title}>Secure Payment</Text>
        <Text style={styles.subtitle}>Complete payment to activate service</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.content}>
        <View style={styles.amountCard}>
          <Text style={styles.amountLabel}>Amount to Pay</Text>
          <Text style={styles.amountValue}>{formatCurrency(amount)}</Text>
          <Text style={styles.amountSub}>
            {driverName ? `Final negotiated price · ${driverName}` : 'Final negotiated price'}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>

        <View style={styles.methodList}>
          {PAYMENT_METHODS.map((method) => {
            const selected = selectedMethod === method.id;
            return (
              <Pressable
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                style={[styles.methodRow, selected && styles.methodRowSelected]}
              >
                <View
                  style={[
                    styles.methodIconWrap,
                    selected
                      ? { backgroundColor: colors.accentBlue }
                      : { backgroundColor: '#F0F0F2' },
                  ]}
                >
                  <Ionicons
                    name={method.icon}
                    size={18}
                    color={selected ? '#FFFFFF' : '#1C1C1E'}
                  />
                </View>
                <View style={styles.methodTextWrap}>
                  <Text style={styles.methodLabel}>{method.label}</Text>
                  {method.sublabel ? (
                    <Text style={styles.methodSublabel}>{method.sublabel}</Text>
                  ) : null}
                </View>
                {selected && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.addMethodBtn}>
          <Text style={styles.addMethodText}>+ Add New Payment Method</Text>
        </Pressable>

        <View style={styles.secureNote}>
          <Ionicons name="shield-checkmark" size={20} color={colors.accentGreen} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.secureTitle}>Secure Payment</Text>
            <Text style={styles.secureBody}>
              Your payment information is encrypted and secure. We never store
              your full card details.
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 14 }]}>
        <Pressable
          onPress={handleConfirm}
          disabled={isProcessing}
          style={[styles.confirmBtn, isProcessing && styles.confirmBtnDisabled]}
        >
          <Text style={styles.confirmBtnText}>
            {isProcessing ? 'Processing…' : `Confirm Payment - ${formatCurrency(amount)}`}
          </Text>
        </Pressable>
        <Text style={styles.termsText}>
          By confirming, you agree to our terms of service
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 18,
  },
  backBtn: {
    marginBottom: 12,
  },
  title: {
    fontFamily: FONT,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#1C1C1E',
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 14.5,
    color: '#8E8E93',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  amountCard: {
    backgroundColor: '#EAF1FE',
    borderRadius: 20,
    paddingVertical: 26,
    alignItems: 'center',
    marginTop: 20,
  },
  amountLabel: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#5A6B87',
    marginBottom: 6,
  },
  amountValue: {
    fontFamily: FONT,
    fontSize: 40,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -1,
  },
  amountSub: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 6,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    marginTop: 26,
    marginBottom: 12,
  },
  methodList: {
    gap: 10,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 16,
    padding: 14,
  },
  methodRowSelected: {
    borderColor: colors.accentBlue,
    backgroundColor: '#F2F7FE',
  },
  methodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodTextWrap: {
    flex: 1,
  },
  methodLabel: {
    fontFamily: FONT,
    fontSize: 15.5,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  methodSublabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 2,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMethodBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderStyle: 'dashed',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  addMethodText: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '600',
    color: colors.accentBlue,
  },
  secureNote: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  secureTitle: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 3,
  },
  secureBody: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#8E8E93',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  confirmBtn: {
    backgroundColor: '#0D1B2A',
    borderRadius: 16,
    paddingVertical: 17,
    alignItems: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.6,
  },
  confirmBtnText: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  termsText: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#B0B0B5',
    textAlign: 'center',
    marginTop: 10,
  },
});
