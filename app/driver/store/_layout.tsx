import { Stack } from 'expo-router';
import { StoreProvider } from '@/components/StoreContext';

export default function StoreLayout() {
  return (
    <StoreProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-product" />
        <Stack.Screen name="product-added" />
        <Stack.Screen name="delivery-tracking" />
        <Stack.Screen name="delivery-complete" />
      </Stack>
    </StoreProvider>
  );
}
