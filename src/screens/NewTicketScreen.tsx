import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { TicketCategory } from '../types/ticket';
import { colors } from '../theme/colors';

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

export default function NewTicketScreen({ onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TicketCategory>('Hardware');
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha o título e a descrição.');
      return;
    }

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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <Text style={styles.title}>Novo chamado</Text>
          <Text style={styles.subtitle}>
            Descreva o problema para abrir uma solicitação de suporte.
          </Text>

          <View style={styles.form}>
            <Text style={styles.label}>Título</Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Ex.: Computador não liga"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              maxLength={80}
            />

            <Text style={styles.label}>Categoria</Text>
            <View style={styles.categoryGrid}>
              {categories.map((item) => {
                const active = item === category;
                return (
                  <Pressable
                    key={item}
                    onPress={() => setCategory(item)}
                    style={[styles.category, active && styles.categoryActive]}
                  >
                    <Text
                      style={[
                        styles.categoryText,
                        active && styles.categoryTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Explique o que está acontecendo..."
              placeholderTextColor="#9CA3AF"
              style={[styles.input, styles.textArea]}
              multiline
              textAlignVertical="top"
              maxLength={500}
            />

            <View style={styles.notice}>
              <Text style={styles.noticeTitle}>Status inicial</Text>
              <Text style={styles.noticeText}>
                Todo chamado criado começa automaticamente como ABERTO.
              </Text>
            </View>

            <Pressable
              onPress={handleSubmit}
              disabled={saving}
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
                saving && styles.buttonDisabled,
              ]}
            >
              <Text style={styles.buttonText}>
                {saving ? 'Abrindo chamado...' : 'Abrir chamado'}
              </Text>
            </Pressable>
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
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  subtitle: {
    marginTop: 5,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  form: {
    marginTop: 25,
  },
  label: {
    marginBottom: 8,
    marginTop: 16,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: 15,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    color: colors.text,
    fontSize: 15,
  },
  textArea: {
    minHeight: 140,
    paddingTop: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  category: {
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  categoryActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  categoryTextActive: {
    color: colors.white,
  },
  notice: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  noticeTitle: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  noticeText: {
    marginTop: 4,
    color: colors.textSecondary,
    lineHeight: 18,
    fontSize: 12,
  },
  button: {
    marginTop: 22,
    minHeight: 54,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  buttonPressed: {
    backgroundColor: colors.primaryDark,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
});