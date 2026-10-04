import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ticket, TicketStatus } from '../types/ticket';
import { colors } from '../theme/colors';
import { useTabBarSpace } from '../theme/layout';
import { radius, typography } from '../theme/tokens';
import StatCard from '../components/StatCard';
import FilterChip from '../components/FilterChip';
import TicketCard from '../components/TicketCard';
import Button from '../components/Button';

interface Props {
  tickets: Ticket[];
  userName: string;
  onNewTicket: () => void;
  onSelectTicket: (id: string) => void;
}

type Filter = 'TODOS' | TicketStatus;

const emptyMessages: Record<Filter, { title: string; text: string }> = {
  TODOS: {
    title: 'Nenhum chamado por aqui',
    text: '',
  },
  ABERTO: {
    title: 'Nenhum chamado aberto',
    text: 'Tudo resolvido por enquanto. Abra um novo chamado se surgir algo.',
  },
  FECHADO: {
    title: 'Nenhum chamado fechado',
    text: 'Os chamados encerrados aparecem aqui.',
  },
};

export default function DashboardScreen({
  tickets,
  userName,
  onNewTicket,
  onSelectTicket,
}: Props) {
  const [filter, setFilter] = useState<Filter>('TODOS');
  const tabBarSpace = useTabBarSpace();

  const openCount = tickets.filter((ticket) => ticket.status === 'ABERTO').length;
  const closedCount = tickets.filter((ticket) => ticket.status === 'FECHADO').length;
  const firstName = userName.trim().split(/\s+/)[0];

  const filteredTickets = useMemo(() => {
    if (filter === 'TODOS') return tickets;
    return tickets.filter((ticket) => ticket.status === filter);
  }, [filter, tickets]);

  const empty = emptyMessages[filter];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpace }]}
        ListHeaderComponent={
          <View>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>Olá, {firstName}</Text>
                <Text style={styles.title} accessibilityRole="header">
                  Meus chamados
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Abrir novo chamado"
                onPress={onNewTicket}
                style={({ pressed }) => [styles.newButton, pressed && styles.newButtonPressed]}
              >
                <Ionicons name="add" size={20} color={colors.white} />
                <Text style={styles.newButtonText}>Novo</Text>
              </Pressable>
            </View>

            <View style={styles.statsRow}>
              <StatCard
                variant="primary"
                icon="folder-open-outline"
                value={openCount}
                label="Chamados abertos"
              />
              <StatCard
                icon="checkmark-done-outline"
                value={closedCount}
                label="Chamados fechados"
              />
            </View>

            <View style={styles.filters}>
              <FilterChip
                label="Todos"
                count={tickets.length}
                active={filter === 'TODOS'}
                onPress={() => setFilter('TODOS')}
              />
              <FilterChip
                label="Abertos"
                count={openCount}
                active={filter === 'ABERTO'}
                onPress={() => setFilter('ABERTO')}
              />
              <FilterChip
                label="Fechados"
                count={closedCount}
                active={filter === 'FECHADO'}
                onPress={() => setFilter('FECHADO')}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TicketCard ticket={item} onPress={() => onSelectTicket(item.id)} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="file-tray-outline" size={30} color={colors.white} />
            </View>
            <Text style={styles.emptyTitle}>{empty.title}</Text>
            <Text style={styles.emptyText}>{empty.text}</Text>
            {filter === 'TODOS' ? (
              <View style={styles.emptyAction}>
                <Button label="Abrir chamado" icon="add" onPress={onNewTicket} />
              </View>
            ) : null}
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    ...typography.body,
    color: colors.onDarkMuted,
  },
  title: {
    ...typography.display,
    marginTop: 2,
    color: colors.onDark,
  },
  newButton: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 12,
    paddingRight: 18,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  newButtonPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.97 }],
  },
  newButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 24,
    marginBottom: 16,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 36,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 68,
    height: 68,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 34,
    backgroundColor: colors.onDarkFaint,
  },
  emptyTitle: {
    ...typography.heading,
    marginTop: 16,
    color: colors.onDark,
  },
  emptyText: {
    ...typography.body,
    marginTop: 6,
    textAlign: 'center',
    color: colors.onDarkMuted,
  },
  emptyAction: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});
