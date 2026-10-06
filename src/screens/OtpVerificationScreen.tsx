import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { setToken } from '@/services/auth';
import { getVerification, setVerified, ProviderServiceType } from '@/services/verification';

const CODE_LENGTH = 6;
const RESEND_SECONDS = 300;

function maskPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  const last4 = digits.slice(-4);
  const countryCode = phone.startsWith('+') ? phone.slice(0, 4) : `+${digits.slice(0, 3)}`;
  return `(${countryCode}) *** **** ${last4}`;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ResendCountdown({ onResend }: { onResend: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handlePress = () => {
    if (secondsLeft > 0) return;
    setSecondsLeft(RESEND_SECONDS);
    onResend();
  };

  return (
    <>
      <Pressable onPress={handlePress} disabled={secondsLeft > 0}>
        <Text style={[styles.resendText, secondsLeft > 0 && styles.resendTextDisabled]}>
          Resend code
        </Text>
      </Pressable>
      <Text style={styles.expiryText}>
        {secondsLeft > 0 ? `Code expires in ${formatTime(secondsLeft)}` : 'Code expired'}
      </Text>
    </>
  );
}

export default function OtpVerificationScreen() {
  const insets = useSafeAreaInsets();
  const { phone = '', mode = 'login', redirectTo } = useLocalSearchParams<{
    phone: string;
    mode: string;
    redirectTo?: string;
  }>();

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const inputs = useRef<(TextInput | null)[]>([]);
  const btnScale = useSharedValue(1);
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 150 });
    opacity.value = withSpring(1);
  }, [scale, opacity]);

  const handleChange = (text: string, index: number) => {
    const digit = text.replace(/[^\d]/g, '').slice(-1);
    const next = [...digits];
    next[index] = digit;
    setDigits(next);

    if (digit && index < CODE_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleResend = () => {
    setDigits(Array(CODE_LENGTH).fill(''));
    inputs.current[0]?.focus();
  };

  const code = digits.join('');
  const canConfirm = code.length === CODE_LENGTH;

  const handleConfirm = async () => {
    if (!canConfirm) return;
    btnScale.value = withSpring(0.97, { damping: 10 }, () => {
      btnScale.value = withSpring(1);
    });
    if (redirectTo) {
      await setToken('demo-token');
      if (mode === 'login') {
        const verification = await getVerification();
        const defaultServiceType: ProviderServiceType = redirectTo?.startsWith('/dispatcher')
          ? 'dispatcher'
          : 'ambulance';
        const serviceType = verification?.serviceType ?? defaultServiceType;
        if (!verification) await setVerified(serviceType);
        const dest =
          serviceType === 'supplier' ? '/driver/store'
          : serviceType === 'dispatcher' ? '/dispatcher/dashboard'
          : '/driver/dashboard';
        router.replace(dest as any);
        return;
      }
      router.replace(redirectTo as any);
      return;
    }
    if (mode === 'signup') {
      router.replace('/auth');
    } else {
      router.replace('/requester' as any);
    }
  };

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={12}>
          <Svg width={22} height={22} viewBox="0 0 24 24">
            <Path
              d="M19 12H5M5 12L11 6M5 12L11 18"
              stroke={colors.black}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Pressable>

        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>We sent a 6-digit code to {maskPhone(phone)}</Text>

        <View style={styles.codeRow}>
          {digits.map((digit, i) => (
            <TextInput
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              style={[styles.codeBox, digit && styles.codeBoxFilled]}
              value={digit}
              onChangeText={(text) => handleChange(text, i)}
              onKeyPress={(e) => handleKeyPress(e, i)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        <ResendCountdown onResend={handleResend} />

        <View style={styles.spacer} />

        <Animated.View style={btnStyle}>
          <Pressable
            style={[styles.confirmBtn, !canConfirm && styles.confirmBtnDisabled]}
            onPress={handleConfirm}
            disabled={!canConfirm}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.black,
  },
  subtitle: {
    fontSize: 15,
    color: colors.subtext,
    marginTop: 8,
    marginBottom: 36,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  codeBox: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    fontSize: 20,
    fontWeight: '700',
    color: colors.black,
  },
  codeBoxFilled: {
    borderColor: colors.accentBlue,
    borderWidth: 2,
  },
  resendText: {
    color: colors.accentBlue,
    fontWeight: '600',
    fontSize: 15,
    textAlign: 'center',
  },
  resendTextDisabled: {
    color: colors.disabled,
  },
  expiryText: {
    color: colors.subtext,
    fontSize: 13,
    textAlign: 'center',
    marginTop: 6,
  },
  spacer: {
    flex: 1,
  },
  confirmBtn: {
    backgroundColor: colors.black,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 28,
  },
  confirmBtnDisabled: {
    opacity: 0.4,
  },
  confirmText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
