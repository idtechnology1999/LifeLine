import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const FONT = Platform.select({ ios: 'System', default: 'System' });

interface AddressItem {
  id: string;
  address: string;
}

const INITIAL_ADDRESSES: AddressItem[] = [
  { id: '1', address: '9, Sakajojo Street, Ikorodu, Lagos' },
  { id: '2', address: '9, Sakajojo Street, Ikorodu, Lagos' },
  { id: '3', address: '9, Sakajojo Street, Ikorodu, Lagos' },
];

export default function SavedAddressesScreen() {
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES);

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
  };

  const renderAddressItem = ({ item }: { item: AddressItem }) => (
    <View style={styles.addressRow}>
      <Text style={styles.addressText}>{item.address}</Text>
      <TouchableOpacity
        onPress={() => handleDelete(item.id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        activeOpacity={0.7}
      >
        <Feather name="trash-2" size={20} color="#E53935" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>

        <Text style={styles.title}>Saved Addresses</Text>
        <Text style={styles.subtitle}>Check the addresses you have saved</Text>
      </View>

      <View style={styles.headerDivider} />

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderAddressItem}
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
    fontWeight: '400',
  },
  headerDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    width: '100%',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  addressText: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#475569',
    fontWeight: '400',
    flex: 1,
    marginRight: 16,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
  },
});
