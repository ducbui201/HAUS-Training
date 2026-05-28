# Karcher Training Board - Master Document

Tài liệu này lưu trữ toàn bộ nguyên tắc phát triển, chuẩn công nghệ, quy định coding style và lộ trình nâng cấp dài hạn cho dự án **Sơ đồ Máy Karcher & Vận Hành Làm Sạch (HAUS)**.

---

## 🚀 1. Công nghệ & Kiến trúc cốt lõi

Ứng dụng được xây dựng trên mô hình Single Page Application (SPA) hiện đại với các công nghệ chính:

1.  **Frontend Framework**: [Vite](https://vite.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
    *   Sử dụng TypeScript ở chế độ kiểm soát chặt chẽ (`strict: true`) nhằm đảm bảo kiểm tra kiểu dữ liệu cho toàn bộ danh mục thực thể và quan hệ mapping chéo.
    *   Quản lý trạng thái toàn cục thông qua React Context API kết hợp với Firestore realtime listener.
2.  **Styling**: [Tailwind CSS](https://tailwindcss.com/)
    *   Hỗ trợ xây dựng giao diện tùy biến nhanh, nhất quán và responsive.
    *   Kết hợp các thuộc tính Vanilla CSS tùy chỉnh để làm nổi bật phong cách **Glassmorphism** và các animation nâng cấp.
3.  **Backend & Database**: [Firebase](https://firebase.google.com/)
    *   **Firestore Database**: Lưu trữ dữ liệu Máy, Hóa chất, Dụng cụ, Khu vực, Gói dịch vụ và các Mapping liên kết. Lắng nghe cập nhật thời gian thực thông qua `onSnapshot`.
    *   **Firebase Auth**: Bảo mật phân quyền Admin (Email/Mật khẩu tĩnh) để khóa/mở khóa bảng cấu hình.
    *   **Firebase Hosting**: Triển khai ứng dụng nhanh chóng với CDN toàn cầu.

---

## 🎨 2. Nguyên tắc Thiết kế & UI/UX Standards

Giao diện ứng dụng phải mang tính **Vibrant, Premium & Interactive** (Rực rỡ, Đẳng cấp & Tương tác cao):

*   **Hệ màu thương hiệu**:
    *   Màu chủ đạo Karcher: Vàng `#FFED00` kết hợp đen bóng tối của không gian kỹ thuật.
    *   Màu nền sâu: Trực quan hóa dưới dạng Glassmorphism mờ đục trên nền gradient chuyển động (`#000428` đến `#004e92`).
*   **Trải nghiệm Sơ đồ dòng chảy 4 cột**:
    *   Bố cục ngang: **[Khu vực] ────> [Thiết bị] ────> [Hóa chất] ────> [Dụng cụ]**
    *   **Particle Flow**: Khi chọn Gói dịch vụ và hover qua một Khu vực, các đường kết nối Bezier sẽ xuất hiện với hiệu ứng hạt năng lượng chạy dọc từ trái qua phải để biểu diễn dòng chảy quy trình. Các thành phần ngoài luồng tự động mờ đi (`opacity-20 blur-[0.5px]`).
*   **Micro-animations & Transitions**:
    *   Tất cả các thẻ (`Card`), panel và nút bấm phải tích hợp hiệu ứng hover nâng góc (`hover-lift`), thay đổi viền phát sáng và chuyển trạng thái mượt mà (`transition-all duration-300`).

---

## 💻 3. Nguyên tắc Lập trình (Coding Principles)

*   **Kiểm soát kiểu (Type Safety)**: Định nghĩa rõ ràng các Interface cho Máy (`Machine`), Hóa chất (`Chemical`), Dụng cụ (`Tool`), Khu vực (`Area`), Gói dịch vụ (`Package`), và bản ghi quy trình (`MappingRecord`) bên trong `src/types/index.ts`. Không sử dụng kiểu `any`.
*   **Realtime listener**:
    *   Chỉ thiết lập lắng nghe Firestore một lần duy nhất tại `AppContext` khi khởi động ứng dụng để tránh lãng phí lượng truy vấn (Read/Write counts).
    *   Hủy lắng nghe (`unsubscribe`) khi component unmount để tránh rò rỉ bộ nhớ.
*   **Bảo mật dữ liệu**:
    *   Quy tắc Firestore Rules phải chặn hoàn toàn quyền ghi (Write/Update/Delete) đối với người dùng chưa đăng nhập. Chỉ cho phép Admin đã xác thực qua Firebase Auth ghi dữ liệu.
    *   Các thông số bảo mật của Firebase phải được lưu trữ trong `.env.local` và không bao giờ commit lên GitHub.

---

## 📅 4. Lộ trình phát triển & Roadmap

### Giai đoạn 1: Tái cấu trúc cốt lõi (Vite + React + TS)
*   [x] Khởi tạo dự án Vite React TypeScript.
*   [x] Tạo các tài liệu nguyên tắc (`MASTER.md`, `STRUCTURE.md`).
*   [ ] Chuyển đổi mã nguồn cũ thành các React Component độc lập.

### Giai đoạn 2: Tích hợp Firestore & Đồng bộ thời gian thực
*   [ ] Thiết lập Firebase SDK, cấu hình Auth & Firestore.
*   [ ] Viết script hạt giống (`seed`) dữ liệu mặc định ban đầu lên Firestore.
*   [ ] Xây dựng màn hình Đăng nhập Admin và Bảng quản trị CRUD (Thêm/Sửa/Xóa máy, hóa chất, dụng cụ, mapping).

### Giai đoạn 3: Nâng cấp Sơ đồ dòng chảy 4 cột & Particle Flow
*   [ ] Thiết lập layout 4 cột ngang mượt mà.
*   [ ] Viết thuật toán hạt năng lượng di chuyển trên đường cong Bezier.
*   [ ] Hoàn thiện và đóng gói ứng dụng để sẵn sàng triển khai lên Firebase Hosting.
