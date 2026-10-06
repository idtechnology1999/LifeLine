import { getItem, setItem } from './storage';

const ONBOARDING_KEY = 'has_seen_onboarding';

export async function hasSeenOnboarding(): Promise<boolean> {
  const value = await getItem(ONBOARDING_KEY);
  return value === 'true';
}

export async function setSeenOnboarding(): Promise<void> {
  await setItem(ONBOARDING_KEY, 'true');
}
