import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ticket } from '../types/ticket';
import { colors } from '../theme/colors';

interface TicketCardProps {
  ticket: Ticket;
  onPress: () => void;
}

export default function TicketCard({ ticket, onPress }: TicketCardProps) {
  const open = ticket.status === 'ABERTO';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <Text style={styles.id}>#{ticket.id}</Text>
        <View style={[styles.status, open ? styles.openStatus : styles.closedStatus]}>
          <View style={[styles.dot, open ? styles.openDot : styles.closedDot]} />
          <Text style={[styles.statusText, open ? styles.openText : styles.closedText]}>
            {ticket.status}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{ticket.title}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.info}>▣ {ticket.category}</Text>
        <Text style={styles.info}>◷ {ticket.createdAt}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 17,
    marginBottom: 13,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  id: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  openStatus: {
    backgroundColor: '#EFF6FF',
  },
  closedStatus: {
    backgroundColor: '#F3F4F6',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  openDot: {
    backgroundColor: colors.primary,
  },
  closedDot: {
    backgroundColor: colors.textSecondary,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  openText: {
    color: colors.primary,
  },
  closedText: {
    color: colors.textSecondary,
  },
  title: {
    marginTop: 12,
    marginBottom: 12,
    fontSize: 16,
    fontWeight: '750',
    color: colors.text,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
  },
  info: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  arrow: {
    position: 'absolute',
    right: 16,
    bottom: 14,
    fontSize: 24,
    color: colors.primary,
  },
});