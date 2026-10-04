import React, { forwardRef, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme/colors';
import { IconName } from '../theme/categories';
import { radius } from '../theme/tokens';

interface TextFieldProps extends TextInputProps {
  label: string;
  icon: IconName;
  error?: string;
  /** Campo de senha, com botão para mostrar/ocultar. */
  secure?: boolean;
  /** Texto auxiliar à direita, abaixo do campo (ex.: contador). */
  counter?: string;
}

const TextField = forwardRef<TextInput, TextFieldProps>(function TextField(
  { label, icon, error, secure = false, counter, multiline, onFocus, onBlur, style, ...rest },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <View
        style={[
          styles.field,
          multiline && styles.fieldMultiline,
          focused && styles.fieldFocused,
          !!error && styles.fieldError,
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={error ? colors.danger : focused ? colors.primary : colors.textMuted}
          style={multiline ? styles.iconTop : undefined}
        />

        <TextInput
          ref={ref}
          accessibilityLabel={label}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          multiline={multiline}
          secureTextEntry={secure && hidden}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[styles.input, multiline && styles.inputMultiline, webReset, style]}
          {...rest}
        />

        {secure ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={10}
            onPress={() => setHidden((value) => !value)}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>

      {error || counter ? (
        <View style={styles.footer}>
          {error ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Ionicons name="alert-circle" size={15} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <View style={styles.spacer} />
          )}
          {counter ? <Text style={styles.counter}>{counter}</Text> : null}
        </View>
      ) : null}
    </View>
  );
});

export default TextField;

const webReset =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  field: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  fieldMultiline: {
    alignItems: 'flex-start',
  },
  fieldFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.white,
  },
  fieldError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerSoft,
  },
  iconTop: {
    marginTop: 15,
  },
  input: {
    flex: 1,
    minHeight: 50,
    fontSize: 16,
    color: colors.text,
  },
  inputMultiline: {
    minHeight: 120,
    paddingTop: 14,
    paddingBottom: 14,
    textAlignVertical: 'top',
  },
  footer: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  spacer: {
    flex: 1,
  },
  errorRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
    color: colors.danger,
    fontWeight: '500',
  },
  counter: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
