import React, { createContext, useContext, useEffect, useState } from 'react';
import { ActivityItem, UserProfile } from '@/types';
import { DEFAULT_ACTIVITIES, DEFAULT_PROFILE } from '@/constants/mockData';
import { StorageService } from '@/services/storage';

interface AppContextType {
  profile: UserProfile;
  activities: ActivityItem[];
  isLoading: boolean;
  error: string | null;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<boolean>;
  addActivity: (activity: Omit<ActivityItem, 'id'>) => Promise<void>;
  toggleActivityCompleted: (id: string) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  clearAllActivities: () => Promise<void>; // Test Empty State (R06)
  restoreSampleActivities: () => Promise<void>;
  resetAllData: () => Promise<void>; // Reset về dữ liệu gốc (R07)
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activities, setActivities] = useState<ActivityItem[]>(DEFAULT_ACTIVITIES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Khởi động ứng dụng: Tải dữ liệu bền vững từ AsyncStorage (R03, R07)
  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [loadedProfile, loadedActivities] = await Promise.all([
        StorageService.getProfile(),
        StorageService.getActivities(),
      ]);

      setProfile(loadedProfile);
      setActivities(loadedActivities);
    } catch (err) {
      console.error('Failed to load initial data from storage:', err);
      setError('Không thể nạp dữ liệu từ bộ nhớ. Đang sử dụng dữ liệu mặc định.');
      // Fallback an toàn (R10)
      setProfile(DEFAULT_PROFILE);
      setActivities(DEFAULT_ACTIVITIES);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchStorage = async () => {
      try {
        const [loadedProfile, loadedActivities] = await Promise.all([
          StorageService.getProfile(),
          StorageService.getActivities(),
        ]);
        if (isMounted) {
          setProfile(loadedProfile);
          setActivities(loadedActivities);
        }
      } catch (err) {
        console.error('Failed to load initial data from storage:', err);
        if (isMounted) {
          setError('Không thể nạp dữ liệu từ bộ nhớ. Đang sử dụng dữ liệu mặc định.');
          setProfile(DEFAULT_PROFILE);
          setActivities(DEFAULT_ACTIVITIES);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchStorage();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cập nhật Profile và lưu AsyncStorage (R03, R04, R07)
  const updateProfile = async (updatedData: Partial<UserProfile>): Promise<boolean> => {
    try {
      const newProfile: UserProfile = {
        ...profile,
        ...updatedData,
        stats: {
          ...profile.stats,
          ...(updatedData.stats || {}),
        },
      };

      setProfile(newProfile);
      const success = await StorageService.saveProfile(newProfile);
      if (!success) {
        throw new Error('Lỗi khi ghi AsyncStorage');
      }
      return true;
    } catch (err) {
      console.error('Lỗi khi cập nhật profile:', err);
      setError('Cập nhật hồ sơ thất bại.');
      return false;
    }
  };

  // Thêm hoạt động mới và lưu AsyncStorage (R06, R07)
  const addActivity = async (item: Omit<ActivityItem, 'id'>) => {
    try {
      const newItem: ActivityItem = {
        ...item,
        id: `act_${Date.now()}`,
      };
      const updatedList = [newItem, ...activities];
      setActivities(updatedList);
      await StorageService.saveActivities(updatedList);
    } catch (err) {
      console.error('Lỗi khi thêm activity:', err);
    }
  };

  // Đổi trạng thái hoàn thành hoạt động (R06, R07)
  const toggleActivityCompleted = async (id: string) => {
    try {
      let completedDelta = 0;
      const updatedList = activities.map((item) => {
        if (item.id === id) {
          const nextCompleted = !item.completed;
          completedDelta = nextCompleted ? 1 : -1;
          return { ...item, completed: nextCompleted };
        }
        return item;
      });

      setActivities(updatedList);
      await StorageService.saveActivities(updatedList);

      // Cập nhật số activitiesCompleted trong profile stats
      const newCompletedCount = Math.max(0, profile.stats.activitiesCompleted + completedDelta);
      const updatedProfile = {
        ...profile,
        stats: {
          ...profile.stats,
          activitiesCompleted: newCompletedCount,
        },
      };
      setProfile(updatedProfile);
      await StorageService.saveProfile(updatedProfile);
    } catch (err) {
      console.error('Lỗi khi toggle activity:', err);
    }
  };

  // Xóa một hoạt động (R06, R07)
  const deleteActivity = async (id: string) => {
    try {
      const updatedList = activities.filter((item) => item.id !== id);
      setActivities(updatedList);
      await StorageService.saveActivities(updatedList);
    } catch (err) {
      console.error('Lỗi khi xóa activity:', err);
    }
  };

  // Xóa toàn bộ activities để kiểm thử Empty State (R06)
  const clearAllActivities = async () => {
    try {
      setActivities([]);
      await StorageService.saveActivities([]);
    } catch (err) {
      console.error('Lỗi khi clear activities:', err);
    }
  };

  // Khôi phục danh sách mẫu ban đầu
  const restoreSampleActivities = async () => {
    try {
      setActivities(DEFAULT_ACTIVITIES);
      await StorageService.saveActivities(DEFAULT_ACTIVITIES);
    } catch (err) {
      console.error('Lỗi khi restore sample activities:', err);
    }
  };

  // Reset toàn bộ dữ liệu ứng dụng về mặc định ban đầu (R07, R10)
  const resetAllData = async () => {
    try {
      setIsLoading(true);
      const defaults = await StorageService.resetToDefaults();
      setProfile(defaults.profile);
      setActivities(defaults.activities);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi reset data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        activities,
        isLoading,
        error,
        updateProfile,
        addActivity,
        toggleActivityCompleted,
        deleteActivity,
        clearAllActivities,
        restoreSampleActivities,
        resetAllData,
        refreshData: loadInitialData,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppContextProvider');
  }
  return context;
};
