import { useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Linking,
  LayoutAnimation,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { colors } from '../src/theme/colors';


import { FONT } from '@/constants/typography';
const IS_IOS = Platform.OS === 'ios';

type Severity = 'red' | 'yellow' | 'green' | 'black';
type AmbulanceTypeId = 'bls' | 'als' | 'erv';

type SymptomOption = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type TierConfig = {
  key: Severity;
  title: string;
  status: string;
  color: string;
  bg: string;
  border: string;
  icon: keyof typeof Ionicons.glyphMap;
  options: SymptomOption[];
};

const TIERS: TierConfig[] = [
  {
    key: 'red',
    title: 'Immediate',
    status: 'Life-threatening — care needed within minutes',
    color: '#D92B20',
    bg: '#FDECEC',
    border: '#F6C6C2',
    icon: 'alert-circle',
    options: [
      { id: 'breathing', label: 'Severe Breathing Difficulty', icon: 'body-outline' },
      { id: 'bleeding_major', label: 'Uncontrolled Major Bleeding', icon: 'water-outline' },
      { id: 'unresponsive', label: 'Unconscious / Unresponsive', icon: 'moon-outline' },
      { id: 'head_trauma', label: 'Severe Head Trauma / Shock', icon: 'alert-circle-outline' },
      { id: 'cardiac_arrest', label: 'Cardiac Arrest', icon: 'heart-outline' },
      { id: 'snake_bite', label: 'Snake Bite', icon: 'warning-outline' },
      { id: 'fire', label: 'Fire Accident', icon: 'flame-outline' },
      { id: 'stroke', label: 'Stroke', icon: 'flash-outline' },
      { id: 'allergic', label: 'Severe Allergic Reaction', icon: 'medical-outline' },
      { id: 'labor', label: 'Obstetric Emergency (Labor)', icon: 'woman-outline' },
      { id: 'accident', label: 'Accident Victim', icon: 'car-outline' },
      { id: 'burns_severe', label: 'Severe Burns', icon: 'flame-outline' },
      { id: 'bleeding_internal', label: 'Internal Bleeding', icon: 'water-outline' },
      { id: 'spinal', label: 'Major Spinal Injury', icon: 'body-outline' },
      { id: 'shock', label: 'Hypovolemic / Septic Shock', icon: 'thermometer-outline' },
      { id: 'seizures', label: 'Prolonged Seizures', icon: 'flash-outline' },
      { id: 'heart_failure', label: 'Heart Failure', icon: 'heart-outline' },
      { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    key: 'yellow',
    title: 'Delayed',
    status: 'Serious but stable — re-evaluated every 30–60 min',
    color: '#B8860B',
    bg: '#FEF8E7',
    border: '#F5E6A3',
    icon: 'time',
    options: [
      { id: 'fracture', label: 'Large Bone Fracture', icon: 'body-outline' },
      { id: 'deep_cut', label: 'Deep Cut (Needs Stitches)', icon: 'bandage-outline' },
      { id: 'burns_controlled', label: 'Controlled Burns', icon: 'flame-outline' },
      { id: 'chest_pain_stable', label: 'Stable Chest Pain', icon: 'heart-outline' },
      { id: 'burns_moderate', label: 'Moderate to Severe Burns', icon: 'flame-outline' },
      { id: 'altered_mental', label: 'Altered Mental Status', icon: 'help-circle-outline' },
      { id: 'abdominal_pain', label: 'Severe Abdominal Pain', icon: 'body-outline' },
      { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    key: 'green',
    title: 'Minor',
    status: 'Non-urgent — care can wait a few hours',
    color: '#1D8A4A',
    bg: '#E4F7EA',
    border: '#BEEBCF',
    icon: 'walk',
    options: [
      { id: 'minor_cuts', label: 'Minor Cuts & Lacerations', icon: 'bandage-outline' },
      { id: 'sprain', label: 'Minor Sprain / Strain', icon: 'walk-outline' },
      { id: 'minor_burns', label: 'Minor Burns', icon: 'flame-outline' },
      { id: 'bruises', label: 'Abrasions & Bruises', icon: 'bandage-outline' },
      { id: 'mild_symptoms', label: 'Mild Symptoms (Headache, Joint Pain)', icon: 'happy-outline' },
      { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  },
  {
    key: 'black',
    title: 'Deceased / Expectant',
    status: 'Beyond medical help — no vital signs',
    color: '#1A1A1A',
    bg: '#F0F0F0',
    border: '#D0D0D0',
    icon: 'heart-dislike',
    options: [
      { id: 'no_pulse', label: 'No Pulse / No Breathing', icon: 'heart-dislike-outline' },
      { id: 'rigor_mortis', label: 'Rigor Mortis Present', icon: 'body-outline' },
      { id: 'decapitation', label: 'Massive Trauma / Decapitation', icon: 'warning-outline' },
      { id: 'decomposition', label: 'Decomposition', icon: 'alert-circle-outline' },
      { id: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
    ],
  },
];

const AMBULANCE_TYPES: {
  id: AmbulanceTypeId;
  title: string;
  subtitle: string;
  recommendedFor: Severity[];
}[] = [
  { id: 'als', title: 'Advanced Life Support (ALS)', subtitle: 'Advanced medical care en route', recommendedFor: ['red'] },
  { id: 'erv', title: 'Emergency Response Vehicle', subtitle: 'Rapid response unit', recommendedFor: ['red'] },
  { id: 'bls', title: 'Basic Life Support (BLS)', subtitle: 'Standard emergency transport', recommendedFor: ['yellow', 'green', 'black'] },
];

export default function RequestAmbulanceScreen() {
  const insets = useSafeAreaInsets();
  const [selectedTier, setSelectedTier] = useState<Severity | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [description, setDescription] = useState('');
  const [ambulanceType, setAmbulanceType] = useState<AmbulanceTypeId | null>(null);
  const [otherDescriptions, setOtherDescriptions] = useState<Record<string, string>>({});
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const hasOtherSelected = selectedTier ? selectedSymptoms.has('other') : false;
  const otherText = selectedTier ? otherDescriptions[selectedTier] || '' : '';
  const canContinue = Boolean(
    selectedTier && (selectedSymptoms.size > 0 || description.trim().length > 0) && ambulanceType &&
    (!hasOtherSelected || otherText.trim().length > 0)
  );

  const handleSelectTier = useCallback((tier: Severity) => {
    LayoutAnimation.configureNext({
      duration: 350,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'spring', springDamping: 0.8 },
    });
    setSelectedTier((prev) => (prev === tier ? null : tier));
    setSelectedSymptoms(new Set());
    setOtherDescriptions({});
    const recommended = AMBULANCE_TYPES.find((a) => a.recommendedFor.includes(tier));
    if (recommended) setAmbulanceType(recommended.id);
  }, []);

  const toggleSymptom = useCallback((id: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleContinue = useCallback(() => {
    if (!canContinue) return;
    const symptomLabels = TIERS.find((t) => t.key === selectedTier)?.options
      .filter((o) => selectedSymptoms.has(o.id))
      .map((o) => o.label) ?? [];
    router.push({
      pathname: '/pickup-destination',
      params: {
        severity: selectedTier ?? '',
        ambulanceType: ambulanceType ?? '',
        symptomLabels: JSON.stringify(symptomLabels),
        otherDescription: otherText,
        notes: description,
      },
    });
  }, [canContinue, selectedTier, selectedSymptoms, ambulanceType, otherText, description]);

  const handleCallEmergency = useCallback(() => {
    Linking.openURL('tel:112');
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <BlurView intensity={IS_IOS ? 40 : 60} tint="light" style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <View style={styles.headerRow}>
          <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color={colors.black} />
          </AnimatedPressable>
          <View style={styles.headerTitleGroup}>
            <Text style={styles.title}>Request Ambulance</Text>
            <Text style={styles.subtitle}>Every second counts</Text>
          </View>
        </View>
      </BlurView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionIconWrap}>
              <Ionicons name="heart-half" size={16} color="#D92B20" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Triage Assessment</Text>
              <Text style={styles.sectionDesc}>Select the closest match — our team will assess further</Text>
            </View>
          </View>
        </View>

        <View style={styles.tierList}>
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.key;
            return (
              <View key={tier.key} style={styles.tierWrap}>
                <AnimatedPressable
                  onPress={() => handleSelectTier(tier.key)}
                  style={[
                    styles.tierCard,
                    { borderColor: isSelected ? tier.color : tier.border },
                    isSelected && { backgroundColor: tier.bg },
                  ]}
                >
                  <View style={[styles.tierBadge, { backgroundColor: tier.color }]}>
                    <Ionicons name={tier.icon} size={18} color="#FFFFFF" />
                  </View>
                  <View style={styles.tierTextBlock}>
                    <Text style={[styles.tierTitle, { color: tier.color }]}>{tier.title}</Text>
                    <Text style={styles.tierStatus} numberOfLines={2}>{tier.status}</Text>
                  </View>
                  <View style={[styles.tierChevron, isSelected && { backgroundColor: tier.color + '20' }]}>
                    <Ionicons
                      name={isSelected ? 'chevron-up' : 'chevron-down'}
                      size={16}
                      color={tier.color}
                    />
                  </View>
                </AnimatedPressable>

                {tier.key === 'red' && !isSelected && (
                  <View style={styles.redHint}>
                    <Ionicons name="information-circle" size={14} color="#B8271F" />
                    <Text style={styles.redHintText}>No pulse or not breathing? Select this tier.</Text>
                  </View>
                )}

                {tier.key === 'red' && isSelected && (
                  <View style={styles.redAlert}>
                    <Ionicons name="information-circle" size={16} color="#FFFFFF" />
                    <Text style={styles.redAlertText}>
                      If the person has no pulse or is not breathing, dispatch will assess further on arrival.
                    </Text>
                  </View>
                )}

                {isSelected && (
                  <View style={styles.symptomSection}>
                    <Text style={styles.symptomSectionLabel}>Select symptoms</Text>
                    <View style={styles.symptomGrid}>
                      {tier.options.map((opt) => {
                        const active = selectedSymptoms.has(opt.id);
                        return (
                          <AnimatedPressable
                            key={opt.id}
                            onPress={() => toggleSymptom(opt.id)}
                            style={[
                              styles.symptomChip,
                              active
                                ? { backgroundColor: tier.color, borderColor: tier.color }
                                : { backgroundColor: '#FFFFFF', borderColor: colors.border },
                            ]}
                          >
                            <Ionicons
                              name={opt.icon}
                              size={14}
                              color={active ? '#FFFFFF' : tier.color}
                            />
                            <Text style={[
                              styles.symptomLabel,
                              { color: active ? '#FFFFFF' : '#1C1C1E' },
                            ]}>
                              {opt.label}
                            </Text>
                          </AnimatedPressable>
                        );
                      })}
                    </View>
                    {selectedSymptoms.has('other') && (
                      <View style={[styles.otherWrap, { borderLeftColor: tier.color }]}>
                        <TextInput
                          value={otherDescriptions[tier.key] || ''}
                          onChangeText={(text) =>
                            setOtherDescriptions((prev) => ({ ...prev, [tier.key]: text }))
                          }
                          placeholder="Describe the emergency..."
                          placeholderTextColor="#8E8E93"
                          multiline
                          textAlignVertical="top"
                          style={styles.otherInput}
                          onFocus={() => setFocusedInput('other')}
                          onBlur={() => setFocusedInput(null)}
                        />
                      </View>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={[styles.sectionIconWrap, { backgroundColor: '#EAF1FE' }]}>
              <Ionicons name="document-text" size={16} color={colors.accentBlue} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Additional Notes</Text>
              <Text style={styles.sectionDesc}>Anything else we should know?</Text>
            </View>
          </View>
          <View style={[styles.inputWrap, focusedInput === 'notes' && styles.inputWrapFocused]}>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Write here..."
              placeholderTextColor="#8E8E93"
              multiline
              textAlignVertical="top"
              style={styles.textArea}
              onFocus={() => setFocusedInput('notes')}
              onBlur={() => setFocusedInput(null)}
            />
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
              <Text style={styles.sectionDesc}>Select the appropriate response unit</Text>
            </View>
          </View>

          {AMBULANCE_TYPES.map((type) => {
            const active = ambulanceType === type.id;
            const recommended = selectedTier ? type.recommendedFor.includes(selectedTier) : false;
            return (
              <AnimatedPressable
                key={type.id}
                onPress={() => setAmbulanceType(type.id)}
                style={[styles.ambulanceCard, active && styles.ambulanceCardActive]}
              >
                <View style={styles.ambulanceCardLeft}>
                  <View style={[styles.ambulanceRadio, active && styles.ambulanceRadioActive]}>
                    {active && <View style={styles.ambulanceRadioDot} />}
                  </View>
                </View>
                <View style={styles.ambulanceCardBody}>
                  <View style={styles.ambulanceCardTop}>
                    <Text style={[styles.ambulanceTitle, active && { color: colors.accentBlue }]}>
                      {type.title}
                    </Text>
                    {recommended && (
                      <View style={[styles.recommendedBadge, active && { backgroundColor: colors.accentBlue }]}>
                        <Text style={styles.recommendedText}>Best match</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.ambulanceSubtitle}>{type.subtitle}</Text>
                </View>
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
            <Text style={styles.continueText}>Continue</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </AnimatedPressable>

        <View style={styles.emergencyHint}>
          <View style={styles.emergencyHintTop}>
            <View style={styles.emergencyDot} />
            <Text style={styles.emergencyHintTitle}>Life-threatening emergency?</Text>
          </View>
          <Text style={styles.emergencyHintBody}>
            Call 112 immediately if this is a life-threatening situation.
          </Text>
          <AnimatedPressable onPress={handleCallEmergency} style={styles.callBtn}>
            <Ionicons name="call" size={15} color="#FFFFFF" />
            <Text style={styles.callBtnText}>Call 112</Text>
          </AnimatedPressable>
        </View>
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
  headerTitleGroup: {
    flex: 1,
  },
  title: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: '#1C1C1E',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 2,
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
    backgroundColor: '#FDECEC',
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
  tierList: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  tierWrap: {
    marginBottom: 10,
  },
  tierCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
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
  tierBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  tierTextBlock: {
    flex: 1,
  },
  tierTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  tierStatus: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 2,
    lineHeight: 16,
  },
  tierChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  redHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    marginHorizontal: 4,
  },
  redHintText: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#B8271F',
    flex: 1,
  },
  redAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#D92B20',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  redAlertText: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '500',
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 17,
  },
  symptomSection: {
    marginTop: 14,
    paddingLeft: 4,
  },
  symptomSectionLabel: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  symptomGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  symptomLabel: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '500',
  },
  otherWrap: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    marginTop: 12,
  },
  otherInput: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#1C1C1E',
    minHeight: 56,
    padding: 0,
  },
  inputWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
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
  inputWrapFocused: {
    borderColor: colors.accentBlue,
    borderWidth: 1.5,
  },
  textArea: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#1C1C1E',
    minHeight: 90,
    padding: 14,
  },
  ambulanceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
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
  ambulanceCardActive: {
    borderColor: colors.accentBlue,
    backgroundColor: '#F8FAFF',
  },
  ambulanceCardLeft: {
    marginRight: 14,
  },
  ambulanceRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#C7C7CC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ambulanceRadioActive: {
    borderColor: colors.accentBlue,
  },
  ambulanceRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentBlue,
  },
  ambulanceCardBody: {
    flex: 1,
  },
  ambulanceCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ambulanceTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: '#1C1C1E',
  },
  ambulanceSubtitle: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '400',
    color: '#8E8E93',
    marginTop: 3,
  },
  recommendedBadge: {
    backgroundColor: '#EAF1FE',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  recommendedText: {
    fontFamily: FONT,
    fontSize: 11,
    fontWeight: '700',
    color: colors.accentBlue,
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
    marginBottom: 12,
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
  emergencyHint: {
    backgroundColor: '#FDECEC',
    borderWidth: 1,
    borderColor: '#F6C6C2',
    borderRadius: 14,
    padding: 14,
  },
  emergencyHintTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emergencyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D92B20',
  },
  emergencyHintTitle: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#D92B20',
  },
  emergencyHintBody: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#B8271F',
    marginTop: 4,
    lineHeight: 17,
    marginLeft: 16,
  },
  callBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#D92B20',
    borderRadius: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  callBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
