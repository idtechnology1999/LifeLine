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
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FONT = Platform.select({ ios: 'System', default: 'System' });

export default function ProductDetailsScreen() {
  const [quantity, setQuantity] = useState(1);

  const keyFeatures = [
    'Clinically validated accuracy',
    'Large easy-to-read display',
    'Irregular heartbeat detector',
    'Memory for 120 readings',
    'Adjustable cuff fits most arms',
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
          <Feather name="shopping-cart" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <MaterialCommunityIcons name="pill" size={120} color="#EF4444" style={styles.pillIcon} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.productTitle}>Lisinopril</Text>

          <View style={styles.ratingAndStockRow}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingScore}>4.5</Text>
              <Text style={styles.ratingCount}>(234 reviews)</Text>
            </View>
            <View style={styles.stockBadge}>
              <Feather name="check-circle" size={14} color="#10B981" />
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          </View>

          <Text style={styles.prescriptionNotice}>Requires Prescription</Text>
          <Text style={styles.priceTag}>N12,500</Text>

          <View style={styles.badgeRow}>
            <View style={[styles.infoBadge, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="truck" size={18} color="#2563EB" />
              <View>
                <Text style={styles.badgeLabel}>Delivery</Text>
                <Text style={styles.badgeValue}>1-2 days</Text>
              </View>
            </View>
            <View style={[styles.infoBadge, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color="#10B981" />
              <View>
                <Text style={styles.badgeLabel}>Guarantee</Text>
                <Text style={styles.badgeValue}>Verified</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionHeader}>Description</Text>
          <Text style={styles.descriptionText}>
            Professional-grade digital blood pressure monitor with advanced accuracy. Features large LCD display, irregular heartbeat detection, and memory for 2 users with 60 readings each.
          </Text>

          <Text style={styles.sectionHeader}>Key Features</Text>
          <View style={styles.featuresList}>
            {keyFeatures.map((feature, idx) => (
              <View key={idx} style={styles.featureItem}>
                <Ionicons name="checkmark-circle-outline" size={18} color="#10B981" />
                <Text style={styles.featureItemText}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionSection}>
          <View style={styles.quantityRow}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.counterControl}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setQuantity((p) => (p > 1 ? p - 1 : 1))}
                activeOpacity={0.7}
              >
                <Feather name="minus" size={16} color="#0F172A" />
              </TouchableOpacity>
              <Text style={styles.quantityValue}>{quantity}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setQuantity((p) => p + 1)}
                activeOpacity={0.7}
              >
                <Feather name="plus" size={16} color="#0F172A" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.85} onPress={() => router.push('/cart')}>
            <Feather name="shopping-cart" size={18} color="#FFFFFF" />
            <Text style={styles.addToCartText}>Add to Cart - N8,500</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, paddingTop: Platform.OS === 'ios' ? 56 : 36 },
  iconButton: { padding: 4 },
  headerTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: '#0F172A' },
  scrollContent: { paddingBottom: 40 },
  imageWrapper: { height: 240, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  pillIcon: { transform: [{ rotate: '-45deg' }] },
  detailsContainer: { paddingHorizontal: 20, paddingTop: 18 },
  productTitle: { fontFamily: FONT, fontSize: 24, fontWeight: '800', color: '#0F172A', marginBottom: 6 },
  ratingAndStockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingScore: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: '#0F172A' },
  ratingCount: { fontFamily: FONT, fontSize: 13, color: '#64748B' },
  stockBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stockText: { fontFamily: FONT, fontSize: 13, color: '#10B981', fontWeight: '600' },
  prescriptionNotice: { fontFamily: FONT, fontSize: 11, color: '#EF4444', fontStyle: 'italic', marginBottom: 8 },
  priceTag: { fontFamily: FONT, fontSize: 26, fontWeight: '800', color: '#0F172A', marginBottom: 16 },
  badgeRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  infoBadge: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12 },
  badgeLabel: { fontFamily: FONT, fontSize: 11, color: '#64748B' },
  badgeValue: { fontFamily: FONT, fontSize: 13, fontWeight: '700', color: '#0F172A' },
  sectionHeader: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#0F172A', marginBottom: 8, marginTop: 6 },
  descriptionText: { fontFamily: FONT, fontSize: 13, color: '#64748B', lineHeight: 20, marginBottom: 16 },
  featuresList: { gap: 10, marginBottom: 20 },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureItemText: { fontFamily: FONT, fontSize: 13, color: '#334155' },
  actionSection: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingHorizontal: 20, paddingTop: 16 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  quantityLabel: { fontFamily: FONT, fontSize: 14, fontWeight: '600', color: '#475569' },
  counterControl: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  counterButton: { width: 32, height: 32, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  quantityValue: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: '#0F172A' },
  addToCartBtn: { backgroundColor: '#0F172A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 12 },
  addToCartText: { fontFamily: FONT, color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
