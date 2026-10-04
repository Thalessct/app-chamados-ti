import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import TextField from '../components/TextField';
import { AuthResult } from '../services/auth';
import { colors } from '../theme/colors';
import { typography } from '../theme/tokens';
import { isValidEmail } from '../utils/validation';

interface Props {
  onLogin: (email: string, password: string) => Promise<AuthResult>;
  onGoToRegister: () => void;
}

interface Errors {
  email?: string;
  password?: string;
  form?: string;
}

export default function LoginScreen({ onLogin, onGoToRegister }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

  function validate(): Errors {
    const next: Errors = {};

    if (!email.trim()) next.email = 'Informe seu e-mail.';
    else if (!isValidEmail(email)) next.email = 'Digite um e-mail válido, como nome@empresa.com.';

    if (!password) next.password = 'Informe sua senha.';

    return next;
  }

  async function handleSubmit() {
    if (loading) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const result = await onLogin(email, password);
      if (!result.ok) {
        setErrors({ [result.field]: result.message } as Errors);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      showBrand
      centerred
      title="Sistema de Gerenciamento de Chamados"
      subtitle=""
    >
      <Text style={styles.heading}>Bem-vindo de volta</Text>
      <Text style={styles.description}>Entre para acompanhar seus chamados.</Text>

      {errors.form ? (
        <View style={styles.banner} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={20} color={colors.danger} />
          <Text style={styles.bannerText}>{errors.form}</Text>
        </View>
      ) : null}

      <TextField
        label="E-mail"
        icon="mail-outline"
        placeholder="nome@gmail.com"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors((current) => ({ ...current, email: undefined, form: undefined }));
        }}
        error={errors.email}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
        blurOnSubmit={false}
      />

      <TextField
        ref={passwordRef}
        label="Senha"
        icon="lock-closed-outline"
        placeholder="Digite sua senha"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setErrors((current) => ({ ...current, password: undefined, form: undefined }));
        }}
        error={errors.password}
        secure
        autoCapitalize="none"
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.submit}>
        <Button label="Entrar" loading={loading} onPress={handleSubmit} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem conta?</Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Criar conta"
          hitSlop={10}
          onPress={onGoToRegister}
        >
          <Text style={styles.link}>Criar conta</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  heading: {
    ...typography.title,
    color: colors.text,
  },
  description: {
    ...typography.body,
    marginTop: 4,
    marginBottom: 24,
    color: colors.textSecondary,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    padding: 14,
    borderRadius: 14,
    backgroundColor: colors.dangerSoft,
  },
  bannerText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.danger,
    fontWeight: '500',
  },
  submit: {
    marginTop: 8,
  },
  footer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  link: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
});
