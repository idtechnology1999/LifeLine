import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const FONT = Platform.select({ ios: 'System', default: 'System' });

export default function HelpAndSupportScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.title}>Help and support</Text>
        <Text style={styles.subtitle}>Reach out to us through our available channels</Text>
      </View>

      <View style={styles.headerDivider} />

      <View style={styles.contentContainer}>
        <TouchableOpacity style={styles.channelRow} activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Ionicons name="chatbubble-outline" size={18} color="#0F172A" />
          </View>
          <Text style={styles.channelTitle}>Chat</Text>
        </TouchableOpacity>

        <View style={styles.itemDivider} />

        <TouchableOpacity style={styles.channelRow} activeOpacity={0.7}>
          <View style={styles.iconContainer}>
            <Feather name="mail" size={18} color="#0F172A" />
          </View>
          <Text style={styles.channelTitle}>E-Mail</Text>
        </TouchableOpacity>
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
  contentContainer: { paddingHorizontal: 20, paddingTop: 10 },
  channelRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
  iconContainer: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  channelTitle: { fontFamily: FONT, fontSize: 15, fontWeight: '600', color: '#0F172A' },
  itemDivider: { height: 1, backgroundColor: '#F1F5F9' },
});
