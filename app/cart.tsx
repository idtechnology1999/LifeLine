import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT } from '@/constants/typography';

interface CartItem {
  id: string;
  name: string;
  price: string;
  quantity: number;
  iconName: string;
  iconType: 'font-awesome' | 'material';
  showPrescriptionAction?: boolean;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { id: '1', name: 'Blood Pressure Monitor', price: 'N8,500', quantity: 1, iconName: 'stethoscope', iconType: 'font-awesome' },
    { id: '2', name: 'Lisinopril', price: 'N12,500', quantity: 2, iconName: 'pill', iconType: 'material', showPrescriptionAction: true },
  ]);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return { ...item, quantity: newQty > 1 ? newQty : 1 };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerRow}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </AnimatedPressable>
        <View>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>{cartItems.length} items</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.itemsList}>
          {cartItems.map((item) => (
            <View key={item.id} style={styles.cartCard}>
              <View style={styles.cartItemTop}>
                <View style={styles.imageThumbnail}>
                  {item.iconType === 'font-awesome' ? (
                    <FontAwesome5 name={item.iconName as any} size={28} color="#64748B" />
                  ) : (
                    <MaterialCommunityIcons name={item.iconName as any} size={32} color="#EF4444" />
                  )}
                </View>
                <View style={styles.itemInfo}>
                  <View style={styles.itemNameRow}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.showPrescriptionAction && (
                      <AnimatedPressable>
                        <Text style={styles.addPrescriptionText}>Add Prescription</Text>
                      </AnimatedPressable>
                    )}
                  </View>
                  <Text style={styles.itemPrice}>{item.price}</Text>
                  <View style={styles.itemActionsRow}>
                    <View style={styles.counterControl}>
                      <AnimatedPressable style={styles.counterButton} onPress={() => updateQuantity(item.id, -1)}>
                        <Feather name="minus" size={14} color="#475569" />
                      </AnimatedPressable>
                      <Text style={styles.quantityValue}>{item.quantity}</Text>
                      <AnimatedPressable style={styles.counterButton} onPress={() => updateQuantity(item.id, 1)}>
                        <Feather name="plus" size={14} color="#475569" />
                      </AnimatedPressable>
                    </View>
                    <AnimatedPressable onPress={() => removeItem(item.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                      <Feather name="trash-2" size={18} color="#EF4444" />
                    </AnimatedPressable>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.sectionHeader}>Delivery Address</Text>
        <View style={styles.addressCard}>
          <View style={styles.addressLeft}>
            <Ionicons name="location-outline" size={20} color="#2563EB" />
            <View>
              <Text style={styles.addressTitle}>23, Allen junction street</Text>
              <Text style={styles.addressSubtitle}>Gbagada Lagos</Text>
            </View>
          </View>
          <AnimatedPressable>
            <Text style={styles.changeAddressText}>Change</Text>
          </AnimatedPressable>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>N11,500</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>N1,800</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>N13,300</Text>
          </View>
        </View>

        <AnimatedPressable style={styles.checkoutBtn} onPress={() => router.push('/order-secure-payment')}>
          <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
        </AnimatedPressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  headerSubtitle: { fontFamily: FONT, fontSize: 14, color: '#64748B' },
  scrollContent: { paddingBottom: 40 },
  itemsList: { gap: 12, marginBottom: 24 },
  cartCard: { backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 14 },
  cartItemTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  imageThumbnail: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#F8FAFC', alignItems: 'center', justifyContent: 'center' },
  itemInfo: { flex: 1 },
  itemNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  itemName: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: '#0F172A', flex: 1 },
  addPrescriptionText: { fontFamily: FONT, fontSize: 11, color: '#10B981', fontWeight: '600' },
  itemPrice: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  itemActionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  counterControl: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  counterButton: { width: 26, height: 26, borderRadius: 6, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  quantityValue: { fontFamily: FONT, fontSize: 13, fontWeight: '700', color: '#0F172A' },
  sectionHeader: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  addressCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFFFFF', marginBottom: 24 },
  addressLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  addressTitle: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#0F172A' },
  addressSubtitle: { fontFamily: FONT, fontSize: 12, color: '#64748B' },
  changeAddressText: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#2563EB' },
  summaryContainer: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 16, marginBottom: 16, gap: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryLabel: { fontFamily: FONT, fontSize: 14, color: '#64748B' },
  summaryValue: { fontFamily: FONT, fontSize: 14, fontWeight: '500', color: '#0F172A' },
  summaryDivider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: '#0F172A' },
  totalValue: { fontFamily: FONT, fontSize: 18, fontWeight: '800', color: '#0F172A' },
  checkoutBtn: { backgroundColor: '#0F172A', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 },
  checkoutBtnText: { fontFamily: FONT, color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
