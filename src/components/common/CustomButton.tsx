import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  disabled = false,
  loading = false,
  style,
}) => {
  const { colors } = useAppTheme();

  // Xác định style nền và màu chữ theo variant
  let backgroundColor = colors.primary;
  let textColor = '#FFFFFF';
  let borderColor = 'transparent';
  let borderWidth = 0;

  if (variant === 'secondary') {
    backgroundColor = colors.surfaceElement;
    textColor = colors.text;
  } else if (variant === 'outline') {
    backgroundColor = 'transparent';
    textColor = colors.primary;
    borderColor = colors.primary;
    borderWidth = 1.5;
  } else if (variant === 'danger') {
    backgroundColor = colors.error;
    textColor = '#FFFFFF';
  }

  // Kích thước nút
  let paddingVertical = 12;
  let paddingHorizontal = 20;
  let fontSize = 15;

  if (size === 'small') {
    paddingVertical = 8;
    paddingHorizontal = 14;
    fontSize = 13;
  } else if (size === 'large') {
    paddingVertical = 15;
    paddingHorizontal = 24;
    fontSize = 17;
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.buttonBase,
        {
          backgroundColor: disabled ? colors.surfaceElement : backgroundColor,
          borderColor: disabled ? colors.border : borderColor,
          borderWidth,
          paddingVertical,
          paddingHorizontal,
          opacity: pressed ? 0.8 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <>
          {icon && (
            <Ionicons
              name={icon}
              size={fontSize + 2}
              color={disabled ? colors.textMuted : textColor}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.textBase,
              {
                color: disabled ? colors.textMuted : textColor,
                fontSize,
              },
            ]}>
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    minHeight: 44,
  },
  textBase: {
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});
