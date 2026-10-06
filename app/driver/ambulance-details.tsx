import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';
import { useWizardGuard } from '@/components/useWizardGuard';
import { scrollFieldIntoView } from '@/utils';

import { FONT } from '@/constants/typography';

const asString = (v: string | string[] | undefined, fallback = '') =>
  Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;

const parseArray = (v: string | string[] | undefined): string[] => {
  try {
    const parsed = JSON.parse(asString(v, '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

type AmbulanceType = 'bls' | 'als' | 'erv';

const AMBULANCE_TYPES: { id: AmbulanceType; title: string; subtitle: string }[] = [
  { id: 'bls', title: 'Basic Life Support (BLS)', subtitle: 'Standard emergency transport' },
  { id: 'als', title: 'Advanced Life Support (ALS)', subtitle: 'Advanced medical care en route' },
  { id: 'erv', title: 'Emergency Response Vehicle', subtitle: 'Rapid response unit' },
];

const EQUIPMENT_OPTIONS = [
  'Automated External Defibrillator (AED)',
  'Oxygen supply and masks',
  'Stretcher and spine board',
  'First aid kit',
  'Blood pressure monitor',
  'Emergency medications',
  'Pulse oximeter',
  'Splints and immobilization devices',
];

export default function AmbulanceDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.businessName));

  const [institution, setInstitution] = useState(asString(params.institution));
  const [ambulanceType, setAmbulanceType] = useState<AmbulanceType | null>(
    (params.ambulanceType as AmbulanceType) || null
  );
  const [vehicleRegNumber, setVehicleRegNumber] = useState(asString(params.vehicleRegNumber));
  const [count, setCount] = useState(asString(params.ambulanceCount, '1'));
  const [equipment, setEquipment] = useState<Set<string>>(() => new Set(parseArray(params.equipmentList)));
  const [images, setImages] = useState<string[]>(() => parseArray(params.imageUris));

  const vehicleRegNumberRef = useRef<TextInput>(null);
  const countRef = useRef<TextInput>(null);

  const toggleEquipment = (item: string) => {
    setEquipment((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleAddPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to add vehicle images.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const canContinue = Boolean(
    institution.trim() &&
    ambulanceType &&
    vehicleRegNumber.trim() &&
    count.trim() &&
    equipment.size > 0 &&
    images.length > 0
  );

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: '/driver/contact-operations',
      params: {
        ...params,
        institution,
        ambulanceType: ambulanceType ?? '',
        vehicleRegNumber,
        ambulanceCount: count,
        equipmentList: JSON.stringify(Array.from(equipment)),
        imageUris: JSON.stringify(images),
      },
    });
  };

  if (!params.businessName) return null;

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Ambulance Service Details</Text>
        <Text style={styles.subtitle}>Provide your ambulance service information</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.field}>
          <Text style={styles.label}>Hospital / Medical Institution Name <Text style={styles.req}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={institution}
            onChangeText={setInstitution}
            placeholder="e.g., City General Hospital"
            placeholderTextColor="#94A3B8"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => vehicleRegNumberRef.current?.focus()}
            blurOnSubmit={false}
          />
          <Text style={styles.hint}>Institution the ambulance operates under</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Type of Ambulance <Text style={styles.req}>*</Text></Text>
          {AMBULANCE_TYPES.map((type) => {
            const active = ambulanceType === type.id;
            return (
              <AnimatedPressable
                key={type.id}
                onPress={() => setAmbulanceType(type.id)}
                style={[styles.typeCard, active && styles.typeCardActive]}
              >
                <Text style={[styles.typeTitle, active && styles.typeTitleActive]}>{type.title}</Text>
                <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Registration Number <Text style={styles.req}>*</Text></Text>
          <TextInput
            ref={vehicleRegNumberRef}
            style={styles.input}
            value={vehicleRegNumber}
            onChangeText={setVehicleRegNumber}
            placeholder="e.g., AMB-2024-NYC-001"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => countRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Number of Ambulances Available <Text style={styles.req}>*</Text></Text>
          <TextInput
            ref={countRef}
            style={styles.input}
            value={count}
            onChangeText={setCount}
            keyboardType="number-pad"
            onFocus={scrollFieldIntoView}
            returnKeyType="done"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Available Medical Equipment <Text style={styles.req}>*</Text></Text>
          {EQUIPMENT_OPTIONS.map((item) => {
            const active = equipment.has(item);
            return (
              <AnimatedPressable
                key={item}
                onPress={() => toggleEquipment(item)}
                style={[styles.equipRow, active && styles.equipRowActive]}
              >
                <Text style={[styles.equipText, active && styles.equipTextActive]}>{item}</Text>
              </AnimatedPressable>
            );
          })}
          <Text style={styles.hint}>Select all equipment available in your ambulance</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Vehicle Images <Text style={styles.req}>*</Text></Text>
          <View style={styles.imageGrid}>
            {images.map((uri) => (
              <Image key={uri} source={{ uri }} style={styles.imageThumb} />
            ))}
            <AnimatedPressable style={styles.addPhotoBox} onPress={handleAddPhoto}>
              <Ionicons name="camera-outline" size={22} color="#64748B" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </AnimatedPressable>
          </View>
          <Text style={styles.hint}>Upload clear photos of your ambulance (exterior and interior)</Text>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, gap: 12 }]}>
        <PrimaryButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
        <SecondaryButton label="Back" onPress={() => router.back()} />
      </View>
      </KeyboardAvoidingView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  backBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  field: {
    marginBottom: 22,
  },
  label: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  req: {
    color: '#EF4444',
  },
  input: {
    fontFamily: FONT,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  hint: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 6,
  },
  typeCard: {
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  typeCardActive: {
    borderColor: '#0F172A',
    borderWidth: 1.5,
    backgroundColor: '#F8FAFC',
  },
  typeTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  typeTitleActive: {
    color: '#0F172A',
  },
  typeSubtitle: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  equipRow: {
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  equipRowActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  equipText: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  equipTextActive: {
    color: '#FFFFFF',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageThumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  addPhotoBox: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D9DFE7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  addPhotoText: {
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
  },
  continueBtn: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  continueBtnDisabled: {
    opacity: 0.4,
  },
  continueText: {
    fontFamily: FONT,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  backOutlineBtn: {
    borderWidth: 1,
    borderColor: '#0F172A',
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  backOutlineText: {
    fontFamily: FONT,
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  },
});
