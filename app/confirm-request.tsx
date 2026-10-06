import { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';

import { FONT } from '@/constants/typography';
const IS_IOS = Platform.OS === 'ios';

type AmbulanceTypeId = 'bls' | 'als' | 'erv';

const BASE_RATES: Record<AmbulanceTypeId, number> = {
  bls: 2500,
  als: 4200,
  erv: 3400,
};

const ambulanceLabels: Record<AmbulanceTypeId, string> = {
  bls: 'Basic Life Support (BLS)',
  als: 'Advanced Life Support (ALS)',
  erv: 'Emergency Response Vehicle',
};

function formatNaira(amount: number) {
  return `N${amount.toLocaleString('en-NG')}`;
}

export default function ConfirmRequestScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const severity = (params.severity as string) || '';
  const ambulanceType = (params.ambulanceType as string) as AmbulanceTypeId | undefined;
  const pickup = (params.pickup as string) || '';
  const destination = (params.destination as string) || '';
  const notes = (params.notes as string) || '';
  const otherDescription = (params.otherDescription as string) || '';

  let symptomLabels: string[] = [];
  try {
    const raw = params.symptomLabels as string;
    if (raw) symptomLabels = JSON.parse(raw);
  } catch {}

  const emergencyType = useMemo(() => {
    if (symptomLabels.length > 0) return symptomLabels.join(', ');
    if (severity === 'red') return 'Immediate Emergency';
    if (severity === 'yellow') return 'Serious but Stable';
    if (severity === 'green') return 'Minor Emergency';
    if (severity === 'black') return 'Deceased / Expectant';
    return 'General Emergency';
  }, [symptomLabels, severity]);

  const estimatedPrice = useMemo(() => {
    return BASE_RATES[ambulanceType ?? 'bls'];
  }, [ambulanceType]);

  const handleContinue = useCallback(() => {
    router.push({
      pathname: '/dispatch-status',
      params: { ...params, pickup, destination, estimatedPrice: String(estimatedPrice) },
    });
  }, [params, pickup, destination, estimatedPrice]);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <BlurView intensity={IS_IOS ? 40 : 60} tint="light" style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#1C1C1E" />
          </AnimatedPressable>
          <Text style={styles.title}>Confirm Request</Text>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#E8F0FE' }]}>
              <Ionicons name="document-text" size={16} color={colors.accentBlue} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Trip Summary</Text>
              <Text style={styles.sectionDesc}>Review your request details</Text>
            </View>
          </View>

          <View style={styles.summaryCard}>
            <SummaryRow label="Emergency" value={emergencyType} bold />
            {otherDescription ? (
              <>
                <View style={styles.summaryDivider} />
                <SummaryRow label="Other Details" value={otherDescription} multiline />
              </>
            ) : null}
            <View style={styles.summaryDivider} />
            <SummaryRow label="Pickup" value={pickup || '\u2014'} />
            <View style={styles.summaryDivider} />
            <SummaryRow label="Destination" value={destination || '\u2014'} isLast />
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#E4F7EA' }]}>
              <Ionicons name="medkit" size={16} color="#1D8A4A" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Ambulance Type</Text>
              <Text style={styles.sectionDesc}>{ambulanceLabels[ambulanceType ?? 'bls']}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#FEF8E7' }]}>
              <Ionicons name="cash" size={16} color="#B8860B" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Estimated Price</Text>
              <Text style={styles.sectionDesc}>System-generated estimate</Text>
            </View>
          </View>

          <View style={styles.priceCard}>
            <Text style={styles.priceValue}>{formatNaira(estimatedPrice)}</Text>
            <Text style={styles.priceSub}>Final price will be negotiated with driver</Text>
          </View>

          <View style={styles.noteCard}>
            <View style={styles.noteIconWrap}>
              <Ionicons name="information-circle" size={18} color="#8B6914" />
            </View>
            <Text style={styles.noteText}>
              You'll have the opportunity to negotiate the final price with the ambulance driver
              before confirming.
            </Text>
          </View>
        </View>

        {notes ? (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View style={[styles.sectionIconWrap, { backgroundColor: '#F0F0F0' }]}>
                  <Ionicons name="document-text-outline" size={16} color="#8E8E93" />
                </View>
                <View>
                  <Text style={styles.sectionTitle}>Additional Notes</Text>
                  <Text style={styles.sectionDesc}>{notes}</Text>
                </View>
              </View>
            </View>
          </>
        ) : null}
      </ScrollView>

      <BlurView intensity={IS_IOS ? 50 : 80} tint="light" style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
        <AnimatedPressable
          onPress={handleContinue}
          style={styles.continueBtn}
        >
          <LinearGradient
            colors={['#0D1B2A', '#1B2D45']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.continueGradient}
          >
            <Text style={styles.continueText}>Dispatch Ambulance</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </AnimatedPressable>
      </BlurView>
    </View>
  );
}

function SummaryRow({ label, value, bold, multiline, isLast }: { label: string; value: string; bold?: boolean; multiline?: boolean; isLast?: boolean }) {
  return (
    <View style={[styles.summaryRow, isLast && styles.summaryRowLast]}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={[styles.summaryValue, bold && styles.summaryValueBold]} numberOfLines={multiline ? undefined : 1}>{value}</Text>
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
  section: {
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  summaryRow: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabel: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  summaryValue: {
    fontFamily: FONT,
    fontSize: 16,
    color: '#1C1C1E',
  },
  summaryValueBold: {
    fontWeight: '700',
    fontSize: 17,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginHorizontal: 16,
  },
  priceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: { elevation: 1 },
    }),
  },
  priceValue: {
    fontFamily: FONT,
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#1C1C1E',
  },
  priceSub: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#8E8E93',
    marginTop: 6,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#FEF8E7',
    borderWidth: 1,
    borderColor: '#F0D97A',
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
  },
  noteIconWrap: {
    marginTop: 2,
  },
  noteText: {
    fontFamily: FONT,
    fontSize: 13,
    lineHeight: 19,
    color: '#8B6914',
    flex: 1,
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
