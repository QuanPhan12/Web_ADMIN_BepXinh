import React, { useState } from 'react'
import {
  Flag,
  Inbox,
  Timer,
  ShieldCheck,
  Shield,
  Search,
  Filter,
  Download,
  Calendar,
  RefreshCw,
  Bell,
  Sliders,
  Clock,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Share2,
  AlertCircle,
  ShieldAlert,
  Scale,
} from 'lucide-react'
import type { AppView } from '../../types'
import { useProfile } from '../../context/ProfileContext'
import { CreateQaAlertModal } from './CreateQaAlertModal'
import { PolicyRuleModal } from './PolicyRuleModal'
import { AiGuardConfigModal } from './AiGuardConfigModal'
import { ViolationHistoryModal } from './ViolationHistoryModal'

interface ReportsManagementViewProps {
  onNavigate?: (view: AppView) => void
}

export const ReportsManagementView: React.FC<ReportsManagementViewProps> = ({ onNavigate }) => {
  const { showToast } = useProfile()

  // Filters state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState('30days')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Modals state
  const [isCreateAlertOpen, setIsCreateAlertOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=qa_alert')
    } catch {
      return false
    }
  })
  const [isPolicyRuleOpen, setIsPolicyRuleOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=policy')
    } catch {
      return false
    }
  })
  const [isAiGuardOpen, setIsAiGuardOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=ai_guard')
    } catch {
      return false
    }
  })
  const [isHistoryOpen, setIsHistoryOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=history')
    } catch {
      return false
    }
  })

  const handleRefresh = () => {
    setIsRefreshing(true)
    showToast('Đang kết nối API kiểm tra hàng đợi vi phạm & khiếu nại...')
    setTimeout(() => {
      setIsRefreshing(false)
      showToast('Đồng bộ hoàn tất: 0 vi phạm mới, hệ thống duy trì mức tuân thủ 100%!')
    }, 900)
  }

  const handleExportReport = () => {
    showToast('Đang kết xuất Báo cáo Tuân thủ & Khiếu nại định dạng PDF/Excel...')
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* Modals */}
      <CreateQaAlertModal
        isOpen={isCreateAlertOpen}
        onClose={() => setIsCreateAlertOpen(false)}
      />
      <PolicyRuleModal
        isOpen={isPolicyRuleOpen}
        onClose={() => setIsPolicyRuleOpen(false)}
      />
      <AiGuardConfigModal
        isOpen={isAiGuardOpen}
        onClose={() => setIsAiGuardOpen(false)}
      />
      <ViolationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />

      {/* 1. Header & Actions */}
      <div className="space-y-3">
        {/* Top Breadcrumb & Quick Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-200/80">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <span>BẾP XINH ADMIN</span>
            <span>&rsaquo;</span>
            <span className="text-[#9c3808]">BÁO CÁO VI PHẠM &amp; KHIẾU NẠI</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Đang cập nhật...' : 'Làm mới dữ liệu'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateAlertOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>+ Tạo cảnh báo QA</span>
            </button>
          </div>
        </div>

        {/* Title Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Báo cáo vi phạm &amp; Khiếu nại
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Hệ thống tuân thủ 100%
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Giám sát báo cáo nội dung cộng đồng, phát hiện vi phạm bản quyền và xử lý khiếu nại tức thời theo chuẩn Bếp Xinh v2.5
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsPolicyRuleOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>Quy tắc cảnh báo</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Lịch sử xử lý</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng khiếu nại tháng */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỔNG KHIẾU NẠI THÁNG</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Flag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              0
            </span>
            <span className="text-xs font-normal text-slate-400">vụ</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              ↘ Giảm 100% so với tuần trước
            </span>
          </div>
        </div>

        {/* Card 2: Đang chờ xử lý */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>ĐANG CHỜ XỬ LÝ</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Inbox className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              0
            </span>
            <span className="text-xs font-normal text-slate-400">yêu cầu</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              ✔ Hàng đợi sạch hoàn toàn
            </span>
          </div>
        </div>

        {/* Card 3: Thời gian phản hồi TB */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>THỜI GIAN PHẢN HỒI TB</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Timer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              &lt; 15
            </span>
            <span className="text-xs font-normal text-slate-400">phút</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              ⚡ Đạt SLA Cam kết dịch vụ
            </span>
          </div>
        </div>

        {/* Card 4: Điểm tin cậy cộng đồng */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>ĐIỂM TIN CẬY CỘNG ĐỒNG</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              99.8
            </span>
            <span className="text-xs font-normal text-slate-400">%</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              ↑ +0.4% so với tháng trước
            </span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Mã báo cáo, tác giả, link..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 text-xs outline-none focus:bg-white focus:border-[#9c3808]"
            />
          </div>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="pending">Đang chờ duyệt</option>
            <option value="resolved">Đã xử lý</option>
            <option value="dismissed">Đã bác bỏ</option>
          </select>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none cursor-pointer"
          >
            <option value="all">Loại vi phạm: Toàn bộ danh mục</option>
            <option value="copyright">Bản quyền hình ảnh</option>
            <option value="hate_speech">Ngôn từ không phù hợp</option>
            <option value="identity">Giả mạo tác giả</option>
            <option value="spam">Quảng cáo rác</option>
          </select>

          {/* Time Range Dropdown */}
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="bg-transparent outline-none cursor-pointer font-bold text-slate-700 text-xs"
            >
              <option value="7days">Thời gian: 7 ngày qua</option>
              <option value="30days">Thời gian: 30 ngày qua</option>
              <option value="this_month">Thời gian: Tháng này</option>
              <option value="this_quarter">Thời gian: Quý này</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Advanced Filter */}
          <button
            type="button"
            onClick={() => showToast('Mở bộ lọc nâng cao thuộc tính vi phạm...')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer text-xs shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Lọc nâng cao</span>
          </button>

          {/* Export Report */}
          <button
            type="button"
            onClick={handleExportReport}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer text-xs shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* 4. Main Hero Card: Centerpiece (Clean & High Compliance Empty State) */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-8 sm:p-12 lg:p-16 text-center relative overflow-hidden">
        {/* Soft decorative background glows */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-100/60 via-teal-50/40 to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Radiant Circular Badge */}
          <div className="relative inline-flex items-center justify-center">
            {/* Outer halo */}
            <div className="w-36 h-36 rounded-full bg-emerald-50/80 border border-emerald-100 flex items-center justify-center shadow-inner">
              {/* Middle ring */}
              <div className="w-26 h-26 rounded-full bg-emerald-100/90 flex items-center justify-center">
                {/* Center circle */}
                <div className="w-18 h-18 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-md">
                  <Shield className="w-9 h-9 stroke-[2.2]" />
                </div>
              </div>
            </div>

            {/* Floating Accent 1: Top Right */}
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-emerald-200 text-emerald-600 flex items-center justify-center shadow-2xs animate-pulse">
              <Share2 className="w-3.5 h-3.5" />
            </div>

            {/* Floating Accent 2: Bottom Left */}
            <div className="absolute bottom-2 left-2 w-7 h-7 rounded-full bg-orange-50 border border-orange-200 text-[#9c3808] flex items-center justify-center shadow-2xs">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Heading & Subtext */}
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
              Tuyệt vời! Không có báo cáo vi phạm nào cần xử lý
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Cộng đồng tác giả và độc giả Bếp Xinh đang tuân thủ rất tốt Tiêu chuẩn Văn hóa Ẩm thực &amp; Bản quyền. Toàn bộ công thức đăng tải đều minh bạch, văn minh và an toàn.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate?.('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Tổng quan Vận hành</span>
            </button>

            <button
              type="button"
              onClick={() => setIsHistoryOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Xem Lịch sử giải quyết vi phạm</span>
            </button>
          </div>

          {/* Tertiary Pill Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsAiGuardOpen(true)}
              className="px-4 py-1.5 rounded-full bg-indigo-50/70 hover:bg-indigo-100/70 text-indigo-700 border border-indigo-200/80 text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-2xs transition-all"
            >
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>Cấu hình bộ lọc AI Guard</span>
            </button>
          </div>

          {/* Bottom System Audit Line */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bộ lọc độc hại AI: <strong>V2.6 Active</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Quét tự động công thức: <strong>100% Hoàn tất</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 font-medium text-[11px]">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Đồng bộ máy chủ gần nhất: <strong>1 phút trước</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. 3 Bottom Action & Policy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Tiêu chuẩn Cộng đồng 2025 */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                Tiêu chuẩn Cộng đồng 2025
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Cập nhật quy định kiểm duyệt hình ảnh, bản quyền tác quyền công thức Bếp Xinh năm 2025.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsPolicyRuleOpen(true)}
              className="text-[#9c3808] hover:text-[#832f07] font-black text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>Xem bộ quy tắc</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Card 2: Cấu hình Ngưỡng tự động gắn cờ AI */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-2xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                Cấu hình Ngưỡng tự động gắn cờ AI
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Hệ thống xử lý tự động phân tích ngôn ngữ độc hại, hình ảnh giả mạo với độ chính xác 98.4%.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAiGuardOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-black text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>Tùy chỉnh ngưỡng chặn</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>

        {/* Card 3: Hỗ trợ Pháp lý & Bản quyền trực tuyến */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-2xs">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900 tracking-tight">
                Hỗ trợ Pháp lý &amp; Bản quyền trực tuyến
              </h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Cần hỗ trợ các khiếu nại bản quyền phức tạp? Đội ngũ pháp chế luôn sẵn sàng trực ca 24/7.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => showToast('Đang kết nối tới chuyên viên Pháp chế ca trực: LuatSu.Nguyen@bepxinh.vn (Hotline: 1900-6886)...')}
              className="text-[#9c3808] hover:text-[#832f07] font-black text-xs inline-flex items-center gap-1 cursor-pointer hover:underline"
            >
              <span>Gửi phiếu tư vấn</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
