# MMA301 - ASSIGNMENT 01: PROFILE & ACTIVITY APP
**CẨM NANG ÔN TẬP PHỎNG VẤN VẤN ĐÁP, CHECKLIST CHẤM BÀI & TRẢ LỜI CÂU HỎI ĐẠT 10/10**

---

## MỤC LỤC
1. [Kế Hoạch Chuẩn Bị 45-60 Phút Trước Giờ Đánh Giá](#1-kế-hoạch-chuẩn-bị-45-60-phút-trước-giờ-đánh-giá)
2. [Bản Đồ Mở File Dưới 30 Giây (30-Second File Lookup Map)](#2-bản-đồ-mở-file-dưới-30-giây-30-second-file-lookup-map)
3. [Kịch Bản Thuyết Minh 2 Luồng Chính (Flow Walkthrough)](#3-kịch-bản-thuyết-minh-2-luồng-chính-flow-walkthrough)
4. [Bộ Câu Hỏi & Câu Trả Lời Mẫu Phỏng Vấn (Phần 12)](#4-bộ-câu-hỏi--câu-trả-lời-mẫu-phỏng-vấn-phần-12)
   * 4.1 React Native Fundamentals
   * 4.2 State & Persistence
   * 4.3 Design Reasoning
   * 4.4 Debugging & Transfer Task (Sửa Code Tại Chỗ)
5. [Khai Báo Sử Dụng AI & Cam Đoan Học Thuật (Phần 12.5 & 12.6)](#5-khai-báo-sử-dụng-ai--cam-đoan-học-thuật-phần-125--126)
6. [Bảng RTM & Ma Trận Kiểm Thử Tham Chiếu Nhanh](#6-bảng-rtm--ma-trận-kiểm-thử-tham-chiếu-nhanh)

---

## 1. KẾ HOẠCH CHUẨN BỊ 45-60 PHÚT TRƯỚC GIỜ ĐÁNH GIÁ

Để tránh bối rối hoặc gặp sự cố bất ngờ khi bước vào phòng phỏng vấn, bạn hãy thực hiện lần lượt các bước sau:

### Bước 1 (10 phút): Chạy Smoke Test xác thực môi trường
Mở Terminal tại thư mục dự án và chạy lần lượt 3 lệnh:
```bash
# 1. Kiểm tra typecheck
npx tsc --noEmit

# 2. Kiểm tra linting
npx expo lint

# 3. Khởi động app
npx expo start
```
*Đảm bảo không có dòng đỏ (error) nào xuất hiện trong terminal.*

### Bước 2 (15 phút): Thao tác thử trên giao diện (Interactive Check)
1. Mở app trên Web (`w`) hoặc Expo Go.
2. **Test Theme**: Vào `Cài đặt` ➡️ Bấm đổi qua lại giữa `Sáng`, `Tối`, `Hệ thống`. Xác nhận cả 4 tab và modal đổi màu mượt mà.
3. **Test Edit Profile**: Vào `Hồ sơ` ➡️ Bấm `Chỉnh sửa thông tin` ➡️ Xóa họ tên bấm Lưu (xem báo lỗi viền đỏ) ➡️ Nhập họ tên hợp lệ và bấm Lưu ➡️ Xác nhận tên mới xuất hiện ở `Hồ sơ` và `Trang chủ`.
4. **Test Activities & Empty State**: Vào `Hoạt động` ➡️ Bấm nút `Xóa sạch (Test Empty)` ➡️ Giao diện `EmptyState` hiện ra với icon ➡️ Bấm `Khôi phục danh sách mẫu` ➡️ 5 hoạt động ban đầu xuất hiện trở lại.
5. **Test Reload**: Reload lại ứng dụng (phím `r` trong terminal) ➡️ Dữ liệu vừa thay đổi vẫn được giữ nguyên (chứng minh AsyncStorage hoạt động).

### Bước 3 (20 phút): Luyện mở file dưới 30 giây & đọc nhẩm câu trả lời
* Nhìn lướt qua **Bản đồ mở file** ở Mục 2.
* Luyện giải thích 2 luồng cốt lõi ở Mục 3.
* Đọc lướt qua câu trả lời mẫu ở Mục 4.

### Bước 4 (10 phút): Kiểm tra hồ sơ nộp bài
* Kiểm tra tệp [README.md](file:///d:/MMA301/Assignment_1/README.md) đã có đầy đủ RTM, DDR, Test Matrix, Debug Logs và Khai báo AI.

---

## 2. BẢN ĐỒ MỞ FILE DƯỚI 30 GIÂY (30-SECOND FILE LOOKUP MAP)

Khi giảng viên nói: *"Hãy mở file xử lý [chức năng X] cho tôi xem"*, bạn mở ngay lập tức theo bảng này:

| Giảng viên hỏi về... | Tệp cần mở ngay | Dòng code trọng tâm |
| :--- | :--- | :--- |
| **Cấu hình Navigation 5 màn hình** | `src/app/_layout.tsx` | Dòng 35 - 55: Khai báo `<Stack>` và `<Stack.Screen name="edit-profile">` |
| **Cấu hình Bottom Tabs** | `src/app/(tabs)/_layout.tsx` | Dòng 15 - 50: Khai báo 4 Tabs: `index`, `activities`, `profile`, `settings` |
| **Validation Form, Lưu / Hủy** | `src/app/edit-profile.tsx` | Dòng 36 - 85: Hàm `validateForm()` và `handleSave()` |
| **Context Theme (Light/Dark)** | `src/context/ThemeContext.tsx` | Dòng 20 - 55: Hook `useAppTheme()` và hàm `setThemeMode()` |
| **Context Profile & Activities** | `src/context/AppContext.tsx` | Dòng 35 - 120: `updateProfile()`, `toggleActivityCompleted()`, `resetAllData()` |
| **Đọc / Ghi AsyncStorage & Fallback** | `src/services/storage.ts` | Dòng 15 - 45: `getProfile()` và `saveProfile()` với khối `try...catch` |
| **FlatList & Empty State** | `src/app/(tabs)/activities.tsx` | Dòng 180 - 215: Thẻ `<FlatList>` với thuộc tính `ListEmptyComponent` |
| **Bảng màu Design Tokens** | `src/constants/themeData.ts` | `LightColors` và `DarkColors` |
| **Dữ liệu mẫu ban đầu (Seed Data)** | `src/constants/mockData.ts` | `DEFAULT_PROFILE` và `DEFAULT_ACTIVITIES` |

---

## 3. KỊCH BẢN THUYẾT MINH 2 LUỒNG CHÍNH (FLOW WALKTHROUGH)

### Luồng 1: Luồng Chỉnh Sửa Hồ Sơ (Edit Profile Flow)
> **Bạn trình bày với giảng viên**:
> 1. *"Thưa thầy/cô, luồng bắt đầu khi người dùng bấm nút 'Chỉnh sửa' tại màn hình Profile hoặc Home. Expo Router điều hướng sang màn hình modal `/edit-profile`."*
> 2. *"Tại `src/app/edit-profile.tsx`, dữ liệu ban đầu được lấy từ `profile` của `AppContext` và đưa vào state cục bộ `formData`."*
> 3. *"Khi người dùng gõ, hàm `handleChange()` cập nhật state và xóa thông báo lỗi tương ứng. Khi bấm 'Lưu', hàm `validateForm()` sẽ kiểm tra: Tên phải từ 2 ký tự trở lên, email phải khớp regex, SĐT phải từ 9-11 số. Nếu sai, state `errors` được set và ô nhập liệu hiển thị viền đỏ và text lỗi ngay dưới ô nhập."*
> 4. *"Nếu form hợp lệ, hàm `updateProfile()` của `AppContext` được gọi. Hàm này vừa cập nhật state trong React để UI render lại ngay lập tức, vừa gọi `StorageService.saveProfile()` để ghi chuỗi JSON xuống `AsyncStorage`."*
> 5. *"Sau đó một Alert thành công hiển thị và `router.back()` đưa người dùng quay lại màn hình Profile với dữ liệu đã được cập nhật."*

### Luồng 2: Luồng Quản Lý Giao Diện & Lưu Trữ (Theme & Persistence Flow)
> **Bạn trình bày với giảng viên**:
> 1. *"Thưa thầy/cô, Theme được quản lý tập trung bằng `ThemeContext` tại `src/context/ThemeContext.tsx`."*
> 2. *"Khi người dùng vào màn hình Cài đặt và bấm chọn chế độ Sáng / Tối / Hệ thống trên component `ThemeToggle`, hàm `setThemeMode()` được kích hoạt."*
> 3. *"Hàm này thực hiện 2 việc đồng thời: cập nhật state `themeMode` để tính toán biến `isDark`, và gọi `StorageService.saveThemePreference(mode)` để lưu giá trị vào AsyncStorage."*
> 4. *"Tất cả 5 màn hình và component con đều lấy mã màu thông qua hook `useAppTheme().colors`. Vì vậy, khi `colors` đổi giữa `LightColors` và `DarkColors`, toàn bộ app tự động re-render đồng bộ."*
> 5. *"Khi tắt app và mở lại, `useEffect` trong `ThemeContext` tự động đọc khóa `@mma301_theme_v1` từ AsyncStorage để phục hồi đúng chế độ người dùng đã chọn trước đó (quá trình Hydration)."*

---

## 4. BỘ CÂU HỎI & CÂU TRẢ LỜI MẪU PHỎNG VẤN (PHẦN 12)

### 4.1 React Native Fundamentals

#### Câu 1: Phân biệt Component, Props và State trong React Native?
* **Component**: Là các khối giao diện độc lập, có thể tái sử dụng (ví dụ: `ProfileCard`, `CustomButton`).
* **Props (Properties)**: Là tham số truyền từ component cha xuống component con, có tính chất **read-only (bất biến)**; component con không được phép sửa props của mình.
* **State**: Là dữ liệu nội tại do chính component đó quản lý và có thể thay đổi theo thời gian bằng hàm `setState` (ví dụ: dữ liệu nhập trong form `edit-profile.tsx`).

#### Câu 2: Điều gì khiến một React component bị re-render?
* Component bị re-render khi:
  1. **State của chính nó thay đổi** (khi gọi `setState` với giá trị mới khác giá trị cũ).
  2. **Props truyền vào thay đổi**.
  3. **Component cha của nó bị re-render** (trừ khi dùng `React.memo`).
  4. **Giá trị của Context mà component đang lắng nghe (qua `useContext`) bị thay đổi**.

#### Câu 3: Tại sao FlatList cần `keyExtractor`? Cơ chế ảo hóa (Virtualization) của FlatList hoạt động thế nào?
* **Lý do cần `keyExtractor`**: Giúp React gán định danh duy nhất (unique key) cho từng phần tử. Khi danh sách thay đổi (thêm, sửa, xóa), thuật toán Diffing của React biết chính xác phần tử nào cần re-render hoặc giữ nguyên, tránh render lại toàn bộ danh sách.
* **Cơ chế Virtualization**: Khác với `ScrollView` (render tất cả phần tử cùng một lúc gây tràn RAM khi danh sách dài), `FlatList` chỉ render các item đang hiển thị trên màn hình (viewport) cộng thêm một khoảng đệm nhỏ (window). Các item bị cuộn ra ngoài màn hình sẽ được gỡ bỏ khỏi cây DOM/Native View để tái sử dụng bộ nhớ.

#### Câu 4: Tại sao tuyệt đối không được mutate state trực tiếp (ví dụ `state.fullName = 'B'`)?
* Vì React dựa vào cơ chế so sánh nông (**Shallow Comparison - Object Reference**) để phát hiện state có thay đổi hay không. Nếu ta thay đổi trực tiếp thuộc tính bên trong object (`mutate`), địa chỉ vùng nhớ của object không đổi (`oldState === newState`), React sẽ tưởng rằng dữ liệu không thay đổi và **sẽ không kích hoạt re-render giao diện**.
* Vì vậy, luôn phải tạo một object/array mới bằng toán tử Spread:
  ```ts
  setProfile(prev => ({ ...prev, fullName: 'Nguyen Van B' }));
  ```

---

### 4.2 State & Persistence

#### Câu 5: Phân biệt Local State, Shared State và Persistent State trong ứng dụng của bạn?
* **Local State (State cục bộ)**: Chỉ tồn tại trong phạm vi 1 màn hình/component, mất đi khi unmount.
  * *Ví dụ*: `formData` và `errors` trong `src/app/edit-profile.tsx`, hoặc `modalVisible` trong `activities.tsx`.
* **Shared State (State dùng chung)**: Tồn tại ở cấp Context, nhiều màn hình cùng đọc và ghi.
  * *Ví dụ*: `profile` và `activities` trong `AppContext`, `themeMode` trong `ThemeContext`.
* **Persistent State (State bền vững)**: Dữ liệu được lưu trữ xuống ổ cứng thiết bị thông qua `AsyncStorage`, vẫn tồn tại khi tắt app hoàn toàn hoặc khởi động lại máy.

#### Câu 6: Quá trình "Hydration" dữ liệu diễn ra ở đâu khi ứng dụng khởi động lại?
* Quá trình Hydration (nạp dữ liệu từ AsyncStorage vào React State) diễn ra tại:
  1. `src/context/ThemeContext.tsx` (dòng 20 - 32): Hook `useEffect` gọi `StorageService.getThemePreference()` để nạp theme đã lưu.
  2. `src/context/AppContext.tsx` (dòng 50 - 75): Hook `useEffect` gọi `StorageService.getProfile()` và `StorageService.getActivities()`. Trong lúc nạp, `isLoading` giữ giá trị `true` để giữ Splash Screen, sau khi nạp xong thì set `isLoading = false` để hiển thị giao diện.

#### Câu 7: Ứng dụng xử lý thế nào khi AsyncStorage trả về `null` (lần chạy đầu tiên) hoặc chuỗi JSON bị hỏng?
* Tại `src/services/storage.ts`:
  * **Trường hợp `null` (First Launch)**: `getProfile()` phát hiện không có dữ liệu ➡️ Tự động gọi `AsyncStorage.setItem()` với dữ liệu mẫu `DEFAULT_PROFILE` và trả về `DEFAULT_PROFILE`.
  * **Trường hợp JSON hỏng hoặc sai định dạng (R10)**: Khối `try...catch` bọc quanh `JSON.parse()`. Bổ sung kiểm tra schema:
    ```ts
    if (!parsed || typeof parsed !== 'object' || !parsed.fullName) {
      console.warn('Storage data corrupted, falling back to default.');
      return DEFAULT_PROFILE;
    }
    ```
    Nếu parse lỗi, khối `catch` bắt ngoại lệ, ghi log và trả về `DEFAULT_PROFILE` an toàn. Ứng dụng không bao giờ bị văng (crash).

---

### 4.3 Design Reasoning

#### Câu 8: Tại sao bạn chọn Context API cho Theme và Profile thay vì Redux Toolkit hay Zustand?
* **Phù hợp quy mô bài toán (Fit for Purpose)**: Ứng dụng có 5 màn hình, tần suất cập nhật dữ liệu ở mức trung bình (khi bấm lưu profile hoặc tick hoàn thành task). Context API có sẵn trong core React, không cần cài thêm thư viện bên ngoài, không tốn dung lượng bundle.
* **Dễ bảo trì và giải thích**: Context API trực quan, dễ chia sẻ giữa các tab mà không cần viết boilerplate code (actions, reducers, dispatch) phức tạp như Redux.
* **Thỏa mãn 100% tiêu chí R05** của đề bài yêu cầu dùng Context API.

#### Câu 9: Khi cần thêm một màn hình mới vào ứng dụng, cấu trúc mã nguồn được mở rộng như thế nào?
* Nhờ kiến trúc file-based routing của **Expo Router**:
  1. Nếu là tab mới: Chỉ cần tạo tệp mới trong `src/app/(tabs)/[ten-man-hinh].tsx` và khai báo thêm 1 `<Tabs.Screen>` trong `src/app/(tabs)/_layout.tsx`.
  2. Nếu là màn hình dạng Stack/Modal độc lập: Chỉ cần tạo tệp trong `src/app/[ten-man-hinh].tsx` và khai báo `<Stack.Screen>` trong `src/app/_layout.tsx`.
  3. Màn hình mới có thể sử dụng ngay các Reusable Components (`CustomButton`, `HeaderBar`,...) và hook `useAppTheme()`, `useApp()` mà không cần cấu hình lại hệ thống.

#### Câu 10: Khi nào nên tách một Custom Hook?
* Khi có một khối logic trạng thái (stateful logic) hoặc hiệu ứng phụ (`useEffect`) được **lặp lại ở từ 2 component trở lên**, hoặc khi cần gom nhóm logic truy xuất Context để code gọn gàng hơn.
* *Ví dụ*: Đã tách `useAppTheme()` và `useApp()` để bọc `useContext(ThemeContext)` kèm kiểm tra an toàn `if (!context) throw Error(...)`.

---

### 4.4 Debugging & Transfer Task (Xử Lý Yêu Cầu Thay Đổi Tại Chỗ)

#### Tình huống 1: "Nếu người dùng bấm Lưu ở Edit Profile nhưng màn hình Profile không cập nhật tên mới, bạn sẽ debug thế nào?"
> **Câu trả lời chuẩn**:
> 1. **Bước 1 (Kiểm tra Form)**: Đặt `console.log('formData:', formData)` trong `handleSave()` ở `edit-profile.tsx` xem dữ liệu người dùng nhập có vào state hay không, hàm `validateForm()` có trả về `true` hay không.
> 2. **Bước 2 (Kiểm tra Context)**: Kiểm tra hàm `updateProfile()` trong `AppContext.tsx` xem `setProfile()` có tạo object mới bằng Spread Operator `{ ...profile, ...updatedData }` hay không. Nếu mutate trực tiếp, Profile sẽ không re-render.
> 3. **Bước 3 (Kiểm tra Storage)**: Xem hàm `StorageService.saveProfile()` có bị vướng lỗi Promise hay không.
> 4. **Bước 4 (Kiểm tra Hook)**: Kiểm tra màn hình `profile.tsx` có đang gọi `useApp()` để lấy `profile` từ Context hay đang lấy từ biến cục bộ cũ.

#### Tình huống 2 (Transfer Task): "Hãy thêm trường 'Số điện thoại dự phòng' (Secondary Phone) vào Profile và Edit Profile"
> **Các bước thực hiện trong 2 phút**:
> 1. **Mở `src/types/index.ts`**: Thêm `secondaryPhone?: string;` vào interface `UserProfile` và `ProfileFormData`.
> 2. **Mở `src/constants/mockData.ts`**: Thêm `secondaryPhone: '0987654321'` vào `DEFAULT_PROFILE`.
> 3. **Mở `src/app/edit-profile.tsx`**:
>    - Thêm `secondaryPhone: profile.secondaryPhone || ''` vào `useState`.
>    - Thêm 1 thẻ `<CustomInput label="Số điện thoại phụ" value={formData.secondaryPhone} onChangeText={t => handleChange('secondaryPhone', t)} icon="call-outline" />`.
>    - Thêm trường `secondaryPhone: formData.secondaryPhone` vào payload của `updateProfile()`.
> 4. **Mở `src/app/(tabs)/profile.tsx`**: Copy 1 khối `infoRow` hiển thị số điện thoại phụ.
> *Bấm Save là app hoạt động ngay lập tức!*

---

## 5. KHAI BÁO SỬ DỤNG AI & CAM ĐOAN HỌC THUẬT (PHẦN 12.5 & 12.6)

### 5.1 Khai Báo Sử Dụng AI (Phần 12.5)
* **Mục đích & Phạm vi**: Hỗ trợ thiết kế cấu trúc khung ban đầu chuẩn Expo SDK 57, xây dựng bảng mã màu Design Tokens (Light/Dark Palette), và gợi ý cấu hình ESLint 9 phẳng (`eslint.config.js`).
* **Sửa đổi so với đề xuất ban đầu của AI**:
  * Thay vì sử dụng các thư viện styling bên thứ ba, tôi đã chuyển đổi toàn bộ sang `StyleSheet` thuần túy của React Native để đảm bảo tính responsive và nhẹ nhàng.
  * Tái cấu trúc lại hook `useEffect` trong `AppContext.tsx` bằng mẫu `isMounted` để tránh lỗi cascading renders trong React 19.
  * Viết bổ sung các kịch bản fallback kiểm tra dữ liệu hỏng trong `StorageService` và thêm tính năng Initials Fallback cho Avatar.
* **Cách kiểm chứng**: Chạy kiểm tra tự động bằng `npx tsc --noEmit` (0 lỗi), `npx expo lint` (0 lỗi) và chạy thử nghiệm thực tế trên Web và Expo Go.

### 5.2 Cam Đoan Học Thuật (Phần 12.6)
Tôi xin cam đoan:
1. Bản thân hoàn toàn hiểu rõ cấu trúc mã nguồn, luồng dữ liệu và các quyết định thiết kế trong đồ án.
2. Đã tự mình kiểm thử đầy đủ các ca bình thường, ca biên và ca lỗi.
3. Có khả năng giải thích và sẵn sàng thực hiện các yêu cầu thay đổi mã nguồn trực tiếp tại buổi đánh giá.
4. Chịu trách nhiệm 100% đối với sản phẩm nộp bài.

---

## 6. BẢNG RTM & MA TRẬN KIỂM THỬ THAM CHIẾU NHANH

### 6.1 Bảng RTM (10 Yêu Cầu Kỹ Thuật)
* **R01**: Expo/React Native chạy đúng quy ước (`app.json`, `package.json`).
* **R02**: Điều hướng 5 khu vực (`_layout.tsx`, `(tabs)`, `edit-profile.tsx`).
* **R03**: Profile hiển thị dữ liệu mặc định và dữ liệu đã lưu.
* **R04**: Edit Profile có form validation, Save, Cancel, xử lý lỗi.
* **R05**: Quản lý Theme dùng chung bằng Context API (`ThemeContext.tsx`).
* **R06**: FlatList cho Activity, xử lý cả Populated State & Empty State.
* **R07**: AsyncStorage lưu trữ bền vững (First Launch & Reload).
* **R08**: Reusable components (`ProfileCard`, `CustomButton`, `ThemeToggle`, `EmptyState`,...).
* **R09**: UI Responsive, Flexbox hiện đại, theme tokens nhất quán.
* **R10**: Error/Fallback State khi dữ liệu lỗi hoặc trống.

### 6.2 Ma Trận Kiểm Thử Rút Gọn
* **Normal 1**: First launch ➡️ Tự động seed data mặc định ➡️ **PASS**.
* **Normal 2**: Đổi theme trong Cài đặt ➡️ Đổi màu toàn bộ 5 màn hình ➡️ **PASS**.
* **Normal 3**: Sửa hồ sơ hợp lệ ➡️ Lưu và cập nhật tức thì ➡️ **PASS**.
* **Negative 1**: Để trống tên ➡️ Viền đỏ và chặn Save ➡️ **PASS**.
* **Negative 2**: Email sai định dạng ➡️ Viền đỏ và chặn Save ➡️ **PASS**.
* **Edge 1**: Bấm "Xóa sạch" ➡️ Hiện EmptyState component ➡️ **PASS**.
* **Edge 2**: Avatar link hỏng ➡️ Hiện chữ cái đầu (Initials) ➡️ **PASS**.
* **Edge 3**: JSON Storage lỗi ➡️ Tự động fallback về dữ liệu mẫu (R10) ➡️ **PASS**.
