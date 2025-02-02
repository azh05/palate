import { StyleSheet } from 'react-native';
import { PlatformPressable } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

type TabBarButtonProps = {
  route: {
    key: string;
    name: string;
    params?: object;
  };
  isFocused: boolean;
  options: {
    tabBarAccessibilityLabel?: string;
    tabBarButtonTestID?: string;
  };
  href: string;
  onPress: () => void;
  onLongPress: () => void;
  color: string;
};

export default function TabBarButton({
  route,
  isFocused,
  options,
  href,
  onPress,
  onLongPress,
  color,
}: TabBarButtonProps) {
  const getIconName = (routeName: string) => {
    switch (routeName) {
      case 'profile':
        return 'user';
      case 'index':
        return 'plus';
      case 'settings':
        return 'menu';
      default:
        return 'circle';
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isFocused ? 1.2 : 1, {
            damping: 15,
            stiffness: 80,
            mass: 0.5,
            velocity: 0.3
          }),
        },
      ],
    };
  }, [isFocused]);

  return (
    <PlatformPressable
      href={href}
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarButtonTestID}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.tabButton}
    >
      <Animated.View style={animatedStyle}>
        <Feather 
          name={getIconName(route.name)}
          size={24}
          color={color}
        />
      </Animated.View>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
}); 