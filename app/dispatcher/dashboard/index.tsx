import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useDispatcherOrder } from '@/components/DispatcherOrderContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';
const RIDER_NAME = 'Phillips Olamide';

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

export default function DispatcherHomeScreen() {
  const insets = useSafeAreaInsets();
  const { orders, online, setOnline, acceptOrder, declineOrder } = useDispatcherOrder();

  const handleAccept = (id: string) => {
    acceptOrder(id);
    router.push('/dispatcher/dashboard/order');
  };

  return (
    <FadeSlideIn style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={['#1D4ED8', '#1E3A8A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{RIDER_NAME}</Text>
            </View>
            <AnimatedPressable style={styles.avatar} onPress={() => router.push('/dispatcher/dashboard/profile')}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </AnimatedPressable>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="cube" size={20} color="#1D4ED8" />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Rider Status</Text>
              <Text style={[styles.statusSub, !online && styles.statusSubOffline]}>
                {online ? 'Open - Accepting Orders' : 'Closed - Not accepting orders'}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{ true: '#16A34A', false: '#D1D5DB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.salesCard}>
            <View style={styles.salesHeaderRow}>
              <Text style={styles.salesTitle}>Today's Sales</Text>
              <View style={styles.salesBadge}>
                <Text style={styles.salesBadgeText}>N</Text>
              </View>
            </View>
            <Text style={styles.salesAmount}>{formatNaira(143000)}</Text>
            <View style={styles.salesTrendRow}>
              <Ionicons name="trending-up" size={14} color="#16A34A" />
              <Text style={styles.salesTrend}>+18.2%</Text>
              <Text style={styles.salesTrendLabel}>from yesterday</Text>
            </View>
            <View style={styles.salesDivider} />
            <View style={styles.salesStatsRow}>
              <View style={styles.salesStat}>
                <Text style={styles.salesStatValue}>12</Text>
                <Text style={styles.salesStatLabel}>Orders Today</Text>
              </View>
              <View style={styles.salesStat}>
                <Text style={styles.salesStatValue}>67</Text>
                <Text style={styles.salesStatLabel}>This Week</Text>
              </View>
              <View style={styles.salesStat}>
                <Text style={styles.salesStatValue}>285</Text>
                <Text style={styles.salesStatLabel}>This Month</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>New Orders</Text>
            <View style={styles.bellRow}>
              {orders.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{orders.length}</Text>
                </View>
              )}
              <AnimatedPressable style={styles.bellBtn} hitSlop={8}>
                <Ionicons name="notifications-outline" size={18} color="#0F172A" />
              </AnimatedPressable>
            </View>
          </View>

          {!online && (
            <View style={styles.offlineCard}>
              <Ionicons name="moon-outline" size={20} color="#64748B" />
              <Text style={styles.offlineText}>You're closed. Go online to see new orders.</Text>
            </View>
          )}

          {online && orders.length === 0 && (
            <View style={styles.offlineCard}>
              <Ionicons name="checkmark-done-outline" size={20} color="#64748B" />
              <Text style={styles.offlineText}>No new orders right now.</Text>
            </View>
          )}

          {online &&
            orders.map((order, i) => (
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
                    <AnimatedPressable style={styles.acceptBtn} onPress={() => handleAccept(order.id)}>
                      <Text style={styles.acceptText}>Accept</Text>
                    </AnimatedPressable>
                  </View>
                </View>
              </FadeSlideIn>
            ))}
        </View>
      </ScrollView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F5FA',
  },
  scroll: {
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontFamily: FONT,
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
  },
  name: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: 20,
    marginTop: -16,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
      android: { elevation: 2 },
    }),
  },
  statusIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusText: {
    flex: 1,
  },
  statusTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusSub: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#1D4ED8',
    marginTop: 2,
  },
  statusSubOffline: {
    color: '#64748B',
  },
  salesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  salesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  salesTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  salesBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  salesBadgeText: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  salesAmount: {
    fontFamily: FONT,
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  salesTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  salesTrend: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  salesTrendLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#94A3B8',
  },
  salesDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  salesStatsRow: {
    flexDirection: 'row',
  },
  salesStat: {
    flex: 1,
    alignItems: 'center',
  },
  salesStatValue: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  salesStatLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
  },
  bellRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  offlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  offlineText: {
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
});
