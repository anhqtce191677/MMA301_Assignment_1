import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { ActivityCategory } from '@/types';
import {
  ActivityCard,
  CustomButton,
  CustomInput,
  EmptyState,
  HeaderBar,
} from '@/components/common';
import { Ionicons } from '@expo/vector-icons';

type FilterType = 'ALL' | 'PENDING' | 'COMPLETED';

export default function ActivitiesScreen() {
  const { colors } = useAppTheme();
  const {
    activities,
    addActivity,
    toggleActivityCompleted,
    deleteActivity,
    clearAllActivities,
    restoreSampleActivities,
  } = useApp();

  const [filter, setFilter] = useState<FilterType>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Modal thêm hoạt động mới
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('Study');
  const [newDesc, setNewDesc] = useState('');
  const [titleError, setTitleError] = useState('');

  const categories: ActivityCategory[] = ['Study', 'Coding', 'Fitness', 'Personal', 'Work'];

  // Lọc danh sách hoạt động theo bộ lọc và danh mục
  const filteredActivities = activities.filter((item) => {
    // Lọc theo trạng thái hoàn thành
    if (filter === 'COMPLETED' && !item.completed) return false;
    if (filter === 'PENDING' && item.completed) return false;

    // Lọc theo danh mục
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;

    return true;
  });

  // Thêm hoạt động mới
  const handleAddSubmit = async () => {
    if (!newTitle.trim()) {
      setTitleError('Vui lòng nhập tên hoạt động.');
      return;
    }

    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${today.getFullYear()}`;

    await addActivity({
      title: newTitle.trim(),
      category: newCategory,
      description: newDesc.trim(),
      date: dateStr,
      completed: false,
    });

    // Reset form và đóng modal
    setNewTitle('');
    setNewDesc('');
    setTitleError('');
    setModalVisible(false);
  };

  // Xác nhận xóa một hoạt động
  const handleDeleteConfirm = (id: string) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa hoạt động này không?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', style: 'destructive', onPress: () => deleteActivity(id) },
    ]);
  };

  // Xác nhận xóa toàn bộ để kiểm thử Empty State (R06)
  const handleClearAllConfirm = () => {
    Alert.alert(
      'Xóa toàn bộ hoạt động?',
      'Hành động này sẽ làm trống danh sách để kiểm tra Empty State (R06). Bạn có thể bấm "Khôi phục mẫu" bất cứ lúc nào.',
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Xóa hết', style: 'destructive', onPress: () => clearAllActivities() },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header Bar */}
      <HeaderBar
        title="Hoạt động"
        subtitle={`Tổng cộng: ${activities.length} việc | Đã xong: ${
          activities.filter((a) => a.completed).length
        }`}
        rightIcon="add-circle-outline"
        onRightPress={() => setModalVisible(true)}
      />

      {/* Filter Tabs (All / Đang chờ / Đã xong) */}
      <View style={styles.filterRow}>
        <View
          style={[
            styles.segmentContainer,
            { backgroundColor: colors.surfaceElement, borderColor: colors.border },
          ]}>
          {(['ALL', 'PENDING', 'COMPLETED'] as FilterType[]).map((tab) => {
            const isSelected = filter === tab;
            const labels: Record<FilterType, string> = {
              ALL: 'Tất cả',
              PENDING: 'Đang làm',
              COMPLETED: 'Đã xong',
            };
            return (
              <Pressable
                key={tab}
                onPress={() => setFilter(tab)}
                style={[
                  styles.segmentBtn,
                  isSelected && [
                    styles.segmentBtnActive,
                    { backgroundColor: colors.card },
                  ],
                ]}>
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: isSelected ? colors.primary : colors.textMuted,
                      fontWeight: isSelected ? '700' : '500',
                    },
                  ]}>
                  {labels[tab]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Category Chips Filter */}
        <View style={styles.catFilterRow}>
          {['ALL', ...categories].map((cat) => {
            const isCatSelected = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.catFilterChip,
                  {
                    backgroundColor: isCatSelected ? colors.primary : colors.surfaceElement,
                    borderColor: isCatSelected ? colors.primary : colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.catFilterText,
                    {
                      color: isCatSelected ? '#FFFFFF' : colors.textSecondary,
                      fontWeight: isCatSelected ? '700' : '500',
                    },
                  ]}>
                  {cat === 'ALL' ? 'Tất cả mục' : cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Nút hành động kiểm thử nhanh: Xóa sạch (test empty state) & Nạp lại */}
        <View style={styles.testActionsRow}>
          {activities.length > 0 ? (
            <Pressable
              onPress={handleClearAllConfirm}
              style={[styles.smallActionBtn, { backgroundColor: colors.surfaceElement }]}>
              <Ionicons name="trash-bin-outline" size={14} color={colors.error} />
              <Text style={[styles.smallActionText, { color: colors.error }]}>Xóa sạch (Test Empty)</Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={restoreSampleActivities}
              style={[styles.smallActionBtn, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="refresh-outline" size={14} color={colors.primary} />
              <Text style={[styles.smallActionText, { color: colors.primary }]}>Nạp lại dữ liệu mẫu</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* FlatList Activities (R06) */}
      <FlatList
        data={filteredActivities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ActivityCard
            item={item}
            onToggle={toggleActivityCompleted}
            onDelete={handleDeleteConfirm}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon={activities.length === 0 ? 'file-tray-outline' : 'search-outline'}
            title={activities.length === 0 ? 'Danh sách hoạt động trống' : 'Không tìm thấy hoạt động'}
            message={
              activities.length === 0
                ? 'Hiện chưa có mục nào trong danh sách. Bạn có thể thêm việc cần làm hoặc khôi phục dữ liệu mẫu để thử nghiệm.'
                : 'Không có hoạt động nào phù hợp với bộ lọc hiện tại của bạn.'
            }
            actionTitle="Thêm hoạt động mới"
            onActionPress={() => setModalVisible(true)}
            secondaryActionTitle={activities.length === 0 ? 'Khôi phục danh sách mẫu' : undefined}
            onSecondaryActionPress={activities.length === 0 ? restoreSampleActivities : undefined}
          />
        }
      />

      {/* Modal Thêm Hoạt Động Mới */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Thêm hoạt động mới</Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                <Ionicons name="close" size={24} color={colors.textMuted} />
              </Pressable>
            </View>

            <CustomInput
              label="Tên hoạt động"
              required
              value={newTitle}
              onChangeText={(t) => {
                setNewTitle(t);
                if (titleError) setTitleError('');
              }}
              placeholder="vd: Luyện tập React Native Hooks..."
              errorMessage={titleError}
            />

            {/* Chọn Danh Mục */}
            <Text style={[styles.categoryLabel, { color: colors.text }]}>Danh mục</Text>
            <View style={styles.categoryPicker}>
              {categories.map((cat) => {
                const isSelected = newCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setNewCategory(cat)}
                    style={[
                      styles.catChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceElement,
                        borderColor: isSelected ? colors.primary : colors.border,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.catChipText,
                        {
                          color: isSelected ? '#FFFFFF' : colors.textSecondary,
                          fontWeight: isSelected ? '700' : '500',
                        },
                      ]}>
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <CustomInput
              label="Mô tả chi tiết"
              value={newDesc}
              onChangeText={setNewDesc}
              placeholder="Chi tiết công việc hoặc mục tiêu..."
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalActions}>
              <CustomButton
                title="Lưu hoạt động"
                onPress={handleAddSubmit}
                variant="primary"
                style={{ flex: 1, marginRight: 8 }}
              />
              <CustomButton
                title="Đóng"
                onPress={() => setModalVisible(false)}
                variant="secondary"
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 3,
    borderWidth: 1,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  segmentBtnActive: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
  },
  catFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  catFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  catFilterText: {
    fontSize: 11.5,
  },
  testActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 4,
  },
  smallActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  smallActionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  categoryPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  catChipText: {
    fontSize: 12,
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
