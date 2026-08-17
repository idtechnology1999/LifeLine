export function hapticFeedback() {
  const Haptics = require('expo-haptics');
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}
