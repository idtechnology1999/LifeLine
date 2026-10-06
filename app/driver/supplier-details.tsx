import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
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

type SupplierType = 'pharmacy' | 'equipment' | 'both';

const SUPPLIER_TYPES: { id: SupplierType; title: string; subtitle: string }[] = [
  { id: 'pharmacy', title: 'Licensed Pharmacy', subtitle: 'Retail or wholesale pharmacy with drug license' },
  { id: 'equipment', title: 'Medical Equipment Supplier', subtitle: 'Supplier of medical equipment and devices' },
  { id: 'both', title: 'Pharmacy & Equipment Supplier', subtitle: 'Both pharmacy and medical equipment services' },
];

const DEFAULT_CATEGORIES = [
  'Prescription Medications',
  'Over-the-Counter Drugs',
  'Medical Equipment',
  'First Aid Supplies',
  'Diagnostic Equipment',
  'Surgical Instruments',
  'Personal Protective Equipment',
  'Wound Care',
  'Diabetes Care',
  'Respiratory Equipment',
];

export default function SupplierDetailsScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.businessName));

  const [supplierType, setSupplierType] = useState<SupplierType | null>(
    (params.supplierType as SupplierType) || null
  );
  const [licenseNumber, setLicenseNumber] = useState(asString(params.licenseNumber));
  const [licenseExpiry, setLicenseExpiry] = useState(asString(params.licenseExpiry));
  const [taxId, setTaxId] = useState(asString(params.taxId));
  const [documents, setDocuments] = useState<string[]>(() => parseArray(params.licenseDocNames));

  const [categories, setCategories] = useState<string[]>(() => {
    const custom = parseArray(params.customCategories);
    return [...DEFAULT_CATEGORIES, ...custom.filter((c) => !DEFAULT_CATEGORIES.includes(c))];
  });
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(parseArray(params.productCategories))
  );
  const [customCategoryInput, setCustomCategoryInput] = useState('');

  const [whoCompliance, setWhoCompliance] = useState(params.whoCompliance === 'true');
  const [coldStorage, setColdStorage] = useState(params.coldStorage === 'true');
  const [prescriptionAuth, setPrescriptionAuth] = useState(params.prescriptionAuth === 'true');
  const [storagePhotos, setStoragePhotos] = useState<string[]>(() => parseArray(params.storagePhotoUris));

  const licenseExpiryRef = useRef<TextInput>(null);
  const taxIdRef = useRef<TextInput>(null);

  const toggleCategory = (item: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleAddCategory = () => {
    const value = customCategoryInput.trim();
    if (!value) return;
    if (!categories.includes(value)) setCategories((prev) => [...prev, value]);
    setSelectedCategories((prev) => new Set(prev).add(value));
    setCustomCategoryInput('');
  };

  const handleUploadLicense = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/jpeg', 'image/png'],
      multiple: true,
    });
    if (!result.canceled) {
      setDocuments((prev) => [...prev, ...result.assets.map((a) => a.name)]);
    }
  };

  const handleUploadStoragePhotos = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setStoragePhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)]);
    }
  };

  const canContinue = Boolean(
    supplierType &&
    licenseNumber.trim() &&
    licenseExpiry.trim() &&
    taxId.trim() &&
    documents.length > 0 &&
    selectedCategories.size > 0
  );

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: '/driver/contact-operations',
      params: {
        ...params,
        supplierType: supplierType ?? '',
        licenseNumber,
        licenseExpiry,
        taxId,
        licenseDocNames: JSON.stringify(documents),
        productCategories: JSON.stringify(Array.from(selectedCategories)),
        customCategories: JSON.stringify(categories.filter((c) => !DEFAULT_CATEGORIES.includes(c))),
        whoCompliance: String(whoCompliance),
        coldStorage: String(coldStorage),
        prescriptionAuth: String(prescriptionAuth),
        storagePhotoUris: JSON.stringify(storagePhotos),
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
        <Text style={styles.title}>Supplier Details</Text>
        <Text style={styles.subtitle}>Provide your pharmacy/supplier information</Text>
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
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="cube-outline" size={18} color="#0F172A" />
            <Text style={styles.cardTitle}>Supplier Type</Text>
          </View>
          {SUPPLIER_TYPES.map((type) => {
            const active = supplierType === type.id;
            return (
              <AnimatedPressable
                key={type.id}
                onPress={() => setSupplierType(type.id)}
                style={[styles.typeCard, active && styles.typeCardActive]}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.typeTitle, active && styles.typeTitleActive]}>{type.title}</Text>
                  <Text style={styles.typeSubtitle}>{type.subtitle}</Text>
                </View>
                {active && <Ionicons name="checkmark" size={20} color="#16A34A" />}
              </AnimatedPressable>
            );
          })}
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="shield-outline" size={18} color="#0F172A" />
            <Text style={styles.cardTitle}>License Information</Text>
          </View>

          <Text style={styles.label}>Pharmacy/Supplier License Number <Text style={styles.req}>*</Text></Text>
          <TextInput
            style={styles.input}
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            placeholder="e.g., PHARM-2024-NYC-456"
            placeholderTextColor="#94A3B8"
            onFocus={scrollFieldIntoView}
            returnKeyType="next"
            onSubmitEditing={() => licenseExpiryRef.current?.focus()}
            blurOnSubmit={false}
          />

          <View style={styles.row}>
            <View style={styles.rowItem}>
              <Text style={styles.label}>License Expiry Date <Text style={styles.req}>*</Text></Text>
              <TextInput
                ref={licenseExpiryRef}
                style={styles.input}
                value={licenseExpiry}
                onChangeText={setLicenseExpiry}
                placeholder="MM/DD/YYYY"
                placeholderTextColor="#94A3B8"
                onFocus={scrollFieldIntoView}
                returnKeyType="next"
                onSubmitEditing={() => taxIdRef.current?.focus()}
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.rowItem}>
              <Text style={styles.label}>Tax ID / EIN <Text style={styles.req}>*</Text></Text>
              <TextInput
                ref={taxIdRef}
                style={styles.input}
                value={taxId}
                onChangeText={setTaxId}
                placeholder="XX-XXXXXXX"
                placeholderTextColor="#94A3B8"
                onFocus={scrollFieldIntoView}
                returnKeyType="done"
              />
            </View>
          </View>

          <Text style={styles.label}>License Documentation <Text style={styles.req}>*</Text></Text>
          <AnimatedPressable style={styles.uploadBox} onPress={handleUploadLicense}>
            <Ionicons name="cloud-upload-outline" size={26} color="#64748B" />
            <Text style={styles.uploadTitle}>Upload License Copy</Text>
            <Text style={styles.uploadSub}>PDF, JPG or PNG (Max 5MB)</Text>
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
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitleNoIcon}>Product Categories <Text style={styles.req}>*</Text></Text>
          <Text style={styles.cardSubtitle}>Select all categories you supply</Text>

          <View style={styles.categoryGrid}>
            {categories.map((cat) => {
              const active = selectedCategories.has(cat);
              return (
                <AnimatedPressable
                  key={cat}
                  onPress={() => toggleCategory(cat)}
                  style={[styles.categoryBox, active && styles.categoryBoxActive]}
                >
                  <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{cat}</Text>
                </AnimatedPressable>
              );
            })}
          </View>

          <Text style={[styles.label, { marginTop: 16 }]}>Add Custom Category</Text>
          <View style={styles.customRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={customCategoryInput}
              onChangeText={setCustomCategoryInput}
              placeholder="Enter custom category"
              placeholderTextColor="#94A3B8"
              onFocus={scrollFieldIntoView}
              returnKeyType="done"
              onSubmitEditing={handleAddCategory}
            />
            <AnimatedPressable style={styles.addBtn} onPress={handleAddCategory}>
              <Text style={styles.addBtnText}>Add</Text>
            </AnimatedPressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitleNoIcon}>Storage & Compliance</Text>

          <AnimatedPressable style={styles.checkRow} onPress={() => setWhoCompliance((v) => !v)}>
            <View style={[styles.checkbox, whoCompliance && styles.checkboxChecked]}>
              {whoCompliance && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkTitle}>WHO Storage Compliance</Text>
              <Text style={styles.checkSubtitle}>Facility meets WHO storage guidelines</Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable style={styles.checkRow} onPress={() => setColdStorage((v) => !v)}>
            <View style={[styles.checkbox, coldStorage && styles.checkboxChecked]}>
              {coldStorage && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkTitle}>Cold Storage Available</Text>
              <Text style={styles.checkSubtitle}>Temperature-controlled storage for vaccines and biologics</Text>
            </View>
          </AnimatedPressable>

          <AnimatedPressable style={styles.checkRow} onPress={() => setPrescriptionAuth((v) => !v)}>
            <View style={[styles.checkbox, prescriptionAuth && styles.checkboxChecked]}>
              {prescriptionAuth && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkTitle}>Prescription Drugs Authorization</Text>
              <Text style={styles.checkSubtitle}>Licensed to dispense prescription medications</Text>
            </View>
          </AnimatedPressable>

          <Text style={[styles.label, { marginTop: 6 }]}>Storage Facility Photos (Optional)</Text>
          <AnimatedPressable style={styles.uploadBox} onPress={handleUploadStoragePhotos}>
            <Ionicons name="cloud-upload-outline" size={26} color="#64748B" />
            <Text style={styles.uploadTitle}>Upload storage facility images</Text>
          </AnimatedPressable>
          {storagePhotos.length > 0 && (
            <Text style={styles.hint}>{storagePhotos.length} photo(s) selected</Text>
          )}
        </View>

        <View style={styles.verifyBox}>
          <Text style={styles.verifyText}>
            <Text style={styles.verifyBold}>Verification Required: </Text>
            All license information will be verified with regulatory authorities before
            account activation.
          </Text>
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
  root: { flex: 1, backgroundColor: '#FFFFFF' },
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
  card: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardTitleNoIcon: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 14,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  typeCardActive: {
    borderColor: '#16A34A',
    borderWidth: 1.5,
    backgroundColor: '#F0FDF4',
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
  label: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 14,
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
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#D9DFE7',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  uploadTitle: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 10,
    textAlign: 'center',
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryBox: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  categoryBoxActive: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  categoryText: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  customRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  addBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: '#16A34A',
    borderColor: '#16A34A',
  },
  checkTitle: {
    fontFamily: FONT,
    fontSize: 14.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkSubtitle: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  hint: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 8,
  },
  verifyBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  verifyText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#166534',
    lineHeight: 19,
  },
  verifyBold: {
    fontWeight: '700',
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
