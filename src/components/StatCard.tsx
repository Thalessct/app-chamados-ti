import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface StatCardProps {
  value: number;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 92,
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 5,
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  label: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});