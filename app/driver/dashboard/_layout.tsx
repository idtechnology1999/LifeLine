import { Tabs } from 'expo-router';
import CustomTabBar from '@/components/CustomTabBar';
import { DriverRequestProvider } from '@/components/DriverRequestContext';

export default function DriverDashboardTabLayout() {
  return (
    <DriverRequestProvider>
      <Tabs
        tabBar={(props) => <CustomTabBar {...props} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Home' }} />
        <Tabs.Screen name="request" options={{ title: 'Request' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </DriverRequestProvider>
  );
}
