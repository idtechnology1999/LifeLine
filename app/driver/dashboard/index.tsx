import React from 'react';
import { View, Text, StyleSheet, Platform, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useDriverRequest } from '@/components/DriverRequestContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';
const DRIVER_NAME = 'Michael Roberts';

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

export default function DriverHomeScreen() {
  const insets = useSafeAreaInsets();
  const { requests, online, setOnline, viewDetails, decline } = useDriverRequest();

  const handleViewDetails = (id: string) => {
    viewDetails(id);
    router.push('/driver/dashboard/request');
  };

  return (
    <FadeSlideIn style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={['#0B1220', '#16233B']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{DRIVER_NAME}</Text>
            </View>
            <AnimatedPressable style={styles.avatar} onPress={() => router.push('/driver/dashboard/profile')}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </AnimatedPressable>
          </View>

          <View style={styles.modeToggle}>
            <AnimatedPressable style={[styles.modePill, styles.modePillActive]}>
              <Text style={[styles.modeText, styles.modeTextActive]}>🚑 Ambulance</Text>
            </AnimatedPressable>
            <AnimatedPressable style={styles.modePill} onPress={() => router.replace('/driver/store' as any)}>
              <Text style={styles.modeText}>📦 Supplier</Text>
            </AnimatedPressable>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Ionicons name="power" size={20} color="#16A34A" />
            </View>
            <View style={styles.statusText}>
              <Text style={styles.statusTitle}>Service Status</Text>
              <Text style={[styles.statusSub, !online && styles.statusSubOffline]}>
                {online ? 'Online - Accepting Requests' : 'Offline - Not accepting requests'}
              </Text>
            </View>
            <Switch
              value={online}
              onValueChange={setOnline}
              trackColor={{ true: '#16A34A', false: '#D1D5DB' }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.earningsCard}>
            <View style={styles.earningsHeaderRow}>
              <Text style={styles.earningsTitle}>Today's Earnings</Text>
              <View style={styles.earningsBadge}>
                <Text style={styles.earningsBadgeText}>N</Text>
              </View>
            </View>
            <Text style={styles.earningsAmount}>{formatNaira(45000)}</Text>
            <View style={styles.earningsTrendRow}>
              <Ionicons name="trending-up" size={14} color="#16A34A" />
              <Text style={styles.earningsTrend}>+12.5%</Text>
              <Text style={styles.earningsTrendLabel}>from yesterday</Text>
            </View>
            <View style={styles.earningsDivider} />
            <View style={styles.earningsStatsRow}>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>8</Text>
                <Text style={styles.earningsStatLabel}>Trips Today</Text>
              </View>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>42</Text>
                <Text style={styles.earningsStatLabel}>This Week</Text>
              </View>
              <View style={styles.earningsStat}>
                <Text style={styles.earningsStatValue}>178</Text>
                <Text style={styles.earningsStatLabel}>This Month</Text>
              </View>
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Incoming Requests</Text>
            <AnimatedPressable style={styles.bellBtn} hitSlop={8}>
              <Ionicons name="notifications-outline" size={18} color="#0F172A" />
            </AnimatedPressable>
          </View>

          {!online && (
            <View style={styles.offlineCard}>
              <Ionicons name="moon-outline" size={20} color="#64748B" />
              <Text style={styles.offlineText}>You're offline. Go online to see incoming requests.</Text>
            </View>
          )}

          {online && requests.length === 0 && (
            <View style={styles.offlineCard}>
              <Ionicons name="checkmark-done-outline" size={20} color="#64748B" />
              <Text style={styles.offlineText}>No incoming requests right now.</Text>
            </View>
          )}

          {online &&
            requests.map((req, i) => (
              <FadeSlideIn key={req.id} delay={i * 80} style={styles.requestCard}>
                <View style={styles.requestHeaderRow}>
                  <View style={styles.requestHeaderLeft}>
                    <View style={styles.requestIcon}>
                      <Text style={{ fontSize: 18 }}>🚨</Text>
                    </View>
                    <View>
                      <Text style={styles.requestTitle}>{req.title}</Text>
                      <Text style={styles.requestTime}>{req.timeAgo}</Text>
                    </View>
                  </View>
                  <View style={styles.requestPriceWrap}>
                    <Text style={styles.requestPriceLabel}>Est. Price</Text>
                    <Text style={styles.requestPrice}>{formatNaira(req.price)}</Text>
                  </View>
                </View>

                <View style={styles.requestRow}>
                  <Ionicons name="location-outline" size={15} color="#64748B" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.requestRowLabel}>Pickup</Text>
                    <Text style={styles.requestRowValue}>{req.pickup}</Text>
                  </View>
                </View>
                <View style={styles.requestRow}>
                  <Ionicons name="location" size={15} color="#16A34A" />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.requestRowLabel}>Destination</Text>
                    <Text style={styles.requestRowValue}>{req.destination}</Text>
                  </View>
                </View>
                <View style={styles.requestRow}>
                  <Ionicons name="time-outline" size={15} color="#64748B" />
                  <Text style={styles.requestRowValue}>
                    {req.distanceMi} mi away • ~{req.durationMin} min
                  </Text>
                </View>

                <View style={styles.requestActionsRow}>
                  <AnimatedPressable style={styles.viewDetailsBtn} onPress={() => handleViewDetails(req.id)}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </AnimatedPressable>
                  <AnimatedPressable style={styles.declineBtn} onPress={() => decline(req.id)}>
                    <Text style={styles.declineText}>Decline</Text>
                  </AnimatedPressable>
                </View>
              </FadeSlideIn>
            ))}

          <Text style={styles.sectionTitle}>Performance</Text>
          <View style={styles.performanceRow}>
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeaderRow}>
                <Text style={styles.performanceLabel}>Rating</Text>
                <Ionicons name="star" size={16} color="#F5A623" />
              </View>
              <Text style={styles.performanceValue}>4.9</Text>
              <Text style={styles.performanceSub}>156 reviews</Text>
            </View>
            <View style={styles.performanceCard}>
              <View style={styles.performanceHeaderRow}>
                <Text style={styles.performanceLabel}>Acceptance</Text>
                <Ionicons name="trending-up" size={16} color="#16A34A" />
              </View>
              <Text style={styles.performanceValue}>94%</Text>
              <Text style={styles.performanceSub}>Last 30 days</Text>
            </View>
          </View>
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
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
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
    color: 'rgba(255,255,255,0.7)',
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
    color: '#16A34A',
    marginTop: 2,
  },
  statusSubOffline: {
    color: '#64748B',
  },
  earningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 2 },
    }),
  },
  earningsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  earningsTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  earningsBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsBadgeText: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  earningsAmount: {
    fontFamily: FONT,
    fontSize: 34,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 10,
  },
  earningsTrendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  earningsTrend: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },
  earningsTrendLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#94A3B8',
  },
  earningsDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  earningsStatsRow: {
    flexDirection: 'row',
  },
  earningsStat: {
    flex: 1,
    alignItems: 'center',
  },
  earningsStatValue: {
    fontFamily: FONT,
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  earningsStatLabel: {
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
    marginBottom: 14,
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
  requestCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  requestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  requestHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  requestIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FDECEC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestTitle: {
    fontFamily: FONT,
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  requestTime: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  requestPriceWrap: {
    alignItems: 'flex-end',
  },
  requestPriceLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
  },
  requestPrice: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 1,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  requestRowLabel: {
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#94A3B8',
  },
  requestRowValue: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '500',
  },
  requestActionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  viewDetailsBtn: {
    flex: 1,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  viewDetailsText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },
  declineBtn: {
    backgroundColor: '#FDECEC',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  declineText: {
    fontFamily: FONT,
    color: '#D92B20',
    fontWeight: '700',
    fontSize: 14.5,
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
