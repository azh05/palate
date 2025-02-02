/* 
Defines the layout for the tabs. 
This is separate from the root layout.
*/

import { Tabs } from 'expo-router';
import MyTabBar from '../../components/TabBar';


export default function TabLayout() {
  return (
    <Tabs tabBar={props => <MyTabBar {...props} />}>
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} /> 
      <Tabs.Screen name="index" options={{ title: 'Search' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="Bruh" options={{ title: 'Bruh' }} />
    </Tabs>
  );
}
