import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

interface FilterChipProps {
  label: string;
  active: boolean;
  count?: number;
  onPress: () => void;
}

export default function FilterChip({ label, active, count, onPress }: FilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        active && styles.activeChip,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, active && styles.activeText]}>{label}</Text>

      {count !== undefined ? (
        <View style={[styles.badge, active && styles.activeBadge]}>
          <Text style={[styles.badgeText, active && styles.activeBadgeText]}>{count}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 8,
    borderRadius: 20,
    backgroundColor: colors.onDarkFaint,
  },
  activeChip: {
    backgroundColor: colors.white,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.onDark,
  },
  activeText: {
    color: colors.text,
  },
  badge: {
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 7,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  activeBadge: {
    backgroundColor: colors.primarySoft,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.onDark,
  },
  activeBadgeText: {
    color: colors.primary,
  },
});
