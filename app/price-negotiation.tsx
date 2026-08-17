import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { router, useLocalSearchParams } from 'expo-router';
import { colors } from '../src/theme/colors';

const FONT = Platform.select({ ios: 'System', default: 'System' });
const RED = '#D92B20';

type Sender = 'driver' | 'user';

type Message = {
  id: string;
  sender: Sender;
  text: string;
  time: string;
};

const NEGOTIATION_WINDOW_SECONDS = 180;

function formatTime(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const suffix = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${suffix}`;
}

function formatCountdown(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatCurrency(value: number) {
  return `N${Math.round(value).toLocaleString('en-NG')}`;
}

// Rounds a number to the nearest 100 so mock counter-offers look realistic
function roundToNearestHundred(value: number) {
  return Math.round(value / 100) * 100;
}

export default function PriceNegotiationScreen() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const driverName = (params.driverName as string) || 'Michael Roberts';
  const driverRating = (params.driverRating as string) || '4.9';
  const driverTrips = (params.driverTrips as string) || '156';
  const driverPhone = (params.driverPhone as string) || '+15550199';
  const vehicleCode = (params.vehicleCode as string) || 'AMB-2347';
  const distanceMiles = (params.distanceMiles as string) || '2.3 mi';
  const etaMinutes = (params.etaMinutes as string) || '5 min';

  const systemEstimate = Number(params.systemEstimate) || 2500;
  const initialDriverPrice = Number(params.driverPrice) || 3000;

  const [secondsLeft, setSecondsLeft] = useState(NEGOTIATION_WINDOW_SECONDS);
  const [currentOffer, setCurrentOffer] = useState(initialDriverPrice);
  const [counterText, setCounterText] = useState('');
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'm1',
      sender: 'driver',
      text: `I can assist you. My price for this trip is ${formatCurrency(initialDriverPrice)}.`,
      time: formatTime(new Date()),
    },
  ]);

  const scrollRef = useRef<ScrollView>(null);
  const negotiationRounds = useRef(0);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const difference = currentOffer - systemEstimate;

  const handleCallDriver = useCallback(() => {
    Linking.openURL(`tel:${driverPhone}`);
  }, [driverPhone]);

  const handleAccept = useCallback(
    (amount: number) => {
      router.push({
        pathname: '/secure-payment',
        params: {
          amount: String(amount),
          driverName,
          vehicleCode,
        },
      });
    },
    [driverName, vehicleCode]
  );

  const handleSendCounter = useCallback(() => {
    const value = Number(counterText.replace(/[^0-9.]/g, ''));
    if (!value || value <= 0) return;

    const userMessage: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: `Can I pay ${formatCurrency(value)}`,
      time: formatTime(new Date()),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCounterText('');
    negotiationRounds.current += 1;

    // If the counter offer is already at or above the driver's current
    // price, the driver simply accepts it.
    if (value >= currentOffer) {
      const acceptMessage: Message = {
        id: `d-${Date.now()}`,
        sender: 'driver',
        text: `Deal, ${formatCurrency(value)} works for me.`,
        time: formatTime(new Date()),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, acceptMessage]);
        setCurrentOffer(value);
      }, 900);
      return;
    }

    // Otherwise the driver meets in the middle, biased toward their own
    // price, and the gap narrows a little more each round.
    const bias = negotiationRounds.current >= 3 ? 0.25 : 0.4;
    const meetingPoint = roundToNearestHundred(
      value + (currentOffer - value) * bias
    );

    const driverMessage: Message = {
      id: `d-${Date.now()}`,
      sender: 'driver',
      text:
        meetingPoint <= value + 100
          ? `Alright, ${formatCurrency(meetingPoint)} and we have a deal.`
          : `I can meet you at ${formatCurrency(meetingPoint)}`,
      time: formatTime(new Date()),
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, driverMessage]);
      setCurrentOffer(meetingPoint);
    }, 900);
  }, [counterText, currentOffer]);

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1C1C1E" />
        </Pressable>
        <Text style={styles.title}>Price Negotiation</Text>
        <View style={styles.timerRow}>
          <Ionicons name="time-outline" size={15} color="#FF7A00" />
          <Text style={styles.timerText}>
            Respond within {formatCountdown(secondsLeft)}
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.divider} />

        <View style={styles.driverRow}>
          <View style={styles.driverAvatar}>
            <Ionicons name="person" size={24} color={colors.accentBlue} />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{driverName}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={13} color="#F5A623" />
              <Text style={styles.ratingText}>
                {driverRating} ({driverTrips} trips)
              </Text>
            </View>
          </View>
          <Pressable onPress={handleCallDriver} style={styles.callIconBtn}>
            <Ionicons name="call" size={18} color={colors.accentGreen} />
          </Pressable>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Text style={styles.infoLabel}>Vehicle</Text>
            <Text style={styles.infoValue}>{vehicleCode}</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{distanceMiles}</Text>
          </View>
          <View style={styles.infoPill}>
            <Text style={styles.infoLabel}>ETA</Text>
            <Text style={styles.infoValue}>{etaMinutes}</Text>
          </View>
        </View>

        <View style={styles.priceCard}>
          <View style={styles.priceCardRow}>
            <View>
              <Text style={styles.priceCardLabel}>System Estimate</Text>
              <Text style={styles.priceCardValueDark}>
                {formatCurrency(systemEstimate)}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.priceCardLabel}>Driver's Price</Text>
              <Text style={styles.priceCardValueBlue}>
                {formatCurrency(currentOffer)}
              </Text>
            </View>
          </View>
          <Text style={styles.diffText}>
            Difference:{' '}
            <Text style={{ color: difference >= 0 ? RED : colors.accentGreen }}>
              {difference >= 0 ? '+' : '-'} {formatCurrency(Math.abs(difference))}
            </Text>
          </Text>
        </View>

        <Text style={styles.sectionHint}>Negotiate a fair price with the driver</Text>

        <View style={styles.chat}>
          {messages.map((m) => (
            <View
              key={m.id}
              style={[
                styles.bubbleWrap,
                m.sender === 'user' ? styles.bubbleWrapUser : styles.bubbleWrapDriver,
              ]}
            >
              <View
                style={[
                  styles.bubble,
                  m.sender === 'user' ? styles.bubbleUser : styles.bubbleDriver,
                ]}
              >
                <Text style={styles.bubbleText}>{m.text}</Text>
              </View>
              <Text
                style={[
                  styles.bubbleTime,
                  m.sender === 'user' ? styles.bubbleTimeUser : styles.bubbleTimeDriver,
                ]}
              >
                {m.time}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
        <Text style={styles.counterLabel}>Your Counter Offer</Text>
        <View style={styles.counterRow}>
          <View style={styles.counterInputWrap}>
            <Text style={styles.currencyPrefix}>N</Text>
            <TextInput
              value={counterText}
              onChangeText={setCounterText}
              placeholder="Enter your price"
              placeholderTextColor="#B0B0B5"
              keyboardType="numeric"
              style={styles.counterInput}
            />
          </View>
          <Pressable
            onPress={handleSendCounter}
            disabled={!counterText}
            style={[styles.sendBtn, !counterText && styles.sendBtnDisabled]}
          >
            <Text
              style={[
                styles.sendBtnText,
                !counterText && styles.sendBtnTextDisabled,
              ]}
            >
              Send
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => handleAccept(currentOffer)}
          style={styles.acceptBtn}
        >
          <Text style={styles.acceptBtnText}>
            Accept {formatCurrency(currentOffer)}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backBtn: {
    marginBottom: 12,
  },
  title: {
    fontFamily: FONT,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: '#1C1C1E',
    marginBottom: 8,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerText: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7A00',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.08)',
    marginBottom: 18,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  driverAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.infoBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontFamily: FONT,
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 3,
  },
  ratingText: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  callIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E4F8EC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  infoPill: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontFamily: FONT,
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  infoValue: {
    fontFamily: FONT,
    fontSize: 14,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  priceCard: {
    marginHorizontal: 20,
    marginTop: 18,
    backgroundColor: '#F5F5F7',
    borderRadius: 18,
    padding: 18,
  },
  priceCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priceCardLabel: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#8E8E93',
    marginBottom: 4,
  },
  priceCardValueDark: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '800',
    color: '#1C1C1E',
  },
  priceCardValueBlue: {
    fontFamily: FONT,
    fontSize: 22,
    fontWeight: '800',
    color: colors.accentBlue,
  },
  diffText: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '600',
    color: '#5A5A60',
    textAlign: 'center',
    marginTop: 14,
  },
  sectionHint: {
    fontFamily: FONT,
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 22,
    marginBottom: 14,
  },
  chat: {
    paddingHorizontal: 20,
    gap: 10,
  },
  bubbleWrap: {
    maxWidth: '82%',
  },
  bubbleWrapDriver: {
    alignSelf: 'flex-start',
  },
  bubbleWrapUser: {
    alignSelf: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bubbleDriver: {
    backgroundColor: '#F0F0F2',
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: '#DFF7E6',
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontFamily: FONT,
    fontSize: 14.5,
    color: '#1C1C1E',
    lineHeight: 20,
  },
  bubbleTime: {
    fontFamily: FONT,
    fontSize: 11,
    color: '#B0B0B5',
    marginTop: 4,
  },
  bubbleTimeDriver: {
    textAlign: 'left',
  },
  bubbleTimeUser: {
    textAlign: 'right',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  counterLabel: {
    fontFamily: FONT,
    fontSize: 13,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  counterInputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.1)',
    borderRadius: 14,
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontFamily: FONT,
    fontSize: 15,
    color: '#B0B0B5',
    marginRight: 4,
  },
  counterInput: {
    flex: 1,
    fontFamily: FONT,
    fontSize: 15,
    color: '#1C1C1E',
    paddingVertical: 13,
  },
  sendBtn: {
    borderRadius: 14,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAEAEC',
  },
  sendBtnDisabled: {
    backgroundColor: '#EAEAEC',
  },
  sendBtnText: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  sendBtnTextDisabled: {
    color: '#B0B0B5',
  },
  acceptBtn: {
    backgroundColor: '#0D1B2A',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  acceptBtnText: {
    fontFamily: FONT,
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
