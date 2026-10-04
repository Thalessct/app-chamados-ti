import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { IconName } from '../theme/categories';
import { TAB_BAR_HEIGHT, TAB_BAR_MARGIN } from '../theme/layout';
import { shadows } from '../theme/tokens';

const icons: Record<string, { active: IconName; inactive: IconName }> = {
  Chamados: { active: 'file-tray-full', inactive: 'file-tray-full-outline' },
  Novo: { active: 'add-circle', inactive: 'add-circle-outline' },
  Perfil: { active: 'person', inactive: 'person-outline' },
};

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { bottom: Math.max(insets.bottom, TAB_BAR_MARGIN) }]}
    >
      <View style={styles.bar}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const { options } = descriptors[route.key];
          const label =
            typeof options.tabBarLabel === 'string'
              ? options.tabBarLabel
              : options.title ?? route.name;
          const icon = icons[route.name] ?? icons.Chamados;
          const isAction = route.name === 'Novo';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.item,
                isAction && !focused && styles.itemAction,
                focused && styles.itemActive,
                pressed && styles.itemPressed,
              ]}
            >
              <Ionicons
                name={focused ? icon.active : icon.inactive}
                size={22}
                color={focused ? colors.white : isAction ? colors.primary : colors.textMuted}
              />
              {focused ? <Text style={styles.label}>{label}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  bar: {
    width: '100%',
    maxWidth: 420,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderRadius: TAB_BAR_HEIGHT / 2,
    backgroundColor: colors.white,
    ...shadows.float,
  },
  item: {
    height: 46,
    minWidth: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 23,
  },
  itemAction: {
    backgroundColor: colors.primarySoft,
  },
  itemActive: {
    paddingHorizontal: 20,
    backgroundColor: colors.primary,
  },
  itemPressed: {
    opacity: 0.8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
  },
});
