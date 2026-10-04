import React, { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import AuthLayout from '../components/AuthLayout';
import Button from '../components/Button';
import PasswordStrength from '../components/PasswordStrength';
import TextField from '../components/TextField';
import { AuthResult, RegisterData } from '../services/auth';
import { colors } from '../theme/colors';
import { isValidEmail, MIN_PASSWORD_LENGTH } from '../utils/validation';

interface Props {
  onRegister: (data: RegisterData) => Promise<AuthResult>;
  onGoToLogin: () => void;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
}

export default function CadScreen({ onRegister, onGoToLogin }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  function clear(field: keyof Errors) {
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }));
  }

  function validate(): Errors {
    const next: Errors = {};

    if (name.trim().length < 2) next.name = 'Informe seu nome.';

    if (!email.trim()) next.email = 'Informe seu e-mail.';
    else if (!isValidEmail(email)) next.email = 'Digite um e-mail válido, como nome@empresa.com.';

    if (password.length < MIN_PASSWORD_LENGTH) {
      next.password = `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
    }

    if (!confirm) next.confirm = 'Repita a senha para confirmar.';
    else if (confirm !== password) next.confirm = 'As senhas não coincidem.';

    return next;
  }

  async function handleSubmit() {
    if (loading) return;

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const result = await onRegister({ name, email, password });
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
      title="Criar conta"
      subtitle=""
      onBack={onGoToLogin}
    >
      {errors.form ? (
        <View style={styles.banner} accessibilityLiveRegion="polite">
          <Ionicons name="alert-circle" size={20} color={colors.danger} />
          <Text style={styles.bannerText}>{errors.form}</Text>
        </View>
      ) : null}

      <TextField
        label="Nome completo"
        icon="person-outline"
        placeholder=""
        value={name}
        onChangeText={(value) => {
          setName(value);
          clear('name');
        }}
        error={errors.name}
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        onSubmitEditing={() => emailRef.current?.focus()}
        blurOnSubmit={false}
      />

      <TextField
        ref={emailRef}
        label="E-mail"
        icon="mail-outline"
        placeholder="nome@gmail.com"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          clear('email');
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
        placeholder={`Mínimo de ${MIN_PASSWORD_LENGTH} caracteres`}
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          clear('password');
        }}
        error={errors.password}
        secure
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        onSubmitEditing={() => confirmRef.current?.focus()}
        blurOnSubmit={false}
      />
      <PasswordStrength password={password} />

      <TextField
        ref={confirmRef}
        label="Confirmar senha"
        icon="shield-checkmark-outline"
        placeholder="Digite novamente sua senha"
        value={confirm}
        onChangeText={(value) => {
          setConfirm(value);
          clear('confirm');
        }}
        error={errors.confirm}
        secure
        autoCapitalize="none"
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <View style={styles.submit}>
        <Button label="Criar conta" loading={loading} onPress={handleSubmit} />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem uma conta?</Text>
        <Pressable
          accessibilityRole="link"
          accessibilityLabel="Entrar"
          hitSlop={10}
          onPress={onGoToLogin}
        >
          <Text style={styles.link}>Entrar</Text>
        </Pressable>
      </View>
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
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
