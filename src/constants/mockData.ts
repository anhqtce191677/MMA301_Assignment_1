import { Image } from 'react-native';
import { ActivityItem, UserProfile } from '@/types';

// Lấy URI từ ảnh thẻ trong thư mục assets
const LOCAL_AVATAR_URI = Image.resolveAssetSource(
  require('../../assets/images/ảnh 3x4.jpg')
).uri;

export const DEFAULT_PROFILE: UserProfile = {
  id: 'user_mma301_001',
  fullName: 'Trinh Quoc Anh',
  email: 'trinhquocanh@fpt.edu.vn',
  phone: '0912345678',
  bio: 'Sinh viên FPT University chuyên ngành Kỹ thuật Phần mềm. Đam mê phát triển ứng dụng di động với React Native và Expo.',
  avatarUrl: LOCAL_AVATAR_URI,
  role: 'Mobile Developer Student',
  location: 'Can Tho, Vietnam',
  joinedDate: 'Tháng 09, 2026',
  interests: ['React Native', 'TypeScript', 'UI/UX Mobile', 'Cloud Computing', 'AI Coding'],
  stats: {
    activitiesCompleted: 12,
    totalPoints: 850,
    streakDays: 7,
  },
};

export const DEFAULT_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act_001',
    title: 'Hoàn thành Assignment 1 MMA301',
    category: 'Study',
    description: 'Xây dựng ứng dụng Profile & Activity với 5 màn hình, Context API và AsyncStorage.',
    date: '12/10/2026',
    completed: true,
  },
  {
    id: 'act_002',
    title: 'Học Expo Router v4',
    category: 'Coding',
    description: 'Nắm vững cơ chế file-based routing và cấu trúc Tabs + Modal Stacks trong Expo.',
    date: '14/10/2026',
    completed: true,
  },
  {
    id: 'act_003',
    title: 'Luyện tập giải thuật LeetCode',
    category: 'Coding',
    description: 'Giải 3 bài tập về Two Pointers và Binary Search.',
    date: '15/10/2026',
    completed: false,
  },
  {
    id: 'act_004',
    title: 'Chạy bộ 5km công viên 29/3',
    category: 'Fitness',
    description: 'Rèn luyện thể lực và duy trì thói quen tập luyện hàng ngày.',
    date: '16/10/2026',
    completed: false,
  },
  {
    id: 'act_005',
    title: 'Đọc tài liệu React Native Reanimated',
    category: 'Study',
    description: 'Tìm hiểu cách tối ưu render 60fps trên giao diện di động.',
    date: '18/10/2026',
    completed: false,
  },
];
