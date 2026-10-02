import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

import DashboardScreen from './src/screens/DashboardScreen';
import NewTicketScreen from './src/screens/NewTicketScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { Ticket, TicketStatus } from './src/types/ticket';
import { colors } from './src/theme/colors';

export type RootTabParamList = {
  Chamados: undefined;
  Novo: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

const STORAGE_KEY = '@chamados_ti:tickets';

const initialTickets: Ticket[] = [
  {
    id: '0003',
    title: 'Computador não liga',
    category: 'Hardware',
    description: 'Meu computador não apresenta nenhum sinal de energia desde esta manhã.',
    status: 'ABERTO',
    createdAt: '02/10/2026',
  },
  {
    id: '0002',
    title: 'Problema com impressora',
    category: 'Hardware',
    description: 'A impressora do setor não está realizando a impressão dos documentos.',
    status: 'FECHADO',
    createdAt: '01/10/2026',
    closedAt: '01/10/2026',
  },
];

export default function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  async function loadTickets() {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      setTickets(saved ? JSON.parse(saved) : initialTickets);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar os chamados.');
      setTickets(initialTickets);
    } finally {
      setLoading(false);
    }
  }

  async function persistTickets(nextTickets: Ticket[]) {
    setTickets(nextTickets);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextTickets));
  }

  async function addTicket(data: Omit<Ticket, 'id' | 'status' | 'createdAt'>) {
    const nextId = String(
      Math.max(0, ...tickets.map((ticket) => Number(ticket.id))) + 1
    ).padStart(4, '0');

    const today = new Date().toLocaleDateString('pt-BR');

    const newTicket: Ticket = {
      ...data,
      id: nextId,
      status: 'ABERTO',
      createdAt: today,
    };

    await persistTickets([newTicket, ...tickets]);
  }

  async function closeTicket(id: string) {
    const today = new Date().toLocaleDateString('pt-BR');

    const updated = tickets.map((ticket) =>
      ticket.id === id
        ? { ...ticket, status: 'FECHADO' as TicketStatus, closedAt: today }
        : ticket
    );

    await persistTickets(updated);
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Carregando chamados...</Text>
      </View>
    );
  }

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textSecondary,
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
          }}
        >
          <Tab.Screen
            name="Chamados"
            options={{ tabBarIcon: () => <Text style={styles.tabIcon}>▣</Text> }}
          >
            {({ navigation }) => (
              <DashboardScreen
                tickets={tickets}
                onNewTicket={() => navigation.navigate('Novo')}
                onSelectTicket={(id) => setSelectedTicketId(id)}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Novo"
            options={{ tabBarIcon: () => <Text style={styles.tabIcon}>＋</Text> }}
          >
            {({ navigation }) => (
              <NewTicketScreen
                onCreate={async (data) => {
                  await addTicket(data);
                  Alert.alert('Chamado criado', 'Seu chamado foi aberto com sucesso.');
                  navigation.navigate('Chamados');
                }}
              />
            )}
          </Tab.Screen>

          <Tab.Screen
            name="Perfil"
            options={{ tabBarIcon: () => <Text style={styles.tabIcon}>●</Text> }}
          >
            {() => <ProfileScreen totalTickets={tickets.length} />}
          </Tab.Screen>
        </Tab.Navigator>

        {selectedTicket && (
          <DetailsScreen
            ticket={selectedTicket}
            onClose={async () => {
              await closeTicket(selectedTicket.id);
              setSelectedTicketId(null);
            }}
            onBack={() => setSelectedTicketId(null)}
          />
        )}
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    color: colors.textSecondary,
    fontSize: 14,
  },
  tabBar: {
    height: 68,
    paddingBottom: 8,
    paddingTop: 5,
    backgroundColor: colors.white,
    borderTopColor: colors.border,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  tabIcon: {
    fontSize: 20,
    color: colors.primary,
  },
});
