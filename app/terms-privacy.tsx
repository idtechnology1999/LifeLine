import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router } from 'expo-router';

import { FONT } from '@/constants/typography';

export default function TermsAndPrivacyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </AnimatedPressable>
        <Text style={styles.title}>Terms and privacy</Text>
        <Text style={styles.subtitle}>View our terms of use and privacy policy</Text>
      </View>

      <View style={styles.headerDivider} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionHeading}>Terms of Service</Text>
        <Text style={styles.bodyText}>
          Welcome to Lifeline. By using our services, you agree to the following terms and conditions. Please read them carefully.
        </Text>
        <Text style={styles.bodyText}>
          Lifeline provides emergency ambulance dispatch and related medical transportation services. By requesting an ambulance through the app, you acknowledge that you understand the nature of these services.
        </Text>

        <Text style={styles.sectionHeading}>Privacy Policy</Text>
        <Text style={styles.bodyText}>
          We respect your privacy. Your personal information, including your name, phone number, email address, and location data, is collected solely to provide and improve our services.
        </Text>
        <Text style={styles.bodyText}>
          Your data is encrypted and securely stored. We do not sell or share your personal information with third parties except as necessary to fulfill ambulance dispatch services.
        </Text>

        <Text style={styles.sectionHeading}>Data Usage</Text>
        <Text style={styles.bodyText}>
          Location data is used only during active emergency requests to dispatch the nearest available ambulance. Emergency contacts are notified only when a request is initiated.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
  },
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  title: { fontFamily: FONT, fontSize: 26, fontWeight: '700', color: '#0F172A', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontFamily: FONT, fontSize: 15, color: '#64748B' },
  headerDivider: { height: 1, backgroundColor: '#F1F5F9', width: '100%' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 120 },
  sectionHeading: { fontFamily: FONT, fontSize: 17, fontWeight: '700', color: '#0F172A', marginTop: 20, marginBottom: 10 },
  bodyText: { fontFamily: FONT, fontSize: 14, color: '#475569', lineHeight: 22, marginBottom: 10 },
});
