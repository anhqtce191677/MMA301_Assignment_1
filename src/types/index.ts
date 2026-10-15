export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background: string;
  card: string;
  surfaceElement: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  border: string;
  error: string;
  errorLight: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  tabBarBorder: string;
}

export interface UserStats {
  activitiesCompleted: number;
  totalPoints: number;
  streakDays: number;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl: string;
  role: string;
  location: string;
  joinedDate: string;
  interests: string[];
  stats: UserStats;
}

export interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  role: string;
  location: string;
  avatarUrl: string;
  interests: string;
}

export interface ProfileFormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
}

export type ActivityCategory = 'Study' | 'Coding' | 'Fitness' | 'Personal' | 'Work';

export interface ActivityItem {
  id: string;
  title: string;
  category: ActivityCategory;
  description: string;
  date: string;
  completed: boolean;
}
