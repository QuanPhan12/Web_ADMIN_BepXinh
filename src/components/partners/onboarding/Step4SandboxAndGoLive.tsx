import React, { useState } from 'react'
import {
  CheckCircle2,
  RefreshCw,
  FileText,
  Rocket,
  ArrowLeft,
  Clock,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { useProfile } from '../../../context/ProfileContext'

interface Step4Props {
  onBack: () => void
  onGoLive: () => void
  onOpenPdfDoc: () => void
}

export const Step4SandboxAndGoLive: React.FC<Step4Props> = ({
  onBack,
  onGoLive,
  onOpenPdfDoc,
}) => {
  const { showToast } = useProfile()

  // Rollout scope
  const [scope, setScope] = useState<'canary' | 'all'>('canary')
  const [autoAlert, setAutoAlert] = useState(true)
  const [isAgreementChecked, setIsAgreementChecked] = useState(true)
  const [isReRunningTests, setIsReRunningTests] = useState(false)
  const [hasRunTests, setHasRunTests] = useState(false)

  const handleRunTests = () => {
    setIsReRunningTests(true)
    setTimeout(() => {
      setIsReRunningTests(false)
      setHasRunTests(true)
      showToast('Đã hoàn thành 4 kịch bản kiểm thử: 100% ĐẠT CHUẨN XANH LÁ!')
    }, 1200)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 2-Column Split: Test Suites (7 cols) + Release Config & Legal (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hero SLA Box */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 rounded-2xl border-4 flex items-center justify-center font-mono font-black text-sm shrink-0 shadow-2xs ${
                hasRunTests
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-slate-300 bg-slate-50 text-slate-500'
              }`}>
                {hasRunTests ? '100%' : '0%'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                    hasRunTests
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {hasRunTests ? '100% SLA READY' : 'CHỜ KIỂM THỬ (PENDING)'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {hasRunTests ? 'Đã hoàn tất kiểm thử tự động' : 'Chờ khởi chạy kịch bản Sandbox'}
                  </span>
                </div>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  {hasRunTests ? '4/4 Kịch bản ĐẠT CHUẨN XANH LÁ' : '0/4 Kịch bản đã kiểm thử'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {hasRunTests
                    ? 'Tất cả bài kiểm tra luồng dữ liệu, độ trễ và webhook bảo mật đã hoàn tất không có cảnh báo.'
                    : 'Nhấn nút bên cạnh để khởi chạy kiểm thử tự động toàn bộ luồng kết nối trước khi Go-Live.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunTests}
              disabled={isReRunningTests}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer ${
                hasRunTests
                  ? 'border border-slate-200 hover:bg-slate-50 text-slate-700'
                  : 'bg-[#9c3808] hover:bg-[#832f07] text-white shadow-xs'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isReRunningTests ? 'animate-spin' : ''}`} />
              <span>{isReRunningTests ? 'Đang chạy kịch bản...' : hasRunTests ? 'Chạy lại kiểm thử' : 'Bắt đầu kiểm thử'}</span>
            </button>
          </div>

          {/* Test Suites List */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-bold">🧪</span>
                <h3 className="font-black text-slate-900 text-sm">
                  Kịch bản Kiểm thử End-to-End Tự động
                </h3>
              </div>
              <span className="font-mono text-[11px] text-slate-400">Session ID: #SBX-RUN-2025</span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Test Suite 1 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                hasRunTests
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasRunTests ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-extrabold text-slate-900">
                      Test Suite 1: Kiểm tra Handshake &amp; OAuth Token Refresh
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      hasRunTests
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {hasRunTests ? 'PASS' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-bold ${hasRunTests ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {hasRunTests ? '48ms' : '--'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans">Avg Ping</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 pl-6">
                  {hasRunTests
                    ? '10/10 lần thử nghiệm thành công • Khóa mã hóa TLS 1.3 • Tự động refresh token sau 3600s'
                    : 'Chờ khởi chạy kiểm tra giao thức TLS 1.3 và xác thực OAuth2 token'}
                </div>
              </div>

              {/* Test Suite 2 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                hasRunTests
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasRunTests ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-extrabold text-slate-900">
                      Test Suite 2: Mô phỏng Đẩy 100 Sự kiện Cập nhật Tồn kho (Stock Delta Webhook)
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      hasRunTests
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {hasRunTests ? 'PASS' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-bold ${hasRunTests ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {hasRunTests ? '54ms' : '--'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans">Throughput SLA</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 pl-6">
                  {hasRunTests
                    ? '100/100 sự kiện nhận diện không nghẽn cổ chai • Không mất gói tin (Packet drop: 0%)'
                    : 'Chờ kiểm tra lưu lượng nhận webhook và throughput tải'}
                </div>
              </div>

              {/* Test Suite 3 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                hasRunTests
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasRunTests ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-extrabold text-slate-900">
                      Test Suite 3: Đặt thử Mock Order Đi Chợ #TEST-ORD-001
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      hasRunTests
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {hasRunTests ? 'PASS' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-bold ${hasRunTests ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {hasRunTests ? '1.8 giây' : '--'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans">ACK</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 pl-6">
                  {hasRunTests
                    ? 'Đặt hàng 14 mặt hàng tươi sống, khớp POS SKU, gửi VAT & ghi sổ nợ tự động'
                    : 'Chờ gửi lệnh đặt đơn giả lập POS và kiểm tra phản hồi'}
                </div>
              </div>

              {/* Test Suite 4 */}
              <div className={`p-3.5 rounded-xl border space-y-1.5 ${
                hasRunTests
                  ? 'border-emerald-200 bg-emerald-50/40'
                  : 'border-slate-200 bg-slate-50/50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {hasRunTests ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="font-extrabold text-slate-900">
                      Test Suite 4: Đối soát dòng tiền Escrow 8.5% &amp; Phí Dịch vụ
                    </span>
                    <span className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                      hasRunTests
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}>
                      {hasRunTests ? 'PASS' : 'PENDING'}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-bold ${hasRunTests ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {hasRunTests ? '0.00%' : '--'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-sans">Lệch số học</span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-600 pl-6">
                  {hasRunTests
                    ? 'Khớp đúng 100% doanh thu & hoa hồng 8.5% theo phụ lục thương mại + Tự sinh bút toán ví Escrow'
                    : 'Chờ đối soát tỷ lệ chiết khấu và cấn trừ thanh toán'}
                </div>
              </div>
            </div>
          </div>

          {/* Supermarket Retail Identifier Card */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-orange-100 text-[#9c3808] flex items-center justify-center shrink-0 shadow-2xs">
              <Building2 className="w-8 h-8" />
            </div>
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">ĐỊNH DANH ĐỐI TÁC BÁN LẺ</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  HỢP ĐỒNG ĐIỆN TỬ
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm">
                Chuỗi Siêu thị Đối tác Phân phối
              </h4>
              <p className="text-[11px] text-slate-500 leading-normal">
                Cơ chế định tuyến đơn: Smart Routing dựa trên tọa độ người nấu &amp; kho nguyên liệu tươi trong bán kính phục vụ.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Rollout Scope & Technical Acceptance */}
        <div className="lg:col-span-5 space-y-5 text-xs">
          {/* Card: Tùy chọn Phạm vi Phát hành */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Rocket className="w-4 h-4 text-[#9c3808]" />
              <h3 className="font-black text-slate-900 text-sm">Tùy chọn Phạm vi Phát hành</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-tight">
              Lựa chọn chiến lược phân phối tải để đảm bảo chất lượng đơn đi chợ đầu tiên.
            </p>

            <div className="space-y-2.5">
              {/* Radio 1 */}
              <label
                onClick={() => setScope('all')}
                className={`p-3 rounded-xl border transition-all cursor-pointer block space-y-1 ${
                  scope === 'all'
                    ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === 'all'}
                    onChange={() => {}}
                    className="text-[#9c3808] focus:ring-[#9c3808]"
                  />
                  <span className="font-extrabold text-slate-800 text-[11px]">Phát hành toàn quốc ngay lập tức</span>
                </div>
                <p className="text-[10px] text-slate-500 pl-5">
                  Áp dụng tức thì cho tất cả các chi nhánh đã cấu hình trên hệ thống.
                </p>
              </label>

              {/* Radio 2 (Canary Pilot - Recommended) */}
              <label
                onClick={() => setScope('canary')}
                className={`p-3 rounded-xl border transition-all cursor-pointer block space-y-2 ${
                  scope === 'canary'
                    ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scope"
                      checked={scope === 'canary'}
                      onChange={() => {}}
                      className="text-[#9c3808] focus:ring-[#9c3808]"
                    />
                    <span className="font-black text-slate-900 text-[11px]">Thử nghiệm Giới hạn (Canary Pilot)</span>
                  </div>
                  <span className="bg-[#9c3808] text-white text-[9px] font-black px-1.5 py-0.2 rounded uppercase">
                    KHUYÊN DÙNG
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 pl-5 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <span className="text-emerald-600">✔</span>
                    <span>Áp dụng cho các chi nhánh đã thiết lập trong Bước 1</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">⏱</span>
                    <span>Giới hạn tối đa 200 đơn/ngày trong 7 ngày</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400">📦</span>
                    <span>Đánh giá tốc độ nhặt hàng &amp; đóng gói thực tế</span>
                  </div>
                </div>
              </label>
            </div>

            {/* Auto alert toggle */}
            <label
              onClick={() => setAutoAlert(!autoAlert)}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 cursor-pointer"
            >
              <span className="font-bold text-slate-700 text-[11px]">Cảnh báo giám sát tự động</span>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
                autoAlert ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
              }`}>
                {autoAlert ? 'BẬT' : 'TẮT'}
              </span>
            </label>
          </div>

          {/* Card: Biên bản Nghiệm thu Kỹ thuật */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#9c3808]" />
                <h3 className="font-black text-slate-900 text-sm">Biên bản Nghiệm thu Kỹ thuật</h3>
              </div>
              <button
                type="button"
                onClick={onOpenPdfDoc}
                className="text-[#9c3808] hover:underline font-bold text-[11px] cursor-pointer"
              >
                Xem chi tiết
              </button>
            </div>

            <div className="space-y-1.5 font-mono text-[10px] text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Mã biên bản:</span>
                <span className="font-black text-slate-800">#BB-TECH-2025-PARTNER-ONB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Bên A (Bếp Xinh):</span>
                <span className="font-bold">Lê Thanh Trúc (Lead Admin)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Bên B (Đối tác):</span>
                <span className="font-bold">Đại diện Kỹ thuật Đối tác</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Chứng chỉ chữ ký số:</span>
                <span className="font-bold text-emerald-700">VNPT-CA VALID</span>
              </div>
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isAgreementChecked}
                onChange={(e) => setIsAgreementChecked(e.target.checked)}
                className="mt-0.5 text-[#9c3808] rounded focus:ring-[#9c3808]"
              />
              <span className="leading-tight">
                Xác nhận đối tác đã hoàn thành toàn bộ bài kiểm tra bảo mật, định lượng nguyên liệu và sẵn sàng tiếp nhận đơn đi chợ thực tế từ người dùng Bếp Xinh.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Step Footer */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại: Bước 3</span>
          </button>
          <span className="text-slate-400 text-[11px]">Bản nháp tự lưu</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onGoLive}
            className="px-6 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Xác nhận Kích hoạt Đối tác (Go-Live)</span>
          </button>
        </div>
      </div>
    </div>
  )
}
