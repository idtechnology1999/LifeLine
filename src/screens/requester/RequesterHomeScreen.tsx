import { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { colors } from '../../theme/colors';

type Contact = {
  id: string;
  name: string;
  relation: string;
  phone: string;
};

type Activity = {
  id: string;
  type: 'ambulance' | 'supplies';
  title: string;
  date: string;
  amount: string;
  status: string;
};

const MOCK_USER = {
  fullName: 'Sarah Johnson',
  address: '123 Main Street, New York, NY',
};

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'John Doe', relation: 'Brother', phone: '+15550100' },
  { id: '2', name: 'Jane Smith', relation: 'Wife', phone: '+15550101' },
];

const MOCK_ACTIVITY: Activity[] = [
  { id: '1', type: 'ambulance', title: 'Ambulance Service', date: 'Jan 15, 2026', amount: 'N3,500', status: 'Completed' },
  { id: '2', type: 'supplies', title: 'Medical Supplies', date: 'Dec 28, 2025', amount: 'N7,650', status: 'Delivered' },
];

const font = Platform.select({ ios: 'System', default: 'System' });
const isIOS = Platform.OS === 'ios';

export default function RequesterHomeScreen() {
  const insets = useSafeAreaInsets();

  const handleCall = useCallback((phone: string) => {
    Linking.openURL(`tel:${phone}`);
  }, []);

  const contactRows = useMemo(() =>
    MOCK_CONTACTS.map((contact, i) => (
      <View
        key={contact.id}
        style={[styles.contactRow, i < MOCK_CONTACTS.length - 1 && styles.divider]}
      >
        <View style={styles.contactAvatar}>
          <Ionicons name="person" size={18} color={colors.accentBlue} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactRelation}>{contact.relation}</Text>
        </View>
        <Pressable style={styles.callBtn} onPress={() => handleCall(contact.phone)}>
          <Ionicons name="call" size={16} color={colors.accentGreen} />
        </Pressable>
      </View>
    )),
  [handleCall]);

  const activityRows = useMemo(() =>
    MOCK_ACTIVITY.map((item, i) => (
      <View
        key={item.id}
        style={[styles.activityRow, i < MOCK_ACTIVITY.length - 1 && styles.divider]}
      >
        <View
          style={[
            styles.activityIcon,
            item.type === 'ambulance' ? styles.activityAmbulance : styles.activitySupplies,
          ]}
        >
          <Ionicons
            name={item.type === 'ambulance' ? 'medkit' : 'cube'}
            size={18}
            color={item.type === 'ambulance' ? colors.danger : colors.accentBlue}
          />
        </View>
        <View style={styles.activityInfo}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDate}>{item.date}</Text>
        </View>
        <View style={styles.activityMeta}>
          <Text style={styles.activityAmount}>{item.amount}</Text>
          <Text style={styles.activityStatus}>{item.status}</Text>
        </View>
      </View>
    )),
  []);

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <LinearGradient
          colors={['#1A3FE0', '#0F2BB5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.name}>{MOCK_USER.fullName}</Text>
            </View>
            <Pressable style={styles.avatar}>
              <Ionicons name="person" size={22} color={colors.white} />
            </Pressable>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.8)" />
            <Text style={styles.locationText}>{MOCK_USER.address}</Text>
          </View>

        </LinearGradient>

        <View style={styles.body}>
          <Pressable style={styles.emergencyCard} onPress={() => router.push('/request-ambulance')}>
            <LinearGradient
              colors={['#FF3B30', '#D92B20']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emergencyGradient}
            >
              <View style={styles.emergencyIcon}>
                <Ionicons name="medkit" size={28} color={colors.white} />
              </View>
              <View style={styles.emergencyText}>
                <Text style={styles.emergencyTitle}>Request Ambulance</Text>
                <Text style={styles.emergencySub}>Emergency medical transport</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
            </LinearGradient>
          </Pressable>

          <Pressable style={styles.suppliesCard} onPress={() => router.push('/medical-supplies')}>
            <View style={styles.suppliesContent}>
              <View style={styles.suppliesIcon}>
                <Ionicons name="cube" size={24} color={colors.accentBlue} />
              </View>
              <View style={styles.suppliesText}>
                <Text style={styles.suppliesTitle}>Medical Supplies</Text>
                <Text style={styles.suppliesSub}>Order drugs & equipment</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.subtext} />
            </View>
          </Pressable>

          <View style={styles.subscriptionBanner}>
            <View style={styles.subscriptionIcon}>
              <Ionicons name="diamond" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.subscriptionText}>
              <Text style={styles.subscriptionTitle}>Ambulance Subscription</Text>
              <Text style={styles.subscriptionSub}>Unlimited emergency rides — $29/month</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <Pressable hitSlop={8}>
              <Text style={styles.editLink}>Edit</Text>
            </Pressable>
          </View>

          <BlurView intensity={isIOS ? 70 : 90} tint="light" style={styles.card}>
            {contactRows}
          </BlurView>

          <Text style={[styles.sectionTitle, styles.recentHeader]}>Recent Activity</Text>

          <BlurView intensity={isIOS ? 70 : 90} tint="light" style={styles.card}>
            {activityRows}
          </BlurView>

          <View style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Ionicons name="bulb" size={16} color={colors.accentBlue} />
              <Text style={styles.tipTitle}>Quick Tip</Text>
            </View>
            <Text style={styles.tipBody}>
              Keep your location services enabled for faster ambulance dispatch during emergencies.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F2F5FA',
  },
  scroll: {
    paddingBottom: 120,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: '400',
    letterSpacing: 0.2,
    color: 'rgba(255,255,255,0.75)',
  },
  name: {
    fontFamily: font,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.white,
    marginTop: 2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  locationText: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
  },
  body: {
    paddingHorizontal: 20,
    marginTop: -20,
  },
  emergencyCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#FF3B30',
        shadowOpacity: 0.3,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 6 },
    }),
  },
  emergencyGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  emergencyIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  emergencyText: {
    flex: 1,
  },
  emergencyTitle: {
    fontFamily: font,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.white,
  },
  emergencySub: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  suppliesCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 2 },
    }),
  },
  suppliesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
  },
  suppliesIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EAF1FE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  suppliesText: {
    flex: 1,
  },
  suppliesTitle: {
    fontFamily: font,
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.black,
  },
  suppliesSub: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '400',
    color: colors.subtext,
    marginTop: 2,
  },
  subscriptionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF8E7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F5E6A3',
    ...Platform.select({
      ios: {
        shadowColor: '#F5A623',
        shadowOpacity: 0.15,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 3 },
    }),
  },
  subscriptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F5A623',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  subscriptionText: {
    flex: 1,
  },
  subscriptionTitle: {
    fontFamily: font,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: '#8B6914',
  },
  subscriptionSub: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '400',
    color: '#A68A3E',
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: font,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.3,
    color: colors.black,
  },
  recentHeader: {
    marginTop: 28,
    marginBottom: 12,
  },
  editLink: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: '600',
    color: colors.accentBlue,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.black,
  },
  contactRelation: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '400',
    color: colors.subtext,
    marginTop: 1,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E4F7EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityAmbulance: {
    backgroundColor: '#FDECEC',
  },
  activitySupplies: {
    backgroundColor: colors.infoBg,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    color: colors.black,
  },
  activityDate: {
    fontFamily: font,
    fontSize: 12,
    fontWeight: '400',
    color: colors.subtext,
    marginTop: 2,
  },
  activityMeta: {
    alignItems: 'flex-end',
  },
  activityAmount: {
    fontFamily: font,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.black,
  },
  activityStatus: {
    fontFamily: font,
    fontSize: 12,
    fontWeight: '600',
    color: colors.accentGreen,
    marginTop: 2,
  },
  tipCard: {
    backgroundColor: colors.infoBg,
    borderWidth: 1,
    borderColor: colors.infoBorder,
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  tipTitle: {
    fontFamily: font,
    fontSize: 14,
    fontWeight: '600',
    color: colors.infoText,
  },
  tipBody: {
    fontFamily: font,
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 20,
    color: colors.infoText,
  },
});
