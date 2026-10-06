import AnimatedPressable from '@/components/AnimatedPressable';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <Text style={styles.code}>404</Text>
      <Text style={styles.message}>This page doesn't exist.</Text>
      <AnimatedPressable style={styles.button} onPress={() => router.replace('/')}>
        <Text style={styles.buttonText}>Go Home</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  code: {
    fontSize: 64,
    fontWeight: '800',
    color: Colors.primary,
  },
  message: {
    fontSize: 18,
    color: Colors.subtext,
    marginTop: 8,
  },
  button: {
    marginTop: 32,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
