import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { colors } from '../src/theme/colors';

import { FONT } from '@/constants/typography';
const IS_IOS = Platform.OS === 'ios';

type Hospital = {
  id: string;
  name: string;
  distance: string;
};

const MOCK_HOSPITALS: Hospital[] = [
  { id: '1', name: "St. Mary's Hospital", distance: '2.3 mi away' },
  { id: '2', name: 'City General Hospital', distance: '3.1 mi away' },
  { id: '3', name: 'Memorial Medical Center', distance: '4.8 mi away' },
  { id: '4', name: 'Lifeline Urgent Care', distance: '1.2 mi away' },
];

export default function PickupDestinationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const [pickup, setPickup] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [locating, setLocating] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const [locationError, setLocationError] = useState<string | null>(null);

  const handleUseCurrentLocation = useCallback(async () => {
    try {
      setLocationError(null);
      setLocating(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. Please enable it in Settings.');
        return;
      }
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      if (place) {
        const parts = [place.streetNumber, place.street, place.district ?? place.city, place.region].filter(Boolean);
        setPickup(parts.join(', ') || 'Current location');
      }
    } catch (error) {
      console.error('Location error:', error);
      setLocationError('Unable to get your location. Please check that location services are enabled.');
    } finally {
      setLocating(false);
    }
  }, []);

  const handleSelectHospital = useCallback((hospital: Hospital) => {
    setSelectedHospital(hospital);
    setDestinationQuery(hospital.name);
  }, []);

  const canContinue = pickup.trim().length > 0 && (selectedHospital || destinationQuery.trim().length > 0);

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    router.push({
      pathname: '/confirm-request',
      params: {
        ...params,
        pickup,
        destination: selectedHospital?.name ?? destinationQuery,
      },
    });
  }, [canContinue, params, pickup, selectedHospital, destinationQuery]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <BlurView intensity={IS_IOS ? 40 : 60} tint="light" style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#1C1C1E" />
          </AnimatedPressable>
          <Text style={styles.title}>Set Location</Text>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#EAF1FE' }]}>
              <Ionicons name="location" size={16} color={colors.accentBlue} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Pickup Location</Text>
              <Text style={styles.sectionDesc}>Where should we pick up the patient?</Text>
            </View>
          </View>

          <View style={[styles.inputRow, focusedInput === 'pickup' && styles.inputRowFocused]}>
            <View style={styles.inputIcon}>
              <Ionicons name="location-outline" size={18} color={colors.accentBlue} />
            </View>
            <TextInput
              value={pickup}
              onChangeText={setPickup}
              placeholder="Enter pickup address"
              placeholderTextColor="#8E8E93"
              style={styles.inputField}
              onFocus={() => setFocusedInput('pickup')}
              onBlur={() => setFocusedInput(null)}
            />
            <AnimatedPressable onPress={handleUseCurrentLocation} style={styles.locateBtn} disabled={locating}>
              <Ionicons name="navigate" size={16} color="#FFFFFF" />
            </AnimatedPressable>
          </View>

          <AnimatedPressable onPress={handleUseCurrentLocation} hitSlop={8} style={styles.locationLink}>
            <Ionicons name="navigate-outline" size={14} color={colors.accentBlue} />
            <Text style={styles.locationLinkText}>
              {locating ? 'Locating\u2026' : 'Use current location'}
            </Text>
          </AnimatedPressable>
          {locationError ? (
            <Text style={styles.locationError}>{locationError}</Text>
          ) : null}
        </View>

        <View style={styles.divider} />

        <View style={styles.cardSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#FDECEC' }]}>
              <Ionicons name="medkit" size={16} color="#D92B20" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Destination</Text>
              <Text style={styles.sectionDesc}>Hospital or clinic to transport to</Text>
            </View>
          </View>

          <View style={[styles.inputRow, focusedInput === 'destination' && styles.inputRowFocused]}>
            <View style={styles.inputIcon}>
              <Ionicons name="search-outline" size={18} color="#D92B20" />
            </View>
            <TextInput
              value={destinationQuery}
              onChangeText={(text) => {
                setDestinationQuery(text);
                setSelectedHospital(null);
              }}
              placeholder="Search for hospital or clinic"
              placeholderTextColor="#8E8E93"
              style={styles.inputField}
              onFocus={() => setFocusedInput('destination')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <Text style={styles.nearbyLabel}>Nearby Hospitals</Text>
          {MOCK_HOSPITALS.map((hospital) => {
            const active = selectedHospital?.id === hospital.id;
            return (
              <AnimatedPressable
                key={hospital.id}
                onPress={() => handleSelectHospital(hospital)}
                style={[styles.hospitalCard, active && styles.hospitalCardActive]}
              >
                <View style={styles.hospitalCardLeft}>
                  <View style={[styles.hospitalIcon, active && styles.hospitalIconActive]}>
                    <Ionicons name="business" size={16} color={active ? '#FFFFFF' : colors.accentBlue} />
                  </View>
                  <View>
                    <Text style={styles.hospitalName}>{hospital.name}</Text>
                    <Text style={styles.hospitalDistance}>{hospital.distance}</Text>
                  </View>
                </View>
                {active && (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark-circle" size={22} color={colors.accentBlue} />
                  </View>
                )}
              </AnimatedPressable>
            );
          })}
        </View>
      </ScrollView>

      <BlurView intensity={IS_IOS ? 50 : 80} tint="light" style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <AnimatedPressable
          disabled={!canContinue}
          onPress={handleContinue}
          style={[styles.continueBtn, !canContinue && styles.continueBtnDisabled]}
        >
          <LinearGradient
            colors={canContinue ? ['#0D1B2A', '#1B2D45'] : ['#B9C0C9', '#B9C0C9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Request Ambulance</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </AnimatedPressable>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F5FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#1C1C1E',
  },
  scroll: {
    paddingBottom: 24,
  },
  cardSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: '#1C1C1E',
  },
  sectionDesc: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 20,
    marginTop: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    paddingLeft: 4,
    paddingRight: 6,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
      },
      android: { elevation: 1 },
    }),
  },
  inputRowFocused: {
    borderColor: colors.accentBlue,
    borderWidth: 1.5,
  },
  inputIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 15,
    color: '#1C1C1E',
    paddingVertical: 14,
  },
  locateBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 4,
  },
  locationLinkText: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentBlue,
  },
  locationError: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '400',
    color: '#D92B20',
    marginTop: 6,
  },
  nearbyLabel: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 20,
  },
  hospitalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.06)',
    padding: 14,
    marginBottom: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
      },
      android: { elevation: 1 },
    }),
  },
  hospitalCardActive: {
    backgroundColor: '#F8FAFF',
    borderColor: colors.accentBlue,
  },
  hospitalCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hospitalIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EAF1FE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hospitalIconActive: {
    backgroundColor: colors.accentBlue,
  },
  hospitalName: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  hospitalDistance: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 2,
  },
  checkCircle: {
    marginLeft: 8,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  continueBtn: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  continueBtnDisabled: {
    opacity: 0.7,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  continueText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
