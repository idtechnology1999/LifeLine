import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AnimatedPressable from '@/components/AnimatedPressable';
import { router } from 'expo-router';

import { FONT } from '@/constants/typography';

interface EmergencyContact {
  id: string;
  relation: string;
  phoneNumber: string;
}

const INITIAL_CONTACTS: EmergencyContact[] = [
  { id: '1', relation: 'Brother', phoneNumber: '0814 545 0485' },
  { id: '2', relation: 'Sister', phoneNumber: '0814 545 0485' },
];

export default function EmergencyContactScreen() {
  const insets = useSafeAreaInsets();
  const [contacts, setContacts] = useState<EmergencyContact[]>(INITIAL_CONTACTS);

  const handleDelete = (id: string) => {
    setContacts((prev) => prev.filter((item) => item.id !== id));
  };

  const renderContactItem = ({ item }: { item: EmergencyContact }) => (
    <View style={styles.contactRow}>
      <View style={styles.contactInfo}>
        <Text style={styles.relationText}>{item.relation}</Text>
        <Text style={styles.phoneText}>{item.phoneNumber}</Text>
      </View>
      <AnimatedPressable
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={20} color="#E53935" />
      </AnimatedPressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={[styles.headerContainer, { paddingTop: insets.top + 16 }]}>
        <AnimatedPressable
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </AnimatedPressable>

        <Text style={styles.title}>Emergency Contact</Text>
        <Text style={styles.subtitle}>
          Alternative Numbers you can be reached on aside the primary registered Number
        </Text>
      </View>

      <View style={styles.headerDivider} />

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={renderContactItem}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 120,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  contactInfo: {
    flex: 1,
    gap: 4,
  },
  relationText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '400',
  },
  phoneText: {
    fontFamily: FONT,
    fontSize: 16,
    color: '#475569',
    fontWeight: '400',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
});
