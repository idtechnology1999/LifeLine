import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, router } from 'expo-router';
import { getToken } from '@/services/auth';

export default function DispatcherLayout() {
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      if (!token) {
        router.replace({ pathname: '/auth', params: { redirectTo: '/dispatcher/ride-details' } });
        return;
      }
      if (!cancelled) setAuthorized(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!authorized) {
    return (
      <View style={{ flex: 1, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#0F172A" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
