import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useStore, Product } from '@/components/StoreContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';
const LOW_STOCK_THRESHOLD = 10;

const formatNaira = (n: number) => `N${n.toLocaleString('en-US')}`;

type StockStatus = 'healthy' | 'low' | 'out';

const stockStatus = (stock: number): StockStatus => {
  if (stock === 0) return 'out';
  if (stock < LOW_STOCK_THRESHOLD) return 'low';
  return 'healthy';
};

const STATUS_META: Record<StockStatus, { label: string; bg: string; color: string; icon: keyof typeof Ionicons.glyphMap }> = {
  healthy: { label: 'Healthy', bg: '#DCFCE7', color: '#16A34A', icon: 'checkmark' },
  low: { label: 'Low Stock', bg: '#FEF3E2', color: '#D97706', icon: 'warning' },
  out: { label: 'Out of Stock', bg: '#FEE2E2', color: '#DC2626', icon: 'close' },
};

type SortMode = 'name' | 'stock' | 'price';

export default function InventoryScreen() {
  const insets = useSafeAreaInsets();
  const { products, adjustStock, deleteProduct, toggleAvailable } = useStore();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');
  const [sortMode, setSortMode] = useState<SortMode>('name');

  const counts = useMemo(() => {
    let healthy = 0, low = 0, out = 0;
    products.forEach((p) => {
      const s = stockStatus(p.stock);
      if (s === 'healthy') healthy++;
      else if (s === 'low') low++;
      else out++;
    });
    return { total: products.length, healthy, low, out };
  }, [products]);

  const lowStockNames = useMemo(
    () => products.filter((p) => stockStatus(p.stock) === 'low').map((p) => p.name),
    [products]
  );
  const expiringProducts = useMemo(() => products.filter((p) => p.expiresAt), [products]);

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    if (filter === 'low') list = list.filter((p) => stockStatus(p.stock) === 'low' || stockStatus(p.stock) === 'out');
    if (filter === 'expiring') list = list.filter((p) => p.expiresAt);

    const sorted = [...list];
    if (sortMode === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (sortMode === 'stock') sorted.sort((a, b) => a.stock - b.stock);
    if (sortMode === 'price') sorted.sort((a, b) => a.price - b.price);
    return sorted;
  }, [products, query, filter, sortMode]);

  const cycleSort = () => {
    setSortMode((prev) => (prev === 'name' ? 'stock' : prev === 'stock' ? 'price' : 'name'));
  };

  const handleEdit = (product: Product) => {
    router.push({
      pathname: '/driver/store/add-product',
      params: {
        id: product.id,
        name: product.name,
        category: product.category,
        description: product.description,
        usageNotes: product.usageNotes,
        price: String(product.price),
        quantity: String(product.stock),
        available: String(product.available),
        imageUris: JSON.stringify(product.imageUris),
      },
    });
  };

  const handleDelete = (product: Product) => {
    Alert.alert('Delete Product', `Remove "${product.name}" from inventory?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProduct(product.id) },
    ]);
  };

  return (
    <FadeSlideIn style={styles.root}>
      <LinearGradient
        colors={['#16A34A', '#0F5132']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerTopRow}>
          <AnimatedPressable hitSlop={12} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </AnimatedPressable>
          <AnimatedPressable
            style={styles.addBtn}
            onPress={() => router.push('/driver/store/add-product')}
          >
            <Ionicons name="add" size={22} color="#16A34A" />
          </AnimatedPressable>
        </View>
        <Text style={styles.title}>Inventory</Text>
        <Text style={styles.subtitle}>{products.length} products in stock</Text>

        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              placeholder="Search products..."
              placeholderTextColor="#94A3B8"
            />
          </View>
          <AnimatedPressable
            style={[styles.filterBtn, filter !== 'all' && styles.filterBtnActive]}
            onPress={() => setFilter((f) => (f === 'all' ? 'low' : 'all'))}
          >
            <Ionicons name="filter" size={18} color={filter !== 'all' ? '#FFFFFF' : '#16A34A'} />
          </AnimatedPressable>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{counts.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.statValue, { color: '#16A34A' }]}>{counts.healthy}</Text>
            <Text style={styles.statLabel}>Healthy</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FFF7ED' }]}>
            <Text style={[styles.statValue, { color: '#D97706' }]}>{counts.low}</Text>
            <Text style={styles.statLabel}>Low</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: '#FEF2F2' }]}>
            <Text style={[styles.statValue, { color: '#DC2626' }]}>{counts.out}</Text>
            <Text style={styles.statLabel}>Out</Text>
          </View>
        </View>

        {lowStockNames.length > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons name="warning" size={18} color="#D97706" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>{lowStockNames.length} Low Stock Alerts</Text>
              <Text style={styles.alertBody} numberOfLines={1}>
                {lowStockNames.slice(0, 2).join(', ')}
                {lowStockNames.length > 2 ? ` and ${lowStockNames.length - 2} more` : ''}
              </Text>
            </View>
            <AnimatedPressable onPress={() => setFilter('low')}>
              <Text style={styles.alertLink}>View All</Text>
            </AnimatedPressable>
          </View>
        )}

        {expiringProducts.length > 0 && (
          <View style={[styles.alertBanner, styles.expiringBanner]}>
            <Ionicons name="calendar" size={18} color="#B8860B" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: '#8B6914' }]}>
                {expiringProducts.length} Expiring Soon
              </Text>
              <Text style={[styles.alertBody, { color: '#8B6914' }]}>
                Products expiring within 90 days
              </Text>
            </View>
            <AnimatedPressable onPress={() => setFilter('expiring')}>
              <Text style={[styles.alertLink, { color: '#8B6914' }]}>Review</Text>
            </AnimatedPressable>
          </View>
        )}

        <View style={styles.listHeaderRow}>
          <Text style={styles.listTitle}>Products ({visibleProducts.length})</Text>
          <AnimatedPressable onPress={cycleSort}>
            <Text style={styles.sortLink}>Sort by {sortMode}</Text>
          </AnimatedPressable>
        </View>

        {visibleProducts.map((product, i) => {
          const status = stockStatus(product.stock);
          const meta = STATUS_META[status];
          return (
            <FadeSlideIn key={product.id} delay={Math.min(i, 6) * 50} style={styles.productCard}>
              <View style={styles.productTopRow}>
                <View style={styles.productEmojiWrap}>
                  <Text style={{ fontSize: 22 }}>{product.emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCategory}>{product.category}</Text>
                </View>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.productPrice}>{formatNaira(product.price)}</Text>
                <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={12} color={meta.color} />
                  <Text style={[styles.statusBadgeText, { color: meta.color }]}>{meta.label}</Text>
                </View>
              </View>

              <View style={styles.stockRow}>
                <Text style={styles.stockLabel}>Stock Level</Text>
                {product.expiresAt && <Text style={styles.expiresLabel}>Expires {product.expiresAt}</Text>}
              </View>
              <View style={styles.stockControlRow}>
                <AnimatedPressable style={styles.stockBtn} onPress={() => adjustStock(product.id, -1)}>
                  <Ionicons name="remove" size={16} color="#0F172A" />
                </AnimatedPressable>
                <Text style={styles.stockValue}>{product.stock}</Text>
                <Text style={styles.stockUnit}>units</Text>
                <AnimatedPressable style={styles.stockBtn} onPress={() => adjustStock(product.id, 1)}>
                  <Ionicons name="add" size={16} color="#0F172A" />
                </AnimatedPressable>
              </View>

              <View style={styles.actionsRow}>
                <AnimatedPressable style={styles.editBtn} onPress={() => handleEdit(product)}>
                  <Ionicons name="create-outline" size={14} color="#2563EB" />
                  <Text style={styles.editText}>Edit</Text>
                </AnimatedPressable>
                <AnimatedPressable style={styles.deleteBtn} onPress={() => handleDelete(product)}>
                  <Ionicons name="trash-outline" size={14} color="#DC2626" />
                  <Text style={styles.deleteText}>Delete</Text>
                </AnimatedPressable>
                <Text style={styles.addedAgo}>{product.addedAgo}</Text>
              </View>

              <View style={styles.availabilityRow}>
                <Text style={styles.availabilityLabel}>
                  {product.available ? 'Available to customers' : 'Not Available to customers'}
                </Text>
                <AnimatedPressable
                  style={[styles.toggle, product.available && styles.toggleOn]}
                  onPress={() => toggleAvailable(product.id)}
                >
                  <View style={[styles.toggleThumb, product.available && styles.toggleThumbOn]} />
                </AnimatedPressable>
              </View>
            </FadeSlideIn>
          );
        })}
      </ScrollView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F5FA' },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONT,
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  subtitle: {
    fontFamily: FONT,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONT,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: {
    backgroundColor: '#0F5132',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONT,
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 2,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FED7AA',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  expiringBanner: {
    backgroundColor: '#FEF8E7',
    borderColor: '#F5E6A3',
  },
  alertTitle: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '700',
    color: '#D97706',
  },
  alertBody: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#B45309',
    marginTop: 1,
  },
  alertLink: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '700',
    color: '#D97706',
  },
  listHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 14,
  },
  listTitle: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  sortLink: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '600',
    color: '#16A34A',
    textTransform: 'capitalize',
  },
  productCard: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#FFFFFF',
  },
  productTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  productEmojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productName: {
    fontFamily: FONT,
    fontSize: 15.5,
    fontWeight: '700',
    color: '#0F172A',
  },
  productCategory: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productPrice: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  statusBadgeText: {
    fontFamily: FONT,
    fontSize: 11.5,
    fontWeight: '700',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockLabel: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#64748B',
  },
  expiresLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#94A3B8',
  },
  stockControlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  stockBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stockValue: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  stockUnit: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#94A3B8',
    marginRight: 'auto',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    marginBottom: 12,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  editText: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    paddingVertical: 7,
    paddingHorizontal: 12,
  },
  deleteText: {
    fontFamily: FONT,
    fontSize: 12.5,
    fontWeight: '700',
    color: '#DC2626',
  },
  addedAgo: {
    marginLeft: 'auto',
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#94A3B8',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  availabilityLabel: {
    fontFamily: FONT,
    fontSize: 13.5,
    color: '#0F172A',
  },
  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#D1D5DB',
    padding: 3,
  },
  toggleOn: {
    backgroundColor: '#16A34A',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  toggleThumbOn: {
    marginLeft: 18,
  },
});
