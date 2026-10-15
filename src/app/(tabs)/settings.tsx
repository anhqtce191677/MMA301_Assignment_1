import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { CustomButton, HeaderBar, ThemeToggle } from '@/components/common';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { colors, isDark, themeMode } = useAppTheme();
  const { resetAllData, isLoading } = useApp();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [offlineSyncEnabled, setOfflineSyncEnabled] = useState(true);

  // Xử lý khôi phục dữ liệu gốc (R07, R10)
  const handleResetData = () => {
    Alert.alert(
      'Khôi phục dữ liệu mặc định?',
      'Hành động này sẽ xóa các thay đổi đã lưu trong AsyncStorage và nạp lại dữ liệu mẫu ban đầu (phục vụ kiểm thử First-Launch).',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Khôi phục ngay',
          style: 'destructive',
          onPress: async () => {
            await resetAllData();
            Alert.alert('Thành công', 'Dữ liệu đã được đưa về trạng thái khởi tạo ban đầu.');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <HeaderBar
        title="Cài đặt"
        subtitle="Quản lý giao diện, tùy chọn & dữ liệu"
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Phần 1: Tùy biến Theme (R05) */}
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
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="color-palette-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.cardTitleWrapper}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Chế độ giao diện (Theme)</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Đang dùng: {themeMode === 'light' ? 'Chế độ Sáng' : themeMode === 'dark' ? 'Chế độ Tối' : 'Theo Hệ thống'}
              </Text>
            </View>
          </View>

          {/* ThemeToggle Reusable Component (R05, R08) */}
          <ThemeToggle />
        </View>

        {/* Phần 2: Cài đặt thông báo & đồng bộ */}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Tùy chọn ứng dụng</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingTextWrapper}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Thông báo nhắc nhở</Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                Nhận thông báo khi có hoạt động đến hạn
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={PlatformThumbColor(notificationsEnabled, colors.card)}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.settingItem}>
            <View style={styles.settingTextWrapper}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Lưu trữ offline (AsyncStorage)</Text>
              <Text style={[styles.settingDesc, { color: colors.textMuted }]}>
                Tự động lưu thay đổi vào bộ nhớ máy
              </Text>
            </View>
            <Switch
              value={offlineSyncEnabled}
              onValueChange={setOfflineSyncEnabled}
              trackColor={{ false: colors.border, true: colors.success }}
              thumbColor={PlatformThumbColor(offlineSyncEnabled, colors.card)}
            />
          </View>
        </View>

        {/* Phần 3: Quản lý dữ liệu lưu trữ (R07, R10) */}
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
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: colors.errorLight }]}>
              <Ionicons name="refresh-circle-outline" size={20} color={colors.error} />
            </View>
            <View style={styles.cardTitleWrapper}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Quản lý dữ liệu</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                Phục vụ kiểm thử First-Launch & Reset
              </Text>
            </View>
          </View>

          <Text style={[styles.resetExplanation, { color: colors.textSecondary }]}>
            Nhấn nút bên dưới để khôi phục toàn bộ AsyncStorage về dữ liệu hạt giống ban đầu (seed data), giúp kiểm tra xem ứng dụng có xử lý đúng lần chạy đầu tiên và nạp lại dữ liệu chuẩn hay không.
          </Text>

          <CustomButton
            title="Khôi phục toàn bộ dữ liệu gốc"
            variant="danger"
            size="medium"
            icon="trash-outline"
            loading={isLoading}
            onPress={handleResetData}
            style={{ marginTop: 8 }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

function PlatformThumbColor(enabled: boolean, cardColor: string) {
  return '#FFFFFF';
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardTitleWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  settingTextWrapper: {
    flex: 1,
    paddingRight: 12,
  },
  settingLabel: {
    fontSize: 14.5,
    fontWeight: '600',
  },
  settingDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  resetExplanation: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
});
