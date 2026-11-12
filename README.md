# Bếp Xinh Admin

Trang quản trị React + TypeScript + Vite, dùng Firebase Authentication và Firestore
cùng project `bepxinh-b0be7` với app Flutter Bếp Xinh.

- Đăng nhập thật, kiểm tra `role` và `status` từ hồ sơ người dùng.
- Duyệt/từ chối công thức; lưu lý do và lịch sử trong cùng transaction.
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
