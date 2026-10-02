import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface Props {
  totalTickets: number;
}

export default function ProfileScreen({ totalTickets }: Props) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>U</Text>
        </View>

        <Text style={styles.name}>Usuário</Text>
        <Text style={styles.email}>usuario@empresa.com</Text>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Chamados registrados</Text>
          <Text style={styles.cardValue}>{totalTickets}</Text>
        </View>

        <View style={styles.about}>
          <Text style={styles.aboutTitle}>Chamados TI</Text>
          <Text style={styles.aboutText}>
            Aplicativo acadêmico para abertura e acompanhamento de chamados de TI.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    alignItems: 'center',
  },
  avatar: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    marginTop: 35,
  },
  avatarText: {
    color: colors.white,
    fontSize: 30,
    fontWeight: '800',
  },
  name: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  email: {
    marginTop: 4,
    color: colors.textSecondary,
  },
  card: {
    width: '100%',
    marginTop: 30,
    padding: 20,
    borderRadius: 18,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  cardLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  cardValue: {
    marginTop: 5,
    color: colors.primary,
    fontSize: 30,
    fontWeight: '800',
  },
  about: {
    width: '100%',
    marginTop: 14,
    padding: 20,
    borderRadius: 18,
    backgroundColor: colors.white,
  },
  aboutTitle: {
    color: colors.text,
    fontWeight: '800',
    fontSize: 16,
  },
  aboutText: {
    marginTop: 6,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});