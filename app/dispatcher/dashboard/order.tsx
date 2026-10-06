import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useDispatcherOrder } from '@/components/DispatcherOrderContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;
const firstName = (name: string) => name.split(' ')[0];

export default function DispatcherOrderScreen() {
  const insets = useSafeAreaInsets();
  const {
    orders,
    activeOrder,
    phase,
    deliveryPhase,
    acceptOrder,
    declineOrder,
    arrivedAtPickup,
    completeDelivery,
  } = useDispatcherOrder();

  const contact = deliveryPhase === 'toPickup'
    ? { name: activeOrder?.pickup ?? '', phone: activeOrder?.pickupPhone ?? '' }
    : { name: activeOrder?.customerName ?? '', phone: activeOrder?.customerPhone ?? '' };

  const handleCall = () => {
    if (contact.phone) Linking.openURL(`tel:${contact.phone}`);
  };

  const handleArrived = () => {
    Alert.alert('Arrived at Pickup', "You've marked arrival. Now head to the customer for delivery.", [
      { text: 'OK', onPress: arrivedAtPickup },
    ]);
  };

  const handleDelivered = () => {
    if (!activeOrder) return;
    const amount = activeOrder.earning;
    Alert.alert('Confirm Delivery', `Mark this order as delivered to ${activeOrder.customerName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        onPress: () => {
          completeDelivery();
          router.push({ pathname: '/dispatcher/delivery-complete', params: { amount: String(amount) } });
        },
      },
    ]);
  };

  if (phase === 'active' && activeOrder) {
    return (
      <FadeSlideIn style={styles.trackRoot}>
        <LinearGradient colors={['#BFDBFE', '#EFF6FF']} style={[styles.mapArea, { paddingTop: insets.top + 16 }]}>
          <View style={styles.headingPill}>
            <Text style={styles.headingPillText}>🚚 Heading to {contact.name}</Text>
          </View>
          <View style={styles.mapBottomRow}>
            <View style={styles.etaCard}>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>{activeOrder.etaMin} min</Text>
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

          <View style={styles.pharmacyRow}>
            <View style={styles.pharmacyAvatar}>
              <Ionicons name="person" size={20} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pharmacyName}>{contact.name}</Text>
              <Text style={styles.pharmacyPhone}>{contact.phone}</Text>
            </View>
            <AnimatedPressable style={styles.iconBtnGreen} onPress={handleCall}>
              <Ionicons name="call" size={18} color="#16A34A" />
            </AnimatedPressable>
            <AnimatedPressable style={styles.iconBtnBlue}>
              <Ionicons name="chatbubble" size={18} color="#2563EB" />
            </AnimatedPressable>
          </View>

          <Text style={styles.tripRouteTitle}>Trip Route</Text>
          <View style={styles.routeRow}>
            <View style={styles.routeDotBlue} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Pickup Location</Text>
              <Text style={styles.routeValue}>{activeOrder.pickupAddress}</Text>
            </View>
          </View>
          <View style={styles.routeConnector} />
          <View style={styles.routeRow}>
            <View style={styles.routeDotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{activeOrder.deliveryTo}</Text>
            </View>
          </View>

          {deliveryPhase === 'toPickup' ? (
            <PrimaryButton variant="success" label="I've Arrived at Pickup" onPress={handleArrived} style={{ marginTop: 24 }} />
          ) : (
            <PrimaryButton
              variant="success"
              label={`I've Delivered to ${firstName(activeOrder.customerName)}`}
              onPress={handleDelivered}
              style={{ marginTop: 24 }}
            />
          )}
        </ScrollView>
      </FadeSlideIn>
    );
  }

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Delivery Request</Text>
        <Text style={styles.subtitle}>
          {orders.length > 0 ? orders[0].timeAgo : 'No new requests'}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>New Orders</Text>

        {orders.length === 0 && (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-done-outline" size={20} color="#64748B" />
            <Text style={styles.emptyText}>No new orders right now.</Text>
          </View>
        )}

        {orders.map((order, i) => (
          <FadeSlideIn key={order.id} delay={i * 80} style={styles.orderCard}>
            <View style={styles.orderRow}>
              <Ionicons name="cube-outline" size={15} color="#64748B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.orderRowLabel}>Pick-up:</Text>
                <Text style={styles.orderRowValue}>{order.pickup}</Text>
              </View>
            </View>
            <View style={styles.orderRow}>
              <Ionicons name="cube-outline" size={15} color="#64748B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.orderRowLabel}>Delivery to:</Text>
                <Text style={styles.orderRowValue}>{order.deliveryTo}</Text>
              </View>
            </View>
            <View style={styles.orderRow}>
              <Ionicons name="cube-outline" size={15} color="#64748B" />
              <View style={{ flex: 1 }}>
                <Text style={styles.orderRowLabel}>Distance:</Text>
                <Text style={styles.orderRowValue}>{order.distanceKm}km</Text>
              </View>
            </View>

            <View style={styles.orderDivider} />

            <View style={styles.orderFooterRow}>
              <View>
                <Text style={styles.earningLabel}>Earning</Text>
                <Text style={styles.earningValue}>{formatNaira(order.earning)}</Text>
              </View>
              <View style={styles.orderActionsRow}>
                <AnimatedPressable style={styles.declineBtn} onPress={() => declineOrder(order.id)}>
                  <Text style={styles.declineText}>Decline</Text>
                </AnimatedPressable>
                <AnimatedPressable style={styles.acceptBtn} onPress={() => acceptOrder(order.id)}>
                  <Text style={styles.acceptText}>Accept</Text>
                </AnimatedPressable>
              </View>
            </View>
          </FadeSlideIn>
        ))}
      </ScrollView>
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
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 14,
  },
  emptyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
  },
  emptyText: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#64748B',
    flex: 1,
  },
  orderCard: {
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  orderRowLabel: {
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#94A3B8',
  },
  orderRowValue: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 8,
  },
  orderFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earningLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
  },
  earningValue: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  orderActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  declineBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  declineText: {
    fontFamily: FONT,
    color: '#475569',
    fontWeight: '700',
    fontSize: 14,
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
  },
  acceptText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
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
  pharmacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  pharmacyAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pharmacyName: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  pharmacyPhone: {
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
  tripRouteTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 20,
    marginBottom: 12,
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
  arrivedBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  arrivedBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15.5,
  },
});
