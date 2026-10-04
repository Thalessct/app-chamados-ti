import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Ticket } from '../types/ticket';
import { colors } from '../theme/colors';
import { categoryIcons } from '../theme/categories';
import { radius, shadows } from '../theme/tokens';
import StatusPill from './StatusPill';

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

export default function TicketCard({ ticket, onPress }: TicketCardProps) {
  const statusLabel = ticket.status === 'ABERTO' ? 'aberto' : 'fechado';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Chamado ${ticket.id}, ${ticket.title}, ${statusLabel}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconTile}>
        <Ionicons name={categoryIcons[ticket.category]} size={24} color={colors.primary} />
      </View>

      <View style={styles.body}>
        <View style={styles.topRow}>
          <Text style={styles.id}>#{ticket.id}</Text>
          <StatusPill status={ticket.status} />
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {ticket.title}
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.info}>{ticket.category}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={14} color={colors.textMuted} />
            <Text style={styles.info}>{ticket.createdAt}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: 14,
    padding: 16,
    marginBottom: 12,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  iconTile: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
  },
  body: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  id: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
  },
  title: {
    marginTop: 8,
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: colors.text,
  },
  infoRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    columnGap: 16,
    rowGap: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  info: {
    fontSize: 13,
    color: colors.textMuted,
  },
});
