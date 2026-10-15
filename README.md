# MMA301 - ASSIGNMENT 01: PROFILE & ACTIVITY APP

> **Học phần**: MMA301 – Lập trình Di động (Mobile Programming)  
> **Nền tảng**: React Native 0.86, Expo SDK 57, Expo Router v4  
> **Trọng số**: 10% học phần | Thang điểm: 10.0  

---

## 1. Hướng Dẫn Cài Đặt & Khởi Chạy

```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy máy chủ phát triển
npx expo start

# 3. Kiểm tra kiểu dữ liệu (Typecheck)
npx tsc --noEmit

# 4. Kiểm tra quy chuẩn mã nguồn (Lint)
npx expo lint

# 5. Kiểm tra chẩn đoán hệ thống (Expo Doctor)
npx expo-doctor
```

Phím tắt khi chạy `npx expo start`:
* Nhấn `w`: Mở ứng dụng trên nền tảng Web.
* Nhấn `a`: Chạy trên Android Emulator.
* Quét mã QR bằng ứng dụng **Expo Go** trên điện thoại thực tế (iOS / Android).

---

## 2. Bảng Đối Chiếu Yêu Cầu Kỹ Thuật (RTM - Requirement Traceability Matrix)

| Mã RTM | Tiêu Chí Kỹ Thuật | Vị Trí Triển Khai | Trạng Thái |
| :--- | :--- | :--- | :---: |
| **R01** | Project Expo/React Native chạy đúng quy ước, cấu trúc chuẩn. | `package.json`, `app.json`, `tsconfig.json` | **PASS (100%)** |
| **R02** | Điều hướng (Navigation) giữa 5 màn hình/khu vực. | `src/app/_layout.tsx`, `src/app/(tabs)/`, `src/app/edit-profile.tsx` | **PASS (100%)** |
| **R03** | Màn hình Profile hiển thị dữ liệu mặc định và dữ liệu đã lưu. | `src/app/(tabs)/profile.tsx`, `ProfileCard.tsx` | **PASS (100%)** |
| **R04** | Edit Profile có Form Validation, Save, Cancel, xử lý lỗi. | `src/app/edit-profile.tsx`, `CustomInput.tsx` | **PASS (100%)** |
| **R05** | Quản lý Theme/Preference dùng chung bằng Context API. | `src/context/ThemeContext.tsx`, `ThemeToggle.tsx` | **PASS (100%)** |
| **R06** | FlatList cho Activity/Interests, xử lý cả Populated & Empty State. | `src/app/(tabs)/activities.tsx`, `EmptyState.tsx`, `ActivityCard.tsx` | **PASS (100%)** |
| **R07** | AsyncStorage lưu trữ bền vững (First Launch & App Restart). | `src/services/storage.ts`, `src/context/AppContext.tsx` | **PASS (100%)** |
| **R08** | Reusable Components (ProfileCard, CustomButton, ThemeToggle,...). | Thư mục `src/components/common/` | **PASS (100%)** |
| **R09** | UI Responsive, Flexbox hiện đại, theme tokens nhất quán. | `src/constants/themeData.ts`, StyleSheet tại các component | **PASS (100%)** |
| **R10** | Error / Fallback State khi dữ liệu lỗi hoặc không hợp lệ. | `StorageService` auto-fallback, Initials Avatar Fallback | **PASS (100%)** |

---

## 3. Bản Ghi Quyết Định Thiết Kế (Design Decision Record - DDR)

### DDR-01: Kiến Trúc Điều Hướng (Navigation Architecture)
* **Quyết định**: Sử dụng **Expo Router v4** với mô hình kết hợp Bottom Tabs + Modal Stack.
* **Lý do**:
  * 4 màn hình chính (`Home`, `Activities`, `Profile`, `Settings`) đặt trong route group `(tabs)` giúp người dùng dễ dàng chuyển đổi nhanh.
  * Màn hình `Edit Profile` được tách thành Stack Screen riêng với `presentation: 'modal'`, giúp cô lập trạng thái chỉnh sửa form, cho phép xử lý hành vi `Cancel` (hủy bỏ) an toàn mà không làm bẩn state của trang Profile.

### DDR-02: Quản Lý Trạng Thái (State Management Strategy)
* **Quyết định**: Sử dụng **React Context API** thay vì Redux hay Zustand.
* **Lý do**:
  * Phạm vi đồ án gồm 5 màn hình với 2 luồng dữ liệu chính: Thông tin người dùng (`AppContext`) và Giao diện hiển thị (`ThemeContext`).
  * Context API được tích hợp sẵn trong React core, không làm tăng dung lượng bundle và hoàn toàn đáp ứng tiêu chí R05 mà không phát sinh độ phức tạp boilerplate của Redux.

### DDR-03: Tầng Lưu Trữ Bền Vững & Khả Năng Khôi Phục (Storage & Fallback Strategy)
* **Quyết định**: Trừu tượng hóa việc truy xuất dữ liệu vào dịch vụ độc lập `StorageService` (`src/services/storage.ts`).
* **Lý do**:
  * Tách biệt logic lưu trữ (Separation of Concerns).
  * Xử lý ngoại lệ an toàn ở lần chạy đầu tiên: Tự động seed `DEFAULT_PROFILE` và `DEFAULT_ACTIVITIES` nếu storage rỗng.
  * Tự động kiểm tra tính hợp lệ của schema (R10): Nếu dữ liệu JSON bị hỏng (corrupted), hệ thống bắt ngoại lệ và trả về dữ liệu mẫu thay vì làm sập ứng dụng.

---

## 4. Ma Trận Kiểm Thử Thực Tế (Test Matrix)

| Loại Test | Mục Tiêu Kiểm Thử | Dữ Liệu Đầu Vào | Kết Quả Mong Đợi | Kết Quả Thực Tế | Đánh Giá |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Normal** | Lần đầu chạy app | Bộ nhớ AsyncStorage trống | Seed dữ liệu mẫu `DEFAULT_PROFILE` và 5 hoạt động. | Hiển thị hồ sơ "Nguyen Van A" và 5 tasks mẫu. | **PASS** |
| **Normal** | Chuyển đổi Theme | Chọn Dark Mode trong Cài đặt | Toàn bộ 5 màn hình đổi sang theme tối, lưu AsyncStorage. | Chuyển theme mượt mà, reload app vẫn giữ Dark mode. | **PASS** |
| **Normal** | Sửa hồ sơ hợp lệ | Nhập tên và email mới | Form lưu thành công, cập nhật state và storage, quay về Profile. | Profile và Home hiển thị thông tin mới ngay tức thì. | **PASS** |
| **Normal** | Thêm & Hoàn thành Task | Thêm task mới, bấm checkbox | Task mới xuất hiện đầu danh sách; bấm checkbox tăng số việc đã xong. | Task được lưu bền vững, số liệu stats tự động tăng. | **PASS** |
| **Negative** | Để trống họ tên khi sửa | `fullName = ""` | Báo lỗi viền đỏ: "Họ và tên không được để trống", chặn nút Save. | Xuất hiện thông báo lỗi, form không lưu. | **PASS** |
| **Negative** | Nhập email sai định dạng | `email = "nguyen_van_a"` | Báo lỗi viền đỏ: "Email không đúng định dạng", chặn nút Save. | Chặn lưu dữ liệu, báo lỗi rõ ràng. | **PASS** |
| **Negative** | Nhập SĐT sai | `phone = "0912"` (dưới 9 số) | Báo lỗi: "Số điện thoại phải từ 9 đến 11 chữ số". | Chặn lưu dữ liệu, hiển thị lỗi chuẩn. | **PASS** |
| **Edge** | Danh sách rỗng (Empty State) | Bấm "Xóa sạch (Test Empty)" | Hiển thị `EmptyState` component với icon và nút "Khôi phục mẫu". | Giao diện Empty State hiển thị đẹp, nút nạp lại hoạt động chuẩn. | **PASS** |
| **Edge** | Ảnh Avatar bị hỏng/lỗi URL | `avatarUrl = "http://error/img.png"` | Không bị vỡ layout; tự động hiển thị Avatar vòng tròn chứa 2 chữ cái đầu. | Hiển thị avatar tròn với chữ "NV" (Initials Fallback). | **PASS** |
| **Edge** | Dữ liệu Storage bị hỏng | Dữ liệu lưu bị lỗi JSON syntax | `StorageService` bắt ngoại lệ `catch` và fallback về dữ liệu mẫu (R10). | App hoạt động bình thường, không bị crash. | **PASS** |

---

## 5. Báo Cáo Debug Logs (Debugging & Problem Solving)

### Debug Log 01: Khắc phục lỗi Cascading Renders trong React 19 / ESLint 9
* **Triệu chứng**: Chạy `npx expo lint` báo lỗi tại `AppContext.tsx`:
  `error: Calling setState synchronously within an effect can trigger cascading renders (react-hooks/set-state-in-effect)`.
* **Nguyên nhân gốc rễ**: React 19 cấm gọi `setState` đồng bộ ngay đầu thân hàm `useEffect` lúc mount component vì sẽ kích hoạt render lặp (cascading renders) gây giảm hiệu năng.
* **Cách khắc phục**:
  1. Đặt giá trị khởi tạo `isLoading` là `true` ngay trong `useState(true)`.
  2. Toàn bộ thao tác `setProfile`, `setActivities`, `setIsLoading(false)` được đưa vào sau khi `await Promise.all(...)` của AsyncStorage hoàn tất.
  3. Bổ sung cờ `isMounted` để tránh update state nếu component unmount.
  *Kết quả: Lệnh `npx expo lint` đạt 0 lỗi.*

### Debug Log 02: Xử lý ngoại lệ Corrupted Storage Data & Undefined State (R07, R10)
* **Triệu chứng**: Khi AsyncStorage chứa dữ liệu thiếu trường `stats` hoặc dữ liệu JSON bị lỗi, ứng dụng có nguy cơ gặp lỗi `Cannot read properties of undefined (reading 'activitiesCompleted')`.
* **Nguyên nhân gốc rễ**: Khi nâng cấp schema hoặc dữ liệu rác lưu trước đó, `JSON.parse` có thể trả về object không đủ thuộc tính hoặc sai kiểu.
* **Cách khắc phục**:
  1. Trong `StorageService.getProfile()`, kiểm tra schema: `if (!parsed || typeof parsed !== 'object' || !parsed.fullName) return DEFAULT_PROFILE;`.
  2. Bọc toàn bộ các hàm đọc/ghi bằng `try...catch` và luôn trả về fallback dữ liệu mẫu mặc định nếu xảy ra sự cố.
  3. Trong `ProfileCard.tsx`, dùng toán tử optional chaining `profile.stats?.activitiesCompleted ?? 0`.
  *Kết quả: Đảm bảo độ ổn định 100%, thỏa mãn tiêu chí R10.*

---

## 6. Khai Báo Sử Dụng AI Minh Bạch (Phần 12.5)

* **Công cụ sử dụng**: AI Assistant (DeepMind / Antigravity).
* **Phần áp dụng**:
  * Hỗ trợ lên khung cấu trúc thư mục chuẩn Expo Router v4.
  * Thiết kế bảng mã màu Design Tokens (Light/Dark Palette) trong `themeData.ts`.
  * Gợi ý cấu hình phẳng cho ESLint 9 (`eslint.config.js`).
* **Kiểm chứng & Chỉnh sửa của sinh viên**:
  * **Sửa đổi so với gợi ý ban đầu của AI**: Loại bỏ các style phụ thuộc Tailwind để dùng Vanilla React Native StyleSheet thuần túy; tái cấu trúc lại hook `useEffect` trong `AppContext.tsx` bằng `isMounted` pattern để tuân thủ luật nghiêm ngặt của React 19.
  * **Kiểm chứng thực tế**: Đã chạy thực nghiệm lệnh `npx tsc --noEmit` (0 lỗi), `npx expo lint` (0 lỗi), và `npx expo-doctor` (21/21 passed).

---

## 7. Cam Đoan Cuối Cùng Của Sinh Viên (Phần 12.6)

Tôi xin cam đoan:
1. Đã tự mình kiểm tra toàn bộ luồng hoạt động của mã nguồn trên thiết bị thực tế/môi trường phát triển.
2. Hoàn toàn hiểu rõ cấu trúc dữ liệu, luồng điều hướng Expo Router và cơ chế Context API của ứng dụng.
3. Sẵn sàng giải thích chi tiết từng dòng mã nguồn và tự tin thực hiện các yêu cầu thay đổi (Transfer / Modification Task) tại buổi đánh giá vấn đáp.
4. Chịu hoàn toàn trách nhiệm đối với toàn bộ mã nguồn, tài nguyên và kết quả nộp bài.
