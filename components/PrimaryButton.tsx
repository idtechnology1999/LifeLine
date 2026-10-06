import React from 'react';
import { Text, StyleSheet, ActivityIndicator, View, StyleProp, ViewStyle } from 'react-native';
import AnimatedPressable from './AnimatedPressable';
import { FONT } from '@/constants/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';

interface PrimaryButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const TEXT_COLOR: Record<ButtonVariant, string> = {
  primary: '#FFFFFF',
  secondary: '#475569',
  outline: '#0F172A',
  danger: '#D92B20',
  success: '#FFFFFF',
};

export default function PrimaryButton({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  loadingLabel,
  icon,
  style,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <AnimatedPressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, VARIANT_STYLES[variant], isDisabled && styles.disabled, style]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={TEXT_COLOR[variant]} size="small" />
        ) : (
          icon
        )}
        <Text style={[styles.text, { color: TEXT_COLOR[variant] }]}>
          {loading ? loadingLabel ?? label : label}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

// Kept as a thin, semantically-named wrapper so call sites read as
// `<SecondaryButton label="Back" />` rather than
// `<PrimaryButton variant="outline" />` everywhere — the outline treatment
// is what every "Back" button in the app already used.
export function SecondaryButton(props: Omit<PrimaryButtonProps, 'variant'>) {
  return <PrimaryButton {...props} variant="outline" />;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontFamily: FONT,
    fontWeight: '700',
    fontSize: 16,
  },
});

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: '#0F172A',
  },
  secondary: {
    backgroundColor: '#F1F5F9',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0F172A',
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#D92B20',
  },
  success: {
    backgroundColor: '#16A34A',
  },
};
