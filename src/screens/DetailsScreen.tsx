import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ticket } from '../types/ticket';
import { colors } from '../theme/colors';
import { categoryIcons, IconName } from '../theme/categories';
import { radius, shadows, typography } from '../theme/tokens';
import Button from '../components/Button';
import StatusPill from '../components/StatusPill';

interface Props {
  ticket: Ticket;
  onBack: () => void;
  onClose: () => Promise<void>;
}

export default function DetailsScreen({ ticket, onBack, onClose }: Props) {
  const open = ticket.status === 'ABERTO';
  const [closing, setClosing] = useState(false);

  async function handleClose() {
    if (closing) return;
    setClosing(true);
    try {
      await onClose();
    } finally {
      setClosing(false);
    }
  }

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            onPress={onBack}
            style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.onDark} />
          </Pressable>
          <Text style={styles.topTitle}>Chamado #{ticket.id}</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <StatusPill status={ticket.status} />
          <Text style={styles.title} accessibilityRole="header">
            {ticket.title}
          </Text>

          <View style={styles.card}>
            <Detail
              icon={categoryIcons[ticket.category]}
              label="Categoria"
              value={ticket.category}
            />
            <Detail icon="calendar-outline" label="Aberto em" value={ticket.createdAt} />
            {ticket.closedAt ? (
              <Detail
                icon="checkmark-circle-outline"
                label="Fechado em"
                value={ticket.closedAt}
              />
            ) : null}

            <View style={styles.divider} />

            <Text style={styles.descriptionLabel}>Descrição</Text>
            <Text style={styles.description}>{ticket.description}</Text>
          </View>

          {open ? (
            <View style={styles.action}>
              <Button
                label="Fechar chamado"
                icon="checkmark-done-outline"
                loading={closing}
                onPress={handleClose}
              />
            </View>
          ) : (
            <View style={styles.closedNotice}>
              <Ionicons name="lock-closed" size={20} color={colors.onDark} />
              <View style={styles.closedNoticeBody}>
                <Text style={styles.closedNoticeTitle}>Chamado encerrado</Text>
                <Text style={styles.closedNoticeText}>
                  Este chamado está fechado e não pode mais ser alterado.
                </Text>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Detail({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  backPressed: {
    backgroundColor: colors.onDarkFaint,
  },
  topTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.onDark,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    ...typography.display,
    marginTop: 14,
    color: colors.onDark,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 18,
  },
  detailIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  detailValue: {
    marginTop: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  divider: {
    height: 1,
    marginBottom: 16,
    backgroundColor: colors.border,
  },
  descriptionLabel: {
    marginBottom: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  description: {
    ...typography.body,
    color: colors.text,
  },
  action: {
    marginTop: 20,
  },
  closedNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: 20,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.onDarkFaint,
  },
  closedNoticeBody: {
    flex: 1,
  },
  closedNoticeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.onDark,
  },
  closedNoticeText: {
    marginTop: 4,
    fontSize: 13,
    lineHeight: 19,
    color: colors.onDarkMuted,
  },
});
