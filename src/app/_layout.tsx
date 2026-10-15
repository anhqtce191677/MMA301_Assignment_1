import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeContextProvider, useAppTheme } from '@/context/ThemeContext';
import { AppContextProvider, useApp } from '@/context/AppContext';

// Ngăn splash screen tự động ẩn trước khi nạp xong dữ liệu
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootNavigation() {
  const { isDark, colors } = useAppTheme();
  const { isLoading } = useApp();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [isLoading]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        {/* Nhóm Tabs chính chứa Home, Activities, Profile, Settings */}
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        {/* Màn hình thứ 5: Edit Profile (dạng Modal hoặc Stack) (R02, R04) */}
        <Stack.Screen
          name="edit-profile"
          options={{
            presentation: 'modal',
            title: 'Chỉnh sửa hồ sơ',
            headerBackTitle: 'Hủy',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeContextProvider>
      <AppContextProvider>
        <RootNavigation />
      </AppContextProvider>
    </ThemeContextProvider>
  );
}
