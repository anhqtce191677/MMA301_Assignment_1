import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { ThemeMode } from '@/types';
import { Ionicons } from '@expo/vector-icons';

export const ThemeToggle: React.FC = () => {
  const { themeMode, setThemeMode, colors, isDark } = useAppTheme();

  const options: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: 'light', label: 'Sáng', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Tối', icon: 'moon-outline' },
    { mode: 'system', label: 'Hệ thống', icon: 'phone-portrait-outline' },
  ];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElement,
          borderColor: colors.border,
        },
      ]}>
      {options.map((option) => {
        const isSelected = themeMode === option.mode;
        return (
          <Pressable
            key={option.mode}
            onPress={() => setThemeMode(option.mode)}
            style={({ pressed }) => [
              styles.optionButton,
              isSelected && [
                styles.selectedButton,
                {
                  backgroundColor: colors.card,
                  shadowColor: '#000',
                  shadowOpacity: isDark ? 0.3 : 0.08,
                },
              ],
              pressed && { opacity: 0.7 },
            ]}>
            <Ionicons
              name={option.icon}
              size={18}
              color={isSelected ? colors.primary : colors.textMuted}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.optionText,
                {
                  color: isSelected ? colors.primary : colors.textMuted,
                  fontWeight: isSelected ? '700' : '500',
                },
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    width: '100%',
  },
  optionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  selectedButton: {
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 14,
  },
});
