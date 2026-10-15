import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface HeaderBarProps {
  title: string;
  subtitle?: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
  showBack?: boolean;
  onBackPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  subtitle,
  rightIcon,
  onRightPress,
  showBack = false,
  onBackPress,
}) => {
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.leftRow}>
        {showBack && (
          <Pressable onPress={onBackPress} style={styles.backButton} hitSlop={8}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
        )}
        <View style={styles.titleWrapper}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          {subtitle ? (
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          ) : null}
        </View>
      </View>

      {rightIcon && onRightPress && (
        <Pressable
          onPress={onRightPress}
          style={[styles.rightButton, { backgroundColor: colors.surfaceElement }]}
          hitSlop={8}>
          <Ionicons name={rightIcon} size={20} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  rightButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
});
