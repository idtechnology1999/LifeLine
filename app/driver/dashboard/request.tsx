import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Linking,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDriverRequest } from '@/components/DriverRequestContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

export default function DriverRequestScreen() {
  const insets = useSafeAreaInsets();
  const {
    activeRequest,
    phase,
    goToNegotiate,
    goBackToDetail,
    acceptSystemPrice,
    sendOffer,
    decline,
    arrivedAtPickup,
    clearActive,
  } = useDriverRequest();

  const [offer, setOffer] = useState('');

  const handleCall = () => {
    if (activeRequest) Linking.openURL(`tel:${activeRequest.patientPhone}`);
  };

  const handleEmergencySupport = () => {
    Linking.openURL('tel:112');
  };

  const handleDecline = () => {
    if (!activeRequest) return;
    decline(activeRequest.id);
  };

  const handleSendOffer = () => {
    const amount = Number(offer);
    if (!amount || amount <= 0) return;
    sendOffer(amount);
  };

  const handleArrived = () => {
    Alert.alert('Arrived at Pickup', "You've marked arrival. The trip will now complete.", [
      { text: 'OK', onPress: arrivedAtPickup },
    ]);
  };

  if (!activeRequest || phase === 'none') {
    return (
      <FadeSlideIn style={styles.emptyRoot}>
        <Ionicons name="document-text-outline" size={40} color="#CBD5E1" />
        <Text style={styles.emptyTitle}>No Active Request</Text>
        <Text style={styles.emptyBody}>
          Accept an incoming request from Home to see its details here.
        </Text>
        <AnimatedPressable style={styles.emptyBtn} onPress={() => router.push('/driver/dashboard')}>
          <Text style={styles.emptyBtnText}>Go to Home</Text>
        </AnimatedPressable>
      </FadeSlideIn>
    );
  }

  if (phase === 'active') {
    return (
      <FadeSlideIn style={styles.trackRoot}>
        <LinearGradient colors={['#BFDBFE', '#EFF6FF']} style={[styles.mapArea, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headingPill}>
            <Text style={styles.headingPillText}>🚑 Heading to Pickup</Text>
          </View>
          <View style={styles.mapBottomRow}>
            <View style={styles.etaCard}>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>{activeRequest.durationMin} min</Text>
            </View>
            <AnimatedPressable style={styles.compassBtn}>
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
            </AnimatedPressable>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.sheet}
          contentContainerStyle={[styles.sheetContent, { paddingBottom: 40 + insets.bottom }]}
        >
          <View style={styles.sheetHandle} />

          <View style={styles.patientRow}>
            <View style={styles.patientAvatar}>
              <Ionicons name="person" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.patientName}>{activeRequest.patientName}</Text>
              <Text style={styles.patientPhone}>{activeRequest.patientPhone}</Text>
            </View>
            <AnimatedPressable style={styles.iconBtnGreen} onPress={handleCall}>
              <Ionicons name="call" size={18} color="#16A34A" />
            </AnimatedPressable>
            <AnimatedPressable style={styles.iconBtnBlue}>
              <Ionicons name="chatbubble" size={18} color="#2563EB" />
            </AnimatedPressable>
          </View>

          <View style={styles.emergencyTag}>
            <Text style={styles.emergencyTagText}>{activeRequest.title}</Text>
          </View>

          <Text style={styles.tripRouteTitle}>Trip Route</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeDotBlue} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Pickup Location</Text>
              <Text style={styles.routeValue}>{activeRequest.pickup}</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.routeDotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{activeRequest.destination}</Text>
            </View>
          </View>

          <View style={styles.paymentCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentLabel}>Trip Payment</Text>
              <Text style={styles.paymentAmount}>{formatNaira(activeRequest.price)}</Text>
              <Text style={styles.paymentSub}>Payment confirmed and secured</Text>
            </View>
            <View style={styles.paymentCheck}>
              <Ionicons name="checkmark" size={18} color="#FFFFFF" />
            </View>
          </View>

          <PrimaryButton variant="success" label="I've Arrived at Pickup" onPress={handleArrived} style={{ marginTop: 20 }} />
          <PrimaryButton variant="danger" label="Emergency Support" onPress={handleEmergencySupport} style={{ marginTop: 12 }} />
        </ScrollView>
      </FadeSlideIn>
    );
  }

  return (
    <FadeSlideIn style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <AnimatedPressable
            hitSlop={12}
            onPress={() => (phase === 'negotiate' ? goBackToDetail() : clearActive())}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </AnimatedPressable>
          <View style={styles.emergencyIcon}>
            <Text style={{ fontSize: 18 }}>🚨</Text>
          </View>
        </View>

        <Text style={styles.title}>Emergency Request</Text>
        <Text style={styles.subtitle}>{activeRequest.timeAgo}</Text>

        <View style={styles.alertBanner}>
          <Ionicons name="alert-circle" size={20} color="#D92B20" />
          <View style={{ flex: 1 }}>
            <Text style={styles.alertTitle}>{activeRequest.title}</Text>
            <Text style={styles.alertBody}>Time-critical emergency - Immediate response required</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Patient Information</Text>
        <View style={styles.patientCard}>
          <View style={styles.patientAvatarGray}>
            <Ionicons name="person" size={20} color="#475569" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{activeRequest.patientName}</Text>
            <Text style={styles.patientPhone}>{activeRequest.patientPhone}</Text>
          </View>
          <AnimatedPressable style={styles.iconBtnGreen} onPress={handleCall}>
            <Ionicons name="call" size={18} color="#16A34A" />
          </AnimatedPressable>
        </View>

        <Text style={styles.sectionTitle}>Trip Details</Text>
        <View style={styles.routeRow}>
          <View style={styles.routeDotBlue} />
          <View style={{ flex: 1 }}>
            <Text style={styles.routeLabel}>Pickup Location</Text>
            <Text style={styles.routeValue}>{activeRequest.pickup}</Text>
          </View>
        </View>
        <View style={styles.routeConnector} />
        <View style={styles.routeRow}>
          <View style={styles.routeDotGreen} />
          <View style={{ flex: 1 }}>
            <Text style={styles.routeLabel}>Destination</Text>
            <Text style={styles.routeValue}>{activeRequest.destination}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Distance</Text>
            <Text style={styles.metricValue}>{activeRequest.distanceMi} mi</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Duration</Text>
            <Text style={styles.metricValue}>{activeRequest.durationMin} min</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Pricing</Text>
        <View style={styles.estimateBox}>
          <View style={{ flex: 1 }}>
            <Text style={styles.estimateLabel}>System Estimate</Text>
            <Text style={styles.estimateSub}>Based on distance and emergency type</Text>
          </View>
          <Text style={styles.estimateValue}>{formatNaira(activeRequest.price)}</Text>
        </View>

        {phase === 'detail' && (
          <>
            <PrimaryButton
              variant="success"
              label={`Accept System Price - ${formatNaira(activeRequest.price)}`}
              onPress={acceptSystemPrice}
              style={{ marginTop: 20 }}
            />
            <PrimaryButton label="Suggest Different Price" onPress={goToNegotiate} style={{ marginTop: 12 }} />
          </>
        )}

        {phase === 'negotiate' && (
          <>
            <Text style={styles.label}>Your Suggested Price</Text>
            <View style={styles.offerInputRow}>
              <Text style={styles.offerCurrency}>N</Text>
              <TextInput
                style={styles.offerInput}
                value={offer}
                onChangeText={setOffer}
                placeholder="Enter your price"
                placeholderTextColor="#94A3B8"
                keyboardType="number-pad"
              />
            </View>
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>Patient can negotiate the price before accepting</Text>
            </View>
            <PrimaryButton
              disabled={!offer || Number(offer) <= 0}
              onPress={handleSendOffer}
              label={`Send Price Offer${offer ? ` - ${formatNaira(Number(offer))}` : ' - N'}`}
              style={{ marginTop: 16 }}
            />
            <PrimaryButton variant="danger" label="Decline Request" onPress={handleDecline} style={{ marginTop: 12 }} />
          </>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  emergencyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
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
    color: '#94A3B8',
    marginTop: 2,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    padding: 14,
    marginTop: 18,
  },
  alertTitle: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '800',
    color: '#D92B20',
  },
  alertBody: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#B8271F',
    marginTop: 2,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 24,
    marginBottom: 12,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  patientAvatarGray: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  patientName: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  patientPhone: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 1,
  },
  iconBtnGreen: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnBlue: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  routeDotBlue: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2563EB',
    marginTop: 3,
  },
  routeDotGreen: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#16A34A',
    marginTop: 3,
  },
  routeConnector: {
    width: 1,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginLeft: 5.5,
  },
  routeLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
  },
  routeValue: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 18,
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
  },
  metricLabel: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#64748B',
  },
  metricValue: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
  },
  estimateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
  },
  estimateLabel: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#64748B',
  },
  estimateSub: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  estimateValue: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  acceptBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15.5,
  },
  suggestBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  suggestBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15.5,
  },
  label: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 8,
  },
  offerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  offerCurrency: {
    fontFamily: FONT,
    fontSize: 16,
    color: '#94A3B8',
    marginRight: 8,
    fontWeight: '600',
  },
  offerInput: {
    flex: 1,
    fontFamily: FONT,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  warningBanner: {
    backgroundColor: '#FEF8E7',
    borderWidth: 1,
    borderColor: '#F5E6A3',
    borderRadius: 10,
    padding: 12,
    marginTop: 12,
  },
  warningText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#8B6914',
  },
  sendOfferBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  sendOfferBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  sendOfferText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15.5,
  },
  declineOutlineBtn: {
    borderWidth: 1.5,
    borderColor: '#D92B20',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 12,
  },
  declineOutlineText: {
    fontFamily: FONT,
    color: '#D92B20',
    fontWeight: '700',
    fontSize: 15.5,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 14,
  },
  emptyBody: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  emptyBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  emptyBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },
  trackRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapArea: {
    height: 260,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headingPill: {
    alignSelf: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  headingPillText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  mapBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  etaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  etaLabel: {
    fontFamily: FONT,
    fontSize: 11,
    color: '#94A3B8',
  },
  etaValue: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  compassBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    flex: 1,
    marginTop: -20,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E2E8F0',
    alignSelf: 'center',
    marginBottom: 16,
  },
  emergencyTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FDECEC',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginTop: 14,
  },
  emergencyTagText: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '700',
    color: '#D92B20',
  },
  tripRouteTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 12,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  paymentLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#166534',
  },
  paymentAmount: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  paymentSub: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#166534',
    marginTop: 2,
  },
  paymentCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrivedBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  arrivedBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15.5,
  },
  supportBtn: {
    borderWidth: 1.5,
    borderColor: '#D92B20',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 12,
  },
  supportBtnText: {
    fontFamily: FONT,
    color: '#D92B20',
    fontWeight: '700',
    fontSize: 15.5,
  },
});
