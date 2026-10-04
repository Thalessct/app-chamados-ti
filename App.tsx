import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import DashboardScreen from './src/screens/DashboardScreen';
import NewTicketScreen from './src/screens/NewTicketScreen';
import DetailsScreen from './src/screens/DetailsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import LoginScreen from './src/screens/LoginScreen';
import CadScreen from './src/screens/CadScreen';
import TabBar from './src/components/TabBar';
import {
  AuthResult,
  RegisterData,
  registerUser,
  restoreSession,
  signIn,
  signOut,
} from './src/services/auth';
import { Ticket, TicketStatus } from './src/types/ticket';
import { SessionUser } from './src/types/user';
import { colors } from './src/theme/colors';
import { radius, shadows } from './src/theme/tokens';

export type RootTabParamList = {
  Chamados: undefined;
  Novo: undefined;
  Perfil: undefined;
};

type AuthMode = 'login' | 'register';

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
  const [user, setUser] = useState<SessionUser | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bootstrap();
  }, []);

  async function bootstrap() {
    try {
      const [saved, session] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        restoreSession(),
      ]);
      setTickets(saved ? JSON.parse(saved) : initialTickets);
      setUser(session);
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

  async function handleLogin(email: string, password: string): Promise<AuthResult> {
    const result = await signIn(email, password);
    if (result.ok) setUser(result.user);
    return result;
  }

  async function handleRegister(data: RegisterData): Promise<AuthResult> {
    const result = await registerUser(data);
    if (result.ok) setUser(result.user);
    return result;
  }

  async function handleLogout() {
    await signOut();
    setSelectedTicketId(null);
    setAuthMode('login');
    setUser(null);
  }

  if (loading) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <View style={styles.loading}>
          <View style={styles.logo}>
            <Ionicons name="headset" size={32} color={colors.white} />
          </View>
          <ActivityIndicator style={styles.spinner} size="small" color={colors.onDark} />
          <Text style={styles.loadingText}>Carregando...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        {authMode === 'login' ? (
          <LoginScreen
            onLogin={handleLogin}
            onGoToRegister={() => setAuthMode('register')}
          />
        ) : (
          <CadScreen
            onRegister={handleRegister}
            onGoToLogin={() => setAuthMode('login')}
          />
        )}
      </SafeAreaProvider>
    );
  }

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedTicketId);
  const openTickets = tickets.filter((ticket) => ticket.status === 'ABERTO').length;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{ headerShown: false }}
          tabBar={(props) => <TabBar {...props} />}
        >
          <Tab.Screen name="Chamados">
            {({ navigation }) => (
              <DashboardScreen
                tickets={tickets}
                userName={user.name}
                onNewTicket={() => navigation.navigate('Novo')}
                onSelectTicket={(id) => setSelectedTicketId(id)}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Novo">
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

          <Tab.Screen name="Perfil">
            {() => (
              <ProfileScreen
                user={user}
                totalTickets={tickets.length}
                openTickets={openTickets}
                onLogout={handleLogout}
              />
            )}
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
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  logo: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  spinner: {
    marginTop: 28,
  },
  loadingText: {
    marginTop: 12,
    color: colors.onDarkMuted,
    fontSize: 14,
  },
});
