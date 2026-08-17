import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

const FONT = Platform.select({ ios: 'System', default: 'System' });

export default function SubscriptionScreen() {
  const [selectedPlan, setSelectedPlan] = useState<'Basic' | 'Family' | 'Annual'>('Family');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Subscription & Plans</Text>
        <Text style={styles.subtitle}>Choose a plan that works for you</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.infoBanner}>
          <Feather name="info" size={18} color="#2563EB" style={styles.infoIcon} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Subscription Coverage</Text>
            <Text style={styles.infoDescription}>
              This subscription covers emergency ambulance services only. Medical supplies and drug delivery are billed separately.
            </Text>
          </View>
        </View>

        {/* Basic Plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'Basic' && styles.selectedPlanCard]}
          onPress={() => setSelectedPlan('Basic')}
          activeOpacity={0.9}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Basic</Text>
              <Text style={styles.planPrice}>
                ₦25,000<Text style={styles.planDuration}>/month</Text>
              </Text>
            </View>
            {selectedPlan === 'Basic' && (
              <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
            )}
          </View>
          <View style={styles.featureList}>
            {['Unlimited emergency ambulance rides', 'Priority dispatch', '24/7 support', 'No hidden fees', 'Cancel anytime'].map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Feather name="check" size={16} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* Family Plan */}
        <View style={styles.popularPlanWrapper}>
          <View style={styles.popularBadge}>
            <FontAwesome name="star" size={11} color="#FACC15" />
            <Text style={styles.popularBadgeText}>Most Popular</Text>
          </View>
          <TouchableOpacity
            style={[styles.planCard, styles.popularPlanCard, selectedPlan === 'Family' && styles.selectedPlanCard]}
            onPress={() => setSelectedPlan('Family')}
            activeOpacity={0.9}
          >
            <View style={styles.planHeader}>
              <View>
                <Text style={styles.planName}>Family</Text>
                <Text style={styles.planPrice}>
                  ₦50,000<Text style={styles.planDuration}>/month</Text>
                </Text>
              </View>
              {selectedPlan === 'Family' && (
                <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
              )}
            </View>
            <View style={styles.featureList}>
              {['Coverage for up to 4 family members', 'Unlimited emergency ambulance rides', 'Priority dispatch', '24/7 support', 'Emergency contact notifications', 'No hidden fees', 'Cancel anytime'].map((feature, idx) => (
                <View key={idx} style={styles.featureItem}>
                  <Feather name="check" size={16} color="#10B981" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>

        {/* Annual Plan */}
        <TouchableOpacity
          style={[styles.planCard, selectedPlan === 'Annual' && styles.selectedPlanCard]}
          onPress={() => setSelectedPlan('Annual')}
          activeOpacity={0.9}
        >
          <View style={styles.planHeader}>
            <View>
              <Text style={styles.planName}>Annual</Text>
              <Text style={styles.planPrice}>
                ₦450,000<Text style={styles.planDuration}>/year</Text>
              </Text>
            </View>
            {selectedPlan === 'Annual' && (
              <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
            )}
          </View>
          <View style={styles.featureList}>
            {['Save $49 per year', 'Unlimited emergency ambulance rides', 'Priority dispatch', '24/7 support', 'Free medical supplies delivery', 'No hidden fees', 'Cancel anytime'].map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Feather name="check" size={16} color="#10B981" />
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        </TouchableOpacity>

        {/* Why Subscribe */}
        <Text style={styles.whySectionTitle}>Why Subscribe?</Text>
        <View style={styles.perksRow}>
          <View style={styles.perkItem}>
            <View style={[styles.perkIconWrapper, { backgroundColor: '#EEF2FF' }]}>
              <Feather name="zap" size={20} color="#6366F1" />
            </View>
            <Text style={styles.perkText}>Priority Dispatch</Text>
          </View>
          <View style={styles.perkItem}>
            <View style={[styles.perkIconWrapper, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="shield-outline" size={20} color="#10B981" />
            </View>
            <Text style={styles.perkText}>No Hidden Fees</Text>
          </View>
          <View style={styles.perkItem}>
            <View style={[styles.perkIconWrapper, { backgroundColor: '#FAF5FF' }]}>
              <Feather name="clock" size={20} color="#A855F7" />
            </View>
            <Text style={styles.perkText}>24/7 Coverage</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.subscribeButton} activeOpacity={0.8}>
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>

        <Text style={styles.footerNotice}>
          You can cancel your subscription at any time
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginTop: 2,
    marginRight: 10,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E40AF',
    marginBottom: 4,
  },
  infoDescription: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#3B82F6',
    lineHeight: 17,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 16,
  },
  popularPlanWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  popularBadge: {
    position: 'absolute',
    top: -11,
    alignSelf: 'center',
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  popularBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  popularPlanCard: {
    marginBottom: 0,
    backgroundColor: '#F8FAFC',
  },
  selectedPlanCard: {
    borderColor: '#2563EB',
    borderWidth: 1.5,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planName: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  planPrice: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  planDuration: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '400',
    color: '#64748B',
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featureText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#334155',
    fontWeight: '400',
  },
  whySectionTitle: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 16,
  },
  perksRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  perkItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  perkIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  perkText: {
    fontFamily: FONT,
    fontSize: 11,
    color: '#475569',
    fontWeight: '500',
    textAlign: 'center',
  },
  subscribeButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  footerNotice: {
    fontFamily: FONT,
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 8,
  },
});
