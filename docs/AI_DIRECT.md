# Bếp Xinh AI — gọi API trực tiếp (18/11/2026)

Theo yêu cầu thử nghiệm: admin lưu cấu hình/key vào Firestore `ai_settings/runtime`.
App đăng nhập đọc cấu hình, tự gọi Gemini `generateContent` hoặc API tương thích
`chat/completions`. Không cần Firebase Functions, Cloudflare hay nâng Firebase Spark.

- Admin: `npm run dev` (Vite cổng 5173). Bản Hosting dùng cùng Firestore thật.
- App: chạy `lib/main.dart` như thường lệ, hot restart sau khi chuyển repository.
  `AI_API_BASE_URL` và `VITE_AI_API_URL` không được dùng bởi luồng trực tiếp.
- Admin đổi key/provider/model ở Cài đặt; app lấy cấu hình mới ở mỗi lượt gửi.
  Ô key để trống giữ key cũ. Đổi provider/endpoint cần nhập key mới.
- Lấy danh sách model và kiểm tra lưu được gọi trực tiếp từ trình duyệt admin.
  API tương thích dùng trên web phải cho phép CORS từ app/admin; lỗi HTTP và
  lỗi kết nối được hiển thị, không trả raw body của provider.

## Dữ liệu và quyền

- Key lưu dạng đọc được bởi tài khoản active đã đăng nhập, theo thiết kế thử nghiệm
  được chủ dự án chấp nhận. Chỉ admin active có quyền sửa cấu hình.
- `ai_chat_threads/{uid}/messages`: lịch sử riêng, chỉ chủ tài khoản đọc/ghi.
  `requests` giữ lượt gửi/retry; `days` giữ số lần thử và khóa lượt đang xử lý.
- `ai_chat_events`: metadata thống kê, không chứa nội dung chat/key. App ghi event
  của mình; chỉ admin đọc tổng hợp. Đây là số liệu client ghi cho thử nghiệm,
  không phải telemetry được máy chủ xác minh độc lập.
- Tổng quan tổng hợp 7 ngày UTC+7 từ events. Bộ đếm `_ai_limits/project_*` cũ
  được cộng làm baseline cho lượt thử trước chuyển đổi, tránh làm mất thống kê.
- Giới hạn 1–100 lượt/ngày qua transaction Firestore. Client trực tiếp giữ key nên
  giới hạn này chỉ áp dụng trong luồng app, không kiểm soát việc gọi API bên ngoài app.

## Chuyển dữ liệu từ bản proxy

Script `app_bep_xinh/functions/tool/migrate-direct-ai.mjs --apply` chỉ chạy một lần
với credential admin đã được chấp thuận. Script lấy master ở `.secret.local` để
giải mã key đã lưu, tạo cấu hình trực tiếp, sao chép lịch sử và metadata thống kê.
Không in key/nội dung chat; không xóa dữ liệu cũ và không ghi đè bản đích đã có.
Functions/proxy cũ không còn là dependency runtime của app/admin; tài liệu AI_CHAT
cũ được giữ làm lịch sử kỹ thuật.

## Kiểm tra

- Flutter: `flutter analyze --no-pub`, `flutter test --no-pub test/features/ai_direct_chat_test.dart test/features/ai_chat_test.dart`.
- Admin: `npm run build`, lint phần thay đổi; browser emulator kiểm tra cấu hình,
  thống kê dark/light mobile/desktop mà không chạy Functions.
- `tests/ai-direct-emulator.mjs`: admin-only config writes, signed-in key reads,
  private history, quota, stats và khóa tài khoản. Chỉ chạy với Auth/Firestore demo.
- Phát hành: deploy Firestore rules đã kiểm tra từ repo app, build và deploy riêng
  `hosting:admin` từ repo admin. Không bật billing, không deploy Functions.

## Kết quả phát hành 18/11/2026

- Firestore rules và admin Hosting đã phát hành. Bundle live
  `/assets/index-CgU-gSYy.js` khớp SHA-256 local và không chứa endpoint Functions cũ.
- Key/cấu hình hiện có đã được chuyển; sao chép 20 tin nhắn và 10 event metadata,
  giữ nguyên bản cũ. Không in key hoặc nội dung hội thoại trong log.
- Kiểm tra Chrome từ origin `https://bepxinh-admin.web.app` gọi Gemini trực tiếp
  bằng cấu hình đã lưu: HTTP 200 và JSON hội thoại hợp lệ, không ghi lịch sử test.
- Flutter analyzer sạch; 377 test toàn bộ suite đạt (4 test capture bỏ qua mặc định).
- Admin build/lint phần thay đổi, browser light/dark mobile/desktop và bài kiểm tra
  quyền Firestore đều đạt khi chỉ chạy Auth/Firestore emulator, không chạy Functions.
- App source đã dùng repository trực tiếp; phiên app đang mở cần hot restart.
  Đợt này phát hành admin Hosting và rules, không ghi đè Hosting Flutter app.

### Phát hành Hosting app tiếp theo ngày 18/11/2026

Theo yêu cầu deploy Hosting app: build release `lib/main.dart` với
`PUBLIC_APP_URL=https://bepxinh-b0be7.web.app`, deploy riêng Hosting mặc định từ
repo app lên `https://bepxinh-b0be7.web.app`. Artifact không còn endpoint proxy AI.
Live `index.html`, `flutter_bootstrap.js`, `main.dart.js` đều khớp SHA-256 build
local. Chrome tải được Flutter view, không có uncaught JS exception; ảnh kiểm tra
ở `app_bep_xinh/build/report_temp/ai-direct-app-live.png`. Không kiểm tra đăng nhập
hoặc gửi chat dưới tài khoản thật trong lần kiểm tra hiển thị app này.
