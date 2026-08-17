import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const FONT = Platform.select({ ios: 'System', default: 'System' });

const SUBSCRIPTION_STATUS = 'Active';

export default function ProfileScreen() {
  const user = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
  };

  const handlePressItem = (key: string) => {
    const routes: Record<string, string> = {
      'personal-info': '/personal-information',
      'saved-addresses': '/saved-addresses',
      'emergency-contacts': '/emergency-contacts',
      'payment-methods': '/payment-methods',
      'subscription-plan': '/subscription',
      'notifications': '/notifications',
      'help-support': '/help-support',
      'terms-privacy': '/terms-privacy',
    };
    const route = routes[key];
    if (route) router.push(route as any);
  };

  const ListItem = ({ icon, label, badge, itemKey, isLast }: {
    icon: React.ReactNode;
    label: string;
    badge?: string;
    itemKey: string;
    isLast?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.row, isLast && styles.rowLast]}
      onPress={() => handlePressItem(itemKey)}
      activeOpacity={0.6}
    >
      <View style={styles.rowIcon}>{icon}</View>
      <Text style={styles.rowLabel}>{label}</Text>
      {badge !== undefined && (
        <View
          style={[
            styles.badge,
            badge === SUBSCRIPTION_STATUS && styles.badgeActive,
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              badge === SUBSCRIPTION_STATUS && styles.badgeActiveText,
            ]}
          >
            {badge}
          </Text>
        </View>
      )}
      <Feather name="chevron-right" size={20} color="#94A3B8" />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <LinearGradient
        colors={['#2551F5', '#1740E0']}
        style={styles.header}
      >
        <View style={styles.avatar}>
          <Ionicons name="person" size={44} color="#2551F5" />
        </View>

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.contactText}>{user.email}</Text>
        <Text style={styles.contactText}>{user.phone}</Text>
      </LinearGradient>

      <View style={styles.body}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.card}>
          <ListItem
            icon={<Ionicons name="person-outline" size={20} color="#475569" />}
            label="Personal Information"
            itemKey="personal-info"
          />
          <ListItem
            icon={<Ionicons name="location-outline" size={20} color="#475569" />}
            label="Saved Addresses"
            badge={String(2)}
            itemKey="saved-addresses"
          />
          <ListItem
            icon={<Feather name="phone" size={20} color="#475569" />}
            label="Emergency Contacts"
            badge={String(2)}
            itemKey="emergency-contacts"
            isLast
          />
        </View>

        <Text style={styles.sectionTitle}>PAYMENT & SUBSCRIPTION</Text>
        <View style={styles.card}>
          <ListItem
            icon={<MaterialIcons name="credit-card" size={20} color="#475569" />}
            label="Payment Methods"
            itemKey="payment-methods"
          />
          <ListItem
            icon={<Feather name="shield" size={20} color="#475569" />}
            label="Subscription Plan"
            badge={SUBSCRIPTION_STATUS}
            itemKey="subscription-plan"
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

        <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
          <Feather name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Lifeline v1.0.0</Text>
      </View>
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
    paddingBottom: 32,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  contactText: {
    fontSize: 15,
    color: '#DCE6FE',
    marginBottom: 2,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 28,
  },
  sectionTitle: {
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
    fontSize: 16,
    color: '#0F172A',
  },
  badge: {
    backgroundColor: '#DCE6FE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2551F5',
  },
  badgeActive: {
    backgroundColor: '#DCFCE7',
  },
  badgeActiveText: {
    color: '#16A34A',
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
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  version: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 13,
    marginVertical: 24,
  },
});
