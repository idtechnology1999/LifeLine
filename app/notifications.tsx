import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import AnimatedPressable from '@/components/AnimatedPressable';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { FONT } from '@/constants/typography';

interface NotificationOption {
  id: string;
  title: string;
  subtitle: string;
  enabled: boolean;
}

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const [options, setOptions] = useState<NotificationOption[]>([
    { id: '1', title: 'Pop Up Notification', subtitle: 'Your device notifies you', enabled: false },
    { id: '2', title: 'SMS Notification', subtitle: 'You get an sms on your registered line', enabled: false },
    { id: '3', title: 'E-mail Notification', subtitle: 'You get an e-mail on your registered email address', enabled: false },
  ]);

  const toggleOption = (id: string) => {
    setOptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
        <AnimatedPressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </AnimatedPressable>
        <Text style={styles.title}>Notification</Text>
        <Text style={styles.subtitle}>Manage your notification preferences</Text>
      </View>

      <View style={styles.headerDivider} />

      <View style={styles.contentContainer}>
        {options.map((item, index) => (
          <View key={item.id}>
            <AnimatedPressable
              style={styles.optionRow}
              onPress={() => toggleOption(item.id)}
            >
              <View style={styles.textContainer}>
                <Text style={styles.optionTitle}>{item.title}</Text>
                <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
              </View>
              <View style={[styles.checkbox, item.enabled && styles.checkboxSelected]}>
                {item.enabled && <Feather name="check" size={14} color="#FFFFFF" />}
              </View>
            </AnimatedPressable>
            {index < options.length - 1 && <View style={styles.itemDivider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
  },
  backButton: { marginBottom: 20, alignSelf: 'flex-start' },
  title: { fontFamily: FONT, fontSize: 26, fontWeight: '700', color: '#0F172A', letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontFamily: FONT, fontSize: 15, color: '#64748B' },
  headerDivider: { height: 1, backgroundColor: '#F1F5F9', width: '100%' },
  contentContainer: { paddingHorizontal: 20, paddingTop: 8 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
  textContainer: { flex: 1, marginRight: 16, gap: 4 },
  optionTitle: { fontFamily: FONT, fontSize: 15, fontWeight: '600', color: '#0F172A' },
  optionSubtitle: { fontFamily: FONT, fontSize: 14, color: '#64748B', lineHeight: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 2, borderWidth: 1.5, borderColor: '#334155', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF' },
  checkboxSelected: { backgroundColor: '#0F172A', borderColor: '#0F172A' },
  itemDivider: { height: 1, backgroundColor: '#E2E8F0' },
});
