# Bếp Xinh Enterprise Portal & Admin System (React 19 + TypeScript)

Hệ thống quản trị điều hành ẩm thực cấp cao **Bếp Xinh Enterprise** được xây dựng toàn diện với **React 19**, **TypeScript**, **Tailwind CSS v4** và **Vite**, bao gồm đầy đủ 3 màn hình nghiệp vụ chính:

1. 🔐 **Cổng Đăng Nhập Quản Trị Bảo Mật (Login & 2FA / Hardware Token)**
2. 📊 **Executive Dashboard: Tổng quan & Chỉ số Vận hành (Executive Telemetry)**
3. 👤 **Hồ sơ Quản trị viên & Thiết lập Bảo mật (Admin Profile & RBAC Matrix)**

---

## 🚀 Các Tính Năng Mới Vừa Cập Nhật

### 1. Đồng Bộ Dữ Liệu Thời Gian Thực (Data Synchronization)
- **Nút đồng bộ chủ động**: Bấm trực tiếp vào nút *VẬN HÀNH THỜI GIAN THỰC (REAL-TIME)* để kích hoạt hiệu ứng xoay đồng bộ `RefreshCw`.
- **Cập nhật mốc thời gian**: Tự động ghi nhận thời điểm đồng bộ chính xác (ví dụ: `Vừa đồng bộ lúc 10:48:30`).
- **Đồng bộ theo chi nhánh**: Hỗ trợ chuyển đổi giữa các cụm chi nhánh (*Toàn quốc 31 Chi Nhánh, Miền Bắc, Miền Nam, Miền Trung, Chi nhánh Mới*).
- **Thông báo Toast**: Hiển thị popup góc màn hình xác nhận kết quả đồng bộ dữ liệu với mạng lưới API.

### 2. Xử Lý & Hiển Thị Dữ Liệu Là 0 Khi Không Có Dữ Liệu (Zero-State Graceful Fallback)
Khi hệ thống chưa có dữ liệu hoặc chọn chi nhánh chưa phát sinh giao dịch:
- **Tất cả 4 thẻ KPI chuyển về 0**:
  - `0` Tổng công thức hoạt động (`+0.0% MoM`, đường sparkline phẳng).
  - `0 bài` Hàng đợi chờ duyệt (`0 bài cần duyệt gấp`, `AI duyệt 0%`).
  - `0 Active` Đầu bếp & Creator (`+0.0%`, `Chỉ số hài lòng: 0/5`).
  - `0 VNĐ` GMV Giỏ đi chợ liên kết (`Tỷ lệ thành công: 0%`, `+0.0% tuần này`).
- **Biểu đồ sóng tương tác**: Chuyển thành đường baseline đứt đoạn tại mốc 0, tooltip ghi nhận `Chưa có tương tác (0)`.
- **Biểu đồ tròn Thói quen ẩm thực**: Vòng tròn rỗng trung tính với tâm hiển thị `0 Lượt nấu tuần này`, các danh mục đều đạt `0% (0)`.
- **Bảng hàng đợi duyệt AI**: Hiển thị placeholder thông báo hàng đợi trống với `0 công thức`.
- **Thanh chuyển đổi nhanh**: Bộ nút `[ 📊 Dữ liệu Thực Tế ]` và `[ ⭕ Dữ liệu Trống (0) ]` cho phép kiểm thử và chuyển đổi ngay lập tức.

### 3. Xuất Báo Cáo Tổng Hợp Vận Hành Bằng Excel (.xlsx) và PDF (.pdf)
Bấm nút **"Xuất Báo Cáo Tổng Hợp"** ở góc trên Dashboard để mở hộp thoại:
- 📊 **Xuất Microsoft Excel (.xlsx)**:
  - Sinh file Excel chuẩn bằng thư viện `xlsx`.
  - Bao gồm 4 Sheet chi tiết:
    1. *Chỉ Số Tổng Quan* (KPIs, tăng trưởng, ghi chú).
    2. *Hàng Đợi Duyệt* (Toàn bộ danh sách bài gửi, điểm AI Score, tác giả).
    3. *Đối Tác Siêu Thị API* (Uptime, số lượng SKU, tỷ lệ hoàn thành).
    4. *Thói Quen Ẩm Thực* (Cơ cấu danh mục nấu nướng).
  - Tự động tải về máy: `Bao_Cao_Tong_Hop_Bep_Xinh_[Ngày].xlsx`.
- 📄 **Xuất Tài Liệu PDF (.pdf)**:
  - Sinh file PDF định dạng Executive bằng thư viện `jspdf`.
  - Có logo, tiêu đề, ngày xuất, tên kiểm toán viên, bảng thống kê KPI và chứng thư số.
  - Tự động tải về máy: `Bao_Cao_Tong_Hop_Bep_Xinh_[Ngày].pdf`.
- 🖨️ **Chế độ In Ấn (Print Preview)**: Kích hoạt hộp thoại in của trình duyệt (`window.print()`).

### 4. Chỉnh Sửa Thông Tin Cá Nhân & Tải Ảnh Đại Diện Từ Thiết Bị
- Cho phép tải ảnh đại diện từ máy tính (kéo thả hoặc bấm nút Camera / Đổi ảnh đại diện).
- Lưu trữ bền vững dưới dạng Base64 trong `localStorage`.
- Chỉnh sửa toàn bộ thông tin quản trị và đồng bộ trực tiếp lên thanh TopNav.

---

## 🛠️ Hướng dẫn Khởi chạy

```bash
# 1. Cài đặt phụ thuộc
npm install

# 2. Chạy máy chủ dev
npm run dev

# 3. Mở trên trình duyệt
http://localhost:5173
```
