import { getItem, setItem, removeItem } from './storage';

const VERIFICATION_KEY = 'provider_verification';

export type ProviderServiceType = 'ambulance' | 'supplier' | 'dispatcher';

export interface VerificationRecord {
  serviceType: ProviderServiceType;
  status: 'verified';
}

export async function getVerification(): Promise<VerificationRecord | null> {
  const raw = await getItem(VERIFICATION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VerificationRecord;
  } catch {
    return null;
  }
}

export async function setVerified(serviceType: ProviderServiceType): Promise<void> {
  await setItem(VERIFICATION_KEY, JSON.stringify({ serviceType, status: 'verified' }));
}

export async function clearVerification(): Promise<void> {
  await removeItem(VERIFICATION_KEY);
}
