import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

const FONT = Platform.select({ ios: 'System', default: 'System' });

interface Product {
  id: string;
  name: string;
  rating: number;
  price: string;
  inStock: boolean;
  requiresPrescription?: boolean;
  iconName: string;
  iconType: 'feather' | 'material' | 'font-awesome';
}

const CATEGORIES = [
  { id: 'all', label: 'All', icon: 'hospital-box-outline' },
  { id: 'prescription', label: 'Prescription', icon: 'pill' },
  { id: 'equipment', label: 'Equipment', icon: 'stethoscope' },
];

const PRODUCTS: Product[] = [
  { id: '1', name: 'Stethoscope', rating: 4.5, price: 'N8,500', inStock: true, iconName: 'stethoscope', iconType: 'font-awesome' },
  { id: '2', name: 'Lisinopril', rating: 4.8, price: 'N12,500', inStock: true, requiresPrescription: true, iconName: 'pill', iconType: 'material' },
  { id: '3', name: 'First Aid Kit', rating: 4.7, price: 'N12,500', inStock: true, iconName: 'bandage', iconType: 'font-awesome' },
  { id: '4', name: 'Thermometer Digital', rating: 4.6, price: 'N3,500', inStock: true, iconName: 'thermometer-half', iconType: 'font-awesome' },
];

export default function MedicalSuppliesScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const renderProductIcon = (item: Product) => {
    switch (item.iconType) {
      case 'font-awesome':
        return <FontAwesome5 name={item.iconName as any} size={40} color="#64748B" />;
      case 'material':
        return <MaterialCommunityIcons name={item.iconName as any} size={44} color="#EF4444" />;
      default:
        return <Feather name="package" size={40} color="#64748B" />;
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => router.push('/product-details')}
    >
      <View style={styles.productImageContainer}>{renderProductIcon(item)}</View>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.ratingRow}>
        <Ionicons name="star" size={14} color="#F59E0B" />
        <Text style={styles.ratingText}>{item.rating}</Text>
      </View>
      <View style={styles.priceRow}>
        <Text style={styles.priceText}>{item.price}</Text>
        {item.inStock && <Text style={styles.inStockText}>In Stock</Text>}
      </View>
      {item.requiresPrescription && (
        <Text style={styles.prescriptionNotice}>Requires Prescription</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medical Supplies</Text>
        <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => router.push('/cart')}>
          <Feather name="shopping-cart" size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines, equipment..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoryContainer}>
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, isSelected ? styles.categoryChipActive : styles.categoryChipInactive]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name={cat.icon as any} size={16} color={isSelected ? '#FFFFFF' : '#475569'} />
              <Text style={[styles.categoryChipText, isSelected ? styles.categoryTextActive : styles.categoryTextInactive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.headerDivider} />

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={renderProduct}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.resultsBar}>
            <Text style={styles.resultsCount}>{PRODUCTS.length} products found</Text>
            <TouchableOpacity style={styles.filterButton} activeOpacity={0.7}>
              <Feather name="filter" size={14} color="#64748B" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12, paddingTop: Platform.OS === 'ios' ? 56 : 36 },
  iconButton: { padding: 4 },
  headerTitle: { fontFamily: FONT, fontSize: 20, fontWeight: '700', color: '#0F172A' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', marginHorizontal: 20, marginTop: 8, marginBottom: 16, paddingHorizontal: 14, height: 48, borderRadius: 12 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontFamily: FONT, fontSize: 14, color: '#0F172A' },
  categoryContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 16 },
  categoryChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
  categoryChipActive: { backgroundColor: '#2563EB' },
  categoryChipInactive: { backgroundColor: '#F1F5F9' },
  categoryChipText: { fontFamily: FONT, fontSize: 13, fontWeight: '600' },
  categoryTextActive: { color: '#FFFFFF' },
  categoryTextInactive: { color: '#475569' },
  headerDivider: { height: 1, backgroundColor: '#F1F5F9' },
  listContent: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 12 },
  resultsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  resultsCount: { fontFamily: FONT, fontSize: 13, color: '#64748B', fontWeight: '500' },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  filterText: { fontFamily: FONT, fontSize: 13, color: '#64748B', fontWeight: '500' },
  columnWrapper: { justifyContent: 'space-between', marginBottom: 14 },
  productCard: { width: '48%', backgroundColor: '#FFFFFF', borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', padding: 12 },
  productImageContainer: { height: 120, backgroundColor: '#F8FAFC', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  productName: { fontFamily: FONT, fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
  ratingText: { fontFamily: FONT, fontSize: 12, fontWeight: '600', color: '#475569' },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontFamily: FONT, fontSize: 15, fontWeight: '800', color: '#0F172A' },
  inStockText: { fontFamily: FONT, fontSize: 11, color: '#10B981', fontWeight: '600' },
  prescriptionNotice: { fontFamily: FONT, fontSize: 10, color: '#EF4444', marginTop: 6, fontStyle: 'italic' },
});
