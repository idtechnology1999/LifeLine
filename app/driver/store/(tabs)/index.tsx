import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useStore } from '@/components/StoreContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';
const STORE_NAME = 'MedSupply Store';

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

export default function StoreHomeScreen() {
  const insets = useSafeAreaInsets();
  const { storeOnline, setStoreOnline, newOrders, activeOrders, acceptOrder, declineOrder } = useStore();

  const statusPillStyle = (status: string) => {
    if (status === 'Preparing') return { bg: '#DBEAFE', color: '#2563EB' };
    if (status === 'Ready') return { bg: '#DCFCE7', color: '#16A34A' };
    return { bg: '#FEF3E2', color: '#D97706' };
  };

  return (
    <FadeSlideIn style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={['#16A34A', '#0F5132']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{STORE_NAME}</Text>
            </View>
            <AnimatedPressable style={styles.avatar} onPress={() => router.push('/driver/store/profile')}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </AnimatedPressable>
          </View>

          <View style={styles.modeToggle}>
            <AnimatedPressable style={styles.modePill} onPress={() => router.replace('/driver/dashboard')}>
              <Text style={styles.modeText}>🚑 Ambulance</Text>
            </AnimatedPressable>
            <AnimatedPressable style={[styles.modePill, styles.modePillActive]}>
              <Text style={[styles.modeText, styles.modeTextActive]}>📦 Supplier</Text>
            </AnimatedPressable>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="cube" size={20} color="#16A34A" />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Store Status</Text>
              <Text style={[styles.statusSub, !storeOnline && styles.statusSubOffline]}>
                {storeOnline ? 'Open - Accepting Orders' : 'Closed - Not accepting orders'}
              </Text>
            </View>
            <Switch
              value={storeOnline}
              onValueChange={setStoreOnline}
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

          <AnimatedPressable onPress={() => router.push('/driver/store/inventory')}>
            <LinearGradient
              colors={['#16A34A', '#0F5132']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.inventoryBanner}
            >
              <View style={styles.inventoryIcon}>
                <Ionicons name="archive" size={22} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inventoryTitle}>Inventory Management</Text>
                <Text style={styles.inventorySub}>Manage your products & stock</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
            </LinearGradient>
          </AnimatedPressable>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>New Orders</Text>
            <View style={styles.newOrdersRight}>
              {newOrders.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{newOrders.length}</Text>
                </View>
              )}
              <AnimatedPressable style={styles.bellBtn} hitSlop={8}>
                <Ionicons name="notifications-outline" size={18} color="#0F172A" />
              </AnimatedPressable>
            </View>
          </View>

          {!storeOnline && (
            <View style={styles.closedCard}>
              <View style={styles.closedIconCircle}>
                <Ionicons name="power" size={26} color="#94A3B8" />
              </View>
              <Text style={styles.closedTitle}>Store is closed</Text>
              <Text style={styles.closedBody}>Open your store to start receiving orders</Text>
            </View>
          )}

          {storeOnline && newOrders.length === 0 && (
            <View style={styles.emptyCard}>
              <Ionicons name="checkmark-done-outline" size={20} color="#64748B" />
              <Text style={styles.emptyText}>No new orders right now.</Text>
            </View>
          )}

          {storeOnline && newOrders.map((order, i) => {
            const total = order.items.reduce((s, item) => s + item.lineTotal, 0) + order.deliveryFee;
            return (
              <FadeSlideIn key={order.id} delay={i * 80} style={styles.orderCard}>
                <View style={styles.orderHeaderRow}>
                  <View style={styles.orderHeaderLeft}>
                    <View style={styles.orderAvatar}>
                      <Ionicons name="person" size={16} color="#475569" />
                    </View>
                    <View>
                      <Text style={styles.orderCustomer}>{order.customerName}</Text>
                      <Text style={styles.orderTime}>{order.timeAgo}</Text>
                    </View>
                  </View>
                  {order.urgent && (
                    <View style={styles.urgentBadge}>
                      <Text style={styles.urgentText}>🔥 Urgent</Text>
                    </View>
                  )}
                </View>

                <View style={styles.itemsBox}>
                  <Text style={styles.itemsLabel}>Items ({order.items.length})</Text>
                  {order.items.map((item, i) => (
                    <View key={i} style={styles.itemRow}>
                      <Text style={styles.itemName}>
                        {item.qty}x {item.name}
                      </Text>
                      <Text style={styles.itemPrice}>{formatNaira(item.lineTotal)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.deliveryRow}>
                  <Ionicons name="cube-outline" size={14} color="#64748B" />
                  <Text style={styles.deliveryLabel}>Delivery to:</Text>
                  <Text style={styles.deliveryAddress} numberOfLines={1}>{order.deliveryAddress}</Text>
                  <Text style={styles.deliveryFee}>{formatNaira(order.deliveryFee)}</Text>
                </View>

                <View style={styles.orderDivider} />

                <View style={styles.orderFooterRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>{formatNaira(total)}</Text>
                  </View>
                  <AnimatedPressable style={styles.declineBtn} onPress={() => declineOrder(order.id)}>
                    <Text style={styles.declineText}>Decline</Text>
                  </AnimatedPressable>
                  <AnimatedPressable style={styles.acceptBtn} onPress={() => acceptOrder(order.id)}>
                    <Text style={styles.acceptText}>Accept</Text>
                  </AnimatedPressable>
                </View>
              </FadeSlideIn>
            );
          })}

          <Text style={styles.sectionTitle}>Active Orders</Text>
          {activeOrders.map((order) => {
            const pill = statusPillStyle(order.status);
            const trackable = order.status === 'Enroute';
            return (
              <AnimatedPressable
                key={order.id}
                style={styles.activeRow}
                disabled={!trackable}
                onPress={() =>
                  router.push({ pathname: '/driver/store/delivery-tracking', params: { id: order.id } })
                }
              >
                <View style={{ flex: 1 }}>
                  <View style={styles.activeTopRow}>
                    <Text style={styles.activeName}>{order.customerName}</Text>
                    <View style={[styles.statusPill, { backgroundColor: pill.bg }]}>
                      <Text style={[styles.statusPillText, { color: pill.color }]}>{order.status}</Text>
                    </View>
                  </View>
                  <View style={styles.activeBottomRow}>
                    <Text style={styles.activeMeta}>
                      {order.itemsCount} items • {formatNaira(order.total)}
                    </Text>
                    <Text style={styles.activeNote}>{order.statusNote}</Text>
                  </View>
                </View>
                {trackable && <Ionicons name="chevron-forward" size={18} color="#94A3B8" />}
              </AnimatedPressable>
            );
          })}

          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceRow}>
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeaderRow}>
                <Text style={styles.performanceLabel}>Rating</Text>
                <Ionicons name="star" size={16} color="#F5A623" />
              </View>
              <Text style={styles.performanceValue}>4.8</Text>
              <Text style={styles.performanceSub}>324 reviews</Text>
            </View>
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeaderRow}>
                <Text style={styles.performanceLabel}>Fulfillment</Text>
                <Ionicons name="checkmark-circle" size={16} color="#16A34A" />
              </View>
              <Text style={styles.performanceValue}>97%</Text>
              <Text style={styles.performanceSub}>Last 30 days</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F5FA' },
  scroll: { paddingBottom: 40 },
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
    color: 'rgba(255,255,255,0.75)',
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 4,
    marginTop: 22,
  },
  modePill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 11,
    alignItems: 'center',
  },
  modePillActive: {
    backgroundColor: '#FFFFFF',
  },
  modeText: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
  },
  modeTextActive: {
    color: '#0F172A',
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
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  statusText: { flex: 1 },
  statusTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusSub: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#16A34A',
    marginTop: 2,
  },
  statusSubOffline: { color: '#64748B' },
  salesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
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
  salesStatsRow: { flexDirection: 'row' },
  salesStat: { flex: 1, alignItems: 'center' },
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
  inventoryBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
  },
  inventoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  inventorySub: {
    fontFamily: FONT,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
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
    marginBottom: 14,
  },
  newOrdersRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countBadgeText: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  bellBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginBottom: 20,
  },
  emptyText: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#64748B',
    flex: 1,
  },
  orderCard: {
    borderWidth: 1.5,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  orderHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orderAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderCustomer: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  orderTime: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 1,
  },
  urgentBadge: {
    backgroundColor: '#FEF3E2',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  urgentText: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '700',
    color: '#D97706',
  },
  itemsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  itemsLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemName: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#0F172A',
  },
  itemPrice: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  deliveryLabel: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#64748B',
  },
  deliveryAddress: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#0F172A',
  },
  deliveryFee: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  orderDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
  },
  orderFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  totalLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
  },
  totalValue: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  declineBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  declineText: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#475569',
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  acceptText: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  closedCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingVertical: 32,
    marginBottom: 20,
  },
  closedIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  closedTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  closedBody: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#64748B',
    marginTop: 4,
  },
  activeTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeName: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusPill: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusPillText: {
    fontFamily: FONT,
    fontSize: 11.5,
    fontWeight: '700',
  },
  activeBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  activeMeta: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
  },
  activeNote: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
  },
  performanceRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  performanceCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
  },
  performanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  performanceLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
  },
  performanceValue: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 8,
  },
  performanceSub: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
});
