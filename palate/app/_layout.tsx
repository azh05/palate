/* 
A stack navigator is the foundation for navigating between different screens in an app. 
On Android, a stacked route animates on top of the current screen. 
On iOS, a stacked route animates from the right. 
Expo Router provides a Stack component to create a navigation stack to add new routes.

It defines shared UI elements such as headers and tab bars so they are consistent between different routes.

Use this to route between screens in your app.
*/

import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SegoeUI': require('../assets/fonts/SegoeUI.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}