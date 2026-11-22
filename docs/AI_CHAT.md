# Ghi chú proxy AI cũ

**Luồng hiện tại đã chuyển sang gọi API trực tiếp theo yêu cầu thử nghiệm.**
Xem [AI_DIRECT.md](AI_DIRECT.md) để chạy app/admin không cần máy chủ local hay Blaze.
Nội dung bên dưới chỉ lưu lịch sử thiết kế proxy cũ.

## Thống kê chat AI

Phần **Thống kê chat AI** nằm trong **Tổng quan** (`?view=dashboard`), chỉ dành cho
admin active; đã bỏ mục menu riêng. Nút Làm mới của Tổng quan cũng tải lại số liệu
AI; nút Làm mới AI chỉ tải riêng phần AI. Endpoint
`GET /admin/stats` tổng hợp 7 ngày theo UTC+7 từ `_ai_requests` và bộ đếm project
`_ai_limits/project_YYYY-MM-DD`, không đọc nội dung chat/key để tính số liệu.
Có tổng yêu cầu, người dùng duy nhất, tỷ lệ hoàn tất, yêu cầu lỗi, biểu đồ và bảng
theo ngày (hoàn tất/lỗi/đang xử lý/gián đoạn/lượt thử). Nút Làm mới đọc dữ liệu lại.

Yêu cầu đếm một lần theo mã yêu cầu và trạng thái của lần thử gần nhất; retry có
thể chuyển ngày hoặc trạng thái của yêu cầu. Lượt thử là số lần nhận hạn mức,
bao gồm lần lỗi/retry, không tính cache hit. Tỷ lệ hoàn tất = hoàn tất / (hoàn tất
+ lỗi + gián đoạn), loại lượt đang xử lý. Số người dùng theo tuần không phải tổng
số người dùng từng ngày. Không suy ra số token/chi phí hoặc số lần lỗi lịch sử từ
trạng thái cuối của yêu cầu. Những lần kiểm tra cấu hình/model trong admin không tính
vào lượt chat. Giới hạn đọc 3.500 yêu cầu và báo rõ nếu số liệu bị cắt.

Dữ liệu cũ suy ra lần thử từ `leaseUntil - 60 giây`; dữ liệu mới ghi rõ
`attemptedAtMillis`. Chưa backfill hoặc ghi thêm dữ liệu production để tạo thống kê.
Kiểm tra read-only trên project thật thành công; kiểm thử ghi/phân quyền dùng emulator.

Admin → Cài đặt → Bếp Xinh AI. Cần chạy proxy Functions local để tải/lưu cấu hình.

## Khởi động nhanh trên Windows

Trong `D:\quan\admin_bep_xinh`, chạy `npm.cmd run dev` (dependencies admin và
`../app_bep_xinh/functions` đã cài). Theo yêu cầu cập nhật, mặc định dùng **dữ liệu
thật** của `bepxinh-b0be7`: Firebase Auth/Firestore thật, chỉ máy chủ AI chạy local.
Firebase CLI dùng tài khoản đã được chấp thuận `phuckk2101@gmail.com`.

Mở http://localhost:5173/?view=settings, đăng nhập bằng tài khoản quản trị hiện có.
Không seed dữ liệu hay tạo tài khoản demo. Lưu cấu hình và chat sẽ ghi Firestore thật.
Giữ file `app_bep_xinh/functions/.secret.local` để giải mã key đã lưu; không xóa
hoặc tạo lại file này tùy tiện và không đưa vào Git. Khi chuyển deploy phải chuyển
master key sang Secret Manager hoặc nhập lại/re-encrypt provider key theo quy trình.

Dừng bằng Ctrl+C. Không chạy đồng thời nhiều bộ máy chủ trên cổng 5001/5173.
Demo cô lập vẫn có lệnh riêng `npm.cmd run dev:ai:demo` (cần Java 21+), không phải
luồng mặc định. Chế độ thật không dùng Auth/Firestore emulator.

Để app web cùng dùng dữ liệu thật và máy chủ AI local, chạy từ `app_bep_xinh`:

```powershell
flutter run -d chrome -t lib/main.dart --dart-define=AI_API_BASE_URL=http://127.0.0.1:5001/bepxinh-b0be7/asia-southeast1/bepXinhAi
```

App web debug ở `localhost`/`127.0.0.1` hiện tự chọn endpoint local trên nếu không
truyền `AI_API_BASE_URL`. Sau thay đổi resolver cần **hot restart** để tạo lại
repository; hot reload không thay instance đang có. Cờ explicit vẫn ưu tiên cao
nhất, nên nếu phiên cũ truyền endpoint khác phải dừng và chạy lại với cờ đúng.
Hosting, profile/release và thiết bị native vẫn dùng endpoint production mặc định.

Không truyền `FIREBASE_EMULATOR_HOST` và không dùng `main_local.dart` trong chế độ
dữ liệu thật. Bản hosting/APK hiện tại không tự trỏ tới localhost của máy này.

Từ 18/11/2026, `npm run dev` khởi động cả máy chủ AI và Vite admin; `dev:ai` là
alias tương đương. `npm run dev:web` chỉ chạy Vite nếu backend đã được giữ chạy
riêng bằng `npm run ai:server`. Nếu đang dùng phiên Vite cũ từ trước thay đổi,
có thể chạy `npm run ai:server` trong terminal khác để khôi phục AI ngay, hoặc dừng
Vite cũ rồi chạy lại `npm run dev`. Không cần nhập lại key do tiến trình local dừng.

Máy hiện tại đã có `.env.development.local` (Git ignore) trỏ admin development
ở cổng 5173 tới `http://127.0.0.1:5001/bepxinh-b0be7/asia-southeast1/bepXinhAi`
và đặt `VITE_USE_EMULATORS=false`. Vì vậy có thể giữ trang 5173 và tài khoản thật;
máy chủ AI cổng 5001 vẫn cần chạy. Nếu Vite chưa nhận env mới, khởi động lại
`npm run dev` rồi tải lại trang. File chỉ áp dụng development, không áp dụng build
production. Preflight từ `http://localhost:5173` đã kiểm tra trả 204 đúng origin.

## Nhập API
Chọn Gemini hoặc OpenAI Chat Completions tương thích, model, API Base URL nếu cần,
nhập API key trực tiếp, bật trợ lý và Kiểm tra và lưu. Key không được đọc lại;
để trống để giữ key hiện tại, nhưng đổi provider/endpoint phải nhập key mới.
Moderator không được cấu hình. Không lưu key vào Vite env hoặc localStorage.

Với Gemini, nhập key rồi bấm **Lấy model từ key**, chọn một model trong danh sách
Google trả về, sau đó **Kiểm tra và lưu**. Không tự suy đoán tên thay thế cho model
đang trả 404. Danh sách lọc model Gemini có `generateContent`, loại các biến thể
image/audio/TTS/live; phép kiểm tra lưu vẫn xác nhận model hỗ trợ câu trả lời JSON.
Lấy danh sách không lưu key/cấu hình, dùng chung hạn mức 5 thao tác/phút/admin.
API `POST /admin/models` chỉ nhận `{apiKey}`, dùng key Gemini đã mã hóa nếu để trống,
chỉ cho admin active, trả `{models:[{id,name}]}`. Không có endpoint public đọc key.
Tham khảo [Gemini models.list](https://ai.google.dev/api/models).

### Model có trong danh sách nhưng gọi thử trả 404

Google xác nhận Gemini 2.5 có thể vẫn trả metadata/list thành công nhưng generation
chỉ được cấp cho project đã có lịch sử sử dụng. Vì vậy lấy danh sách chưa chứng minh
gọi chat được. Chọn `gemini-3.5-flash-lite` nếu có trong danh sách hoặc một model
mới phù hợp, rồi kiểm tra/lưu. Mặc định cho cấu hình mới hiện là
`gemini-3.5-flash-lite`; model 2.5 vẫn được giữ với nhãn cảnh báo cho project cũ.
Không tự đổi model đã lưu và không tự gọi lần lượt nhiều model để tránh phí ngoài ý muốn.
Tham khảo [phản hồi của Google về list 200/generate 404](https://discuss.ai.google.dev/t/gemini-2-5-flash-models-get-returns-200-but-generatecontent-returns-404-not-found/195898).
Đây là nguyên nhân phù hợp với quan sát, chưa phải xác minh trực tiếp eligibility
của key khách hàng. Chưa có lần generate thành công bằng key thật trong kiểm thử của agent.

Nếu form đã tải nhưng bấm lưu bị từ chối, kết nối admin → máy chủ AI đã hoạt động;
đây là lỗi ở bước gọi provider, cấu hình/key chưa được lưu. Thông báo hiện phân biệt
HTTP 400/401/403/404/429 và các lý do Google trả về như `API_KEY_INVALID`,
`ACCESS_TOKEN_TYPE_UNSUPPORTED`, API/IP/referrer restriction, service/billing disabled.
Chỉ trả câu giải thích cố định, không hiển thị/log raw response có thể chứa key.
Không tự kết luận key sai từ lỗi chung; cần mã lỗi mới từ lần kiểm tra tiếp theo.

[API contract, giới hạn và cách chạy demo cô lập](../../app_bep_xinh/docs/AI_CHAT.md).

Đợt này chỉ bàn giao local theo yêu cầu: chưa deploy Functions/Hosting/rules AI,
chưa gọi thử Gemini hay provider thật bằng key khách hàng.

Kiểm tra ngày 17/11/2026: đọc `_ai_private/config` thật thành công (chưa có cấu
hình), truy vấn công thức đã duyệt thành công; admin local trả HTTP 200, endpoint
cấu hình không có token trả 401. Chưa lưu cấu hình hoặc gửi chat thật thay người dùng.
