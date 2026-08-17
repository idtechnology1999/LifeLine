import { Tabs } from 'expo-router';
import CustomTabBar from '../../components/CustomTabBar';

export default function RequesterTabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="request" options={{ title: 'Request' }} />
      <Tabs.Screen name="order" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
