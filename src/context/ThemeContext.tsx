import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeColors, ThemeMode } from '@/types';
import { DarkColors, LightColors } from '@/constants/themeData';
import { StorageService } from '@/services/storage';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  // Nạp cấu hình theme đã lưu từ AsyncStorage khi khởi động (R05, R07)
  useEffect(() => {
    let isMounted = true;
    const loadTheme = async () => {
      const savedTheme = await StorageService.getThemePreference();
      if (isMounted) {
        setThemeModeState(savedTheme);
      }
    };
    loadTheme();
    return () => {
      isMounted = false;
    };
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await StorageService.saveThemePreference(mode);
  };

  // Xác định giao diện thực tế dựa trên lựa chọn và hệ thống
  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  const colors = isDark ? DarkColors : LightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, isDark, colors, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeContextProvider');
  }
  return context;
};
