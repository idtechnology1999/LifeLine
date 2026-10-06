export function hapticFeedback() {
  const Haptics = require('expo-haptics');
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

export function scrollFieldIntoView(e: any) {
  e?.nativeEvent?.target?.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
}
