import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Easing,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';

import { FONT } from '@/constants/typography';

type DispatchState = 'searching' | 'matched';

type Driver = {
  name: string;
  vehicle: string;
  plate: string;
  phone: string;
  etaMinutes: number;
};

const MOCK_DRIVERS: Driver[] = [
  {
    name: 'Michael Adeyemi',
    vehicle: 'Toyota Hiace Ambulance',
    plate: 'LND 442 KJA',
    phone: '+15550199',
    etaMinutes: 6,
  },
  {
    name: 'Chinedu Okafor',
    vehicle: 'Mercedes Sprinter Ambulance',
    plate: 'LND 118 BQJ',
    phone: '+15550223',
    etaMinutes: 9,
  },
  {
    name: 'Sara Aliyu',
    vehicle: 'Ford Transit Ambulance',
    plate: 'LND 903 XZC',
    phone: '+15550711',
    etaMinutes: 12,
  },
];

const SEARCH_STEPS = ['Checking availability\u2026', 'Notifying nearby drivers\u2026'];

function SpinningRing() {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotation]);

  const spin = rotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]} />;
}

function SearchingView({ onCancel }: { onCancel: () => void }) {
  const insets = useSafeAreaInsets();
  const [visibleSteps, setVisibleSteps] = useState(1);

  useEffect(() => {
    if (visibleSteps >= SEARCH_STEPS.length) return;
    const timer = setTimeout(() => setVisibleSteps((n) => n + 1), 1200);
    return () => clearTimeout(timer);
  }, [visibleSteps]);

  return (
    <View style={styles.searchingRoot}>
      <StatusBar style="dark" />
      <View style={styles.searchingCenter}>
        <SpinningRing />
        <Text style={styles.searchingTitle}>Finding ambulance\u2026</Text>
        <Text style={styles.searchingSub}>Searching for nearby emergency vehicles</Text>

        <View style={styles.stepsList}>
          {SEARCH_STEPS.slice(0, visibleSteps).map((step) => (
            <View key={step} style={styles.stepRow}>
              <View style={styles.stepDot} />
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>

      <AnimatedPressable
        onPress={onCancel}
        style={[styles.searchingCancelBtn, { marginBottom: insets.bottom + 16 }]}
      >
        <Text style={styles.searchingCancelText}>Cancel Request</Text>
      </AnimatedPressable>
    </View>
  );
}

export default function DispatchStatusScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [state, setState] = useState<DispatchState>('searching');

  const pickup = (params.pickup as string) || 'Your location';
  const destination = (params.destination as string) || 'Nearest hospital';

  useEffect(() => {
    const timer = setTimeout(() => setState('matched'), 4200);
    return () => clearTimeout(timer);
  }, []);

  const handleCallDriver = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  const handleCancel = useCallback(() => {
    router.back();
  }, []);

  const handleConnect = useCallback(
    (driver: Driver) => {
      const estimate = Number(params.estimatedPrice) || 2500;
      router.push({
        pathname: '/price-negotiation',
        params: {
          systemEstimate: String(estimate),
          driverPrice: String(estimate + 800),
          driverName: driver.name,
          driverRating: '4.9',
          driverTrips: '156',
          driverPhone: driver.phone,
          vehicleCode: driver.plate,
          distanceMiles: '2.3 mi',
          etaMinutes: `${driver.etaMinutes} min`,
        },
      });
    },
    [params.estimatedPrice]
  );

  if (state === 'searching') {
    return <SearchingView onCancel={handleCancel} />;
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <View style={styles.mapArea}>
        <View style={styles.mapPlaceholder}>
          <Ionicons name="map-outline" size={40} color="rgba(255,255,255,0.5)" />
          <Text style={styles.mapPlaceholderText}>Live tracking</Text>
        </View>
      </View>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.matchedBadge}>
          <Ionicons name="checkmark-circle" size={16} color={colors.accentGreen} />
          <Text style={styles.matchedBadgeText}>Ambulance on the way</Text>
        </View>

        <View style={styles.driverList}>
          {MOCK_DRIVERS.map((driver) => (
            <View key={driver.plate} style={styles.driverRow}>
              <View style={styles.driverAvatar}>
                <Ionicons name="person" size={24} color={colors.accentBlue} />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{driver.name}</Text>
                <Text style={styles.driverVehicle}>
                  {driver.vehicle} · {driver.plate} · {driver.etaMinutes} min away
                </Text>
              </View>
              <AnimatedPressable onPress={() => handleCallDriver(driver.phone)} style={styles.callIconBtn}>
                <Ionicons name="call" size={16} color={colors.accentGreen} />
              </AnimatedPressable>
              <AnimatedPressable onPress={() => handleConnect(driver)} style={styles.connectPill}>
                <Text style={styles.connectPillText}>Connect</Text>
              </AnimatedPressable>
            </View>
          ))}
        </View>

        <View style={styles.routeCard}>
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: colors.accentBlue }]} />
            <Text style={styles.routeText} numberOfLines={1}>{pickup}</Text>
          </View>
          <View style={styles.routeLine} />
          <View style={styles.routeRow}>
            <View style={[styles.routeDot, { backgroundColor: '#D92B20' }]} />
            <Text style={styles.routeText} numberOfLines={1}>{destination}</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <AnimatedPressable onPress={handleCancel} style={styles.cancelBtnFull}>
            <Text style={styles.cancelTextFull}>Cancel Request</Text>
          </AnimatedPressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchingRoot: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  searchingCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  spinnerRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: colors.accentBlue,
    borderTopColor: 'transparent',
    marginBottom: 24,
  },
  searchingTitle: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#1C1C1E',
  },
  searchingSub: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 6,
  },
  stepsList: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.accentBlue,
  },
  stepText: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
  },
  searchingCancelBtn: {
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: '#D92B20',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
  },
  searchingCancelText: {
    fontFamily: FONT,
    color: '#D92B20',
    fontSize: 15,
    fontWeight: '700',
  },
  root: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  },
  mapArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  mapPlaceholderText: {
    fontFamily: FONT,
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  matchedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.infoBg,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 18,
  },
  matchedBadgeText: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '600',
    color: colors.accentGreen,
  },
  driverList: {
    gap: 12,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  driverVehicle: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 2,
  },
  callIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4F8EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  connectPill: {
    backgroundColor: '#0D1B2A',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  connectPillText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  routeCard: {
    marginTop: 20,
    marginBottom: 4,
    paddingLeft: 4,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  routeLine: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginLeft: 4.5,
  },
  routeText: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '500',
    color: '#1C1C1E',
    flexShrink: 1,
  },
  actionRow: {
    marginTop: 20,
  },
  cancelBtnFull: {
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelTextFull: {
    fontFamily: FONT,
    color: '#8E8E93',
    fontSize: 15,
    fontWeight: '600',
  },
});
