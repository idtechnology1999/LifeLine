import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FONT } from '@/constants/typography';

export default function OrderAmbulanceTrackingScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <View style={[styles.enRouteBadge, { top: insets.top + 12 }]}>
          <Text style={styles.enRouteText}>🚑 En Route to You</Text>
        </View>

        <View style={styles.hospitalPin}>
          <FontAwesome5 name="hospital-alt" size={14} color="#FFFFFF" />
        </View>

        <View style={styles.ambulancePin}>
          <MaterialCommunityIcons name="ambulance" size={20} color="#FFFFFF" />
        </View>

        <View style={styles.userLocationPin}>
          <View style={styles.innerDot} />
        </View>

        <View style={styles.etaCallout}>
          <Feather name="clock" size={16} color="#2563EB" />
          <View>
            <Text style={styles.etaSubtext}>Estimated Arrival</Text>
            <Text style={styles.etaTime}>4 min</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <View style={styles.dragHandle} />

        <View style={styles.driverCard}>
          <View style={styles.driverHeader}>
            <View style={styles.driverAvatar}>
              <Ionicons name="person" size={24} color="#3B82F6" />
            </View>
            <View style={styles.driverMeta}>
              <Text style={styles.driverName}>Michael Roberts</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#F59E0B" />
                <Text style={styles.ratingText}>4.9 (156 trips)</Text>
              </View>
            </View>
            <View style={styles.driverActions}>
              <AnimatedPressable style={styles.callButton}>
                <Ionicons name="call" size={18} color="#10B981" />
              </AnimatedPressable>
              <AnimatedPressable style={styles.chatButton}>
                <Ionicons name="chatbubble-ellipses" size={18} color="#3B82F6" />
              </AnimatedPressable>
            </View>
          </View>

          <View style={styles.specsRow}>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Vehicle</Text>
              <Text style={styles.specValue}>AMB-2347</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>Type</Text>
              <Text style={styles.specValue}>Basic Life Support</Text>
            </View>
            <View style={styles.specItem}>
              <Text style={styles.specLabel}>License</Text>
              <Text style={styles.specValue}>NY-5432</Text>
            </View>
          </View>
        </View>

        <View style={styles.routeContainer}>
          <View style={styles.timelineRow}>
            <View style={[styles.timelineNode, { backgroundColor: '#2563EB' }]} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.nodeLabel}>Pickup Location</Text>
              <Text style={styles.nodeValue}>123 Main Street, New York, NY</Text>
            </View>
          </View>
          <View style={styles.timelineConnector} />
          <View style={styles.timelineRow}>
            <View style={[styles.timelineNode, { backgroundColor: '#10B981' }]} />
            <View style={styles.timelineTextGroup}>
              <Text style={styles.nodeLabel}>Destination</Text>
              <Text style={styles.nodeValue}>St. Mary's Hospital</Text>
            </View>
          </View>
        </View>

        <View style={styles.emergencyBanner}>
          <Text style={styles.emergencyLabel}>Emergency Type</Text>
          <Text style={styles.emergencyValue}>Cardiac Emergency</Text>
        </View>

        <AnimatedPressable style={styles.shareBtn}>
          <Feather name="send" size={16} color="#0F172A" />
          <Text style={styles.shareBtnText}>Share Live Location</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E0F2FE' },
  mapContainer: { flex: 1, backgroundColor: '#DDEEFE', position: 'relative' },
  enRouteBadge: { position: 'absolute', alignSelf: 'center', backgroundColor: '#2563EB', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  enRouteText: { fontFamily: FONT, color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  hospitalPin: { position: 'absolute', top: 100, right: 80, width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', alignItems: 'center', justifyContent: 'center' },
  ambulancePin: { position: 'absolute', top: 140, left: '42%', width: 44, height: 44, borderRadius: 22, backgroundColor: '#EF4444', alignItems: 'center', justifyContent: 'center' },
  userLocationPin: { position: 'absolute', top: 200, left: 80, width: 32, height: 32, borderRadius: 16, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
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
  routeContainer: { marginBottom: 14, paddingHorizontal: 4 },
  timelineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  timelineNode: { width: 10, height: 10, borderRadius: 5 },
  timelineConnector: { width: 2, height: 16, backgroundColor: '#E2E8F0', marginLeft: 4, marginVertical: 2 },
  timelineTextGroup: { flex: 1 },
  nodeLabel: { fontFamily: FONT, fontSize: 11, color: '#64748B' },
  nodeValue: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#0F172A' },
  emergencyBanner: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 12, padding: 12, marginBottom: 12 },
  emergencyLabel: { fontFamily: FONT, fontSize: 12, fontWeight: '700', color: '#991B1B', marginBottom: 2 },
  emergencyValue: { fontFamily: FONT, fontSize: 13, color: '#B91C1C', fontWeight: '500' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingVertical: 12 },
  shareBtnText: { fontFamily: FONT, fontSize: 13, fontWeight: '600', color: '#0F172A' },
});
