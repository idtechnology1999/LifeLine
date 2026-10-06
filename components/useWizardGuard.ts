import { useEffect } from 'react';
import { router } from 'expo-router';

export function useWizardGuard(stepComplete: boolean, fallback: string = '/driver') {
  useEffect(() => {
    if (!stepComplete) {
      router.replace(fallback as any);
    }
  }, [stepComplete, fallback]);
}
