import { View, StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';

const tabIcons = {
  index: 'search',
  profile: 'person',
  bruh: 'log-in',
};

const tabLabels = {
  index: 'Search',
  profile: 'Profile',
  bruh: 'Login',
};

export default function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const icon = tabIcons[route.name as keyof typeof tabIcons];
        const label = tabLabels[route.name as keyof typeof tabLabels];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            route={route}
            isFocused={isFocused}
            options={options}
            href={buildHref(route.name, route.params) || ''}
            onPress={onPress}
            onLongPress={onLongPress}
            color={colors.text}
            icon={icon}
            label={label}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e9c46a',
    paddingHorizontal: 40,
    paddingTop: 16,
    paddingBottom: 20,
  }
});
