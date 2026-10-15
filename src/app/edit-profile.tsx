import { CustomButton, CustomInput, HeaderBar } from '@/components/common';
import { useApp } from '@/context/AppContext';
import { useAppTheme } from '@/context/ThemeContext';
import { ProfileFormData, ProfileFormErrors } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EditProfileScreen() {
  const { colors, isDark } = useAppTheme();
  const { profile, updateProfile } = useApp();

  // Khởi tạo state từ dữ liệu Profile hiện tại (R03, R04)
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: profile.fullName || '',
    email: profile.email || '',
    phone: profile.phone || '',
    bio: profile.bio || '',
    role: profile.role || '',
    location: profile.location || '',
    avatarUrl: profile.avatarUrl || '',
    interests: (profile.interests || []).join(', '),
  });

  const [errors, setErrors] = useState<ProfileFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hàm cập nhật trường dữ liệu và xóa lỗi tương ứng khi người dùng nhập lại
  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof ProfileFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Xử lý chọn ảnh từ thư viện thiết bị (Image Picker)
  const handlePickFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Quyền truy cập bị từ chối',
          'Ứng dụng cần cấp quyền truy cập thư viện ảnh để bạn có thể chọn ảnh đại diện.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleChange('avatarUrl', result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error selecting image from gallery:', err);
      Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện thiết bị.');
    }
  };

  // Xử lý chụp ảnh mới bằng máy ảnh
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert(
          'Quyền truy cập bị từ chối',
          'Ứng dụng cần cấp quyền máy ảnh để bạn có thể chụp ảnh đại diện mới.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        handleChange('avatarUrl', result.assets[0].uri);
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      Alert.alert('Lỗi', 'Không thể khởi động máy ảnh.');
    }
  };

  // Hiển thị menu tùy chọn khi người dùng nhấn vào ô Avatar
  const handleSelectAvatarSource = () => {
    Alert.alert(
      'Ảnh đại diện',
      'Chọn hình ảnh từ thiết bị của bạn:',
      [
        {
          text: 'Thư viện ảnh trên máy',
          onPress: handlePickFromGallery,
        },
        {
          text: 'Chụp ảnh mới',
          onPress: handleTakePhoto,
        },
        ...(formData.avatarUrl
          ? [
              {
                text: 'Xóa ảnh này',
                style: 'destructive' as const,
                onPress: () => handleChange('avatarUrl', ''),
              },
            ]
          : []),
        {
          text: 'Hủy',
          style: 'cancel' as const,
        },
      ]
    );
  };

  // Hàm kiểm tra tính hợp lệ của Form (Form Validation - R04)
  const validateForm = (): boolean => {
    const newErrors: ProfileFormErrors = {};

    // 1. Kiểm tra Họ và Tên (bắt buộc, tối thiểu 2 ký tự)
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ và tên không được để trống.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự.';
    }

    // 2. Kiểm tra Email (bắt buộc, định dạng chuẩn)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Email không đúng định dạng (vd: user@example.com).';
    }

    // 3. Kiểm tra Số điện thoại (bắt buộc, 9 - 11 chữ số)
    const phoneRegex = /^[0-9+]{9,11}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại không được để trống.';
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Số điện thoại phải từ 9 đến 11 chữ số.';
    }

    // 4. Kiểm tra Bio (tối đa 200 ký tự)
    if (formData.bio && formData.bio.length > 200) {
      newErrors.bio = 'Tiểu sử không được vượt quá 200 ký tự.';
    }

    // 5. Kiểm tra Avatar URL (nếu có nhập link web thì kiểm tra định dạng)
    if (formData.avatarUrl.trim() && formData.avatarUrl.startsWith('http')) {
      const urlRegex = /^https?:\/\/.+/i;
      if (!urlRegex.test(formData.avatarUrl.trim())) {
        newErrors.avatarUrl = 'Đường dẫn ảnh web không hợp lệ.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý Lưu thông tin (Save - R04, R07)
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Dữ liệu chưa hợp lệ', 'Vui lòng kiểm tra lại các trường có báo lỗi màu đỏ.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Chuyển chuỗi interests (phân tách dấu phẩy) thành mảng
      const parsedInterests = formData.interests
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0);

      const success = await updateProfile({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        bio: formData.bio.trim(),
        role: formData.role.trim(),
        location: formData.location.trim(),
        avatarUrl: formData.avatarUrl.trim(),
        interests: parsedInterests,
      });

      if (success) {
        Alert.alert('Thành công', 'Thông tin hồ sơ đã được lưu trữ!', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      } else {
        Alert.alert('Lỗi', 'Không thể lưu hồ sơ vào bộ nhớ.');
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      Alert.alert('Lỗi hệ thống', 'Đã xảy ra lỗi khi lưu thông tin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Xử lý Hủy bỏ (Cancel - R04)
  const handleCancel = () => {
    // Hỏi xác nhận trước khi hủy nếu đã sửa dữ liệu
    const isDirty =
      formData.fullName !== profile.fullName ||
      formData.email !== profile.email ||
      formData.phone !== profile.phone ||
      formData.bio !== profile.bio;

    if (isDirty) {
      Alert.alert(
        'Hủy bỏ thay đổi?',
        'Các thông tin bạn vừa chỉnh sửa sẽ không được lưu.',
        [
          { text: 'Tiếp tục sửa', style: 'cancel' },
          { text: 'Rời đi', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <HeaderBar
        title="Chỉnh sửa hồ sơ"
        subtitle="Cập nhật thông tin cá nhân của bạn"
        showBack={true}
        onBackPress={handleCancel}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        <View
          style={[
            styles.formCard,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: '#000',
              shadowOpacity: isDark ? 0.3 : 0.06,
            },
          ]}>
          <Text style={[styles.sectionHeading, { color: colors.text }]}>
            Thông tin cơ bản
          </Text>

          {/* Ô chọn ảnh đại diện từ thiết bị */}
          <View style={styles.avatarPickerSection}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSelectAvatarSource}
              style={[
                styles.avatarContainer,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surfaceElement,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Chọn ảnh đại diện từ máy">
              {formData.avatarUrl ? (
                <Image
                  source={{ uri: formData.avatarUrl }}
                  style={styles.avatarImage}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: colors.primaryLight },
                  ]}>
                  <Ionicons name="person" size={44} color={colors.primary} />
                </View>
              )}

              {/* Badge camera ở góc */}
              <View
                style={[
                  styles.cameraBadge,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.card,
                  },
                ]}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSelectAvatarSource}
              style={styles.changePhotoBtn}>
              <Ionicons
                name="images-outline"
                size={16}
                color={colors.primary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.changePhotoText, { color: colors.primary }]}>
                Chạm để chọn ảnh từ máy
              </Text>
            </TouchableOpacity>

            {formData.avatarUrl ? (
              <TouchableOpacity
                onPress={() => handleChange('avatarUrl', '')}
                style={styles.removePhotoBtn}>
                <Text style={[styles.removePhotoText, { color: colors.error }]}>
                  Xóa ảnh này
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Họ và Tên */}
          <CustomInput
            label="Họ và tên"
            required
            value={formData.fullName}
            onChangeText={(val) => handleChange('fullName', val)}
            placeholder="Nhập họ và tên..."
            icon="person-outline"
            errorMessage={errors.fullName}
          />

          {/* Email */}
          <CustomInput
            label="Địa chỉ Email"
            required
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            placeholder="example@domain.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="mail-outline"
            errorMessage={errors.email}
          />

          {/* Số điện thoại */}
          <CustomInput
            label="Số điện thoại"
            required
            value={formData.phone}
            onChangeText={(val) => handleChange('phone', val)}
            placeholder="0912345678"
            keyboardType="phone-pad"
            icon="call-outline"
            errorMessage={errors.phone}
          />

          {/* Chức vụ / Vai trò */}
          <CustomInput
            label="Chức vụ / Ngành học"
            value={formData.role}
            onChangeText={(val) => handleChange('role', val)}
            placeholder="vd: Mobile Developer, Student..."
            icon="briefcase-outline"
          />

          {/* Địa điểm */}
          <CustomInput
            label="Địa điểm / Thành phố"
            value={formData.location}
            onChangeText={(val) => handleChange('location', val)}
            placeholder="vd: Da Nang, Vietnam"
            icon="location-outline"
          />


          {/* Tiểu sử (Bio) */}
          <CustomInput
            label="Tiểu sử bản thân (Bio)"
            value={formData.bio}
            onChangeText={(val) => handleChange('bio', val)}
            placeholder="Giới thiệu đôi nét về bản thân bạn..."
            multiline
            numberOfLines={4}
            maxLength={200}
            icon="reader-outline"
            errorMessage={errors.bio}
          />

          {/* Sở thích */}
          <CustomInput
            label="Sở thích & Kỹ năng (ngăn cách bởi dấu phẩy)"
            value={formData.interests}
            onChangeText={(val) => handleChange('interests', val)}
            placeholder="React Native, AI, Bóng đá, Đọc sách..."
            icon="pricetag-outline"
            helperText="Ví dụ: React Native, TypeScript, UI/UX"
          />
        </View>

        {/* Cụm nút Lưu (Save) và Hủy (Cancel) (R04) */}
        <View style={styles.buttonGroup}>
          <CustomButton
            title="Lưu thông tin"
            variant="primary"
            size="large"
            icon="save-outline"
            loading={isSubmitting}
            onPress={handleSave}
            style={{ marginBottom: 12 }}
          />

          <CustomButton
            title="Hủy bỏ"
            variant="secondary"
            size="medium"
            icon="close-outline"
            onPress={handleCancel}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 16,
  },
  buttonGroup: {
    width: '100%',
  },
  avatarPickerSection: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  avatarContainer: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2.5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: '600',
  },
  removePhotoBtn: {
    marginTop: 2,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  removePhotoText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
