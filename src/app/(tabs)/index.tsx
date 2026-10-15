import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ProfileCard, ActivityCard, HeaderBar, CustomButton } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { colors, isDark } = useAppTheme();
  const { profile, activities, toggleActivityCompleted, deleteActivity } = useApp();

  // 3 hoạt động gần nhất
  const recentActivities = activities.slice(0, 3);
  const completedCount = activities.filter((a) => a.completed).length;
  const pendingCount = activities.length - completedCount;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <HeaderBar
        title="Trang chủ"
        subtitle={`Xin chào, ${profile.fullName.split(' ')[0]} 👋`}
        rightIcon="notifications-outline"
        onRightPress={() => {}}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Summary Card (R03, R08) */}
        <ProfileCard
          profile={profile}
          onEditPress={() => router.push('/edit-profile')}
          showStats={false}
        />

        {/* Dashboard Quick Stats */}
        <View style={styles.statsContainer}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.25 : 0.05,
              },
            ]}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="list" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statNumber, { color: colors.text }]}>{activities.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Tổng hoạt động</Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.25 : 0.05,
              },
            ]}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.successLight }]}>
              <Ionicons name="checkmark-done" size={20} color={colors.success} />
            </View>
            <Text style={[styles.statNumber, { color: colors.success }]}>{completedCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Đã xong</Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                shadowColor: '#000',
                shadowOpacity: isDark ? 0.25 : 0.05,
              },
            ]}>
            <View style={[styles.statIconBadge, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="time" size={20} color={colors.warning} />
            </View>
            <Text style={[styles.statNumber, { color: colors.warning }]}>{pendingCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Đang chờ</Text>
          </View>
        </View>

        {/* Quick Navigation Shortcuts */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Truy cập nhanh</Text>
        </View>

        <View style={styles.shortcutsRow}>
          <Pressable
            onPress={() => router.push('/edit-profile')}
            style={({ pressed }) => [
              styles.shortcutCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
            <Text style={[styles.shortcutText, { color: colors.text }]}>Sửa hồ sơ</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/activities')}
            style={({ pressed }) => [
              styles.shortcutCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons name="add-circle-outline" size={24} color={colors.success} />
            <Text style={[styles.shortcutText, { color: colors.text }]}>Hoạt động</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/(tabs)/settings')}
            style={({ pressed }) => [
              styles.shortcutCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
            ]}>
            <Ionicons name="color-palette-outline" size={24} color={colors.warning} />
            <Text style={[styles.shortcutText, { color: colors.text }]}>Giao diện</Text>
          </Pressable>
        </View>

        {/* Recent Activities Section */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Hoạt động gần đây</Text>
          <Pressable onPress={() => router.push('/(tabs)/activities')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>Xem tất cả</Text>
          </Pressable>
        </View>

        {recentActivities.length > 0 ? (
          recentActivities.map((item) => (
            <ActivityCard
              key={item.id}
              item={item}
              onToggle={toggleActivityCompleted}
              onDelete={deleteActivity}
            />
          ))
        ) : (
          <View
            style={[
              styles.emptyRecentCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}>
            <Text style={[styles.emptyRecentText, { color: colors.textMuted }]}>
              Chưa có hoạt động nào được ghi nhận.
            </Text>
            <CustomButton
              title="Thêm hoạt động mới"
              size="small"
              onPress={() => router.push('/(tabs)/activities')}
              style={{ marginTop: 8 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  shortcutCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    gap: 6,
  },
  shortcutText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyRecentCard: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
  },
  emptyRecentText: {
    fontSize: 14,
    textAlign: 'center',
  },
});
