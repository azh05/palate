import React, { useEffect } from 'react';
import { Animated } from 'react-native';

interface FadeViewProps {
  children: React.ReactNode;
  style?: any;
}

export default function FadeView({ children, style }: FadeViewProps) {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    };
  }, []);

  return (
    <Animated.View
      style={[
        {
          opacity: fadeAnim,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
} 