import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from './CustomButton';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionTitle?: string;
  onActionPress?: () => void;
  secondaryActionTitle?: string;
  onSecondaryActionPress?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'clipboard-outline',
  title,
  message,
  actionTitle,
  onActionPress,
  secondaryActionTitle,
  onSecondaryActionPress,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={styles.container}>
      <View style={[styles.iconWrapper, { backgroundColor: colors.surfaceElement }]}>
        <Ionicons name={icon} size={48} color={colors.primary} />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

      {actionTitle && onActionPress && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title={actionTitle}
            onPress={onActionPress}
            size="medium"
            variant="primary"
          />
        </View>
      )}

      {secondaryActionTitle && onSecondaryActionPress && (
        <View style={[styles.buttonContainer, { marginTop: 8 }]}>
          <CustomButton
            title={secondaryActionTitle}
            onPress={onSecondaryActionPress}
            size="small"
            variant="outline"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
    marginBottom: 20,
  },
  buttonContainer: {
    minWidth: 180,
  },
});
