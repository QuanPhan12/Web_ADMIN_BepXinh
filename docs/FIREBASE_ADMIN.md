# Quản trị dữ liệu Firebase Bếp Xinh

## Kết nối và dữ liệu

Portal dùng Firebase Authentication email/password và Firestore của project
`bepxinh-b0be7`, cùng project với `../app_bep_xinh`. Cấu hình Web nằm ở
`src/config.ts`; đây là Firebase Web config công khai, không chứa service account
hay khóa IAM. Không đưa Admin SDK/service account vào browser.

App production render `src/features/admin/AdminApp.tsx`. Các màn prototype cũ
vẫn còn trong source nhưng không còn được router của portal mở; không dùng số liệu
mẫu, đăng nhập giả, thông báo phát sóng local hay giao dịch siêu thị để quản trị thật.

| Chức năng | Collection/document | Thao tác |
|---|---|---|
| Tổng quan | `recipes`, `users` | `getCountFromServer`; nút cập nhật số liệu |
| Bài gửi | `recipes/{id}` | Listener theo `status`, mới nhất trước; tải 50 bài/lần |
| Duyệt/từ chối | `recipes/{id}` + `recipe_moderation_events/{id}` | Transaction cập nhật kết quả và tạo audit; chỉ xử lý `pending` một lần |
| Banner | `recipes/{id}.isBanner` | Chỉ đổi cờ cấp gốc của bài `approved`; không sửa `content.isBanner` |
| Danh mục | `catalogs/ingredients` | Listener; thêm/sửa nguyên liệu, nhóm, đơn vị; transaction phát hành phiên bản |
| Tài khoản | `users/{uid}` | Listener; sửa `role`, `status`, `lockedAt`, `lockReason`, `updatedAt` |
| Lịch sử duyệt | `recipe_moderation_events` | Listener, mới nhất trước; không sửa/xóa audit |

Tìm kiếm bài/tài khoản áp dụng trong danh sách đã tải; bấm tải thêm để mở rộng phạm vi.
Danh mục là một document nên tải đủ danh sách. Thông báo duyệt trong app tự dựng từ
`recipes.status/reviewReason`; portal không tạo collection thông báo mới.

## Quyền

Quyền được kiểm tra bằng Firestore Rules tại database và listener hồ sơ trong portal,
không chỉ ẩn nút ở giao diện. Tài khoản cần `id == UID`, `status == active` và role hợp lệ.
Tham khảo cơ chế [Security Rules](https://firebase.google.com/docs/rules/basics)
và [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions).

| Quyền | user | moderator | admin |
|---|---|---|---|
| Vào portal | Không | Có | Có |
| Đọc bài chờ duyệt/kết quả và lịch sử | Không | Có | Có |
| Duyệt/từ chối kèm audit | Không | Có | Có |
| Đọc hồ sơ tác giả theo UID để kiểm tra bài | Chỉ mình | Có | Có |
| Liệt kê tài khoản | Không | Không | Có |
| Chọn/gỡ banner | Không | Không | Có |
| Sửa danh mục | Không | Không | Có |
| Sửa quyền, khóa/mở tài khoản khác | Không | Không | Có |
| Tự thay quyền/khóa mình | Không | Không | Không |

Admin không có quyền đọc hội thoại, ảnh chat, nháp, tủ lạnh, yêu thích hoặc dấu đọc
riêng của người khác. Portal không có API tạo/xóa tài khoản Auth, thu hồi refresh
token hay vô hiệu hóa đăng nhập Firebase Auth. `locked` là trạng thái hồ sơ được
Rules hiện tại dùng để chặn các thao tác dữ liệu; đăng nhập Auth vẫn có thể thành công.
App Flutter hiện có guard theo dõi trạng thái hồ sơ realtime, chặn router khi locked
và chỉ mở phiên sau khi server xác nhận active. Người dùng app bản cũ cần cập nhật/
khởi động lại bản Flutter có guard; deploy rules không tự cập nhật code trên thiết bị.

## Cấp admin đầu tiên

1. Đăng ký/đăng nhập qua app để tạo Firebase Auth account và `users/{uid}` đúng schema.
2. Người có quyền IAM mở Firebase Console đúng project `bepxinh-b0be7`.
3. Xác minh UID ở Authentication trùng với `users/{uid}.id`. Cập nhật **duy nhất**
   `role: admin`, giữ `status: active`, `lockedAt: null`, `lockReason: null`.
4. Đăng nhập portal bằng email/password của tài khoản đó.

Portal không có đường tự nâng quyền. Không cấp quyền theo email hard-code hay
localStorage. Sau bootstrap, admin có thể cấp moderator/admin cho tài khoản khác.
Phiên browser dùng session persistence; không tự ghi password/ID token vào storage.

## Bảo toàn dữ liệu

- Duyệt: đọc lại bài và audit trong transaction. Approve kiểm tra tác giả active và
  toàn bộ nội dung/nguyên liệu/ảnh bằng validator; reject bắt buộc lý do 1–500 ký tự.
- Rules bắt buộc quyết định và audit cùng commit, đúng UID người duyệt, cùng lý do
  và server timestamp. Không cho sửa nội dung/hash/tác giả trong lúc duyệt.
- Portal lưu `reviewedBy` và `reviewer` bằng Firebase UID. Công cụ CLI cũ dùng
  `iam:<hash>`; cả hai định dạng cùng tồn tại trên schema hiện có.
- Banner chỉ dành cho bài approved; Home của app chỉ đọc tối đa 10 banner mới nhất.
- Danh mục giữ nguyên ID đã phát hành, không xóa nguyên liệu/nhóm/đơn vị; không bỏ
  đơn vị đã gắn với nguyên liệu. Thêm/sửa tên, aliases, nhóm và bổ sung đơn vị được hỗ trợ.
- Mỗi lần lưu tăng `YYYY-MM-DD.vN`, tính SHA-256 payload và ghi server timestamp.
  Transaction so sánh version/hash đang sửa để chặn ghi đè phiên bản mới của người khác.
- Validator client kiểm tra ID duy nhất, nhóm/đơn vị tồn tại, đơn vị mặc định thuộc
  danh sách, tên/alias và giới hạn 750 KB. Rules kiểm tra role/schema cấp gốc;
  không lặp kiểm tra từng phần tử nested của danh mục. Admin là người xuất bản tin cậy.
- File JSON trong repo app là bản bootstrap, không tự đồng bộ ngược khi sửa trên portal.
  Không chạy lại publisher từ JSON cũ đè lên phiên bản mới đã sửa trong portal.

## Chạy và kiểm thử

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run lint
npm.cmd test
```

Để chạy emulator, copy `.env.example` thành `.env.local`, đặt
`VITE_USE_EMULATORS=true`, rồi khởi động auth/firestore emulator từ repo app,
project cố định `demo-bepxinh`, auth `127.0.0.1:9099`, Firestore `127.0.0.1:8080`.
Cần Java 21+ và Node 22+. Test browser tự khởi động Vite và Chrome headless với
profile riêng, seed duy nhất demo emulator và chặn endpoint Firebase production.

Từ `../app_bep_xinh`:

```powershell
firebase emulators:exec --only auth,firestore --project demo-bepxinh "node tool/admin_portal_emulator_smoke.cjs"
firebase emulators:exec --only auth,firestore --project demo-bepxinh "node ../admin_bep_xinh/tests/browser-emulator.cjs"
```

Các kiểm tra bao gồm phân quyền, duyệt/audit bắt buộc đồng thời, khóa tác giả,
banner approved-only, cấp quyền sai, snapshot thật, version conflict và render portal.
Test không cấp quyền hoặc duyệt bài trên project thật.

## Triển khai

Rules/indexes **chỉ có một nguồn** tại `../app_bep_xinh/firestore.rules` và
`../app_bep_xinh/firestore.indexes.json`. Đã bỏ cấu hình `rules: y/indexes: y`
không hợp lệ ở admin để tránh deploy nhầm. Từ repo app, sau khi duyệt diff:

```powershell
firebase deploy --only firestore --project bepxinh-b0be7
```

Sau khi rules mới đã được triển khai, admin mới có quyền thao tác dữ liệu thật.
Để đưa web lên Hosting, xác nhận Hosting site dành riêng cho admin trước;
không ghi đè site Flutter đang phục vụ app. `firebase.json` dùng target `admin`
chưa gắn site, nên không vô tình deploy vào default site. Sau khi tạo site riêng,
gắn bằng `firebase target:apply hosting admin <site-id>`; triển khai bằng
`firebase deploy --only hosting:admin --project bepxinh-b0be7`. Build phải có
`VITE_USE_EMULATORS=false` (hoặc không khai báo), rồi deploy đúng site/target.
Không deploy artifact emulator lên Hosting. Việc thay đổi source không tự chứng minh
rules hoặc Hosting production đã cập nhật; cần kiểm tra bản phát hành thực tế.

Nguồn schema đầy đủ: [README của app](../../app_bep_xinh/README.md).
