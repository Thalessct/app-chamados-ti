import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { getPasswordStrength } from '../utils/validation';

export default function PasswordStrength({ password }: { password: string }) {
  const { level, label } = getPasswordStrength(password);
  if (level === 0) return null;

  const tone = level === 1 ? colors.danger : colors.primary;

  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityLabel={`Força da senha: ${label}`}
    >
      <View style={styles.bars}>
        {[1, 2, 3, 4].map((segment) => (
          <View
            key={segment}
            style={[styles.bar, segment <= level && { backgroundColor: tone }]}
          />
        ))}
      </View>
      <Text style={[styles.label, { color: tone }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: -4,
    marginBottom: 16,
  },
  bars: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  bar: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  label: {
    minWidth: 62,
    textAlign: 'right',
    fontSize: 12,
    fontWeight: '700',
  },
});
