/* 
A stack navigator is the foundation for navigating between different screens in an app. 
On Android, a stacked route animates on top of the current screen. 
On iOS, a stacked route animates from the right. 
Expo Router provides a Stack component to create a navigation stack to add new routes.

It defines shared UI elements such as headers and tab bars so they are consistent between different routes.

Use this to route between screens in your app.
*/

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import useFonts from '../hooks/useFonts';
import * as SplashScreen from 'expo-splash-screen';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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