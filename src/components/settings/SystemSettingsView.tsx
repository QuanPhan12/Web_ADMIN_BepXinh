import React, { useState } from 'react'
import {
  RotateCcw,
  Save,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  Store,
  Users,
  Sliders,
  Cpu,
  Clock,
  ShieldCheck,
  Award,
  BookOpen,
  Star,
  Zap,
  Trash2,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ResetDefaultsConfirmModal } from './ResetDefaultsConfirmModal'
import { AuditLogModal } from './AuditLogModal'
import { PartnerDetailModal } from './PartnerDetailModal'

export const SystemSettingsView: React.FC = () => {
  const { showToast } = useProfile()

  

  const hasData = false

  // Tab State
  const [activeTab, setActiveTab] = useState<'ai' | 'retail_api' | 'permissions'>('ai')

  // AI Thresholds State
  const [approvalThreshold, setApprovalThreshold] = useState<number>(0)
  const [isReverseOcrOn, setIsReverseOcrOn] = useState<boolean>(false)
  const [isAllergyGuardOn, setIsAllergyGuardOn] = useState<boolean>(false)
  const [reverseOcrThreshold, setReverseOcrThreshold] = useState<number>(0)
  const [isSyncingSupermarket, setIsSyncingSupermarket] = useState<boolean>(false)
  const [isSaving, setIsSaving] = useState<boolean>(false)

  // Modals State
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false)
  const [selectedPartner, setSelectedPartner] = useState<any>(null)

  const handleResetToDefaults = () => {
    setApprovalThreshold(0)
    setIsReverseOcrOn(false)
    setIsAllergyGuardOn(false)
    setReverseOcrThreshold(0)
    setIsResetConfirmOpen(false)
    showToast('Đã đặt lại toàn bộ tham số hệ thống về giá trị 0!')
  }

  const handleClearData = () => {
    setApprovalThreshold(0)
    setIsReverseOcrOn(false)
    setIsAllergyGuardOn(false)
    setReverseOcrThreshold(0)
    showToast('Đã xóa toàn bộ cấu hình hệ thống và đặt lại toàn bộ thông tin là 0!')
  }

  const handleSaveConfig = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      showToast(hasData
        ? `Đã lưu cấu hình tham số thành công! Ngưỡng tự động duyệt AI hiện tại là ${approvalThreshold} điểm.`
        : 'Đã lưu cấu hình hệ thống: Toàn bộ thông tin và chỉ số đang ở mức 0.'
      )
    }, 700)
  }

  const handleSyncSupermarkets = () => {
    if (!hasData) {
      showToast('Không có đối tác siêu thị nào kết nối (0 đối tác) để phát lệnh đồng bộ!')
      return
    }
    setIsSyncingSupermarket(true)
    showToast('Đang phát lệnh đồng bộ giá & tồn kho với 3 hệ thống siêu thị đối tác...')
    setTimeout(() => {
      setIsSyncingSupermarket(false)
      showToast('Đồng bộ thành công! 3,420 SKU WinMart+, Co.opFood và Direct Hub đã sẵn sàng.')
    }, 1200)
  }

  // Dynamic calculations based on approval threshold
  const manualReviewRate = hasData ? (100 - approvalThreshold + 3.4).toFixed(1) : '0.0'
  const publishSpeed = hasData ? (0.2 + (approvalThreshold / 85) * 0.2).toFixed(1) : '0'

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* Modals */}
      <ResetDefaultsConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetToDefaults}
      />
      <AuditLogModal
        isOpen={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        hasData={hasData}
      />
      <PartnerDetailModal
        isOpen={!!selectedPartner}
        onClose={() => setSelectedPartner(null)}
        partner={selectedPartner}
      />

      {/* 1. Header & Actions */}
      <div className="space-y-2.5">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>Bếp Xinh Admin</span>
          <span>&rsaquo;</span>
          <span className="text-slate-700">Hệ thống điều hành</span>
        </div>

        {/* Page Title & Main Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#9c3808]">
              <span>TRUNG TÂM ĐIỀU HÀNH</span>
              <span>●</span>
              <span className="text-slate-500 font-bold">Phiên bản v2.4.8 - LTS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-0.5">
              Cài đặt &amp; Tham số Hệ thống Bếp Xinh
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Thiết lập ngưỡng kiểm duyệt AI Kitchen Vision, đồng bộ API đối tác siêu thị bán lẻ, tiêu chuẩn tích xanh và giám sát luồng dữ liệu thời gian thực.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {hasData && (
              <button
                type="button"
                onClick={handleClearData}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa dữ liệu (0)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-sky-600" />
              <span>Khôi phục mặc định</span>
            </button>

            <button
              type="button"
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi cấu hình'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Tabs Strip */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-1.5 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ai'
              ? 'bg-[#9c3808] text-white shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kiểm duyệt AI Kitchen Vision</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
            activeTab === 'ai'
              ? 'bg-white/20 text-white'
              : hasData
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {hasData ? 'Active' : 'Standby (0)'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('retail_api')
            showToast('Chuyển sang cấu hình kết nối API chuỗi siêu thị...')
          }}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'retail_api'
              ? 'bg-[#9c3808] text-white shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Store className="w-3.5 h-3.5 text-slate-400" />
          <span>Liên kết Đối tác Siêu thị &amp; API</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'retail_api' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {hasData ? '3 Kết nối' : '0 Kết nối'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('permissions')
            showToast('Xem ma trận phân quyền Quản trị & Nhân sự Bếp Xinh...')
          }}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'permissions'
              ? 'bg-[#9c3808] text-white shadow-xs font-black'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-3.5 h-3.5 text-slate-400" />
          <span>Phân quyền Quản trị &amp; Nhân sự</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            activeTab === 'permissions' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
          }`}>
            {hasData ? '12 Thành viên' : '0 Thành viên'}
          </span>
        </button>
      </div>

      {/* 3. Main Split View: Left Column (2/3) + Right Column (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: 8 Cols */}
        <div className="lg:col-span-8 space-y-5">
          {/* Box 1: Cấu hình Trí tuệ Nhân tạo Kitchen Vision & OCR */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
            {/* Box Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center shadow-2xs shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                      Cấu hình Trí tuệ Nhân tạo Kitchen Vision &amp; OCR
                    </h2>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                      hasData
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {hasData ? 'Mô hình v4.2 Pro' : '0 Mô hình kích hoạt'}
                    </span>
                    {hasData ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Nhận diện hình ảnh món nấu, phân tích bước làm, kiểm duyệt an toàn dinh dưỡng và tự động xét duyệt công thức.
                  </p>
                </div>
              </div>
            </div>

            {/* Inner Sub-card 1: Ngưỡng tự động phê duyệt bài viết Pro */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-slate-50/80 via-white to-orange-50/20 rounded-2xl border border-slate-200/90 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-slate-900 text-sm tracking-tight">
                      Ngưỡng tự động phê duyệt bài viết Pro
                    </h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      hasData
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {hasData ? 'Tự động xuất bản' : 'Tạm dừng (0 bài)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-lg">
                    Các công thức nộp từ Đầu Bếp Đã Xác Minh đạt điểm tin cậy AI lớn hơn hoặc bằng ngưỡng sẽ vào thẳng kho công thức mà không chờ duyệt thủ công.
                  </p>
                </div>

                <div className="p-2.5 px-4 bg-white rounded-xl border border-slate-200 shadow-2xs text-center shrink-0">
                  <span className="text-[10px] font-extrabold text-slate-400 block tracking-wider">
                    ĐIỂM YÊU CẦU:
                  </span>
                  <div className="flex items-baseline justify-center gap-0.5 font-mono">
                    <span className="text-2xl font-black text-[#9c3808]">{hasData ? approvalThreshold : 0}</span>
                    <span className="text-xs font-bold text-slate-400">/ {hasData ? 100 : 0}</span>
                  </div>
                </div>
              </div>

              {/* Slider Input */}
              <div className="space-y-2 pt-1">
                <input
                  type="range"
                  min={hasData ? "60" : "0"}
                  max={hasData ? "98" : "100"}
                  value={hasData ? approvalThreshold : 0}
                  disabled={!hasData}
                  onChange={(e) => hasData && setApprovalThreshold(Number(e.target.value))}
                  className={`w-full accent-[#9c3808] h-2 bg-slate-200 rounded-lg appearance-none ${
                    hasData ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                  }`}
                />
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-400">
                    {hasData ? '60 (Dễ dãi - rủi ro chất lượng)' : '0 (Không áp dụng)'}
                  </span>
                  <span className="text-[#9c3808] font-black">
                    {hasData ? '85 (Khuyên dùng cho Bếp Xinh)' : 'Chưa cấu hình ngưỡng (0 điểm)'}
                  </span>
                  <span className="text-slate-500">
                    {hasData ? '98 (Cực kỳ nghiêm ngặt)' : '0 / 100'}
                  </span>
                </div>
              </div>

              {/* 3 Metrics Mini Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                {/* Metric 1 */}
                <div className="p-2.5 bg-white rounded-xl border border-dashed border-sky-300 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Tốc độ xuất bản trung bình</span>
                    <span className="font-mono font-black text-sky-700 text-xs">{publishSpeed} giây/bài</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Tỷ lệ bài chuyển sang duyệt tay</span>
                    <span className="font-mono font-black text-amber-700 text-xs">{manualReviewRate}% tổng số</span>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Độ chính xác kiểm duyệt</span>
                    <span className="font-mono font-black text-emerald-700 text-xs">
                      {hasData ? '99.2% sau 30 ngày' : '0.0% sau 30 ngày'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inner Sub-card 2 & 3: Reverse OCR & Allergy Guard (2 cols) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1: Quét Bản Quyền Hình Ảnh (Reverse OCR) */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      disabled={!hasData}
                      onClick={() => {
                        if (!hasData) return
                        setIsReverseOcrOn(!isReverseOcrOn)
                        showToast(isReverseOcrOn ? 'Đã tắt Quét Bản Quyền Hình Ảnh!' : 'Đã bật Quét Bản Quyền Hình Ảnh!')
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        !hasData
                          ? 'cursor-not-allowed bg-slate-200'
                          : isReverseOcrOn
                          ? 'cursor-pointer bg-[#9c3808]'
                          : 'cursor-pointer bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          hasData && isReverseOcrOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm tracking-tight">
                    Quét Bản Quyền Hình Ảnh (Reverse OCR)
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {hasData
                      ? 'Đối chiếu hình ảnh đăng tải với 12 triệu ảnh nấu ăn quốc tế và nội địa. Tự động gắn cờ ảnh copy từ Pinterest/Google.'
                      : 'Kho đối chiếu hình ảnh chưa kích hoạt. Đang có 0 ảnh đối chiếu và 0 cờ vi phạm.'}
                  </p>
                </div>

                <div className="p-2.5 bg-orange-50/60 rounded-xl border border-orange-200 text-xs flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Ngưỡng trùng lặp cảnh báo:</span>
                  <span className="font-mono font-black text-[#9c3808] text-xs">
                    {hasData && isReverseOcrOn ? `> ${reverseOcrThreshold}% độ tương đồng` : '0% độ tương đồng'}
                  </span>
                </div>
              </div>

              {/* Card 2: Cảnh Báo Dị Ứng & Kỵ Thực Phẩm */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 flex flex-col justify-between space-y-3 shadow-2xs">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      disabled={!hasData}
                      onClick={() => {
                        if (!hasData) return
                        setIsAllergyGuardOn(!isAllergyGuardOn)
                        showToast(isAllergyGuardOn ? 'Đã tắt Cảnh Báo Dị Ứng & Kỵ Thực Phẩm!' : 'Đã bật Cảnh Báo Dị Ứng & Kỵ Thực Phẩm!')
                      }}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        !hasData
                          ? 'cursor-not-allowed bg-slate-200'
                          : isAllergyGuardOn
                          ? 'cursor-pointer bg-emerald-600'
                          : 'cursor-pointer bg-slate-200'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          hasData && isAllergyGuardOn ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <h4 className="font-black text-slate-900 text-sm tracking-tight">
                    Cảnh Báo Dị Ứng &amp; Kỵ Thực Phẩm
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {hasData
                      ? 'AI phân tích các cặp nguyên liệu kỵ nhau gây độc (VD: Mật ong + Đậu nành, Ba ba + Rau dền) hoặc lượng muối/ớt vượt ngưỡng an toàn.'
                      : 'Bộ lọc an toàn đang ở chế độ chờ. 0 quy tắc độc tố & kỵ thực phẩm đang kích hoạt.'}
                  </p>
                </div>

                <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600">Cơ sở dữ liệu:</span>
                  <span className="font-bold text-emerald-800 text-[11px]">
                    {hasData && isAllergyGuardOn ? 'Viện Dinh Dưỡng Quốc Gia (2024)' : 'Chưa kích hoạt (0 dữ liệu)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Inner Sub-card 4: GPU Worker Nodes Kitchen Vision */}
            <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-100/60 text-[#9c3808] flex items-center justify-center shrink-0">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-slate-900 text-xs block">
                    GPU Worker Nodes Kitchen Vision
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Cluster H100 Việt Nam: <strong>{hasData ? '8/8 Nodes' : '0/0 Nodes'}</strong>{' '}
                    {hasData ? 'hoạt động mượt mà' : 'hoạt động'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-slate-500 font-medium text-xs">
                  Tải GPU hiện tại: <strong className="text-orange-600 font-mono">{hasData ? '42%' : '0%'}</strong>
                </span>
                {/* Mini Sparkline Curve */}
                <svg className="w-16 h-5 text-orange-500" fill="none" viewBox="0 0 60 20" stroke="currentColor">
                  {hasData ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M1 14 L15 12 L28 16 L42 6 L59 9" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" strokeDasharray="3 3" d="M1 10 L59 10" />
                  )}
                </svg>
              </div>
            </div>
          </div>

          {/* Box 2: Kết nối API & Đồng bộ Kho Siêu thị */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs shrink-0">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                    Kết nối API &amp; Đồng bộ Kho Siêu thị
                  </h2>
                  <p className="text-xs text-slate-500">
                    Quản lý luồng dữ liệu giá tươi sống, tồn kho nguyên liệu và tự động tạo giỏ đi chợ 1-chạm cho độc giả.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSyncSupermarkets}
                disabled={isSyncingSupermarket || !hasData}
                className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <RotateCcw className={`w-3.5 h-3.5 text-sky-600 ${isSyncingSupermarket ? 'animate-spin' : ''}`} />
                <span>{isSyncingSupermarket ? 'Đang đồng bộ...' : 'Đồng bộ ngay'}</span>
              </button>
            </div>

            {/* 3 Partner Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
              {/* Partner 1: WinMart+ / Retail API */}
              <div
                onClick={() =>
                  setSelectedPartner({
                    name: 'WinMart+ / Retail API',
                    code: 'WM+',
                    status: hasData ? 'Đang kết nối (TLS 1.3)' : 'Chưa kết nối (0)',
                    protocol: hasData ? 'OAuth 2.0 / REST' : 'Chưa kích hoạt',
                    desc: hasData
                      ? 'Đồng bộ giá thịt, rau củ quả hữu cơ theo từng quận huyện.'
                      : 'Chưa có luồng dữ liệu đồng bộ.',
                    syncFreq: hasData ? '30 phút / lần' : '0 phút / lần',
                    slipRate: hasData ? '5.0%' : '0.0%',
                    stockSku: hasData ? '3,420 SKU' : '0 SKU',
                    endpoint: hasData ? 'https://api.winmart.vn/v2/inventory/bepxinh-sync' : 'Chưa cấu hình endpoint API',
                  })
                }
                className="p-4 bg-sky-50/40 hover:bg-sky-50/80 rounded-2xl border border-sky-100 flex flex-col justify-between space-y-3 cursor-pointer transition-all shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                      hasData ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {hasData && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      {hasData ? 'Đang kết nối' : 'Chưa kết nối (0)'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {hasData ? 'OAuth 2.0' : '0 Token'}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm tracking-tight">
                    WinMart+ / Retail API
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {hasData
                      ? 'Đồng bộ giá thịt, rau củ quả hữu cơ theo từng quận huyện.'
                      : 'Chưa có cấu hình kết nối API siêu thị WinMart+.'}
                  </p>
                </div>

                <div className="p-2.5 bg-white/90 rounded-xl border border-sky-100 space-y-1 text-[11px] font-medium text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Tần suất đồng bộ:</span>
                    <strong className="text-slate-800">{hasData ? '30 phút / lần' : '0 phút / lần'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Trượt giá cho phép:</span>
                    <strong className="text-orange-600 font-mono font-bold">{hasData ? '5.0%' : '0.0%'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tồn kho khả dụng:</span>
                    <strong className="text-emerald-700 font-mono font-bold">{hasData ? '3,420 SKU' : '0 SKU'}</strong>
                  </div>
                </div>
              </div>

              {/* Partner 2: Co.opFood Realtime */}
              <div
                onClick={() =>
                  setSelectedPartner({
                    name: 'Co.opFood Realtime',
                    code: 'CPF',
                    status: hasData ? 'Hoạt động tốt' : 'Chưa kết nối (0)',
                    protocol: hasData ? 'Webhook v2 / EventStream' : 'Chưa kích hoạt',
                    desc: hasData
                      ? 'Luồng thông báo thay đổi khuyến mãi chớp nhoáng (Flash Deals rau sạch).'
                      : 'Chưa có luồng thông báo khuyến mãi.',
                    syncFreq: hasData ? 'Tức thời (Webhook)' : '0 phút / lần',
                    slipRate: hasData ? '4.0%' : '0.0%',
                    stockSku: hasData ? '2,890 SKU' : '0 SKU',
                    endpoint: hasData ? 'https://webhook.coopfood.vn/events/live-price-stream' : 'Chưa cấu hình endpoint API',
                  })
                }
                className="p-4 bg-emerald-50/40 hover:bg-emerald-50/80 rounded-2xl border border-emerald-100 flex flex-col justify-between space-y-3 cursor-pointer transition-all shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 ${
                      hasData ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {hasData && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                      {hasData ? 'Hoạt động tốt' : 'Chưa kết nối (0)'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {hasData ? 'Webhook v2' : '0 Webhook'}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm tracking-tight">
                    Co.opFood Realtime
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {hasData
                      ? 'Luồng thông báo thay đổi khuyến mãi chớp nhoáng (Flash Deals rau sạch).'
                      : 'Chưa có cấu hình webhook thời gian thực Co.opFood.'}
                  </p>
                </div>

                <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-100 space-y-1 text-[11px] font-medium text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Độ trễ phản hồi:</span>
                    <strong className="text-emerald-700">{hasData ? '120ms (Cực nhanh)' : '0ms'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lỗi 24h qua:</span>
                    <strong className="text-slate-800">0 lần</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Đơn hàng tự tạo:</span>
                    <strong className="text-orange-600 font-mono font-bold">{hasData ? '1,829 giỏ/ngày' : '0 giỏ/ngày'}</strong>
                  </div>
                </div>
              </div>

              {/* Partner 3: Bếp Xinh Direct Hub */}
              <div
                onClick={() =>
                  setSelectedPartner({
                    name: 'Bếp Xinh Direct Hub',
                    code: 'BXH',
                    status: hasData ? 'Kho trung tâm trực tuyến' : 'Kho đóng (0 SKU)',
                    protocol: hasData ? 'Nội bộ Microservice' : 'Chưa kích hoạt',
                    desc: hasData
                      ? 'Kho sốt gia vị ướp sẵn và combo nguyên liệu chia sẵn theo khẩu phần.'
                      : 'Chưa có kho phân phối hoạt động.',
                    syncFreq: hasData ? 'Liên tục 24/7' : '0 phút / lần',
                    slipRate: '0.0%',
                    stockSku: hasData ? '1,420 SKU độc quyền' : '0 SKU độc quyền',
                    endpoint: hasData ? 'grpc://internal.bepxinh.vn:50051/hub/inventory' : 'Chưa cấu hình endpoint API',
                  })
                }
                className="p-4 bg-orange-50/40 hover:bg-orange-50/80 rounded-2xl border border-orange-100 flex flex-col justify-between space-y-3 cursor-pointer transition-all shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      hasData ? 'bg-[#9c3808] text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {hasData ? 'Kho Gia Vị Độc Quyền' : 'Kho đóng (0 SKU)'}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {hasData ? 'Nội bộ' : 'Chưa kích hoạt'}
                    </span>
                  </div>
                  <h4 className="font-black text-slate-900 text-sm tracking-tight">
                    Bếp Xinh Direct Hub
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {hasData
                      ? 'Kho sốt gia vị ướp sẵn và combo nguyên liệu chia sẵn theo khẩu phần.'
                      : 'Chưa kích hoạt kho trung tâm phân phối trực tiếp Bếp Xinh.'}
                  </p>
                </div>

                <div className="p-2.5 bg-white/90 rounded-xl border border-orange-100 space-y-1 text-[11px] font-medium text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Trung tâm phân phối:</span>
                    <strong className="text-slate-800">{hasData ? 'Hà Nội & TP.HCM' : '0 Trung tâm'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Giao hàng hỏa tốc:</span>
                    <strong className="text-orange-600 font-bold">{hasData ? 'Dưới 45 phút' : '0 phút'}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tỷ lệ hoàn thành:</span>
                    <strong className="text-emerald-700 font-mono font-bold">{hasData ? '99.7%' : '0.0%'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: 4 Cols */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel 1: Tiêu chuẩn Cấp Tích Xanh & Hoa Hồng */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4 text-xs">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shadow-2xs shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-sm tracking-tight">
                  Tiêu chuẩn Cấp Tích Xanh &amp; Hoa Hồng
                </h3>
                <span className="text-[11px] text-slate-400 font-bold">
                  Chính sách Bếp Trưởng Pro
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Điều kiện tự động nâng cấp tác giả thành Đầu Bếp Chứng Nhận cùng tỷ lệ san sẻ lợi nhuận liên kết nguyên liệu.
            </p>

            {/* Criteria List */}
            <div className="space-y-2">
              {/* Item 1 */}
              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-sky-600 shrink-0" />
                  <span className="font-bold text-slate-700 text-xs">Công thức chuẩn được duyệt</span>
                </div>
                <span className="font-mono font-black text-sky-800 text-xs">
                  {hasData ? '> 30 bài' : '0 bài'}
                </span>
              </div>

              {/* Item 2 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="font-bold text-slate-700 text-xs">Điểm đánh giá từ độc giả</span>
                </div>
                <span className="font-mono font-black text-slate-800 text-xs">
                  {hasData ? '≥ 4.8 ★' : '0.0 ★'}
                </span>
              </div>

              {/* Item 3 */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold text-slate-700 text-xs">Lịch sử vi phạm bản quyền</span>
                </div>
                <span className="font-bold text-emerald-700 text-xs">
                  {hasData ? '0 vi phạm / 6 tháng' : '0 vi phạm / 0 tháng'}
                </span>
              </div>
            </div>

            {/* Commission Rate Box */}
            <div className="p-4 bg-orange-50/80 rounded-2xl border border-orange-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-800 text-xs">Tỷ lệ hoa hồng Giỏ Đi Chợ</span>
                <span className="font-mono font-black text-xl text-[#9c3808]">
                  {hasData ? '8.0%' : '0.0%'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Tác giả hưởng 8% giá trị đơn nguyên liệu thành công phát sinh từ link công thức của họ.
              </p>
            </div>

            {/* Current Pro Chefs Count */}
            <div className="p-3 bg-sky-50/40 rounded-xl border border-sky-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Bếp trưởng Tích Xanh hiện tại</span>
                <span className="text-lg font-black text-slate-900 font-mono">
                  {hasData ? '482 thành viên' : '0 thành viên'}
                </span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                hasData ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
              }`}>
                {hasData ? '+14 tháng này' : '+0 tháng này'}
              </span>
            </div>
          </div>

          {/* Panel 2: Nhật ký Thay đổi Tham số (Audit Log) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5 text-xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-black text-slate-900 text-sm">Nhật ký Thay đổi Tham số</h3>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                  {hasData ? '3' : '0'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsAuditLogOpen(true)}
                className="text-[#9c3808] font-bold text-xs hover:underline cursor-pointer"
              >
                Xem tất cả
              </button>
            </div>

            {/* Timeline Items or Empty State */}
            {!hasData ? (
              <div className="p-6 text-center rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                  <Clock className="w-5 h-5" />
                </div>
                <p className="font-bold text-slate-800 text-xs">Chưa có nhật ký thay đổi nào (0 bản ghi)</p>
                <p className="text-[11px] text-slate-500">
                  Toàn bộ lịch sử can thiệp tham số hệ thống sẽ được ghi nhận tại đây khi có phát sinh.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Item 1 */}
                <div className="space-y-1 pl-3 border-l-2 border-[#9c3808]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-slate-900">Bếp Trưởng Minh (Admin)</span>
                    <span className="text-slate-400 font-mono">10 phút trước</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Điều chỉnh <strong>Ngưỡng tự động phê duyệt AI</strong> từ 80 lên <strong className="text-[#9c3808]">85 điểm</strong>.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="space-y-1 pl-3 border-l-2 border-emerald-500">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-slate-900">Hệ thống Tự động (Cron)</span>
                    <span className="text-slate-400 font-mono">03:00 Sáng nay</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Cập nhật chứng chỉ bảo mật SSL &amp; Tokens kết nối WinMart API định kỳ.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="space-y-1 pl-3 border-l-2 border-slate-300">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-black text-slate-900">Lan Huong (Tech Lead)</span>
                    <span className="text-slate-400 font-mono">Hôm qua, 16:45</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Bật tính năng phát hiện gia vị ngộ độc và kết nối API Viện Dinh Dưỡng.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Security Capsule */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-2 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-relaxed">
                Mọi thay đổi cấu hình gốc đều được mã hóa và ghi nhận bất biến vào nhật ký bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
