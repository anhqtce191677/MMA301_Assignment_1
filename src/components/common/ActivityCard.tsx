import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { ActivityCategory, ActivityItem } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ActivityCardProps {
  item: ActivityItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const CATEGORY_COLORS: Record<ActivityCategory, { bg: string; text: string }> = {
  Study: { bg: '#E0E7FF', text: '#3730A3' },
  Coding: { bg: '#DBEAFE', text: '#1E40AF' },
  Fitness: { bg: '#DCFCE7', text: '#166534' },
  Personal: { bg: '#FCE7F3', text: '#9D174D' },
  Work: { bg: '#FEF3C7', text: '#92400E' },
};

export const ActivityCard: React.FC<ActivityCardProps> = ({ item, onToggle, onDelete }) => {
  const { colors, isDark } = useAppTheme();
  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Personal;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.25 : 0.05,
        },
      ]}>
      {/* Checkbox Toggle */}
      <Pressable
        onPress={() => onToggle(item.id)}
        style={styles.checkboxWrapper}
        hitSlop={8}>
        <Ionicons
          name={item.completed ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.completed ? colors.success : colors.textMuted}
        />
      </Pressable>

      {/* Main Content */}
      <View style={styles.contentWrapper}>
        <View style={styles.topRow}>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: isDark ? colors.surfaceElement : categoryStyle.bg },
            ]}>
            <Text
              style={[
                styles.categoryText,
                { color: isDark ? colors.primaryLight : categoryStyle.text },
              ]}>
              {item.category}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: colors.textMuted }]}>{item.date}</Text>
        </View>

        <Text
          style={[
            styles.title,
            {
              color: item.completed ? colors.textMuted : colors.text,
              textDecorationLine: item.completed ? 'line-through' : 'none',
            },
          ]}>
          {item.title}
        </Text>

        {item.description ? (
          <Text
            style={[
              styles.description,
              {
                color: colors.textSecondary,
                opacity: item.completed ? 0.7 : 1,
              },
            ]}
            numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>

      {/* Delete Button */}
      <Pressable
        onPress={() => onDelete(item.id)}
        style={styles.deleteButton}
        hitSlop={8}>
        <Ionicons name="trash-outline" size={19} color={colors.error} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  checkboxWrapper: {
    marginRight: 12,
    marginTop: 2,
  },
  contentWrapper: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 11,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 6,
    marginTop: 2,
  },
});
