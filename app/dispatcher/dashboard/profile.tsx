import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, Feather } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { removeToken } from '@/services/auth';
import { clearVerification } from '@/services/verification';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';

export default function DispatcherProfileScreen() {
  const insets = useSafeAreaInsets();
  const rider = {
    name: 'Phillips Olamide',
    email: 'phillips.olamide@lifeline.com',
    phone: '+234-814-123-4567',
    orders: 342,
    rating: 4.8,
    earned: 'N685,000',
  };

  const handlePressItem = (key: string) => {
    const routes: Record<string, string> = {
      'personal-info': '/personal-information',
      notifications: '/notifications',
      'help-support': '/help-support',
      'terms-privacy': '/terms-privacy',
    };
    if (key === 'rate-us') {
      Alert.alert('Thank You!', 'We appreciate your support — rating is coming soon.');
      return;
    }
    if (key === 'earnings') {
      router.push('/dispatcher/earnings');
      return;
    }
    const route = routes[key];
    if (route) router.push(route as any);
  };

  const ListItem = ({
    icon,
    label,
    itemKey,
    isLast,
  }: {
    icon: React.ReactNode;
    label: string;
    itemKey: string;
    isLast?: boolean;
  }) => (
    <AnimatedPressable
      style={[styles.row, isLast && styles.rowLast]}
      onPress={() => handlePressItem(itemKey)}
    >
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color="#94A3B8" />
    </AnimatedPressable>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <FadeSlideIn>
        <LinearGradient colors={['#1D4ED8', '#1E3A8A']} style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={44} color="#1E3A8A" />
          </View>

          <Text style={styles.name}>{rider.name}</Text>
          <Text style={styles.contactText}>{rider.email}</Text>
          <Text style={styles.contactText}>{rider.phone}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rider.orders.toLocaleString('en-US')}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={16} color="#F5A623" />
                <Text style={styles.statValue}>{rider.rating}</Text>
              </View>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rider.earned}</Text>
              <Text style={styles.statLabel}>Earned</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.card}>
            <ListItem
              icon={<Ionicons name="person-outline" size={20} color="#475569" />}
              label="Personal Information"
              itemKey="personal-info"
              isLast
            />
          </View>

          <Text style={styles.sectionTitle}>PAYMENTS</Text>
          <View style={styles.card}>
            <ListItem
              icon={<Feather name="dollar-sign" size={20} color="#475569" />}
              label="Earnings"
              itemKey="earnings"
              isLast
            />
          </View>

          <Text style={styles.sectionTitle}>SETTINGS</Text>
          <View style={styles.card}>
            <ListItem
              icon={<Ionicons name="notifications-outline" size={20} color="#475569" />}
              label="Notifications"
              itemKey="notifications"
            />
            <ListItem
              icon={<Ionicons name="star-outline" size={20} color="#475569" />}
              label="Rate Us"
              itemKey="rate-us"
            />
            <ListItem
              icon={<Feather name="help-circle" size={20} color="#475569" />}
              label="Help & Support"
              itemKey="help-support"
            />
            <ListItem
              icon={<Feather name="file-text" size={20} color="#475569" />}
              label="Terms & Privacy"
              itemKey="terms-privacy"
              isLast
            />
          </View>

          <AnimatedPressable
            style={styles.logoutBtn}
            onPress={() =>
              Promise.all([removeToken(), clearVerification()]).then(() => router.replace('/'))
            }
          >
            <Feather name="log-out" size={18} color="#fff" />
            <Text style={styles.logoutText}>Log Out</Text>
          </AnimatedPressable>

          <Text style={styles.version}>Lifeline v1.0.0</Text>
        </View>
      </FadeSlideIn>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 28,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  name: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  contactText: {
    fontFamily: FONT,
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginTop: 20,
    width: '86%',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } },
      android: { elevation: 3 },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#94A3B8',
    marginTop: 2,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9EDF3',
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F5',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EAF0FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 16,
    color: '#0F172A',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#E11D2E',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  logoutText: {
    fontFamily: FONT,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  version: {
    fontFamily: FONT,
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginVertical: 24,
  },
});
