# Bếp Xinh Admin

Giao diện dark và biểu đồ tổng quan: [Dashboard UI](docs/DASHBOARD_UI.md).
Yêu cầu khách hàng mới: [Đối chiếu 001](docs/CUSTOMER_001.md).
Chat AI và cấu hình Gemini/API tương thích: [Hướng dẫn local](../app_bep_xinh/docs/AI_CHAT.md).

Trang quản trị React + TypeScript + Vite, dùng Firebase Authentication và Firestore
cùng project `bepxinh-b0be7` với app Flutter Bếp Xinh.

Hosting: **https://bepxinh-admin.web.app** (site riêng `bepxinh-admin`, target `admin`).

Triển khai bản mới bằng `npm.cmd run build`, sau đó
`firebase deploy --only hosting:admin --project bepxinh-b0be7`.

- Đăng nhập thật, kiểm tra `role` và `status` từ hồ sơ người dùng.
- Duyệt/từ chối công thức; lưu lý do và lịch sử trong cùng transaction.
- Duyệt đánh giá: chọn công thức → chờ duyệt/đã duyệt/đã ẩn; xem báo cáo và duyệt/ẩn, cập nhật điểm trong cùng transaction.
- Admin ẩn bài kèm lý do, hiện lại bài admin đã ẩn, xem bài tác giả ẩn/xóa và lịch sử; tự gỡ banner khi đổi trạng thái.
- Báo cáo món: staff xem phản ánh; admin xem công thức, ẩn bài và đóng báo cáo hoặc kết luận không vi phạm.
- Chọn/gỡ banner bằng `recipes/{id}.isBanner`.
- Thêm/sửa nguyên liệu, nhóm và đơn vị trong `catalogs/ingredients`.
- Quản lý quyền, khóa/mở tài khoản; giữ nguyên ID và dữ liệu nghiệp vụ.
- Danh sách cập nhật realtime; tổng quan dùng số đếm thật từ Firestore.

## Chạy local

```powershell
npm.cmd install
npm.cmd run dev
```

Tài khoản cần có `users/{uid}.role = admin` hoặc `moderator` và `status = active`.
Không có tài khoản/mật khẩu mặc định, đăng nhập giả hoặc tự cấp quyền.

## Kiểm tra

```powershell
npm.cmd run build
npm.cmd run lint
npm.cmd test
```

Kiến trúc: `src/features/admin/models.ts` → `domain.ts/validation.ts` →
`repository.ts` → hooks → các view. Firebase khởi tạo duy nhất ở `src/config.ts`.
Các màn prototype cũ còn trong source nhưng không tham gia giao diện chạy thật.

Xem [hướng dẫn Firebase Admin](docs/FIREBASE_ADMIN.md) để cấp admin đầu tiên,
chạy emulator, kiểm tra quyền và triển khai rules/Hosting đúng site.
Schema dữ liệu: [README app Bếp Xinh](../app_bep_xinh/README.md).
# Duyệt bản biến tấu công thức

Modal chi tiết bài gửi hiển thị nguồn công thức, tác giả gốc và phần điều chỉnh
khi document có `remix`. Người đăng bản mới vẫn là `authorId` của bài gửi; nguồn
không thay quyền tác giả hoặc bỏ qua kiểm duyệt. Contract và kiểm thử:
`D:/quan/app_bep_xinh/docs/RECIPE_REMIX.md`.

