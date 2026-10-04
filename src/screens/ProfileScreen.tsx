import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SessionUser } from '../types/user';
import { colors } from '../theme/colors';
import { useTabBarSpace } from '../theme/layout';
import { radius, shadows, typography } from '../theme/tokens';
import Button from '../components/Button';

interface Props {
  user: SessionUser;
  totalTickets: number;
  openTickets: number;
  onLogout: () => void;
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '?';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function ProfileScreen({ user, totalTickets, openTickets, onLogout }: Props) {
  const tabBarSpace = useTabBarSpace();

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarSpace }]}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
        </View>

        <Text style={styles.name} accessibilityRole="header">
          {user.name}
        </Text>
        <Text style={styles.email}>{user.email}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{totalTickets}</Text>
            <Text style={styles.statLabel}>Chamados registrados</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={[styles.statValue, styles.statValuePrimary]}>{openTickets}</Text>
            <Text style={styles.statLabel}>Em aberto</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="calendar-outline" size={20} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.rowLabel}>Conta criada em</Text>
              <Text style={styles.rowValue}>{user.createdAt}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Ionicons name="headset-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.rowBody}>
              <Text style={styles.rowLabel}>Sobre o app</Text>
              <Text style={styles.about}>
                Chamados TI: aplicativo acadêmico para abertura e acompanhamento de chamados de
                suporte.
              </Text>
            </View>
          </View>

          <Button label="Sair da conta" icon="log-out-outline" variant="outline" onPress={onLogout} />
        </View>
      </ScrollView>
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
    paddingTop: 28,
    alignItems: 'center',
  },
  avatar: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 48,
    borderWidth: 4,
    borderColor: colors.onDarkFaint,
    backgroundColor: colors.primary,
  },
  avatarText: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    color: colors.white,
  },
  name: {
    ...typography.title,
    marginTop: 16,
    textAlign: 'center',
    color: colors.onDark,
  },
  email: {
    ...typography.body,
    marginTop: 4,
    color: colors.onDarkMuted,
  },
  stats: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    paddingVertical: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statDivider: {
    width: 1,
    height: 44,
    backgroundColor: colors.border,
  },
  statValue: {
    fontSize: 32,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: -1,
    color: colors.text,
  },
  statValuePrimary: {
    color: colors.primary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: colors.textSecondary,
  },
  card: {
    width: '100%',
    marginTop: 14,
    padding: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  rowIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  rowBody: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  rowValue: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  about: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
