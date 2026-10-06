import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT } from '@/constants/typography';

type OrderType = 'ambulance' | 'supplies';
type OrderStatus = 'completed' | 'in-progress' | 'delivered' | 'cancelled';

interface Order {
  id: string;
  type: OrderType;
  title: string;
  date: string;
  amount: string;
  status: OrderStatus;
}

const MOCK_ORDERS: Order[] = [
  { id: '1', type: 'ambulance', title: 'Ambulance Service', date: 'Jan 15, 2026', amount: 'N4,700', status: 'completed' },
  { id: '2', type: 'supplies', title: 'Medical Supplies Order', date: 'Jan 12, 2026', amount: 'N13,300', status: 'delivered' },
  { id: '3', type: 'ambulance', title: 'Emergency Transport', date: 'Dec 28, 2025', amount: 'N3,500', status: 'completed' },
  { id: '4', type: 'supplies', title: 'First Aid Kit + Thermometer', date: 'Dec 20, 2025', amount: 'N7,650', status: 'delivered' },
];

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  'completed': { bg: '#DCFCE7', text: '#16A34A' },
  'in-progress': { bg: '#FEF3C7', text: '#D97706' },
  'delivered': { bg: '#DBEAFE', text: '#2563EB' },
  'cancelled': { bg: '#FEE2E2', text: '#DC2626' },
};

export default function OrderScreen() {
  const insets = useSafeAreaInsets();

  const renderOrder = ({ item }: { item: Order }) => {
    const statusStyle = STATUS_COLORS[item.status];
    return (
      <TouchableOpacity style={styles.orderCard} activeOpacity={0.7}>
        <View style={styles.orderTop}>
          <View style={[styles.orderIcon, item.type === 'ambulance' ? styles.iconAmbulance : styles.iconSupplies]}>
            <Ionicons name={item.type === 'ambulance' ? 'medkit' : 'cube'} size={18} color={item.type === 'ambulance' ? '#D92B20' : '#2563EB'} />
          </View>
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>{item.title}</Text>
            <Text style={styles.orderDate}>{item.date}</Text>
          </View>
          <View style={styles.orderRight}>
            <Text style={styles.orderAmount}>{item.amount}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
              <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.headerTitle}>Orders</Text>
      <Text style={styles.headerSubtitle}>Your ambulance and supply orders</Text>

      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA', paddingHorizontal: 20 },
  headerTitle: { fontFamily: FONT, fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 4 },
  headerSubtitle: { fontFamily: FONT, fontSize: 14, color: '#8E8E93', marginBottom: 20 },
  listContent: { paddingBottom: 40 },
  orderCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(0,0,0,0.06)', ...Platform.select({ ios: { shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }, android: { elevation: 1 } }) },
  orderTop: { flexDirection: 'row', alignItems: 'center' },
  orderIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  iconAmbulance: { backgroundColor: '#FDECEC' },
  iconSupplies: { backgroundColor: '#EAF1FE' },
  orderInfo: { flex: 1 },
  orderTitle: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  orderDate: { fontFamily: FONT, fontSize: 12, color: '#8E8E93', marginTop: 2 },
  orderRight: { alignItems: 'flex-end', gap: 6 },
  orderAmount: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontFamily: FONT, fontSize: 11, fontWeight: '600' },
});
