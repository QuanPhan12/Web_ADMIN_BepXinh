import React from 'react'
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  ShieldCheck,
  Send,
  ZoomIn,
  ZoomOut,
  Rocket,
} from 'lucide-react'
import { useProfile } from '../../../context/ProfileContext'

interface TechnicalAcceptanceDocModalProps {
  isOpen: boolean
  onClose: () => void
  onGoToStep4?: () => void
}

export const TechnicalAcceptanceDocModal: React.FC<TechnicalAcceptanceDocModalProps> = ({
  isOpen,
  onClose,
  onGoToStep4,
}) => {
  const { showToast } = useProfile()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs select-none overflow-y-auto">
      <div className="bg-slate-100 rounded-2xl shadow-2xl border border-slate-300 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        {/* Top Viewer Toolbar */}
        <div className="px-6 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-500 font-medium text-[11px]">
              <span>Bếp Xinh Enterprise</span>
              <span>›</span>
              <span>Đối tác Siêu thị API</span>
              <span>›</span>
              <span>Đối tác Siêu thị Bán lẻ</span>
              <span>›</span>
              <strong className="text-slate-800 font-mono">BB-TECH-2025-PARTNER-ONB.pdf</strong>
            </div>

            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded uppercase">
              SẴN SÀNG PRODUCTION
            </span>
          </div>

          {/* Document Actions */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-mono">
              <button type="button" className="text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold px-1.5">100%</span>
              <button type="button" className="text-slate-500 hover:text-slate-800 p-0.5 cursor-pointer">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            <span className="text-slate-400 font-mono text-[11px]">1 / 4 trang</span>

            <button
              type="button"
              onClick={() => {
                window.print()
                showToast('Đang chuẩn bị lệnh in biên bản nghiệm thu...')
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>In biên bản</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Đang gửi biên bản số tới Ban Giám Đốc đối tác...')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-slate-500" />
              <span>Gửi HĐ điện tử</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Tải tệp PDF biên bản nghiệm thu (2.4MB)...')}
              className="px-3 py-1.5 rounded-lg bg-[#9c3808] hover:bg-[#832f07] text-white font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải PDF (2.4MB)</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewer Body: A4 Paper (Left) + Document Metadata Sidebar (Right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 justify-center bg-slate-200/70">
          {/* A4 Paper Document Container */}
          <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-300 p-8 sm:p-12 space-y-6 text-slate-800 select-text">
            {/* Document Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#9c3808] text-white font-black text-xs flex items-center justify-center">
                  BX
                </div>
                <div>
                  <div className="font-black text-slate-900 text-sm">Bếp Xinh Enterprise</div>
                  <div className="text-[10px] text-slate-400 font-mono">Cloud Kitchen Logistics</div>
                </div>
              </div>

              <div className="px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono font-bold text-slate-600 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                mTLS v1.3 Linked
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="font-black text-slate-800 text-sm">Siêu Thị Đối Tác</div>
                  <div className="text-[10px] text-slate-400 font-mono">Retail Partner Co., Ltd</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black text-xs flex items-center justify-center">
                  PRT
                </div>
              </div>
            </div>

            {/* National Motto & Title */}
            <div className="text-center space-y-1.5">
              <div className="font-bold text-xs uppercase tracking-wider text-slate-700">
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
              <div className="text-xs font-semibold text-slate-600 underline">
                Độc lập - Tự do - Hạnh phúc
              </div>
              <div className="pt-4">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">
                  BIÊN BẢN NGHIỆM THU KIỂM THỬ KỸ THUẬT VÀ TÍCH HỢP HỆ THỐNG
                </h2>
                <p className="text-xs text-[#9c3808] font-bold mt-0.5">
                  KẾT NỐI MỚI ĐỐI TÁC SIÊU THỊ TRỰC TUYẾN • PHÂN HỆ FULFILLMENT ĐỐI TÁC
                </p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 inline-block font-mono text-[11px] text-slate-600 space-x-4">
                <span>Số hồ sơ: <strong className="text-slate-800">DOC-TECH-2025-PARTNER-ONB</strong></span>
                <span>Số phát hành: <strong className="text-slate-800">01/2025/BB-BX-PARTNER</strong></span>
                <span>Ngày lập: <strong className="text-slate-800">Hôm nay</strong></span>
              </div>
            </div>

            {/* Section 1 */}
            <div className="space-y-3 text-xs leading-relaxed">
              <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-wide flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-mono">1</span>
                CĂN CỨ VÀ ĐẠI DIỆN CÁC BÊN THAM GIA NGHIỆM THU
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                    <span>BÊN A (ĐƠN VỊ TÍCH HỢP NỀN TẢNG):</span>
                    <span className="bg-slate-200 text-slate-700 text-[9px] font-mono px-1 rounded">HOST</span>
                  </div>
                  <div className="font-black text-[#9c3808]">CÔNG TY CỔ PHẦN CÔNG NGHỆ ẨM THỰC BẾP XINH</div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>Đại diện kỹ thuật: <strong>Bà Lê Thanh Trúc</strong></div>
                    <div>Chức vụ: Lead Admin &amp; Trưởng ban Kỹ thuật Hệ thống</div>
                    <div>Trụ sở: Tòa nhà Bếp Xinh Innovation Hub, Quận 1, TP. HCM</div>
                    <div className="font-mono text-[10px] text-slate-500">CA mTLS: bepxinh-mtls-root-ca-01</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                    <span>BÊN B (CHUỖI BÁN LẺ SIÊU THỊ):</span>
                    <span className="bg-slate-200 text-slate-700 text-[9px] font-mono px-1 rounded">CLIENT</span>
                  </div>
                  <div className="font-black text-slate-800">CÔNG TY CỔ PHẦN ĐỐI TÁC BÁN LẺ SIÊU THỊ</div>
                  <div className="text-[11px] text-slate-600 space-y-0.5">
                    <div>Đại diện kỹ thuật: <strong>Đại diện Kỹ thuật Đối tác</strong></div>
                    <div>Chức vụ: Tech Lead &amp; Giám đốc Kỹ thuật Tích hợp API</div>
                    <div>Trụ sở: Địa chỉ trụ sở chính đăng ký pháp lý của đối tác</div>
                    <div className="font-mono text-[10px] text-slate-500">Client ID: partner-vn-ent-2025</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-wide flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-mono">2</span>
                  KẾT QUẢ KIỂM THỬ TÍCH HỢP TỰ ĐỘNG (SANDBOX SUITE)
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                  Phiên chạy: #SBX-RUN-8929 (200k/24h)
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[10px] grid grid-cols-3 gap-2 text-slate-600">
                <div>GATEWAY ENDPOINT: <span className="font-bold text-slate-800 block">sandbox-gateway.bepxinh.internal</span></div>
                <div>SERVER CLUSTER: <span className="font-bold text-slate-800 block">SG-01 (VN-South Region)</span></div>
                <div>BẢO MẬT MÃ HÓA: <span className="font-bold text-emerald-700 block">REST/TLS over mTLS FIPS 140-2 L3</span></div>
              </div>

              {/* Acceptance Test Results Table */}
              <table className="w-full text-left border border-slate-200 rounded-lg overflow-hidden text-[11px]">
                <thead className="bg-slate-100 font-bold text-slate-600">
                  <tr>
                    <th className="py-2 px-3 border-b border-slate-200">KỊCH BẢN THỬ NGHIỆM</th>
                    <th className="py-2 px-3 border-b border-slate-200">TẢI TRỌNG / QUY MÔ</th>
                    <th className="py-2 px-3 border-b border-slate-200">THỜI GIAN PHẢN HỒI</th>
                    <th className="py-2 px-3 border-b border-slate-200">TỶ LỆ LỖI</th>
                    <th className="py-2 px-3 border-b border-slate-200 text-right">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[10px]">
                  <tr>
                    <td className="py-2 px-3 font-sans">
                      <strong className="block text-slate-800">TS-01: OAuth 2.0 Handshake &amp; Auth Flow</strong>
                      <span className="text-slate-400 text-[10px]">Client Credentials, Key Rotation, Token Refresh 3600s</span>
                    </td>
                    <td className="py-2 px-3">500 req/min</td>
                    <td className="py-2 px-3 text-emerald-600 font-bold">48 ms</td>
                    <td className="py-2 px-3">0.00%</td>
                    <td className="py-2 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-sans">ĐẠT (PASS)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">
                      <strong className="block text-slate-800">TS-02: Webhook Stream Tồn kho Real-time</strong>
                      <span className="text-slate-400 text-[10px]">100 Sự kiện biến động kho (Stock Delta), Broadcast check</span>
                    </td>
                    <td className="py-2 px-3">100 Events</td>
                    <td className="py-2 px-3 text-emerald-600 font-bold">54 ms</td>
                    <td className="py-2 px-3">0.00%</td>
                    <td className="py-2 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-sans">ĐẠT (PASS)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">
                      <strong className="block text-slate-800">TS-03: Đặt thử Mock Order Đi Chợ #TEST-LMT-001</strong>
                      <span className="text-slate-400 text-[10px]">Đặt hàng 14 mặt hàng tươi sống, khớp POS SKU, gửi VAT &amp; ghi sổ nợ</span>
                    </td>
                    <td className="py-2 px-3">14 SKUs</td>
                    <td className="py-2 px-3 text-emerald-600 font-bold">1.8 giây ACK</td>
                    <td className="py-2 px-3">0.00%</td>
                    <td className="py-2 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-sans">ĐẠT (PASS)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans">
                      <strong className="block text-slate-800">TS-04: Đối soát dòng tiền Escrow 8.5% &amp; Phí Dịch vụ</strong>
                      <span className="text-slate-400 text-[10px]">Hoàn tất ví đại lý, kèm hợp đồng bồi hoàn tự động</span>
                    </td>
                    <td className="py-2 px-3">50 Transactions</td>
                    <td className="py-2 px-3 text-emerald-600 font-bold">112 ms</td>
                    <td className="py-2 px-3">0.00%</td>
                    <td className="py-2 px-3 text-right">
                      <span className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black font-sans">ĐẠT (PASS)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Section 3 */}
            <div className="space-y-3 text-xs leading-relaxed">
              <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-wide flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-mono">3</span>
                KẾT LUẬN &amp; PHẠM VI TRIỂN KHAI PILOT GIAI ĐOẠN 1
              </h3>

              <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                <div className="flex items-center gap-2 font-black text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đánh giá chung: ĐẠT TIÊU CHUẨN SẴN SÀNG VẬN HÀNH (GRADE A+)</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-normal">
                  Căn cứ vào dữ liệu kiểm định Sandbox, hệ thống API v2.5 giữa Bếp Xinh và đối tác siêu thị đáp ứng đầy đủ các chỉ số SLA về độ trễ dưới 200ms, tỷ lệ rớt gói tin 0%, đồng bộ tồn kho 1:1 và hoàn thành hạch toán kế toán tự động chuẩn xác tuyệt đối.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <strong className="block text-slate-800">Chi nhánh thử nghiệm Pilot (7 ngày):</strong>
                  <ul className="text-slate-600 space-y-0.5 list-disc pl-4">
                    <li>Các chi nhánh trọng điểm đã thiết lập ở Bước 1</li>
                  </ul>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
                  <strong className="block text-slate-800">Hạn ngạch giới hạn Pilot (Rate Limiting):</strong>
                  <div className="text-slate-600">
                    Tối đa <strong>200 đơn hàng/ngày/chi nhánh</strong>. Tự động kích hoạt toàn bộ mạng lưới chi nhánh sau 07 ngày đạt SLA.
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Digital Signatures */}
            <div className="space-y-3 text-xs pt-2">
              <h3 className="font-black text-slate-900 uppercase text-[11px] tracking-wide flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white text-[9px] flex items-center justify-center font-mono">4</span>
                XÁC NHẬN CHỮ KÝ SỐ ĐIỆN TỬ (DIGITAL SIGNATURE FIPS 140-2)
              </h3>

              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Stamp Bên A */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 text-center space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-500">ĐẠI DIỆN BÊN A - BẾP XINH ENTERPRISE</div>
                  <div className="font-black text-slate-900 text-sm">Lê Thanh Trúc</div>
                  <div className="text-[10px] text-slate-500">Lead Admin / Root Authority</div>

                  <div className="pt-2 border-t border-emerald-200 inline-block font-mono text-[9px] text-emerald-800 text-left">
                    <div className="flex items-center gap-1 font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CHỮ KÝ SỐ HỢP LỆ (VNPT-CA)</span>
                    </div>
                    <div>SERIAL: 54:02:AA:78:E2:56:DF</div>
                    <div>THỜI GIAN: 24/10/2024 15:32:18 GMT+7</div>
                  </div>
                </div>

                {/* Stamp Bên B */}
                <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/40 text-center space-y-1.5">
                  <div className="text-[10px] uppercase font-bold text-slate-500">ĐẠI DIỆN BÊN B - ĐỐI TÁC BÁN LẺ SIÊU THỊ</div>
                  <div className="font-black text-slate-900 text-sm">Đại diện Kỹ thuật Đối tác</div>
                  <div className="text-[10px] text-slate-500">Tech Lead / Integration Director</div>

                  <div className="pt-2 border-t border-emerald-200 inline-block font-mono text-[9px] text-emerald-800 text-left">
                    <div className="flex items-center gap-1 font-bold text-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>CHỮ KÝ SỐ HỢP LỆ (VNPT-CA)</span>
                    </div>
                    <div>SERIAL: 7B:3E:91:9D:C4:33:88</div>
                    <div>THỜI GIAN: 24/10/2024 16:15:45 GMT+7</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Document Footnote */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Bản quyền tài liệu Kỹ thuật © Bếp Xinh Enterprise – Mật độ bảo mật: NỘI BỘ LIÊN DOANH</span>
              <span>Trang 1 / 4 (Trang chính nghiệm thu)</span>
            </div>
          </div>

          {/* Right Sidebar: Status & Verification Checksum */}
          <div className="w-full lg:w-80 space-y-4 shrink-0 text-xs">
            {/* Status Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500">TRẠNG THÁI HỒ SƠ</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                  HOÀN TẤT
                </span>
              </div>
              <div className="flex items-center gap-2 font-black text-emerald-700 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã nghiệm thu &amp; Đóng dấu</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Tài liệu đã được bảo chứng pháp lý kỹ thuật bởi 2 bên và đủ điều kiện để kích hoạt Sandbox sang Chế độ Live.
              </p>
            </div>

            {/* Integrity Check */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between font-sans">
                <span className="font-extrabold text-slate-800">Toàn vẹn tệp (Integrity Check)</span>
                <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Khóa bảo mật
                </span>
              </div>
              <div className="text-slate-400 text-[10px] font-sans">SHA-256 Checksum:</div>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-slate-600 text-[10px] break-all select-all">
                efa0b4d20bfebc1d2eef44ac899df091427ea4444e49e913aee298901e70331038
              </div>
              <div className="text-slate-400 text-[10px] font-sans">
                Kích thước / Định dạng: <strong>2.41 MB (PDF/A-2b ISO 19005-2)</strong>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2.5">
              <div className="font-extrabold text-slate-800 text-xs">Nhật ký xử lý (Audit Trail)</div>
              <div className="space-y-2 text-[11px] font-mono text-slate-600">
                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">Ký số bởi Đại diện Đối tác</div>
                    <div className="text-[10px] text-slate-400 font-sans">Đại diện Kỹ thuật qua VNPT-CA HSM</div>
                  </div>
                  <span className="text-[10px] text-slate-400">16:15</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">Ký số bởi Bếp Xinh Tech</div>
                    <div className="text-[10px] text-slate-400 font-sans">Lê Thanh Trúc qua Viettel-CA Cloud</div>
                  </div>
                  <span className="text-[10px] text-slate-400">15:32</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">Tự động xuất báo cáo PDF</div>
                    <div className="text-[10px] text-slate-400 font-sans">Pipeline Sandbox SG-01 sinh file tự động</div>
                  </div>
                  <span className="text-[10px] text-slate-400">14:50</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0"></span>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800">Kết thúc 4 Test Suites Sandbox</div>
                    <div className="text-[10px] text-slate-400 font-sans">Đạt 100% chỉ số kỹ thuật SLA</div>
                  </div>
                  <span className="text-[10px] text-slate-400">14:38</span>
                </div>
              </div>
            </div>

            {/* Sharing & Publishing */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-2 text-xs">
              <div className="font-extrabold text-slate-800">Tùy chọn chia sẻ &amp; Xuất bản</div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  showToast('Đã sao chép liên kết chia sẻ bảo mật!')
                }}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-between text-[11px] transition-colors cursor-pointer"
              >
                <span>Sao chép liên kết bảo mật</span>
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => showToast('Đang kết xuất bản ghi Raw JSON payload...')}
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-between text-[11px] transition-colors cursor-pointer"
              >
                <span>Xuất bản ghi Raw JSON</span>
                <span className="font-mono text-[10px] text-slate-400">.json</span>
              </button>

              {onGoToStep4 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onGoToStep4()
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#9c3808] hover:bg-[#832f07] font-black text-white flex items-center justify-center gap-2 shadow-xs transition-all mt-2 cursor-pointer"
                >
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Chuyển sang Bước 4: Kích hoạt Live</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
