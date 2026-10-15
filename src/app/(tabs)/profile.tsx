import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAppTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ProfileCard, HeaderBar, CustomButton } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { colors, isDark } = useAppTheme();
  const { profile, refreshData } = useApp();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <HeaderBar
        title="Hồ sơ cá nhân"
        subtitle="Thông tin người dùng và hoạt động"
        rightIcon="create-outline"
        onRightPress={() => router.push('/edit-profile')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Profile Card tổng quan (R03, R08) */}
        <ProfileCard
          profile={profile}
          showStats={true}
          onEditPress={() => router.push('/edit-profile')}
        />

        {/* Khối Thông tin liên hệ chi tiết (R03) */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOpacity: isDark ? 0.25 : 0.05,
            },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Thông tin liên hệ</Text>

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="mail-outline" size={18} color={colors.primary} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile.email}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.successLight }]}>
              <Ionicons name="call-outline" size={18} color={colors.success} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Số điện thoại</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile.phone}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: colors.warningLight }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.warning} />
            </View>
            <View style={styles.infoTextWrapper}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Tham gia</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{profile.joinedDate}</Text>
            </View>
          </View>
        </View>

        {/* Khối Sở thích & Kỹ năng (R03, R06) */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOpacity: isDark ? 0.25 : 0.05,
            },
          ]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Sở thích & Kỹ năng quan tâm</Text>
          <View style={styles.interestsContainer}>
            {profile.interests && profile.interests.length > 0 ? (
              profile.interests.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.interestChip,
                    {
                      backgroundColor: colors.surfaceElement,
                      borderColor: colors.border,
                    },
                  ]}>
                  <Ionicons name="pricetag-outline" size={13} color={colors.primary} />
                  <Text style={[styles.interestText, { color: colors.text }]}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyInterests, { color: colors.textMuted }]}>
                Chưa cập nhật sở thích nào.
              </Text>
            )}
          </View>
        </View>

        {/* Nút hành động */}
        <View style={styles.actionButtons}>
          <CustomButton
            title="Chỉnh sửa thông tin hồ sơ"
            variant="primary"
            icon="create"
            size="large"
            onPress={() => router.push('/edit-profile')}
            style={{ marginBottom: 10 }}
          />
          <CustomButton
            title="Đồng bộ lại từ bộ nhớ"
            variant="outline"
            icon="refresh"
            size="medium"
            onPress={refreshData}
          />
        </View>
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
    paddingBottom: 36,
  },
  sectionCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoTextWrapper: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  interestText: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyInterests: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  actionButtons: {
    marginTop: 8,
  },
});
