import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FONT = Platform.select({ ios: 'System', default: 'System' });

export default function OrderDeliveryTrackingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={[styles.statusBadge, { top: insets.top + 12 }]}>
          <Feather name="package" size={14} color="#FFFFFF" />
          <Text style={styles.statusText}>📦 Out for Delivery</Text>
        </View>

        <View style={styles.warehousePin}>
          <MaterialCommunityIcons name="warehouse" size={16} color="#FFFFFF" />
        </View>

        <View style={styles.driverPin}>
          <MaterialCommunityIcons name="truck-delivery" size={18} color="#FFFFFF" />
        </View>

        <View style={styles.userPin}>
          <View style={styles.innerDot} />
        </View>

        <View style={styles.etaCallout}>
          <Feather name="clock" size={16} color="#2563EB" />
          <View>
            <Text style={styles.etaSubtext}>Estimated Delivery</Text>
            <Text style={styles.etaTime}>15 min</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />

        <View style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={24} color="#2563EB" />
            </View>
            <View style={styles.driverMeta}>
              <Text style={styles.driverName}>Emeka Delivery</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>4.8 (89 deliveries)</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
                <Ionicons name="call" size={18} color="#10B981" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatButton} activeOpacity={0.7}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#3B82F6" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Order</Text>
              <Text style={styles.specValue}>#ORD-2847</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Items</Text>
              <Text style={styles.specValue}>2 items</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Weight</Text>
              <Text style={styles.specValue}>1.2 kg</Text>
            </View>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.timelineRow}>
            <View style={[styles.timelineNode, { backgroundColor: '#2563EB' }]} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.nodeLabel}>Pickup</Text>
              <Text style={styles.nodeValue}>Lifeline Warehouse, Lagos</Text>
            </View>
          </View>
          <View style={styles.timelineConnector} />
          <View style={styles.timelineRow}>
            <View style={[styles.timelineNode, { backgroundColor: '#10B981' }]} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.nodeLabel}>Delivering to</Text>
              <Text style={styles.nodeValue}>23, Allen junction street, Gbagada</Text>
            </View>
          </View>
        </View>

        <View style={styles.itemsCard}>
          <Text style={styles.itemsTitle}>Order Items</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Blood Pressure Monitor</Text>
            <Text style={styles.itemQty}>x1</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemName}>Lisinopril</Text>
            <Text style={styles.itemQty}>x2</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.8}>
          <Feather name="send" size={16} color="#0F172A" />
          <Text style={styles.shareBtnText}>Share Live Location</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F2FE' },
  mapContainer: { flex: 1, backgroundColor: '#DDEEFE', position: 'relative' },
  statusBadge: { position: 'absolute', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  statusText: { fontFamily: FONT, color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  warehousePin: { position: 'absolute', top: 100, right: 80, width: 32, height: 32, borderRadius: 16, backgroundColor: '#64748B', alignItems: 'center', justifyContent: 'center' },
  driverPin: { position: 'absolute', top: 140, left: '42%', width: 44, height: 44, borderRadius: 22, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  userPin: { position: 'absolute', top: 200, left: 80, width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  innerDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFFFFF' },
  etaCallout: { position: 'absolute', bottom: 20, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 14, gap: 8, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  etaSubtext: { fontFamily: FONT, fontSize: 10, color: '#64748B' },
  etaTime: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#0F172A' },
  bottomSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  dragHandle: { width: 36, height: 4, backgroundColor: '#CBD5E1', borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  driverCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 14, marginBottom: 16 },
  driverHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  driverAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  driverMeta: { flex: 1 },
  driverName: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: '#0F172A' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  ratingText: { fontFamily: FONT, fontSize: 12, color: '#64748B' },
  driverActions: { flexDirection: 'row', gap: 8 },
  callButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center' },
  chatButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#DBEAFE', alignItems: 'center', justifyContent: 'center' },
  specsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 10 },
  specItem: { alignItems: 'center' },
  specLabel: { fontFamily: FONT, fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  specValue: { fontFamily: FONT, fontSize: 13, fontWeight: '700', color: '#0F172A' },
  routeContainer: { marginBottom: 16, paddingHorizontal: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timelineNode: { width: 10, height: 10, borderRadius: 5 },
  timelineConnector: { width: 2, height: 16, backgroundColor: '#E2E8F0', marginLeft: 4, marginVertical: 2 },
  timelineTextGroup: { flex: 1 },
  nodeLabel: { fontFamily: FONT, fontSize: 11, color: '#64748B' },
  nodeValue: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#0F172A' },
  itemsCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginBottom: 12 },
  itemsTitle: { fontFamily: FONT, fontSize: 13, fontWeight: '700', color: '#0F172A', marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  itemName: { fontFamily: FONT, fontSize: 13, color: '#475569' },
  itemQty: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#0F172A' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingVertical: 12 },
  shareBtnText: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#0F172A' },
});
