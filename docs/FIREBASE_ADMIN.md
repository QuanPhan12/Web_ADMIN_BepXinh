# Quản trị dữ liệu Firebase Bếp Xinh

Giao diện hiện tại dùng font Be Vietnam Pro, màu cam và surface trung tính; có
Sáng/Tối/Theo hệ thống trong phiên quản trị. Login theo hệ thống. Kiểm chứng giao
diện và phạm vi đợt nâng cấp: [bàn giao UI](../../app_bep_xinh/docs/UI_UX_PREMIUM_IMPLEMENTATION.md).
Đã phát hành UI mới lúc 23:01:31 UTC+7 ngày 16/11/2026, Hosting version
`0b43bcd6a87c2fdf`; HTML/JS/CSS và bốn font live khớp artifact local.

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
| Duyệt đánh giá | `recipes/{id}/user_reviews/{uid}` + `ratings/summary` | Theo từng công thức; duyệt/ẩn và cập nhật điểm đồng thời |
| Báo cáo đánh giá | `recipes/{id}/user_reviews/{uid}/reports` | Staff xem lý do báo cáo, có thể ẩn đánh giá |
| Ẩn/hiện bài | `recipes/{id}` + `visibility_events/{eventId}` | Admin đổi trạng thái và ghi lịch sử trong cùng transaction; gỡ banner |
| Báo cáo món | `recipe_reports/{uid}:{recipeId}` | Staff đọc; admin ẩn bài và đóng báo cáo cùng transaction, hoặc kết luận không vi phạm |

Tìm kiếm bài/tài khoản áp dụng trong danh sách đã tải; bấm tải thêm để mở rộng phạm vi.
Danh mục là một document nên tải đủ danh sách. Thông báo duyệt trong app tự dựng từ
`recipes.status/reviewReason`; portal không tạo collection thông báo mới.

## Quyền

Mở **Duyệt đánh giá** ở menu hoặc `?view=user-reviews`. Chọn công thức đã xuất bản
(tải thêm 50 bài/lần hoặc mở trực tiếp bằng ID), rồi chọn Chờ duyệt / Đã duyệt /
Đã ẩn. Duyệt đưa đánh giá lên app và cộng điểm; ẩn rút điểm nếu trước đó đã duyệt.
Từ chối dùng trạng thái `hidden`, không xóa đánh giá hay báo cáo. Admin và moderator
đều được xử lý theo Rules đã phát hành ngày 16/11/2026, không cần thay Rules/index.
Danh sách đánh giá và báo cáo realtime, tải thêm 50 mục/lần; không quét toàn bộ
collection group. Transaction kiểm tra timestamp đến nano giây để chặn duyệt nhầm
nội dung đã sửa và đọc lại aggregate để không ghi đè điểm của người khác.

Lịch sử duyệt hiện tại là lịch sử **công thức**. Browser chưa ghi audit đánh giá:
`user_review_moderation_events` vẫn chỉ cho IAM ghi; công cụ CLI có audit riêng.
Portal chỉ thay trạng thái đánh giá và tổng điểm, không giả lập bản ghi lịch sử.

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
| Ẩn bài đã duyệt, hiện lại bài admin đã ẩn | Không | Không | Có |
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

- **Báo cáo món** (`?view=recipe-reports`) có các tab Chờ xử lý/Đã xử lý/Không vi
  phạm, listener realtime, tải 50 mục/lần và tìm kiếm trong dữ liệu đã tải. Admin
  phải xem công thức và nhập kết quả trước khi quyết định. Ẩn bài và đóng báo cáo
  là một transaction cùng audit visibility; không vi phạm giữ nguyên món. Kết
  quả đã đóng không sửa/xóa hay mở lại. Báo cáo không tự ẩn bài theo số lượng.
  Quyền và schema chi tiết: [báo cáo món](../../app_bep_xinh/docs/RECIPE_REPORTS.md).

- Trong **Duyệt công thức** và **Banner trang chủ**, admin bấm **Ẩn bài**, nhập lý
  do 1–500 ký tự và xác nhận. Tab **Đã ẩn** có lý do/người ẩn, nút **Hiện lại bài**
  cho bài do admin ẩn; bài tác giả ẩn có nút **Giữ ẩn bởi admin** để tiếp nhận.
  Không tự hiện lại bài tác giả đã ẩn/xóa. Tab **Đã xóa** chỉ đọc, không khôi phục.
- Chủ bài quản lý từ app, có quyền xóa khỏi app bằng `status: deleted`, giữ document
  và subcollection làm lịch sử; không xóa Cloudinary. Hành động đều gỡ banner và
  lưu actor/role/lý do/thời gian trong audit bất biến. Nút **Lịch sử ẩn/xóa** xem
  realtime 50 sự kiện/lần; không sửa lịch sử duyệt ban đầu.
- Client so sánh status và visibilityEventId đang xem với bản server để chặn hành
  động cũ; Rules bắt buộc đúng chủ/admin và audit đồng thời, không dựa vào UI.

- Duyệt: đọc lại bài và audit trong transaction. Approve kiểm tra tác giả active và
  toàn bộ nội dung/nguyên liệu/ảnh bằng validator; reject bắt buộc lý do 1–500 ký tự.
- Rules bắt buộc quyết định và audit cùng commit, đúng UID người duyệt, cùng lý do
  và server timestamp. Không cho sửa nội dung/hash/tác giả trong lúc duyệt.
- Portal lưu `reviewedBy` và `reviewer` bằng Firebase UID. Công cụ CLI cũ dùng
  `iam:<hash>`; cả hai định dạng cùng tồn tại trên schema hiện có.
- Banner chỉ dành cho bài approved; Home của app chỉ đọc tối đa 10 banner mới nhất.
- Bật banner qua portal mở preview ảnh vuông; cần ảnh tải được và ba xác nhận
  về tên/ảnh/crop. Đây là checklist người duyệt, không phân loại nội dung tự động
  hay invariant mới ở server. Banner cũ không tự gỡ. Chi tiết:
  [điều chỉnh Home](../../app_bep_xinh/docs/HOME_REFINEMENT.md).
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
không ghi đè site Flutter đang phục vụ app. `firebase.json` dùng target `admin`,
đã gắn site `bepxinh-admin` trong `.firebaserc`.
URL production: **https://bepxinh-admin.web.app**. Các domain `bepxinh-admin.web.app`
và `bepxinh-admin.firebaseapp.com` đã có trong Firebase Auth authorized domains.
Triển khai bằng
`firebase deploy --only hosting:admin --project bepxinh-b0be7`. Build phải có
`VITE_USE_EMULATORS=false` (hoặc không khai báo), rồi deploy đúng site/target.
Không deploy artifact emulator lên Hosting. Việc thay đổi source không tự chứng minh
rules hoặc Hosting production đã cập nhật; cần kiểm tra bản phát hành thực tế.

### Phát hành Hosting ngày 17/11/2026

Đã build production với `VITE_USE_EMULATORS=false`, endpoint AI HTTPS production
(không đưa cấu hình `.env.development.local` lên Hosting). Deploy thành công riêng
`hosting:admin`, site `bepxinh-admin`, bằng tài khoản Firebase đã được chấp thuận.
Live HTML trả HTTP 200 và JS `/assets/index-CS7uX11D.js` có SHA-256 khớp file local.
Build và test domain đạt; lint không có lỗi chặn, vẫn có cảnh báo ở source cũ.

Backend AI production `/admin/stats` hiện trả HTTP 404. Đợt này không deploy
Functions/rules, không bật billing. Vì vậy cấu hình/thống kê AI trên Hosting chưa
hoạt động dù giao diện đã phát hành; backend dùng dữ liệu thật hiện vẫn chạy local.

Nguồn schema đầy đủ: [README của app](../../app_bep_xinh/README.md).

### Phát hành màn duyệt đánh giá — 16/11/2026

- Đã deploy riêng `hosting:admin`, version `7d802030c5dce1b9`, lúc 18:20:16 UTC+7.
- HTML và 2 asset JS/CSS production khớp SHA-256 bản build local; không chứa
  project emulator. Không thay Hosting Flutter hay Rules/index trong đợt này.
- Build production và 4 domain test đạt. Lint không có lỗi; còn các warning cũ
  trong prototype. Browser emulator đạt 13 SDK check và 8 UI check, gồm
  duyệt/ẩn/duyệt lại, điểm tổng, chặn bản cũ, hiển thị đánh giá và báo cáo.
- Chưa thực hiện thao tác duyệt bằng tài khoản admin thật trên production.
- Log emulator: `../app_bep_xinh/build/admin_review_browser.log`;
  ảnh UI và log deploy ở `node_modules/.cache/admin-smoke` (cục bộ).

### Phát hành quyền ẩn bài — 16/11/2026, 18:40 UTC+7

Hosting version `602b65cabcb66e4c` đã phát hành riêng site `bepxinh-admin`.
HTML và asset live khớp build production. Bộ Chrome/emulator đạt 17 SDK check và
11 UI check, gồm ẩn/hiện bài, rút banner, chặn thao tác cũ và audit cùng transaction.
Rules đã phát hành trước admin; app web cũng đã cập nhật. Chi tiết quyền, giới hạn
xóa bằng tombstone, SHA-256 Rules và các log tại
[quyền ẩn/xóa bài](../../app_bep_xinh/docs/RECIPE_VISIBILITY.md).

### Phát hành báo cáo món — 16/11/2026, 21:54 UTC+7

Admin version `92c3ed759b8d2dfc` đã phát hành riêng site `bepxinh-admin`;
HTML/JS/CSS live khớp build. Rules và app web đã phát hành trước đó. Kiểm thử
Chrome/emulator đạt 21 SDK check và 15 UI check. Các bản phát hành, SHA-256 Rules
và giới hạn được ghi trong [báo cáo món](../../app_bep_xinh/docs/RECIPE_REPORTS.md).
