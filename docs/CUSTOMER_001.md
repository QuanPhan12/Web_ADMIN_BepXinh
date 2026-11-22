# Yêu cầu khách hàng 001

Đối chiếu đầy đủ app/admin, cách sử dụng và các mục cần cấu hình/dữ liệu thêm:
[CUSTOMER_001](../../app_bep_xinh/docs/CUSTOMER_001.md).

Admin thêm Cài đặt tài khoản, hình thức đình chỉ lần đầu, tên món/người đăng/người
duyệt trong lịch sử, bộ lọc thống kê Hôm nay/7 ngày/30 ngày theo UTC+7. Mục đánh giá
ưu tiên chọn món theo tên, có thể đọc lịch sử của món đã ẩn/xóa.

Đình chỉ dùng `status=locked`, lý do bắt đầu bằng `[Đình chỉ lần đầu] ` và phải có
nội dung thực. Không có thời hạn tự mở lại. Chỉ admin quản lý tài khoản khác;
không tự thay quyền/khóa mình. Thống kê ngày/tuần/tháng là lượng bài gửi thật,
không có dữ liệu lượt xem/hành vi để dựng các đường minh họa trong ảnh khách hàng.

Bản production đã phát hành: `d9f48be972b3eda7` trên `bepxinh-admin.web.app`.
HTML/JS/CSS live đã so khớp với build; các thao tác quản trị kiểm thử trên demo
emulator, không đăng nhập thử bằng tài khoản production.
