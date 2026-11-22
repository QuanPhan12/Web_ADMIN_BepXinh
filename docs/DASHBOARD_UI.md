# Giao diện quản trị và biểu đồ

- Mặc định dark, giữ màu cam Bếp Xinh. Bộ chọn sáng/tối/hệ thống lưu lựa chọn
  bằng `bx-admin-theme`; đăng nhập, bảng, form và dialog dùng chung token màu.
- Tổng quan còn 4 số liệu chính (moderator không thấy tài khoản), 2 biểu đồ và
  2 lối vào hàng đợi. Các mục quản trị khác vẫn có đầy đủ trên sidebar.
- Biểu đồ cột: số document công thức gửi theo `submittedAt`, 7 ngày theo UTC+7.
  Ngày hiện tại chưa kết thúc; đây là lượng bài gửi, không phải lượt xem hay người dùng.
- Biểu đồ vòng: trạng thái hiện tại của toàn bộ công thức, gồm đã ẩn/đã xóa.
  Banner là tập con của bài đã xuất bản, không cộng vào tổng trạng thái.
- Tất cả là `getCountFromServer`, không tải toàn bộ bài để thống kê. Mỗi lần mở
  tổng quan/làm mới có 14 aggregate query cho admin, 13 cho moderator. Không
  thêm listener hoặc polling cho dashboard; thời điểm cập nhật hiện ở nút làm mới.
  Danh sách quản trị vẫn realtime. Không cần rules/index mới.
- Không dùng dữ liệu giả khi truy vấn lỗi; hiện thông báo lỗi và cho làm mới.

## Kiểm tra

`npm run build`, `npm test`; lint riêng các file thay đổi. Lint toàn repo vẫn có
các cảnh báo purity/set-state-in-effect trong màn prototype không tham gia app.

Browser test với Firebase demo emulator kiểm tra dashboard nhận aggregate thật,
dark mặc định, lưu lựa chọn giao diện, không tràn ngang ở 1440/800/390px và các
luồng quản trị có sẵn. Ảnh: `node_modules/.cache/admin-smoke/dashboard-*.png`.
Không seed hoặc thay dữ liệu production.

## Phát hành 17/11/2026

- Build production với `VITE_USE_EMULATORS=false`; gói ZIP tại
  `build/releases/bepxinh-admin-production.zip`.
- Đã deploy riêng `hosting:admin` lên `https://bepxinh-admin.web.app`;
  version `5e069ab7256864a0`, release `1794905556848000`.
- HTML và 2 asset JS/CSS live trùng build local; không có project emulator trong
  JS production. Chrome live hiển thị đăng nhập dark mặc định, không có exception.
- Chưa đăng nhập bằng tài khoản thật trên bản live; các thao tác quản trị đã
  được kiểm tra bằng emulator trước phát hành. Không thay Hosting Flutter/rules.
