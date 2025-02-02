import { useEffect, useState } from 'react';
import * as Font from 'expo-font';

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Bodoni': require('../assets/fonts/BodoniflfRoman-vmAD.ttf'),
        'Bodoni-Bold': require('../assets/fonts/BodoniflfBold-MVZx.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return fontsLoaded;
} 