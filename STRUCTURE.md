# Karcher Training Board - Structure Document

Tài liệu này lưu trữ chi tiết cấu trúc cây thư mục, vai trò của từng tệp tin, lịch sử nâng cấp và nhật ký các lỗi thường gặp trong quá trình vận hành dự án **Sơ đồ Máy Karcher & Vận Hành Làm Sạch (HAUS)**.

---

## 📂 1. Chi tiết cấu trúc thư mục & Vai trò

```
c:\HAUS\HAUS-Training\
├── .env.local                  # Lưu thông số cấu hình Firebase của dự án (Không đưa lên git)
├── .gitignore                  # Loại bỏ node_modules, file build và file cấu hình bảo mật khỏi Git
├── firebase.json               # Cấu hình dịch vụ Firebase Hosting & rules
├── firestore.rules             # Luật bảo mật truy cập cơ sở dữ liệu Firestore
├── firestore.indexes.json      # Thiết lập chỉ mục tìm kiếm tối ưu cho Firestore
├── package.json                # Định nghĩa thư viện và script npm (dev, build, lint)
├── tailwind.config.js          # Tích hợp màu sắc Karcher và hoạt ảnh hạt năng lượng
├── tsconfig.json               # Cấu hình gốc cho trình biên dịch TypeScript
├── vite.config.ts              # Cấu hình dự án Vite và TypeScript path aliases
├── MASTER.md                   # Tài liệu nguyên tắc thiết kế, roadmap & công nghệ cốt lõi
├── STRUCTURE.md                # [Tài liệu này] Cấu trúc tệp tin, nhật ký phiên bản & lỗi thường gặp
└── src/
    ├── main.tsx                # Điểm khởi động ứng dụng React, mount root element
    ├── App.tsx                 # Bố cục giao diện chính (4 cột ngang + panel + header)
    ├── index.css               # Định nghĩa các lớp CSS chung, Glassmorphism, animations và style hạt năng lượng
    ├── types/                  # Thư mục chứa định nghĩa kiểu TypeScript
    │   └── index.ts            # Khai báo Interface cho Machine, Chemical, Tool, Area, Package, MappingRecord
    ├── context/                # Quản lý State toàn cục của ứng dụng
    │   └── AppContext.tsx      # Lắng nghe Firestore realtime và chia sẻ trạng thái cho các component con
    ├── services/               # Thư mục chứa kết nối cơ sở dữ liệu và xác thực
    │   ├── firebase.ts         # Khởi tạo Firebase App, Firestore và Auth
    │   └── db.ts               # Triển khai các hàm CRUD (Thêm, Xóa, Sửa) dữ liệu
    ├── data/                   # Dữ liệu tĩnh dự phòng ban đầu
    │   ├── packages.ts         # Danh sách Gói mặc định
    │   ├── areas.ts            # Danh sách Khu vực mặc định
    │   ├── machines.ts         # Danh sách Thiết bị mặc định
    │   └── initialData.ts      # Kịch bản tải dữ liệu mẫu ban đầu lên Firestore nếu db trống
    └── components/             # Thư mục chứa các thành phần giao diện nhỏ
        ├── ui/                 # Các component dùng chung nhỏ gọn
        │   ├── Button.tsx      # Nút bấm phong cách Glassmorphism
        │   ├── GlassPanel.tsx  # Tấm nền kính mờ ứng dụng Glassmorphism
        │   └── Tooltip.tsx     # Nhãn gợi ý khi hover chuột
        ├── panels/             # Cụm panel giao diện chính
        │   ├── Header.tsx      # Thanh công cụ trên cùng chứa logo Karcher và chọn Gói dịch vụ
        │   ├── AIChat.tsx      # Cửa sổ trò chuyện ảo kết nối NotebookLM
        │   ├── InfoPanel.tsx   # Panel chi tiết trượt ra khi chọn thiết bị/hóa chất/dụng cụ
        │   ├── LoginModal.tsx  # Hộp thoại đăng nhập bằng tài khoản Admin Email/Password
        │   └── ConfigPanel.tsx # Panel quản lý dữ liệu CRUD dành cho quản trị viên
        └── diagram/            # Thành phần hiển thị trực quan sơ đồ quy trình
            ├── ConnectionLayer.tsx # Vẽ đường hạt năng lượng di chuyển dọc theo Bezier nối 4 cột
            ├── AreaCard.tsx    # Thẻ hiển thị Khu vực
            ├── MachineCard.tsx # Thẻ hiển thị Máy/Thiết bị
            ├── ChemicalCard.tsx# Thẻ hiển thị Hóa chất
            └── ToolCard.tsx    # Thẻ hiển thị Dụng cụ phụ trợ
```

---

## 🕒 2. Lịch sử Nâng cấp (Upgrade History)

*   **V1.00 - V3.43 (Phiên bản cũ)**: Ứng dụng chạy trên tệp đơn HTML độc lập. React, Tailwind và Babel được biên dịch runtime trực tiếp trên trình duyệt. Phù hợp cho việc trình chiếu demo nhanh nhưng không thể bảo mật, không có database thực tế và khó nâng cấp.
*   **V4.00 - V4.10 (Phiên bản hiện tại)**:
    *   Tái cấu trúc hoàn toàn sang cấu trúc **Vite + React + TypeScript + Tailwind CSS** chuẩn hóa.
    *   Chia mô-đun tệp tin rõ ràng, tối ưu hóa tái sử dụng mã nguồn.
    *   Thiết lập cơ sở dữ liệu **Firestore** đồng bộ thời gian thực cho Máy, Hóa chất, Dụng cụ, Khu vực, Gói dịch vụ và Quy trình liên kết chéo (Mô hình C).
    *   Bảo mật quyền Admin thông qua **Firebase Auth** (đăng nhập Email/Mật khẩu tĩnh).
    *   Bố cục lại màn hình thành **4 cột ngang trực quan** kết hợp hiệu ứng **Particle Flow** kết nối quy trình chuyển động hạt năng lượng dọc theo đường SVG Bezier.
    *   **Tích hợp CRUD Gói dịch vụ & Khu vực**: Hỗ trợ Admin Thêm, Xóa, Sửa đầy đủ 6 danh mục dữ liệu trực tiếp trên bảng điều khiển quản trị, tự đặt ID định danh tùy chọn và chọn màu bằng Colorpicker.

---

## ⚠️ 3. Nhật ký lỗi thường gặp & Cách xử lý (Troubleshooting)

### 1. Lỗi lệch điểm vẽ của đường nối SVG (SVG Connection Mismatch)
*   **Nguyên nhân**: Điểm bắt đầu và điểm kết thúc của đường cong Bezier được tính toán dựa trên tọa độ vị trí thực tế của các thẻ (`getBoundingClientRect`). Khi thay đổi kích thước trình duyệt hoặc thu phóng (zoom) màn hình, các thẻ dịch chuyển vị trí khiến đường nối bị lệch.
*   **Cách xử lý**: Luôn sử dụng hook lắng nghe sự kiện `resize` trên window và thêm thời gian trễ ngắn (debounce 100ms) trước khi tính toán lại tọa độ để đảm bảo các thẻ đã hoàn thành dịch chuyển trong layout.

### 2. Quá tải hạn mức đọc/ghi của Firestore (Firestore Quota Exceeded)
*   **Nguyên nhân**: Đăng ký sự kiện lắng nghe trực tiếp (`onSnapshot`) lặp đi lặp lại trong các component con mỗi khi chúng render lại (re-render) dẫn đến việc tạo ra hàng trăm kết nối đồng thời và tăng đột biến số lượng lượt đọc (Read counts).
*   **Cách xử lý**: Đăng ký lắng nghe duy nhất tại `AppContext` (Context Provider chính ở cấp cao nhất) và chỉ chạy một lần duy nhất trong hook `useEffect` khi mount. Các component con chỉ đọc dữ liệu từ State toàn cục được chia sẻ.

### 3. Lỗi không tìm thấy file cấu hình `.env.local` khi build
*   **Nguyên nhân**: File `.env.local` bị bỏ qua bởi Git (nằm trong `.gitignore` để đảm bảo bảo mật), dẫn đến khi deploy lên các nền tảng CI/CD hoặc Firebase Hosting trực tiếp từ repository sẽ bị lỗi thiếu biến môi trường.
*   **Cách xử lý**: Tạo file mẫu `.env.example` chứa các key cấu hình không có giá trị để hướng dẫn người triển khai mới tự điền thông số Firebase của họ khi tải mã nguồn về.
