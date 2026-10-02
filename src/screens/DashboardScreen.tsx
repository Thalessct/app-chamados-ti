import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ticket, TicketStatus } from '../types/ticket';
import { colors } from '../theme/colors';
import StatCard from '../components/StatCard';
import FilterChip from '../components/FilterChip';
import TicketCard from '../components/TicketCard';

interface Props {
  tickets: Ticket[];
  onNewTicket: () => void;
  onSelectTicket: (id: string) => void;
}

type Filter = 'TODOS' | TicketStatus;

export default function DashboardScreen({
  tickets,
  onNewTicket,
  onSelectTicket,
}: Props) {
  const [filter, setFilter] = useState<Filter>('TODOS');

  const openCount = tickets.filter((ticket) => ticket.status === 'ABERTO').length;
  const closedCount = tickets.filter((ticket) => ticket.status === 'FECHADO').length;

  const filteredTickets = useMemo(() => {
    if (filter === 'TODOS') return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [filter, tickets]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá! 👋</Text>
        <Text style={styles.subtitle}>Acompanhe seus chamados</Text>
      </View>

      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <>
            <View style={styles.statsRow}>
              <StatCard value={openCount} label="Chamados abertos" />
              <StatCard value={closedCount} label="Chamados fechados" />
            </View>

            <Text style={styles.sectionTitle}>Meus chamados</Text>

            <View style={styles.filters}>
              <FilterChip
                label="Todos"
                active={filter === 'TODOS'}
                onPress={() => setFilter('TODOS')}
              />
              <FilterChip
                label="Abertos"
                active={filter === 'ABERTO'}
                onPress={() => setFilter('ABERTO')}
              />
              <FilterChip
                label="Fechados"
                active={filter === 'FECHADO'}
                onPress={() => setFilter('FECHADO')}
              />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => onSelectTicket(item.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>□</Text>
            <Text style={styles.emptyTitle}>Nenhum chamado encontrado</Text>
            <Text style={styles.emptyText}>
              Crie um novo chamado para começar.
            </Text>
          </View>
        }
      />

      <Pressable
        accessibilityLabel="Criar novo chamado"
        onPress={onNewTicket}
        style={({ pressed }) => [styles.fab, pressed && styles.fabPressed]}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 27,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -5,
    marginTop: 8,
    marginBottom: 26,
  },
  sectionTitle: {
    marginBottom: 12,
    fontSize: 19,
    fontWeight: '800',
    color: colors.text,
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 30,
  },
  emptyIcon: {
    fontSize: 38,
    color: colors.primary,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  emptyText: {
    marginTop: 5,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 18,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
  },
  fabPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.96 }],
  },
  fabText: {
    color: colors.white,
    fontSize: 32,
    lineHeight: 34,
    fontWeight: '300',
  },
});