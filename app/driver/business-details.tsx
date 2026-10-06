import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';
import { useWizardGuard } from '@/components/useWizardGuard';
import { scrollFieldIntoView } from '@/utils';

import { FONT } from '@/constants/typography';

const asString = (v: string | string[] | undefined, fallback = '') =>
  Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;

export default function BusinessDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.serviceType));
  const serviceType = params.serviceType === 'supplier' ? 'supplier' : 'ambulance';

  const [businessName, setBusinessName] = useState(asString(params.businessName));
  const [address, setAddress] = useState(asString(params.address));
  const [city, setCity] = useState(asString(params.city));
  const [state, setState] = useState(asString(params.state));
  const [zip, setZip] = useState(asString(params.zip));
  const [coverageArea, setCoverageArea] = useState(asString(params.coverageArea));
  const [registrationNumber, setRegistrationNumber] = useState(asString(params.registrationNumber));
  const [documents, setDocuments] = useState<string[]>(() => {
    try {
      const parsed = JSON.parse(asString(params.documentNames, '[]'));
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const stateRef = useRef<TextInput>(null);
  const zipRef = useRef<TextInput>(null);
  const coverageAreaRef = useRef<TextInput>(null);
  const registrationNumberRef = useRef<TextInput>(null);

  const canContinue = Boolean(
    businessName.trim() &&
    address.trim() &&
    city.trim() &&
    state.trim() &&
    zip.trim() &&
    coverageArea.trim() &&
    registrationNumber.trim() &&
    documents.length > 0
  );

  const handleUpload = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      multiple: true,
    });
    if (!result.canceled) {
      setDocuments((prev) => [...prev, ...result.assets.map((a) => a.name)]);
    }
  };

  const handleContinue = () => {
    if (!canContinue) return;

    router.push({
      pathname: serviceType === 'supplier' ? '/driver/supplier-details' : '/driver/ambulance-details',
      params: {
        ...params,
        serviceType,
        businessName,
        address,
        city,
        state,
        zip,
        coverageArea,
        registrationNumber,
        documentNames: JSON.stringify(documents),
      },
    });
  };

  if (!params.serviceType) return null;

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Business Details</Text>
        <Text style={styles.subtitle}>Provide your organization information</Text>
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
          <Text style={styles.label}>Business / Organization Name <Text style={styles.req}>*</Text></Text>
          <View style={styles.inputRow}>
            <Ionicons name="business-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              style={styles.inputWithIcon}
              value={businessName}
              onChangeText={setBusinessName}
              placeholder="e.g., City General Hospital"
              placeholderTextColor="#94A3B8"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() => addressRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <Text style={styles.hint}>Official registered business name</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Registered Office Address <Text style={styles.req}>*</Text></Text>
          <View style={styles.inputRow}>
            <Ionicons name="location-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
            <TextInput
              ref={addressRef}
              style={styles.inputWithIcon}
              value={address}
              onChangeText={setAddress}
              placeholder="Street address"
              placeholderTextColor="#94A3B8"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() => cityRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, styles.rowItem]}>
            <Text style={styles.label}>City <Text style={styles.req}>*</Text></Text>
            <TextInput
              ref={cityRef}
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Lagos"
              placeholderTextColor="#94A3B8"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() => stateRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
          <View style={[styles.field, styles.rowItem]}>
            <Text style={styles.label}>State <Text style={styles.req}>*</Text></Text>
            <TextInput
              ref={stateRef}
              style={styles.input}
              value={state}
              onChangeText={setState}
              placeholder="Nigeria"
              placeholderTextColor="#94A3B8"
              onFocus={scrollFieldIntoView}
              returnKeyType="next"
              onSubmitEditing={() => zipRef.current?.focus()}
              blurOnSubmit={false}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>ZIP Code <Text style={styles.req}>*</Text></Text>
          <TextInput
            ref={zipRef}
            style={styles.input}
            value={zip}
            onChangeText={setZip}
            placeholder="10001"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => coverageAreaRef.current?.focus()}
            blurOnSubmit={false}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Service Coverage Area <Text style={styles.req}>*</Text></Text>
          <TextInput
            ref={coverageAreaRef}
            style={styles.textArea}
            value={coverageArea}
            onChangeText={setCoverageArea}
            placeholder="e.g., Manhattan, Brooklyn, Queens - 5 mile radius from base location"
            placeholderTextColor="#94A3B8"
            multiline
            textAlignVertical="top"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => registrationNumberRef.current?.focus()}
          />
          <Text style={styles.hint}>Specify geographic areas where you provide services</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Business Registration Number <Text style={styles.req}>*</Text></Text>
          <View style={styles.inputRow}>
            <Text style={styles.hashIcon}>#</Text>
            <TextInput
              ref={registrationNumberRef}
              style={styles.inputWithIcon}
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              placeholder="Government-issued registration number"
              placeholderTextColor="#94A3B8"
              onFocus={scrollFieldIntoView}
              returnKeyType="done"
            />
          </View>
          <Text style={styles.hint}>EIN, business license, or government registration ID</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Supporting Documents <Text style={styles.req}>*</Text></Text>
          <AnimatedPressable style={styles.uploadBox} onPress={handleUpload}>
            <Ionicons name="cloud-upload-outline" size={26} color="#64748B" />
            <Text style={styles.uploadTitle}>Upload Documents</Text>
            <Text style={styles.uploadSub}>Business license, permits, or certificates</Text>
            <Text style={styles.uploadSub}>PDF, JPG, PNG - Max 10MB</Text>
          </AnimatedPressable>
          {documents.length > 0 && (
            <View style={styles.docList}>
              {documents.map((name, i) => (
                <View key={`${name}-${i}`} style={styles.docItem}>
                  <Ionicons name="document-text-outline" size={16} color="#0F172A" />
                  <Text style={styles.docItemText} numberOfLines={1}>{name}</Text>
                  <AnimatedPressable onPress={() => setDocuments((prev) => prev.filter((_, idx) => idx !== i))}>
                    <Ionicons name="close" size={16} color="#94A3B8" />
                  </AnimatedPressable>
                </View>
              ))}
            </View>
          )}
          <View style={styles.requiredDocsBox}>
            <Text style={styles.requiredDocsText}>
              <Text style={styles.legalBold}>Required documents:</Text> Business license,
              certificate of operation, insurance proof, and any relevant healthcare permits.
            </Text>
          </View>
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
    fontSize: 26,
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
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 8,
  },
  hashIcon: {
    fontFamily: FONT,
    fontSize: 16,
    color: '#94A3B8',
    marginRight: 8,
    fontWeight: '600',
  },
  inputWithIcon: {
    flex: 1,
    fontFamily: FONT,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    fontFamily: FONT,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 90,
  },
  hint: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 6,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#D9DFE7',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 28,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
  },
  uploadSub: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 3,
  },
  docList: {
    marginTop: 10,
    gap: 8,
  },
  docItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  docItemText: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 13,
    color: '#0F172A',
  },
  requiredDocsBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 14,
    marginTop: 14,
  },
  requiredDocsText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  legalBold: {
    fontWeight: '700',
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
