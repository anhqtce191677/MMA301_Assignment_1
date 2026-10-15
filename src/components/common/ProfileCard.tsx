import React, { useState } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { UserProfile } from '@/types';
import { useAppTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { CustomButton } from './CustomButton';

interface ProfileCardProps {
  profile: UserProfile;
  onEditPress?: () => void;
  style?: ViewStyle;
  showStats?: boolean;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  onEditPress,
  style,
  showStats = true,
}) => {
  const { colors, isDark } = useAppTheme();
  const [imageError, setImageError] = useState(false);

  // Lấy 2 chữ cái đầu làm Avatar fallback khi ảnh lỗi hoặc không có URL (R10)
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowColor: '#000',
          shadowOpacity: isDark ? 0.35 : 0.06,
        },
        style,
      ]}>
      {/* Header Profile: Avatar & Main Info */}
      <View style={styles.headerRow}>
        <View style={styles.avatarWrapper}>
          {profile.avatarUrl && !imageError ? (
            <Image
              source={{ uri: profile.avatarUrl }}
              style={styles.avatar}
              onError={() => setImageError(true)}
            />
          ) : (
            <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
              <Text style={styles.initialsText}>{getInitials(profile.fullName)}</Text>
            </View>
          )}
        </View>

        <View style={styles.infoWrapper}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {profile.fullName || 'Người dùng chưa đặt tên'}
          </Text>

          {profile.role ? (
            <View style={[styles.roleBadge, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.roleText, { color: colors.primary }]}>{profile.role}</Text>
            </View>
          ) : null}

          {profile.location ? (
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
              <Text style={[styles.locationText, { color: colors.textSecondary }]}>
                {profile.location}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* Bio Section */}
      {profile.bio ? (
        <Text style={[styles.bio, { color: colors.textSecondary }]}>
          {profile.bio}
        </Text>
      ) : null}

      {/* Interests Tags */}
      {profile.interests && profile.interests.length > 0 && (
        <View style={styles.tagsContainer}>
          {profile.interests.map((tag, idx) => (
            <View
              key={`${tag}-${idx}`}
              style={[styles.tag, { backgroundColor: colors.surfaceElement }]}>
              <Text style={[styles.tagText, { color: colors.textSecondary }]}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats Row */}
      {showStats && profile.stats && (
        <View style={[styles.statsRow, { borderTopColor: colors.border }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {profile.stats.activitiesCompleted}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Hoàn thành</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {profile.stats.streakDays}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Ngày streak</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: colors.warning }]}>
              {profile.stats.totalPoints}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>Điểm tích lũy</Text>
          </View>
        </View>
      )}

      {/* Action Button */}
      {onEditPress && (
        <View style={styles.buttonWrapper}>
          <CustomButton
            title="Chỉnh sửa thông tin"
            variant="outline"
            size="small"
            icon="create-outline"
            onPress={onEditPress}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    marginRight: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  avatarFallback: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  infoWrapper: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
  },
  bio: {
    fontSize: 13.5,
    lineHeight: 20,
    marginTop: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    marginTop: 16,
    paddingTop: 14,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
  },
  buttonWrapper: {
    marginTop: 14,
  },
});
