import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore } from '@/components/StoreContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

export default function DeliveryTrackingScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { activeOrders, completeDelivery } = useStore();

  const order = activeOrders.find((o) => o.id === params.id);

  if (!order) {
    return (
      <FadeSlideIn style={styles.emptyRoot}>
        <Text style={styles.emptyText}>This delivery is no longer active.</Text>
        <AnimatedPressable style={styles.emptyBtn} onPress={() => router.replace('/driver/store' as any)}>
          <Text style={styles.emptyBtnText}>Back to Home</Text>
        </AnimatedPressable>
      </FadeSlideIn>
    );
  }

  const handleCall = () => {
    if (order.customerPhone) Linking.openURL(`tel:${order.customerPhone}`);
  };

  const handleContactSupport = () => {
    Alert.alert('Contact Support', 'Our support team will reach out to you shortly.');
  };

  const handleArrived = () => {
    router.replace({
      pathname: '/driver/store/delivery-complete',
      params: { id: order.id, total: String(order.total) },
    });
  };

  return (
    <FadeSlideIn style={styles.root}>
      <LinearGradient colors={['#BBF7D0', '#DCFCE7']} style={[styles.mapArea, { paddingTop: insets.top + 16 }]}>
        <View style={styles.headingPill}>
          <Text style={styles.headingPillText}>🚚 On the Way</Text>
        </View>
        <View style={styles.mapBottomRow}>
          <View style={styles.etaCard}>
            <Text style={styles.etaLabel}>ETA</Text>
            <Text style={styles.etaValue}>{order.etaMinutes} min</Text>
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

        <View style={styles.orderNumberBox}>
          <Text style={styles.orderNumberLabel}>Order Number</Text>
          <Text style={styles.orderNumberValue}>#LSO-{order.id.toUpperCase()}</Text>
        </View>

        <View style={styles.customerCard}>
          <View style={styles.customerRow}>
            <View style={styles.customerAvatar}>
              <Ionicons name="person" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.customerName}>{order.customerName}</Text>
              <Text style={styles.customerPhone}>{order.customerPhone}</Text>
            </View>
            <AnimatedPressable style={styles.iconBtnGreen} onPress={handleCall}>
              <Ionicons name="call" size={18} color="#16A34A" />
            </AnimatedPressable>
            <AnimatedPressable style={styles.iconBtnBlue} onPress={handleContactSupport}>
              <Ionicons name="chatbubble" size={18} color="#2563EB" />
            </AnimatedPressable>
          </View>

          <View style={styles.addressRow}>
            <Ionicons name="location" size={16} color="#16A34A" style={{ marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addressText}>{order.deliveryAddress}</Text>
              {!!order.deliveryNote && <Text style={styles.addressNote}>{order.deliveryNote}</Text>}
            </View>
          </View>
        </View>

        <View style={styles.paymentCard}>
          <View style={styles.paymentIcon}>
            <Ionicons name="cube" size={18} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.paymentItems}>{order.itemsCount} items</Text>
            <Text style={styles.paymentAmount}>{formatNaira(order.total)}</Text>
          </View>
          <View style={styles.paymentCheck}>
            <Ionicons name="checkmark" size={18} color="#FFFFFF" />
          </View>
        </View>
        <Text style={styles.paymentSecuredText}>Payment secured - will be released on delivery</Text>

        <AnimatedPressable style={styles.arrivedBtn} onPress={handleArrived}>
          <Text style={styles.arrivedBtnText}>I've Arrived</Text>
        </AnimatedPressable>
        <AnimatedPressable style={styles.supportBtn} onPress={handleContactSupport}>
          <Text style={styles.supportBtnText}>Contact Support</Text>
        </AnimatedPressable>
      </ScrollView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  mapArea: {
    height: 260,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headingPill: {
    alignSelf: 'center',
    backgroundColor: '#16A34A',
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
    backgroundColor: '#16A34A',
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
  orderNumberBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumberLabel: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#64748B',
  },
  orderNumberValue: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  customerCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  customerPhone: {
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
  addressRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
  },
  addressText: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  addressNote: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#64748B',
    marginTop: 4,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 14,
    padding: 16,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentItems: {
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
  paymentCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentSecuredText: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#16A34A',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
  },
  arrivedBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 22,
  },
  arrivedBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15.5,
  },
  supportBtn: {
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 12,
  },
  supportBtnText: {
    fontFamily: FONT,
    color: '#0F172A',
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
  emptyText: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  emptyBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },
});
