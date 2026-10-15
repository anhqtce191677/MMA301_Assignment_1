import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface CustomInputProps extends TextInputProps {
  label: string;
  errorMessage?: string;
  helperText?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerStyle?: ViewStyle;
  required?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  errorMessage,
  helperText,
  icon,
  containerStyle,
  required = false,
  maxLength,
  value,
  ...props
}) => {
  const { colors } = useAppTheme();
  const hasError = Boolean(errorMessage);

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Label & Required Indicator */}
      <View style={styles.labelRow}>
        <Text style={[styles.label, { color: colors.text }]}>
          {label}
          {required && <Text style={{ color: colors.error }}> *</Text>}
        </Text>
        {maxLength !== undefined && value !== undefined && (
          <Text style={[styles.counter, { color: colors.textMuted }]}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>

      {/* Input Box */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.surfaceElement,
            borderColor: hasError ? colors.error : colors.border,
          },
        ]}>
        {icon && (
          <Ionicons
            name={icon}
            size={18}
            color={hasError ? colors.error : colors.textMuted}
            style={styles.icon}
          />
        )}
        <TextInput
          placeholderTextColor={colors.textMuted}
          style={[
            styles.input,
            {
              color: colors.text,
              minHeight: props.multiline ? 80 : 44,
              textAlignVertical: props.multiline ? 'top' : 'center',
            },
          ]}
          value={value}
          maxLength={maxLength}
          {...props}
        />
      </View>

      {/* Error Message (R04: Error handling & validation) */}
      {hasError ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.error} style={{ marginRight: 4 }} />
          <Text style={[styles.errorText, { color: colors.error }]}>{errorMessage}</Text>
        </View>
      ) : helperText ? (
        <Text style={[styles.helperText, { color: colors.textMuted }]}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  counter: {
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
});
