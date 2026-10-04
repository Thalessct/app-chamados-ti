import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { TicketStatus } from '../types/ticket';
import { colors } from '../theme/colors';

export default function StatusPill({ status }: { status: TicketStatus }) {
  const open = status === 'ABERTO';

  return (
    <View style={[styles.pill, open ? styles.openPill : styles.closedPill]}>
      <View style={[styles.dot, open ? styles.openDot : styles.closedDot]} />
      <Text style={[styles.text, open ? styles.openText : styles.closedText]}>
        {open ? 'Aberto' : 'Fechado'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  openPill: { backgroundColor: colors.primarySoft },
  closedPill: { backgroundColor: colors.surfaceMuted },
  dot: { width: 7, height: 7, borderRadius: 4 },
  openDot: { backgroundColor: colors.primary },
  closedDot: { backgroundColor: colors.textMuted },
  text: { fontSize: 12, fontWeight: '700' },
  openText: { color: colors.primary },
  closedText: { color: colors.textSecondary },
});
