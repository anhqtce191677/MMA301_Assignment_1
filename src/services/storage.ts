import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityItem, ThemeMode, UserProfile } from '@/types';
import { DEFAULT_ACTIVITIES, DEFAULT_PROFILE } from '@/constants/mockData';

const STORAGE_KEYS = {
  PROFILE: '@mma301_profile_v1',
  ACTIVITIES: '@mma301_activities_v1',
  THEME: '@mma301_theme_v1',
  HAS_SEEDED: '@mma301_has_seeded_v1',
};

export const StorageService = {
  /**
   * Khởi tạo và nạp dữ liệu Profile từ AsyncStorage.
   * Xử lý cả trường hợp lần đầu khởi động (first launch) và dữ liệu lỗi (R07, R10).
   */
  async getProfile(): Promise<UserProfile> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!stored) {
        // Lần đầu chạy: Seed dữ liệu mặc định
        await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      const parsed = JSON.parse(stored);
      // Kiểm tra tính toàn vẹn của dữ liệu (R10: Error/fallback state)
      if (!parsed || typeof parsed !== 'object' || !parsed.fullName) {
        console.warn('Storage data corrupted for Profile, falling back to default.');
        await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
        return DEFAULT_PROFILE;
      }
      return parsed as UserProfile;
    } catch (error) {
      console.error('Error reading profile from AsyncStorage:', error);
      return DEFAULT_PROFILE; // Fallback an toàn
    }
  },

  /**
   * Lưu thông tin Profile vào AsyncStorage (R04, R07)
   */
  async saveProfile(profile: UserProfile): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving profile to AsyncStorage:', error);
      return false;
    }
  },

  /**
   * Lấy danh sách Activities từ AsyncStorage (R06, R07)
   */
  async getActivities(): Promise<ActivityItem[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!stored) {
        // Lần đầu chạy: Seed danh sách mặc định
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
        return DEFAULT_ACTIVITIES;
      }
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        console.warn('Activities data corrupted, falling back to default.');
        await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
        return DEFAULT_ACTIVITIES;
      }
      return parsed as ActivityItem[];
    } catch (error) {
      console.error('Error reading activities from AsyncStorage:', error);
      return DEFAULT_ACTIVITIES;
    }
  },

  /**
   * Lưu danh sách Activities vào AsyncStorage (R07)
   */
  async saveActivities(activities: ActivityItem[]): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
      return true;
    } catch (error) {
      console.error('Error saving activities to AsyncStorage:', error);
      return false;
    }
  },

  /**
   * Lấy cấu hình Theme (Light / Dark / System) (R05, R07)
   */
  async getThemePreference(): Promise<ThemeMode> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
      return 'system';
    } catch (error) {
      console.error('Error reading theme from AsyncStorage:', error);
      return 'system';
    }
  },

  /**
   * Lưu cấu hình Theme vào AsyncStorage (R05, R07)
   */
  async saveThemePreference(theme: ThemeMode): Promise<boolean> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
      return true;
    } catch (error) {
      console.error('Error saving theme to AsyncStorage:', error);
      return false;
    }
  },

  /**
   * Khôi phục toàn bộ dữ liệu về mặc định (phục vụ kiểm thử First-Launch và Reset) (R07, R10)
   */
  async resetToDefaults(): Promise<{ profile: UserProfile; activities: ActivityItem[] }> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.PROFILE,
        STORAGE_KEYS.ACTIVITIES,
        STORAGE_KEYS.THEME,
      ]);
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEFAULT_ACTIVITIES));
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, 'system');
      return { profile: DEFAULT_PROFILE, activities: DEFAULT_ACTIVITIES };
    } catch (error) {
      console.error('Error resetting storage to defaults:', error);
      return { profile: DEFAULT_PROFILE, activities: DEFAULT_ACTIVITIES };
    }
  },
};
