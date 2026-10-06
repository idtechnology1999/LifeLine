import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AnimatedPressable from '@/components/AnimatedPressable';
import { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

type ServiceType = 'ambulance' | 'supplier';

const REQUIREMENTS: Record<ServiceType, string[]> = {
  ambulance: [
    'Valid ambulance operation license',
    'Vehicle registration and insurance',
    'Certified medical equipment',
    'Trained medical personnel',
  ],
  supplier: [
    'Valid pharmacy or supplier license',
    'Drug distribution authorization',
    'Proper storage facilities',
    'Inventory management system',
  ],
};

export default function ProviderVerificationScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<ServiceType | null>(null);
  const navigateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (navigateTimeout.current) clearTimeout(navigateTimeout.current);
    };
  }, []);

  const handleSelectType = (type: ServiceType) => {
    if (navigateTimeout.current) clearTimeout(navigateTimeout.current);
    setSelected(type);
    navigateTimeout.current = setTimeout(() => {
      router.push({
        pathname: '/driver/business-details',
        params: { serviceType: type },
      });
    }, 400);
  };

  return (
    <FadeSlideIn style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>

        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Ionicons name="shield-checkmark" size={26} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>Provider Verification</Text>
            <Text style={styles.subtitle}>Official Registration Process</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoCard}>
          <View style={styles.infoHeaderRow}>
            <Ionicons name="shield-outline" size={18} color="#0F172A" />
            <Text style={styles.infoTitle}>Verification Required</Text>
          </View>
          <Text style={styles.infoBody}>
            As a healthcare service provider on Lifeline, you must complete our
            verification process to ensure the safety and security of our users.
          </Text>
          <View style={styles.infoBullets}>
            <View style={styles.infoBulletRow}>
              <Ionicons name="checkmark-circle-outline" size={16} color="#0F172A" />
              <Text style={styles.infoBulletText}>Valid licenses and permits required</Text>
            </View>
            <View style={styles.infoBulletRow}>
              <Ionicons name="time-outline" size={16} color="#0F172A" />
              <Text style={styles.infoBulletText}>Verification typically takes 24-48 hours</Text>
            </View>
            <View style={styles.infoBulletRow}>
              <Ionicons name="document-text-outline" size={16} color="#0F172A" />
              <Text style={styles.infoBulletText}>All information is kept confidential and secure</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Select Your Service Type</Text>
        <Text style={styles.sectionSubtitle}>Choose the service you wish to provide on Lifeline</Text>

        <AnimatedPressable
          onPress={() => handleSelectType('ambulance')}
          style={[styles.serviceCard, selected === 'ambulance' && styles.serviceCardActive]}
        >
          <View style={styles.serviceHeaderRow}>
            <View style={[styles.serviceIconWrap, { backgroundColor: '#DBEAFE' }]}>
              <Ionicons name="medkit-outline" size={26} color="#1D4ED8" />
            </View>
            <Text style={styles.serviceTitle}>Ambulance Service{'\n'}Provider</Text>
          </View>
          <Text style={styles.serviceDesc}>
            Provide emergency medical transportation services and respond to health
            emergencies.
          </Text>
          <Text style={styles.reqTitle}>Requirements:</Text>
          {REQUIREMENTS.ambulance.map((r) => (
            <Text key={r} style={styles.reqItem}>• {r}</Text>
          ))}
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => handleSelectType('supplier')}
          style={[styles.serviceCard, selected === 'supplier' && styles.serviceCardActive]}
        >
          <View style={styles.serviceHeaderRow}>
            <View style={[styles.serviceIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <Ionicons name="storefront-outline" size={26} color="#15803D" />
            </View>
            <Text style={styles.serviceTitle}>Medical Supplier /{'\n'}Pharmacy</Text>
          </View>
          <Text style={styles.serviceDesc}>
            Supply medical equipment, prescription drugs, and health products to
            customers.
          </Text>
          <Text style={styles.reqTitle}>Requirements:</Text>
          {REQUIREMENTS.supplier.map((r) => (
            <Text key={r} style={styles.reqItem}>• {r}</Text>
          ))}
        </AnimatedPressable>

        <View style={styles.legalCard}>
          <Text style={styles.legalText}>
            <Text style={styles.legalBold}>Legal Notice</Text>: By proceeding, you
            confirm that you have the legal authority to provide healthcare
            services and agree to comply with all applicable laws, regulations,
            and Lifeline's terms of service.
          </Text>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <SecondaryButton label="Back" onPress={() => router.back()} />
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
  },
  title: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  infoTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  infoBody: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
    marginBottom: 12,
  },
  infoBullets: {
    gap: 8,
  },
  infoBulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoBulletText: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#334155',
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  serviceCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
  },
  serviceCardActive: {
    borderColor: '#0F172A',
    borderWidth: 2,
    backgroundColor: '#F8FAFC',
  },
  serviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTitle: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    flex: 1,
  },
  serviceDesc: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  reqTitle: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  reqItem: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#475569',
    lineHeight: 20,
  },
  legalCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  legalText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#475569',
    lineHeight: 19,
  },
  legalBold: {
    fontWeight: '700',
    color: '#0F172A',
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
