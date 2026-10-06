import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Image,
  Switch,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '@/components/StoreContext';
import AnimatedPressable from '@/components/AnimatedPressable';
import FadeSlideIn from '@/components/FadeSlideIn';

import { FONT } from '@/constants/typography';
const MAX_IMAGES = 5;

const asString = (v: string | string[] | undefined, fallback = '') =>
  Array.isArray(v) ? v[0] ?? fallback : v ?? fallback;

const parseArray = (v: string | string[] | undefined): string[] => {
  try {
    const parsed = JSON.parse(asString(v, '[]'));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const DEFAULT_CATEGORIES: { id: string; label: string; emoji: string }[] = [
  { id: 'Drugs', label: 'Drugs', emoji: '💊' },
  { id: 'Medical Equipment', label: 'Medical Equipment', emoji: '🩺' },
  { id: 'Consumables', label: 'Consumables', emoji: '🧴' },
  { id: 'Emergency Supplies', label: 'Emergency Supplies', emoji: '🚑' },
];

export default function AddProductScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<Record<string, string>>();
  const { addProduct, updateProduct } = useStore();

  const editingId = asString(params.id) || null;

  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [name, setName] = useState(asString(params.name));
  const [category, setCategory] = useState(asString(params.category) || null);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [description, setDescription] = useState(asString(params.description));
  const [usageNotes, setUsageNotes] = useState(asString(params.usageNotes));
  const [price, setPrice] = useState(asString(params.price));
  const [quantity, setQuantity] = useState(asString(params.quantity));
  const [images, setImages] = useState<string[]>(() => parseArray(params.imageUris));
  const [available, setAvailable] = useState(params.available !== 'false');

  const handleAddCategory = () => {
    const value = customCategoryInput.trim();
    if (!value) return;
    if (!categories.some((c) => c.id === value)) {
      setCategories((prev) => [...prev, { id: value, label: value, emoji: '📦' }]);
    }
    setCategory(value);
    setCustomCategoryInput('');
  };

  const handleAddPhoto = async () => {
    if (images.length >= MAX_IMAGES) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, MAX_IMAGES));
    }
  };

  const priceNumber = Number(price);
  const quantityNumber = Number(quantity);
  const canSubmit = Boolean(
    name.trim() &&
    category &&
    description.trim() &&
    price.trim() &&
    !Number.isNaN(priceNumber) &&
    priceNumber > 0 &&
    quantity.trim() &&
    !Number.isNaN(quantityNumber) &&
    quantityNumber >= 0
  );

  const handleSubmit = () => {
    if (!canSubmit || !category) return;
    const categoryMeta = categories.find((c) => c.id === category);
    const input = {
      name: name.trim(),
      category,
      description: description.trim(),
      usageNotes: usageNotes.trim(),
      price: priceNumber,
      stock: quantityNumber,
      expiresAt: null,
      available,
      emoji: categoryMeta?.emoji ?? '📦',
      imageUris: images,
    };

    if (editingId) {
      updateProduct(editingId, input);
    } else {
      addProduct(input);
    }

    router.replace({ pathname: '/driver/store/product-added', params: { name: input.name } });
  };

  return (
    <FadeSlideIn style={styles.root}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? insets.top : 0}
      >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + 16, paddingBottom: 40 + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AnimatedPressable hitSlop={12} onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#0F172A" />
        </AnimatedPressable>

        <Text style={styles.eyebrow}>Fill in product details</Text>
        <Text style={styles.title}>{editingId ? 'Edit Product' : 'Add New Product'}</Text>
        <View style={styles.divider} />

        <Text style={styles.label}>Product Name <Text style={styles.req}>*</Text></Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Paracetamol 500mg"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Category <Text style={styles.req}>*</Text></Text>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => {
            const active = category === cat.id;
            return (
              <AnimatedPressable
                key={cat.id}
                onPress={() => setCategory(cat.id)}
                style={[styles.categoryBox, active && styles.categoryBoxActive]}
              >
                <Text style={{ fontSize: 24 }}>{cat.emoji}</Text>
                <Text style={[styles.categoryText, active && styles.categoryTextActive]}>{cat.label}</Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Text style={styles.label}>Add Custom Category</Text>
        <View style={styles.customRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={customCategoryInput}
            onChangeText={setCustomCategoryInput}
            placeholder="Enter custom category"
            placeholderTextColor="#94A3B8"
          />
          <AnimatedPressable style={styles.addCatBtn} onPress={handleAddCategory}>
            <Text style={styles.addCatText}>Add</Text>
          </AnimatedPressable>
        </View>

        <Text style={styles.label}>Description <Text style={styles.req}>*</Text></Text>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe the product, its benefits, and specifications..."
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
        />

        <Text style={styles.label}>Usage Notes (Optional)</Text>
        <TextInput
          style={styles.textArea}
          value={usageNotes}
          onChangeText={setUsageNotes}
          placeholder="Dosage instructions, warnings, or special instructions..."
          placeholderTextColor="#94A3B8"
          multiline
          textAlignVertical="top"
        />

        <View style={styles.row}>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Price (Naira) <Text style={styles.req}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="N 0.00"
              placeholderTextColor="#94A3B8"
              keyboardType="decimal-pad"
            />
          </View>
          <View style={styles.rowItem}>
            <Text style={styles.label}>Quantity <Text style={styles.req}>*</Text></Text>
            <TextInput
              style={styles.input}
              value={quantity}
              onChangeText={setQuantity}
              placeholder="0"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Text style={styles.label}>Product Images (Up to {MAX_IMAGES})</Text>
        <View style={styles.imageGrid}>
          {images.map((uri) => (
            <Image key={uri} source={{ uri }} style={styles.imageThumb} />
          ))}
          {images.length < MAX_IMAGES && (
            <AnimatedPressable style={styles.addPhotoBox} onPress={handleAddPhoto}>
              <Ionicons name="camera-outline" size={22} color="#64748B" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </AnimatedPressable>
          )}
        </View>

        <View style={styles.availabilityCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.availabilityTitle}>Make Available to Customers</Text>
            <Text style={styles.availabilitySub}>Product will be visible in the marketplace</Text>
          </View>
          <Switch
            value={available}
            onValueChange={setAvailable}
            trackColor={{ true: '#16A34A', false: '#D1D5DB' }}
            thumbColor="#FFFFFF"
          />
        </View>

        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={styles.noteBold}>Note: </Text>
            Once added, this product will be visible to users on the Lifeline marketplace if
            marked as available.
          </Text>
        </View>

        <AnimatedPressable
          disabled={!canSubmit}
          onPress={handleSubmit}
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
        >
          <Text style={styles.submitText}>{editingId ? 'Save Changes' : 'Add Product'}</Text>
        </AnimatedPressable>
      </ScrollView>
      </KeyboardAvoidingView>
    </FadeSlideIn>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 56 : 36,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  eyebrow: {
    fontFamily: FONT,
    fontSize: 14,
    color: '#64748B',
  },
  title: {
    fontFamily: FONT,
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: -20,
    marginTop: 18,
    marginBottom: 22,
  },
  label: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 18,
  },
  req: {
    color: '#EF4444',
  },
  input: {
    fontFamily: FONT,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
  },
  textArea: {
    fontFamily: FONT,
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#0F172A',
    minHeight: 90,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryBox: {
    width: '47%',
    borderWidth: 1,
    borderColor: '#D9DFE7',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 8,
  },
  categoryBoxActive: {
    borderColor: '#16A34A',
    borderWidth: 1.5,
    backgroundColor: '#F0FDF4',
  },
  categoryText: {
    fontFamily: FONT,
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0F172A',
  },
  categoryTextActive: {
    color: '#0F172A',
  },
  customRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'stretch',
  },
  addCatBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCatText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14.5,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowItem: {
    flex: 1,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  imageThumb: {
    width: 88,
    height: 88,
    borderRadius: 12,
  },
  addPhotoBox: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#D9DFE7',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  addPhotoText: {
    fontFamily: FONT,
    fontSize: 11.5,
    color: '#64748B',
    marginTop: 4,
  },
  availabilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 16,
    marginTop: 22,
  },
  availabilityTitle: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  availabilitySub: {
    fontFamily: FONT,
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 2,
  },
  noteBox: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  noteText: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#334155',
    lineHeight: 19,
  },
  noteBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  submitBtn: {
    backgroundColor: '#16A34A',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.4,
  },
  submitText: {
    fontFamily: FONT,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
