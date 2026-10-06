import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';
import { DispatcherOrderProvider } from '@/components/DispatcherOrderContext';

export default function DispatcherDashboardTabLayout() {
  return (
    <DispatcherOrderProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="order" options={{ title: 'Order' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </DispatcherOrderProvider>
  );
}
