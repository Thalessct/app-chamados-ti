import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { IconName } from '../theme/categories';
import { radius, shadows } from '../theme/tokens';

interface StatCardProps {
  value: number;
  label: string;
  icon: IconName;
  variant?: 'primary' | 'light';
}

export default function StatCard({ value, label, icon, variant = 'light' }: StatCardProps) {
  const primary = variant === 'primary';

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.card, primary ? styles.primaryCard : styles.lightCard]}
    >
      <View style={[styles.iconTile, primary ? styles.primaryTile : styles.lightTile]}>
        <Ionicons name={icon} size={20} color={primary ? colors.white : colors.primary} />
      </View>

      <View>
        <Text style={[styles.value, primary && styles.onPrimary]}>{value}</Text>
        <Text style={[styles.label, primary && styles.onPrimaryMuted]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 132,
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: radius.xl,
  },
  primaryCard: {
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  lightCard: {
    backgroundColor: colors.white,
    ...shadows.card,
  },
  iconTile: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  primaryTile: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  lightTile: {
    backgroundColor: colors.primarySoft,
  },
  value: {
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
  },
  label: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  onPrimary: {
    color: colors.white,
  },
  onPrimaryMuted: {
    color: 'rgba(255,255,255,0.82)',
  },
});
