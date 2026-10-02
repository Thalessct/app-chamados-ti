import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Ticket } from '../types/ticket';
import { colors } from '../theme/colors';

interface Props {
  ticket: Ticket;
  onBack: () => void;
  onClose: () => Promise<void>;
}

export default function DetailsScreen({ ticket, onBack, onClose }: Props) {
  const open = ticket.status === 'ABERTO';

  return (
    <View style={styles.overlay}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Pressable onPress={onBack} style={styles.back}>
            <Text style={styles.backText}>‹ Voltar</Text>
          </Pressable>

          <View style={styles.headerRow}>
            <View>
              <Text style={styles.label}>Chamado #{ticket.id}</Text>
              <Text style={styles.title}>{ticket.title}</Text>
            </View>

            <View style={[styles.status, open ? styles.open : styles.closed]}>
              <Text style={[styles.statusText, open ? styles.openText : styles.closedText]}>
                {ticket.status}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <Detail label="Categoria" value={ticket.category} />
            <Detail label="Aberto em" value={ticket.createdAt} />
            {ticket.closedAt && (
              <Detail label="Fechado em" value={ticket.closedAt} />
            )}

            <Text style={styles.detailLabel}>Descrição</Text>
            <Text style={styles.description}>{ticket.description}</Text>
          </View>

          {open && (
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Text style={styles.closeButtonText}>Fechar chamado</Text>
            </Pressable>
          )}

          {!open && (
            <View style={styles.closedNotice}>
              <Text style={styles.closedNoticeTitle}>Chamado encerrado</Text>
              <Text style={styles.closedNoticeText}>
                Este chamado está fechado e não pode mais ser alterado.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  back: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingRight: 12,
  },
  backText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    maxWidth: 235,
    marginTop: 5,
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '800',
    color: colors.text,
  },
  status: {
    marginTop: 4,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  open: {
    backgroundColor: '#EFF6FF',
  },
  closed: {
    backgroundColor: '#E5E7EB',
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
  card: {
    marginTop: 24,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  detail: {
    marginBottom: 18,
  },
  detailLabel: {
    marginBottom: 5,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  detailValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  description: {
    color: colors.text,
    lineHeight: 21,
    fontSize: 14,
  },
  closeButton: {
    marginTop: 18,
    minHeight: 54,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  closeButtonPressed: {
    backgroundColor: colors.primaryDark,
  },
  closeButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  closedNotice: {
    marginTop: 18,
    padding: 15,
    borderRadius: 15,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closedNoticeTitle: {
    color: colors.text,
    fontWeight: '800',
  },
  closedNoticeText: {
    marginTop: 5,
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
});