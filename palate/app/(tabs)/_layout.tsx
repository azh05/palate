/* 
Defines the layout for the tabs. 
This is separate from the root layout.
*/

import { Tabs } from 'expo-router';
import MyTabBar from '../../components/TabBar';
import { Platform } from 'react-native';
import { Animated } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,  // This removes the header
        animation: 'fade',  // iOS fade animation
        // For Android, we'll use custom animation
        ...Platform.select({
          android: {
            animation: 'fade',
            presentation: 'transparentModal',
          },
        }),
        tabBarStyle: {}, // Remove animation config
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} /> 
      <Tabs.Screen name="index" options={{ title: 'Search' }} />
    </Tabs>
  );
}
