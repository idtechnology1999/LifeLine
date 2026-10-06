import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router, useLocalSearchParams } from 'expo-router';

const { width } = Dimensions.get('window');

const DRIVER_DATA = {
  name: 'Michael Roberts',
  rating: 4.9,
  trips: 156,
  vehicle: 'AMB-2347',
  type: 'Basic Life Support',
  license: 'NY-5432',
};

export default function AmbulanceTrackingScreen() {
  const params = useLocalSearchParams();
  const pickup = (params.pickup as string) || '123 Main Street, New York, NY';
  const destination = (params.destination as string) || "St. Mary's Hospital";
  const emergencyType = (params.emergencyType as string) || 'Cardiac Emergency';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#DCEBFB', '#BFDCF7']}
        style={styles.mapArea}
      >
        <View style={styles.arrivedBadge}>
          <Ionicons name="checkmark" size={18} color="#fff" />
          <Text style={styles.arrivedText}>Ambulance Arrived</Text>
        </View>

        <View style={[styles.marker, styles.hospitalMarker]}>
          <MaterialCommunityIcons name="hospital-building" size={20} color="#fff" />
        </View>

        <View style={[styles.marker, styles.ambulanceMarker]}>
          <Text style={{ fontSize: 26 }}>🚑</Text>
          <View style={styles.markerTail} />
        </View>

        <View style={[styles.marker, styles.pickupMarker]}>
          <View style={styles.pickupDot} />
        </View>
      </LinearGradient>

      <View style={styles.sheet}>
        <View style={styles.grabber} />

        <View style={styles.driverCard}>
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={26} color="#3B82F6" />
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.driverName}>{DRIVER_DATA.name}</Text>
              <View style={styles.ratingRow}>
                <FontAwesome name="star" size={13} color="#F5A623" />
                <Text style={styles.ratingText}>
                  {DRIVER_DATA.rating} ({DRIVER_DATA.trips} trips)
                </Text>
              </View>
            </View>

            <AnimatedPressable style={styles.callBtn} onPress={() => {}}>
              <Ionicons name="call" size={18} color="#16A34A" />
            </AnimatedPressable>
            <AnimatedPressable style={styles.msgBtn} onPress={() => {}}>
              <Ionicons name="chatbubble" size={18} color="#3B82F6" />
            </AnimatedPressable>
          </View>

          <View style={styles.divider} />

          <View style={styles.statsRow}>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Vehicle</Text>
              <Text style={styles.statValue}>{DRIVER_DATA.vehicle}</Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>Type</Text>
              <Text style={[styles.statValue, { textAlign: 'center' }]}>
                {DRIVER_DATA.type}
              </Text>
            </View>
            <View style={styles.statCol}>
              <Text style={styles.statLabel}>License</Text>
              <Text style={styles.statValue}>{DRIVER_DATA.license}</Text>
            </View>
          </View>
        </View>

        <View style={styles.routeBlock}>
          <View style={styles.routeRow}>
            <View style={styles.dotBlue} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Pickup Location</Text>
              <Text style={styles.routeValue}>{pickup}</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeRow}>
            <View style={styles.dotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{destination}</Text>
            </View>
          </View>
        </View>

        <View style={styles.emergencyBox}>
          <Text style={styles.emergencyLabel}>Emergency Type</Text>
          <Text style={styles.emergencyValue}>{emergencyType}</Text>
        </View>

        <AnimatedPressable style={styles.shareBtn} onPress={() => {}}>
          <Ionicons name="navigate-outline" size={18} color="#0F172A" />
          <Text style={styles.shareText}>Share Live Location</Text>
        </AnimatedPressable>

        <AnimatedPressable style={styles.cancelBtn} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel Request</Text>
        </AnimatedPressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapArea: {
    height: 380,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    alignItems: 'center',
  },
  arrivedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22A559',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  arrivedText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 8,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalMarker: {
    top: 140,
    right: 60,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#22A559',
  },
  ambulanceMarker: {
    top: 190,
    left: 55,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E11D2E',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  markerTail: {
    position: 'absolute',
    bottom: -8,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#E11D2E',
  },
  pickupMarker: {
    top: 300,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563EB',
  },
  pickupDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  sheet: {
    flex: 1,
    marginTop: -24,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  grabber: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
    marginBottom: 18,
  },
  driverCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DCEBFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  ratingText: {
    marginLeft: 5,
    color: '#475569',
    fontSize: 13,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  msgBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  routeBlock: {
    marginTop: 20,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    marginTop: 5,
    marginRight: 12,
  },
  dotGreen: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22A559',
    marginTop: 5,
    marginRight: 12,
  },
  routeLine: {
    width: 1,
    height: 22,
    backgroundColor: '#CBD5E1',
    marginLeft: 4,
    marginVertical: 2,
  },
  routeLabel: {
    fontSize: 13,
    color: '#94A3B8',
  },
  routeValue: {
    fontSize: 16,
    color: '#0F172A',
    marginTop: 2,
  },
  emergencyBox: {
    marginTop: 18,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    padding: 16,
  },
  emergencyLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: 4,
  },
  emergencyValue: {
    fontSize: 15,
    color: '#B91C1C',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingVertical: 15,
    marginTop: 18,
  },
  shareText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '500',
  },
  cancelBtn: {
    backgroundColor: '#E11D2E',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 24,
  },
  cancelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
