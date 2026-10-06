import React, { useState } from 'react';
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

type PhotoSlot = 'validId' | 'driversLicense' | 'ridePapers';

export default function DocumentUploadScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.rideType), '/dispatcher/ride-details');

  const [validId, setValidId] = useState(asString(params.validIdUri));
  const [driversLicense, setDriversLicense] = useState(asString(params.driversLicenseUri));
  const [ridePapers, setRidePapers] = useState(asString(params.ridePapersUri));
  const [regNumber, setRegNumber] = useState(asString(params.rideRegNumber));

  const setters: Record<PhotoSlot, (uri: string) => void> = {
    validId: setValidId,
    driversLicense: setDriversLicense,
    ridePapers: setRidePapers,
  };

  const handleAddPhoto = async (slot: PhotoSlot) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Please allow photo library access to add a photo.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setters[slot](result.assets[0].uri);
    }
  };

  const canContinue = Boolean(validId.trim() && driversLicense.trim() && regNumber.trim());

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: '/dispatcher/availability-hours',
      params: {
        ...params,
        validIdUri: validId,
        driversLicenseUri: driversLicense,
        ridePapersUri: ridePapers,
        rideRegNumber: regNumber,
      },
    });
  };

  if (!params.rideType) return null;

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Document Upload</Text>
        <Text style={styles.subtitle}>Provide your ride information</Text>
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
          <Text style={styles.label}>Valid ID <Text style={styles.req}>*</Text></Text>
          <AnimatedPressable style={styles.photoBox} onPress={() => handleAddPhoto('validId')}>
            {validId ? (
              <Image source={{ uri: validId }} style={styles.photoPreview} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={26} color="#64748B" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </AnimatedPressable>
          <Text style={styles.hint}>Upload clear photos of your ID (exterior and interior)</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Driver's License <Text style={styles.req}>*</Text></Text>
          <AnimatedPressable style={styles.photoBox} onPress={() => handleAddPhoto('driversLicense')}>
            {driversLicense ? (
              <Image source={{ uri: driversLicense }} style={styles.photoPreview} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={26} color="#64748B" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </AnimatedPressable>
          <Text style={styles.hint}>Upload clear photos of your ID (exterior and interior)</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ride Papers</Text>
          <AnimatedPressable style={styles.photoBox} onPress={() => handleAddPhoto('ridePapers')}>
            {ridePapers ? (
              <Image source={{ uri: ridePapers }} style={styles.photoPreview} />
            ) : (
              <>
                <Ionicons name="camera-outline" size={26} color="#64748B" />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </>
            )}
          </AnimatedPressable>
          <Text style={styles.hint}>Upload clear photos of your ID (exterior and interior)</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ride Registration Number <Text style={styles.req}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={regNumber}
            onChangeText={setRegNumber}
            placeholder="e.g., RID-2024-LOS-001"
            placeholderTextColor="#94A3B8"
            autoCapitalize="characters"
            onFocus={scrollFieldIntoView}
            returnKeyType="done"
          />
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
  photoBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#F8FAFC',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  addPhotoText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  hint: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 6,
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
