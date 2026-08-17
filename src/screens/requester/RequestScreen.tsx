import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors } from '@/src/theme/colors';

const FONT = Platform.select({ ios: 'System', default: 'System' });

const ACTIVE_REQUEST = {
  id: '1',
  name: 'Emergency Ambulance Request',
  pickup: '123 Main Street, New York, NY',
  destination: "St. Mary's Hospital",
  emergencyType: 'Cardiac Emergency',
  status: 'In Progress',
};

export default function RequestScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top + 12 }]}>
      <Text style={styles.title}>Request</Text>

      <Text style={styles.sectionLabel}>Active Request</Text>

      <Pressable
        onPress={() =>
          router.push({
            pathname: '/ambulance-tracking',
            params: {
              pickup: ACTIVE_REQUEST.pickup,
              destination: ACTIVE_REQUEST.destination,
              emergencyType: ACTIVE_REQUEST.emergencyType,
            },
          })
        }
        style={({ pressed }) => [
          styles.requestCard,
          pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{ACTIVE_REQUEST.status}</Text>
        </View>

        <Text style={styles.requestName}>{ACTIVE_REQUEST.name}</Text>

        <View style={styles.routeRow}>
          <View style={styles.routeItem}>
            <View style={styles.dotBlue} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Pickup</Text>
              <Text style={styles.routeValue}>{ACTIVE_REQUEST.pickup}</Text>
            </View>
          </View>

          <View style={styles.routeLine} />

          <View style={styles.routeItem}>
            <View style={styles.dotGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.routeLabel}>Destination</Text>
              <Text style={styles.routeValue}>{ACTIVE_REQUEST.destination}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.viewLabel}>View Request</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.accentBlue} />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F5F7FA', paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1C1E', marginBottom: 20 },
  sectionLabel: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22A559',
    marginRight: 8,
  },
  statusText: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '600',
    color: '#22A559',
  },
  requestName: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 14,
  },
  routeRow: {
    gap: 8,
  },
  routeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dotBlue: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginTop: 5,
    marginRight: 10,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22A559',
    marginTop: 5,
    marginRight: 10,
  },
  routeLine: {
    width: 1,
    height: 14,
    backgroundColor: '#D1D5DB',
    marginLeft: 3,
    marginVertical: 2,
  },
  routeLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#8E8E93',
  },
  routeValue: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#1C1C1E',
    marginTop: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  viewLabel: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentBlue,
    marginRight: 4,
  },
});
