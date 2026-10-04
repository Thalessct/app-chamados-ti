import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TicketCategory } from '../types/ticket';
import { colors } from '../theme/colors';
import { categoryIcons } from '../theme/categories';
import { useTabBarSpace } from '../theme/layout';
import { radius, shadows, typography } from '../theme/tokens';
import Button from '../components/Button';
import TextField from '../components/TextField';

interface Props {
  onCreate: (data: {
    title: string;
    category: TicketCategory;
    description: string;
  }) => Promise<void>;
}

const categories: TicketCategory[] = [
  'Hardware',
  'Software',
  'Rede/Internet',
  'Acesso/Conta',
  'Outros',
];

const TITLE_LIMIT = 80;
const DESCRIPTION_LIMIT = 500;

export default function NewTicketScreen({ onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Hardware');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [saving, setSaving] = useState(false);
  const tabBarSpace = useTabBarSpace();

  async function handleSubmit() {
    if (saving) return;

    const found: { title?: string; description?: string } = {};
    if (!title.trim()) found.title = 'Dê um título curto para o problema.';
    if (!description.trim()) found.description = 'Explique o que está acontecendo.';

    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    try {
      await onCreate({
        title: title.trim(),
        description: description.trim(),
        category,
      });
      setTitle('');
      setDescription('');
      setCategory('Hardware');
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.content, { paddingBottom: tabBarSpace }]}
        >
          <Text style={styles.title} accessibilityRole="header">
            Novo chamado
          </Text>
          <Text style={styles.subtitle}>
            Descreva o problema para abrir uma solicitação de suporte.
          </Text>

          <View style={styles.card}>
            <TextField
              label="Título"
              icon="create-outline"
              placeholder="Ex.: Computador não liga"
              value={title}
              onChangeText={(value) => {
                setTitle(value);
                setErrors((current) => ({ ...current, title: undefined }));
              }}
              error={errors.title}
              maxLength={TITLE_LIMIT}
              returnKeyType="next"
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {categories.map((item) => {
                const active = item === category;
                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    onPress={() => setCategory(item)}
                    style={({ pressed }) => [
                      styles.category,
                      active && styles.categoryActive,
                      pressed && styles.categoryPressed,
                    ]}
                  >
                    <Ionicons
                      name={categoryIcons[item]}
                      size={20}
                      color={active ? colors.primary : colors.textMuted}
                    />
                    <Text style={[styles.categoryText, active && styles.categoryTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <TextField
              label="Descrição"
              icon="document-text-outline"
              placeholder="Explique o que está acontecendo..."
              value={description}
              onChangeText={(value) => {
                setDescription(value);
                setErrors((current) => ({ ...current, description: undefined }));
              }}
              error={errors.description}
              counter={`${description.length}/${DESCRIPTION_LIMIT}`}
              multiline
              maxLength={DESCRIPTION_LIMIT}
            />

            <View style={styles.notice}>
              <Ionicons name="information-circle" size={20} color={colors.primary} />
              <Text style={styles.noticeText}>
                Todo chamado criado começa com o status Aberto.
              </Text>
            </View>

            <View style={styles.submit}>
              <Button label="Abrir chamado" loading={saving} onPress={handleSubmit} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  title: {
    ...typography.display,
    color: colors.onDark,
  },
  subtitle: {
    ...typography.body,
    marginTop: 6,
    color: colors.onDarkMuted,
  },
  card: {
    marginTop: 24,
    padding: 20,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    ...shadows.card,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  category: {
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  categoryActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  categoryPressed: {
    opacity: 0.8,
  },
  categoryText: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: colors.primary,
  },
  notice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  submit: {
    marginTop: 20,
  },
});
