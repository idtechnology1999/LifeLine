import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

export type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const insets = useSafeAreaInsets();
  const { redirectTo } = useLocalSearchParams<{ redirectTo?: string }>();
  const [mode, setMode] = useState<AuthMode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const nameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  const tabProgress = useSharedValue(0);
  const trackWidth = useSharedValue(0);

  const switchMode = (next: AuthMode) => {
    setMode(next);
    tabProgress.value = withTiming(next === 'login' ? 0 : 1, {
      duration: 300,
      easing: Easing.out(Easing.cubic),
    });
  };

  const onTrackLayout = (e: LayoutChangeEvent) => {
    trackWidth.value = e.nativeEvent.layout.width;
  };

  const sliderStyle = useAnimatedStyle(() => {
    const half = (trackWidth.value - 8) / 2;
    return {
      width: half > 0 ? half : 0,
      transform: [{ translateX: tabProgress.value * (half > 0 ? half : 0) }],
    };
  });

  const isSignup = mode === 'signup';
  const canSubmit =
    phone.trim().length >= 7 && (!isSignup || (fullName.trim().length > 0 && email.trim().length > 0));

  const handleSendOtp = () => {
    if (!canSubmit) return;
    router.push({
      pathname: '/otp-verification',
      params: {
        phone: `+234${phone.trim()}`,
        mode,
        name: isSignup ? fullName.trim() : '',
        email: isSignup ? email.trim() : '',
        ...(redirectTo ? { redirectTo } : {}),
      },
    });
  };

  const scrollToField = (yPos: number) => {
    scrollRef.current?.scrollTo({ y: Math.max(0, yPos - 100), animated: true });
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 16 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          <Pressable style={styles.backBtn} onPress={() => router.back()} hitSlop={16}>
            <View style={styles.backBtnInner}>
              <Svg width={20} height={20} viewBox="0 0 24 24">
                <Path
                  d="M19 12H5M5 12L11 6M5 12L11 18"
                  stroke={Colors.text}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
            </View>
          </Pressable>

          <Text style={styles.title}>{isSignup ? 'Create account' : 'Welcome back'}</Text>
          <Text style={styles.subtitle}>
            {isSignup ? 'Sign up to start using Lifeline' : 'Log in to continue with Lifeline'}
          </Text>

          <View style={styles.tabTrack} onLayout={onTrackLayout}>
            <Animated.View style={[styles.tabSlider, sliderStyle]} />
            <Pressable style={styles.tabBtn} onPress={() => switchMode('login')}>
              <Text style={[styles.tabText, !isSignup && styles.tabTextActive]}>Log In</Text>
            </Pressable>
            <Pressable style={styles.tabBtn} onPress={() => switchMode('signup')}>
              <Text style={[styles.tabText, isSignup && styles.tabTextActive]}>Sign Up</Text>
            </Pressable>
          </View>

          <BlurView intensity={Platform.OS === 'ios' ? 80 : 90} tint="light" style={styles.formCard}>
            {isSignup && (
              <>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  ref={nameRef}
                  style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                  placeholder="John Doe"
                  placeholderTextColor="#9AA3B2"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onFocus={() => { setFocusedField('name'); scrollToField(180); }}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />

                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  ref={emailRef}
                  style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                  placeholder="john@example.com"
                  placeholderTextColor="#9AA3B2"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onFocus={() => { setFocusedField('email'); scrollToField(300); }}
                  onBlur={() => setFocusedField(null)}
                  onSubmitEditing={() => phoneRef.current?.focus()}
                />
              </>
            )}

            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.phoneRow, focusedField === 'phone' && styles.phoneRowFocused]}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+234</Text>
              </View>
              <TextInput
                ref={phoneRef}
                style={styles.phoneInput}
                placeholder="812 123 4567"
                placeholderTextColor="#9AA3B2"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={11}
                returnKeyType="done"
                onFocus={() => { setFocusedField('phone'); scrollToField(isSignup ? 430 : 230); }}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            <View style={styles.infoBox}>
              <Svg width={16} height={16} viewBox="0 0 24 24" style={{ marginRight: 8, marginTop: 1 }}>
                <Path
                  d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-14v5m0 3v.01"
                  stroke="#1E3A8A"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </Svg>
              <Text style={styles.infoText}>
                We use OTP verification for fast, secure access during emergencies.
              </Text>
            </View>
          </BlurView>

          <View style={[styles.submitWrap, { paddingBottom: insets.bottom + 8 }]}>
            <Pressable
              style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
              onPress={handleSendOtp}
              disabled={!canSubmit}
            >
              <LinearGradient
                colors={['#0A7AFF', '#0055CC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                <Text style={styles.submitText}>Send OTP</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  flex: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 12,
  },
  backBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 6,
    marginBottom: 28,
    lineHeight: 22,
  },
  tabTrack: {
    flexDirection: 'row',
    backgroundColor: '#E8ECF0',
    borderRadius: 16,
    padding: 5,
    marginBottom: 28,
    position: 'relative',
  },
  tabSlider: {
    position: 'absolute',
    top: 5,
    left: 5,
    bottom: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    zIndex: 1,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#1A1A1A',
  },
  formCard: {
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E8F0',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  inputFocused: {
    borderColor: '#0A7AFF',
    borderWidth: 2,
    shadowColor: '#0A7AFF',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 0,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E4E8F0',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  phoneRowFocused: {
    borderColor: '#0A7AFF',
    borderWidth: 2,
    shadowColor: '#0A7AFF',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  countryCode: {
    paddingHorizontal: 18,
    justifyContent: 'center',
    backgroundColor: '#F8F9FB',
    borderRightWidth: 1,
    borderRightColor: '#E4E8F0',
  },
  countryCodeText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1A1A1A',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF1FE',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1E3A8A',
    lineHeight: 20,
  },
  submitWrap: {
    paddingTop: 8,
  },
  submitBtn: {
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#0A7AFF',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
