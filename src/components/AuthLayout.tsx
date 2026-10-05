import React, { ReactNode } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { radius, shadows, typography } from '../theme/tokens';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  centerred?: boolean;
  showBrand?: boolean;
  onBack?: () => void;
  children: ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  showBrand = false,
  onBack,
  centerred = false,
  children,
}: AuthLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

          <View style={[StyleSheet.absoluteFill, styles.overlay]} />

          <SafeAreaView edges={['top']} style={styles.heroContent}>
            {onBack ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Voltar para a entrada"
                hitSlop={8}
                onPress={onBack}
                style={({ pressed }) => [styles.backButton, pressed && styles.backPressed]}
              >
                <Ionicons name="chevron-back" size={22} color={colors.onDark} />
              </Pressable>
            ) : null}

            {showBrand ? (
              <View style={styles.logo}>
                <Ionicons name="headset" size={32} color={colors.white} />
              </View>
            ) : null}

            <Text style={styles.heroTitle} accessibilityRole="header">
              {title}
            </Text>
            <Text style={styles.heroSubtitle}>{subtitle}</Text>
          </SafeAreaView>

        <View style={[styles.sheet, { paddingBottom: 32 + insets.bottom }]}>
          <View style={styles.sheetInner}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundDeep,
  },
  scroll: {
    flexGrow: 1,
  },
  hero: {
    overflow: 'hidden',
    backgroundColor: colors.backgroundDeep,
  },
  overlay: {
    backgroundColor: 'rgba(58, 60, 64, 0.7)',
  },
  heroContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 64,
    alignItems: 'flex-start',
  },
  backButton: {
    width: 44,
    height: 44,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: colors.onDarkFaint,
  },
  backPressed: {
    opacity: 0.7,
  },
  logo: {
    width: 64,
    height: 64,
    marginTop: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  heroTitle: {
    ...typography.display,
    color: colors.onDark,
  },
  heroSubtitle: {
    ...typography.body,
    marginTop: 6,
    maxWidth: 320,
    color: colors.onDarkMuted,
  },
  sheet: {
    flexGrow: 1,
    marginTop: -32,
    paddingTop: 32,
    paddingHorizontal: 24,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    backgroundColor: colors.white,
  },
  sheetInner: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
});
