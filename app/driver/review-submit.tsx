import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import PrimaryButton, { SecondaryButton } from '@/components/PrimaryButton';
import FadeSlideIn from '@/components/FadeSlideIn';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { setVerified } from '@/services/verification';
import { useWizardGuard } from '@/components/useWizardGuard';

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

const AMBULANCE_TYPE_LABELS: Record<string, string> = {
  bls: 'Basic Life Support (BLS)',
  als: 'Advanced Life Support (ALS)',
  erv: 'Emergency Response Vehicle',
};

const SUPPLIER_TYPE_LABELS: Record<string, string> = {
  pharmacy: 'Licensed Pharmacy',
  equipment: 'Medical Equipment Supplier',
  both: 'Pharmacy & Equipment Supplier',
};

function RowStat({ label, value, verified }: { label: string; value: string; verified?: boolean }) {
  return (
    <View style={styles.rowStat}>
      <Text style={styles.rowStatLabel}>{label}</Text>
      <View style={styles.rowStatValueWrap}>
        <Text style={styles.rowStatValue}>{value}</Text>
        {verified && <Ionicons name="checkmark-circle" size={14} color="#16A34A" style={{ marginLeft: 6 }} />}
      </View>
    </View>
  );
}

function EditLink({ onPress }: { onPress: () => void }) {
  return (
    <AnimatedPressable onPress={onPress} hitSlop={8}>
      <Text style={styles.editLink}>Edit</Text>
    </AnimatedPressable>
  );
}

function Checkbox({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <AnimatedPressable onPress={onToggle} style={styles.checkboxRow}>
      <View style={[styles.checkboxBox, checked && styles.checkboxBoxChecked]}>
        {checked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
      </View>
      <Text style={styles.checkboxText}>{children}</Text>
    </AnimatedPressable>
  );
}

export default function ReviewSubmitScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  useWizardGuard(Boolean(params.businessName));

  const [confirmations, setConfirmations] = useState({
    accurate: false,
    authority: false,
    terms: false,
    verification: false,
  });

  const toggle = (key: keyof typeof confirmations) =>
    setConfirmations((c) => ({ ...c, [key]: !c[key] }));
  const allChecked = Object.values(confirmations).every(Boolean);

  const isSupplier = asString(params.serviceType) === 'supplier';
  const documentCount = parseArray(params.documentNames).length;
  const equipmentCount = parseArray(params.equipmentList).length;
  const imageCount = parseArray(params.imageUris).length;
  const categoryCount = parseArray(params.productCategories).length;
  const licenseDocCount = parseArray(params.licenseDocNames).length;

  const [submitting, setSubmitting] = useState(false);

  const handleContinue = () => {
    if (!allChecked || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setVerified(isSupplier ? 'supplier' : 'ambulance');
      router.replace({
        pathname: '/driver/verification-in-progress',
        params: { serviceType: asString(params.serviceType) },
      });
    }, 700);
  };

  const editTo = (pathname: string) => () =>
    router.push({ pathname: pathname as any, params });

  if (!params.businessName) return null;

  return (
    <FadeSlideIn style={styles.root}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>
        <Text style={styles.title}>Review and Submit</Text>
        <Text style={styles.subtitle}>Confirm your details before submitting</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <MaterialCommunityIcons name={isSupplier ? 'store-outline' : 'ambulance'} size={18} color="#0F172A" />
              <Text style={styles.cardTitle}>Service Type</Text>
            </View>
            <EditLink onPress={editTo('/driver')} />
          </View>
          <Text style={styles.serviceValue}>
            {isSupplier ? 'Medical Supplier / Pharmacy' : 'Ambulance Service Provider'}
          </Text>
          <Text style={styles.serviceSub}>
            {isSupplier
              ? 'Medical equipment and drug supply services'
              : 'Emergency medical transportation services'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Feather name="briefcase" size={18} color="#0F172A" />
              <Text style={styles.cardTitle}>Business Information</Text>
            </View>
            <EditLink onPress={editTo('/driver/business-details')} />
          </View>
          <RowStat label="Business Name" value={asString(params.businessName, '—')} />
          <RowStat
            label="Address"
            value={[params.address, params.city, params.state].filter(Boolean).join(', ') || '—'}
          />
          <RowStat label="Coverage Area" value={asString(params.coverageArea, '—')} />
          <RowStat label="Registration Number" value={asString(params.registrationNumber, '—')} />
          <RowStat
            label="Documents"
            value={`${documentCount} document${documentCount === 1 ? '' : 's'} uploaded`}
            verified={documentCount > 0}
          />
        </View>

        {isSupplier ? (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Feather name="file-text" size={18} color="#0F172A" />
                <Text style={styles.cardTitle}>Supplier Details</Text>
              </View>
              <EditLink onPress={editTo('/driver/supplier-details')} />
            </View>
            <RowStat
              label="Supplier Type"
              value={SUPPLIER_TYPE_LABELS[asString(params.supplierType)] ?? '—'}
            />
            <RowStat label="License Number" value={asString(params.licenseNumber, '—')} />
            <RowStat label="License Expiry" value={asString(params.licenseExpiry, '—')} />
            <RowStat label="Tax ID / EIN" value={asString(params.taxId, '—')} />
            <RowStat
              label="License Documents"
              value={`${licenseDocCount} document${licenseDocCount === 1 ? '' : 's'} uploaded`}
              verified={licenseDocCount > 0}
            />
            <RowStat
              label="Product Categories"
              value={
                categoryCount > 0
                  ? parseArray(params.productCategories).join(', ')
                  : '—'
              }
            />
          </View>
        ) : (
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <Feather name="file-text" size={18} color="#0F172A" />
                <Text style={styles.cardTitle}>Ambulance Details</Text>
              </View>
              <EditLink onPress={editTo('/driver/ambulance-details')} />
            </View>
            <RowStat label="Hospital / Institution" value={asString(params.institution, '—')} />
            <RowStat
              label="Ambulance Type"
              value={AMBULANCE_TYPE_LABELS[asString(params.ambulanceType)] ?? '—'}
            />
            <RowStat label="Vehicle Registration" value={asString(params.vehicleRegNumber, '—')} />
            <RowStat
              label="Fleet Size"
              value={`${asString(params.ambulanceCount, '0')} ambulance${
                asString(params.ambulanceCount) === '1' ? '' : 's'
              }`}
            />
            <RowStat
              label="Medical Equipment"
              value={`${equipmentCount} equipment item${equipmentCount === 1 ? '' : 's'} verified`}
              verified={equipmentCount > 0}
            />
            <RowStat
              label="Vehicle Images"
              value={`${imageCount} image${imageCount === 1 ? '' : 's'} uploaded`}
              verified={imageCount > 0}
            />
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <Ionicons name="person-outline" size={18} color="#0F172A" />
              <Text style={styles.cardTitle}>Contact & Operations</Text>
            </View>
            <EditLink onPress={editTo('/driver/contact-operations')} />
          </View>
          <RowStat
            label="Primary Contact"
            value={[params.fullName, params.role].filter(Boolean).join(' - ') || '—'}
          />
          <RowStat label="Phone" value={asString(params.phone, '—')} />
          <RowStat label="Email" value={asString(params.email, '—')} />
          <View style={{ marginTop: 12 }}>
            <Text style={styles.rowStatLabel}>Availability</Text>
            <View style={styles.availabilityRow}>
              <Ionicons name="time-outline" size={16} color="#16A34A" />
              <Text style={styles.availabilityText}>
                {asString(params.availability) === '24_7'
                  ? '24/7 Emergency Service'
                  : `Scheduled: ${asString(params.startTime, '—')} - ${asString(params.endTime, '—')}`}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitleNoIcon}>Final Confirmations</Text>
          <View style={{ marginTop: 14 }}>
            <Checkbox checked={confirmations.accurate} onToggle={() => toggle('accurate')}>
              I confirm that all information provided is accurate and up to date
            </Checkbox>
            <Checkbox checked={confirmations.authority} onToggle={() => toggle('authority')}>
              I have the legal authority to provide healthcare services on behalf of this organization
            </Checkbox>
            <Checkbox checked={confirmations.terms} onToggle={() => toggle('terms')}>
              I agree to Lifeline's Terms of Service and Provider Agreement
            </Checkbox>
            <Checkbox checked={confirmations.verification} onToggle={() => toggle('verification')}>
              I understand that my application requires verification before account activation
            </Checkbox>
          </View>
        </View>

      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16, gap: 12 }]}>
        <PrimaryButton
          label="Submit For Verification"
          onPress={handleContinue}
          disabled={!allChecked}
          loading={submitting}
          loadingLabel="Submitting…"
        />
        <SecondaryButton label="Back" onPress={() => router.back()} disabled={submitting} />
      </View>
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
    justifyContent: 'space-between',
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  editLink: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#2563EB',
  },
  serviceValue: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  serviceSub: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  rowStat: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 12,
  },
  rowStatLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#64748B',
  },
  rowStatValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  rowStatValue: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'right',
    flexShrink: 1,
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  availabilityText: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#16A34A',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 14,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D9DFE7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxBoxChecked: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  checkboxText: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#334155',
    lineHeight: 19,
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
