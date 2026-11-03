import React, { useState } from 'react'
import { ApprovedRecipeDetailView } from './ApprovedRecipeDetailView'
import { RejectedRecipeDetailView } from './RejectedRecipeDetailView'
import { RequestRevisionModal } from '../modals/RequestRevisionModal'
import { RejectViolationModal } from '../modals/RejectViolationModal'
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  Hourglass,
  Layers,
  ChevronRight,
  Filter,
  Check,
  Download,
  RotateCw,
  Edit3,
  XCircle,
  ChefHat,
  Flame,
  Users,
  Camera,
  CheckSquare,
  Square,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface RecipeItem {
  id: string
  code: string
  title: string
  chefName: string
  chefRole: 'Master Chef' | 'Creator Pro' | 'Creator Mới'
  chefMemberSince: string
  chefApprovedCount: number
  chefViolationRate: string
  timeAgo: string
  timeLeft: string
  category: string
  aiScore: number
  aiStatus: 'Đạt' | 'Cần rà soát' | 'Cảnh báo Vi phạm'
  prepTime: string
  calories: string
  servings: string
  difficulty: 'Dễ' | 'Trung bình' | 'Khó'
  image: string
  heroImage: string
  urgentTag?: string
  isAiPass: boolean
  cameraMeta?: string
  tags: string[]
  ingredients: {
    name: string
    amount: string
    aiAssessment: string
    sku: string
    inventory: string
  }[]
  steps: {
    stepNumber: string
    title: string
    time: string
    desc: string
    badge: string
    image?: string
  }[]
  defaultNote: string
}

export const RecipeReviewQueueView: React.FC = () => {
  const { showToast, isEmptyData } = useProfile()
  const [recipes, setRecipes] = useState<RecipeItem[]>([])
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'review' | 'approved' | 'rejected'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const t = new URLSearchParams(window.location.search).get('tab')
        if (t === 'approved' || t === 'pending' || t === 'review' || t === 'rejected' || t === 'all') {
          return t
        }
      }
    } catch {}
    return 'pending'
  })
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [reviewNote, setReviewNote] = useState<string>('')
  const [sendChefNotification, setSendChefNotification] = useState<boolean>(true)
  const [isScanning, setIsScanning] = useState<boolean>(false)
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'revision'
      }
    } catch {}
    return false
  })
  const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'reject'
      }
    } catch {}
    return false
  })

  const activeRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0] || null

  // Select / deselect individual recipe
  const toggleSelectRecipe = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedIds.length === recipes.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(recipes.map((r) => r.id))
    }
  }

  // Quick Approve AI-Pass
  const handleQuickApproveAll = () => {
    showToast('Đang tiến hành duyệt tự động 48 bài AI-Pass với tốc độ 0.4s/item...')
    setTimeout(() => {
      showToast('Đã hoàn tất duyệt nhanh 48 công thức AI-Pass thành công!')
    }, 1200)
  }

  // Rescan all
  const handleRescan = () => {
    setIsScanning(true)
    showToast('Đang kích hoạt quét toàn bộ hàng đợi với AI Inspector v3.2...')
    setTimeout(() => {
      setIsScanning(false)
      showToast('Đã quét xong toàn bộ 48 công thức. Tất cả chỉ số đã được cập nhật!')
    }, 1500)
  }

  // Export List
  const handleExportList = () => {
    showToast('Đang chuẩn bị file xuất danh sách kiểm duyệt công thức (Excel/CSV)...')
    setTimeout(() => {
      showToast('Đã tải xuống danh sách hàng đợi kiểm duyệt thành công!')
    }, 800)
  }

  // Approve single recipe
  const handleApproveRecipe = () => {
    showToast(`Đã PHÊ DUYỆT công thức ${activeRecipe.code} (${activeRecipe.title}) và đưa món ăn lên Trang Khám Phá!`)
    setRecipes((prev) => prev.filter((r) => r.id !== activeRecipe.id))
    setActiveTab('approved')
  }

  // Reject single recipe
  const handleRejectRecipe = () => {
    setIsRejectModalOpen(true)
  }

  // Handle Reject Modal Submission
  const handleRejectModalSubmit = () => {
    showToast(`Đã ban hành quyết định từ chối & lập biên bản kỷ luật #REJ-2024-98540!`)
    setActiveTab('rejected')
  }

  // Request revision
  const handleRequestRevision = () => {
    setIsRevisionModalOpen(true)
  }

  // Append note tag
  const handleAddNoteTag = (tagText: string) => {
    if (!reviewNote.includes(tagText)) {
      setReviewNote((prev) => (prev ? `${prev} ${tagText}.` : `${tagText}.`))
      showToast(`Đã thêm ghi chú: "${tagText}"`)
    }
  }

  if ((activeTab as string) === 'approved') {
    return (
      <ApprovedRecipeDetailView
        currentTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />
    )
  }

  if ((activeTab as string) === 'rejected') {
    return (
      <RejectedRecipeDetailView
        currentTab={activeTab}
        onNavigateTab={(tab) => setActiveTab(tab)}
        onBackToQueue={() => setActiveTab('pending')}
      />
    )
  }

  return (
    <div className="p-3.5 sm:p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Request Revision Modal */}
      <RequestRevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        recipeCode={activeRecipe?.code || (isEmptyData ? '#RC-00000' : '#RC-98621')}
        recipeTitle={activeRecipe?.title || (isEmptyData ? 'Chưa chọn công thức' : 'Thịt ba chỉ nướng mật ong sốt tiêu xanh')}
        chefName={activeRecipe?.chefName || (isEmptyData ? 'Chưa có tác giả' : 'Hoàng Lan Chef')}
        chefRole={activeRecipe ? `${activeRecipe.chefRole} • ${activeRecipe.chefApprovedCount} công thức đã đăng` : (isEmptyData ? 'Chưa có thông tin' : 'Cấp độ 4: Bếp Vàng • 120 công thức đã đăng')}
        chefAvatar={activeRecipe?.image || (isEmptyData ? '/images/admin_avatar.png' : '/images/approved_chef.png')}
        aiScore={activeRecipe?.aiScore ?? (isEmptyData ? 0 : 94)}
        onSuccess={() => {
          showToast(`Đã chuyển công thức ${activeRecipe?.code || ''} sang trạng thái Cần xem lại!`)
        }}
      />

      {/* Reject Violation Modal */}
      <RejectViolationModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        recipeCode={activeRecipe?.code || (isEmptyData ? '#RC-00000' : '#RC-98540')}
        decisionCode={isEmptyData ? '#REJ-0000-00000' : '#REJ-2024-98540'}
        recipeTitle={activeRecipe?.title || (isEmptyData ? 'Chưa chọn công thức' : 'Sườn nướng sốt BBQ Hàn Quốc siêu cay')}
        category={activeRecipe?.category || (isEmptyData ? 'Chưa phân loại' : 'Món nướng than hoa')}
        chefName={activeRecipe?.chefName || (isEmptyData ? 'Chưa xác định' : 'Trần Bảo')}
        chefRole={activeRecipe ? `${activeRecipe.chefRole} • ${activeRecipe.chefApprovedCount} công thức đã đăng` : (isEmptyData ? 'Chưa có thông tin' : 'Tập sự L1 • 2 lần vi phạm')}
        chefStats={isEmptyData ? 'Đã gửi: 0 bài • Tỷ lệ vi phạm: 0%' : 'Đã gửi: 3 bài • Tỷ lệ vi phạm: 66.7%'}
        chefAvatar={activeRecipe?.image || (isEmptyData ? '/images/admin_avatar.png' : '/images/food_thit_nuong.png')}
        aiScore={activeRecipe?.aiScore ?? (isEmptyData ? 0 : 18)}
        onSubmit={handleRejectModalSubmit}
      />
      {/* 1. Header & Live Telemetry Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
            <span>BẾP XINH ENTERPRISE</span>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-[#9c3808]">KIỂM DUYỆT CÔNG THỨC MÓN ĂN</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Hàng đợi Kiểm duyệt Công thức Món ăn
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Sync - Enterprise v2.4
            </span>
          </div>

          <p className="text-xs md:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
            Thẩm định tính xác thực dinh dưỡng, bản quyền hình ảnh qua AI Inspector và đồng bộ kho nguyên liệu trước khi phát hành đến độc giả.
          </p>
        </div>

        {/* Right Compliance Badge */}
        <div className="flex items-center gap-2.5 bg-white border border-slate-200/90 rounded-2xl p-3 shadow-2xs shrink-0">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#9c3808]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-extrabold text-slate-400 uppercase">TIÊU CHUẨN AN TOÀN</div>
            <div className="text-xs font-black text-slate-800">Quy chuẩn VSTP QCVN: 100%</div>
          </div>
        </div>
      </div>

      {/* 2. 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Chờ thẩm định */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">
            <span>CHỜ THẨM ĐỊNH</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {isEmptyData ? 0 : 48}
            </span>
            <span className="text-xs font-bold text-slate-500 uppercase">BÀI</span>
          </div>
          <div className="mt-2">
            <span className={`inline-block px-2 py-0.5 rounded-md ${
              isEmptyData ? 'bg-slate-100 text-slate-500 border border-slate-200' : 'bg-rose-50 border border-rose-100 text-rose-700'
            } text-[10px] font-bold`}>
              {isEmptyData ? 'Cơ chế tiền kiểm: STANDBY' : 'Cơ chế tiền kiểm cấp 1: ON'}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-500 font-medium">
              {isEmptyData ? 'Chưa có bài chờ thẩm định' : 'Tồn đọng giảm 3.1% tuần này'}
            </span>
            {/* Sparkline curve */}
            <svg className={`w-16 h-5 ${isEmptyData ? 'text-slate-300' : 'text-amber-500'}`} viewBox="0 0 60 20" fill="none">
              {isEmptyData ? (
                <line x1="0" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              ) : (
                <path d="M0 16 Q15 12 25 15 T45 6 T60 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Card 2: Điểm AI Inspector TB */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">
            <span>ĐIỂM AI INSPECTOR TB</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {isEmptyData ? 0 : 89.4}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 100</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {isEmptyData ? 'Chưa có dữ liệu đánh giá' : 'Trung bình giá trị chất lượng tự động'}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className={`${isEmptyData ? 'text-slate-400 font-semibold' : 'text-emerald-600 font-bold'}`}>
              {isEmptyData ? '0% bài đạt' : '78% bài đạt từ 85đ'}
            </span>
            <span className={`px-2 py-0.5 rounded-md ${
              isEmptyData ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-700'
            } text-[10px] font-bold`}>
              {isEmptyData ? 'Chờ kích hoạt' : 'Chuẩn hóa AI'}
            </span>
          </div>
        </div>

        {/* Card 3: Tỷ lệ vi phạm hệ thống */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">
            <span>TỶ LỆ VI PHẠM HỆ THỐNG</span>
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-3xl font-black ${isEmptyData ? 'text-slate-400' : 'text-rose-600'} tracking-tight`}>
            {isEmptyData ? '0%' : '4.2%'}
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {isEmptyData ? 'Chưa ghi nhận vi phạm' : 'Trùng lặp, bản quyền & phụ gia cấm'}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className={`${isEmptyData ? 'text-slate-400' : 'text-rose-600 font-bold'}`}>
              {isEmptyData ? '0%' : '↘ Giảm 1.1% so với tháng trước'}
            </span>
            <span className={`px-2 py-0.5 rounded-md ${
              isEmptyData ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-700'
            } text-[10px] font-bold`}>
              {isEmptyData ? 'An toàn' : 'Kiểm soát tốt'}
            </span>
          </div>
        </div>

        {/* Card 4: Thời gian xử lý TB */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-1.5">
            <span>THỜI GIAN XỬ LÝ TB</span>
            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {isEmptyData ? 0 : 14}
            </span>
            <span className="text-xs font-semibold text-slate-500">phút/bài</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate">
            {isEmptyData ? 'Chưa có phiên xử lý' : 'Nhanh hơn 35% nhờ AI Pre-screening'}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className={`${isEmptyData ? 'text-slate-400' : 'text-blue-600 font-bold'}`}>
              Target: &lt; 30 phút
            </span>
            <span className={`px-2 py-0.5 rounded-md ${
              isEmptyData ? 'bg-slate-100 text-slate-500' : 'bg-blue-50 text-blue-700'
            } text-[10px] font-bold`}>
              {isEmptyData ? 'Hoàn tất 0%' : 'Hoàn tất 94%'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Action Bar, Filter Tabs & Quick Tags */}
      <div className="space-y-3.5">
        {/* Row 1: Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 md:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 select-none">
              <input
                type="checkbox"
                checked={selectedIds.length === recipes.length && recipes.length > 0}
                onChange={toggleSelectAll}
                className="w-4 h-4 rounded border-slate-300 accent-[#9c3808]"
              />
              <span>Chọn tất cả</span>
            </label>

            <button
              type="button"
              onClick={handleQuickApproveAll}
              disabled={isEmptyData || recipes.length === 0}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-white text-xs font-bold transition-all ${
                isEmptyData || recipes.length === 0
                  ? 'bg-slate-300 cursor-not-allowed opacity-70'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-xs hover:shadow-md cursor-pointer'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Duyệt nhanh {isEmptyData ? 0 : 48} bài (AI-Pass) {isEmptyData ? '' : '(0.4s/item)'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRescan}
              title="Quét lại toàn bộ hàng đợi"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${isScanning ? 'animate-spin text-orange-600' : ''}`} />
              <span className="hidden sm:inline">Quét lại toàn bộ</span>
            </button>

            <button
              type="button"
              onClick={handleExportList}
              title="Xuất danh sách Excel/CSV"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Xuất danh sách Excel/CSV</span>
            </button>
          </div>
        </div>

        {/* Row 2: Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
            }`}
          >
            Tất cả: {isEmptyData ? 0 : 48}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
            }`}
          >
            • Chờ duyệt ({isEmptyData ? 0 : 48})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('review')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
            }`}
          >
            Cần xem lại: {isEmptyData ? 0 : 16}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              (activeTab as string) === 'approved'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
            }`}
          >
            Đã phê duyệt: {isEmptyData ? 0 : '1,840'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200/60'
            }`}
          >
            Từ chối: {isEmptyData ? 0 : 34}
          </button>
        </div>

        {/* Row 3: Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-bold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" />
            Lọc nhanh:
          </span>

          <button
            type="button"
            onClick={() => setFilterTag(filterTag === 'urgent' ? null : 'urgent')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              filterTag === 'urgent'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
            }`}
          >
            Ưu tiên &lt;2h tiền kiểm (x {isEmptyData ? 0 : 24})
          </button>

          <button
            type="button"
            onClick={() => setFilterTag(filterTag === 'ai_high' ? null : 'ai_high')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              filterTag === 'ai_high'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            AI Chất lượng cao (&gt; 90đ)
          </button>

          <button
            type="button"
            onClick={() => setFilterTag(filterTag === 'warning' ? null : 'warning')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              filterTag === 'warning'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Có cảnh báo vi phạm
          </button>

          <button
            type="button"
            onClick={() => setFilterTag(filterTag === 'new_dish' ? null : 'new_dish')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              filterTag === 'new_dish'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
            }`}
          >
            Món mới xưởng làm
          </button>

          <button
            type="button"
            onClick={() => setFilterTag(filterTag === 'verified_chef' ? null : 'verified_chef')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
              filterTag === 'verified_chef'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            Đầu bếp xác minh
          </button>
        </div>
      </div>

      {/* 4. Main Two-Column Layout: Left Queue & Right Inspector */}
      <div className="flex flex-col lg:flex-row items-start gap-4 xl:gap-5">
        {/* Left Column: Queue List */}
        <div className="w-full lg:w-[250px] xl:w-[270px] shrink-0 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              HÀNG ĐỢI CÔNG THỨC NỘP
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {isEmptyData ? 0 : recipes.length} bài / {isEmptyData ? 0 : 48} bài chờ duyệt
            </span>
          </div>

          <div className="space-y-3">
            {recipes.length === 0 ? (
              <div className="p-6 bg-white rounded-2xl border border-slate-200/80 text-center space-y-2.5 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#9c3808] mx-auto flex items-center justify-center">
                  <Hourglass className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800">Hàng đợi đang trống</div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Chưa có công thức nào cần thẩm định tại thời điểm này.
                </p>
              </div>
            ) : (
              recipes.map((item) => {
              const isSelected = item.id === selectedRecipeId
              const isChecked = selectedIds.includes(item.id)

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedRecipeId(item.id)
                    setReviewNote(item.defaultNote)
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-orange-50/40 border-[#9c3808] ring-2 ring-orange-200/80 shadow-md'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
                  }`}
                >
                  {/* Top pill if selected */}
                  {isSelected && (
                    <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-[#9c3808] text-white text-[10px] font-bold shadow-xs">
                      Đang kiểm định
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => toggleSelectRecipe(item.id, e)}
                      className="mt-1 text-slate-400 hover:text-[#9c3808] transition-colors"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-4 h-4 text-[#9c3808]" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>

                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60 shadow-2xs">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails
                          ;(e.target as HTMLElement).style.display = 'none'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-bold font-mono text-slate-400">
                          {item.code}
                        </span>
                        {item.urgentTag && (
                          <span
                            className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                              item.urgentTag.includes('Cảnh báo')
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {item.urgentTag}
                          </span>
                        )}
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mb-2">
                        <ChefHat className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="font-semibold text-slate-700 truncate">{item.chefName}</span>
                        <span className="text-[9px] font-bold px-1 rounded bg-amber-100 text-amber-800">
                          {item.chefRole}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.aiScore >= 90
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.aiScore >= 80
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          AI: {item.aiScore}/100 {item.aiStatus}
                        </span>

                        <span className="text-[10px] text-slate-400 font-medium truncate">
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-500">
            <span>Trang {isEmptyData ? '0 / 0 (0 công thức)' : '1 / 12 (48 công thức)'}</span>
            {!isEmptyData && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-slate-400 cursor-pointer"
                >
                  &lt;
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-[#9c3808] text-white flex items-center justify-center font-bold shadow-xs cursor-pointer"
                >
                  1
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                >
                  2
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                >
                  3
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center font-bold text-slate-600 cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Recipe Detail Inspector */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {!activeRecipe ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-100 text-[#9c3808] mx-auto flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-800">
                  Hàng đợi kiểm duyệt đang trống
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Hiện chưa có công thức nào được gửi duyệt trong hệ thống. Khi có bài viết mới từ đầu bếp hoặc creator, toàn bộ dữ liệu định lượng, hình ảnh và báo cáo kiểm duyệt AI sẽ xuất hiện tại đây.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-500">
                <span>0 bài đang chờ xử lý</span>
              </div>
            </div>
          ) : (
            <>
              {/* Top Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {activeRecipe.code}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Đầu bếp xác minh VIP
              </span>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                {activeRecipe.timeAgo}
              </span>
            </div>

            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
              {activeRecipe.timeLeft}
            </span>
          </div>

          {/* Large Hero Card with Recipe Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 group">
            <img
              src={activeRecipe.heroImage}
              alt={activeRecipe.title}
              className="w-full h-56 sm:h-72 object-cover opacity-90 group-hover:scale-102 transition-transform duration-500"
            />
            {/* Top overlay pills */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5">
              {activeRecipe.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white ${
                    idx === 0 ? 'bg-orange-600/90' : 'bg-emerald-600/90'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>

            {activeRecipe.cameraMeta && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono border border-white/20">
                <Camera className="w-3 h-3 text-orange-400" />
                <span>{activeRecipe.cameraMeta}</span>
              </div>
            )}

            {/* Bottom Gradient with Info */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 text-white">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-2">
                {activeRecipe.title}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-200">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  {activeRecipe.prepTime}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  {activeRecipe.calories}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  {activeRecipe.servings}
                </span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  Độ khó: {activeRecipe.difficulty}
                </span>
              </div>
            </div>
          </div>

          {/* Chef Bio Info Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-amber-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                HL
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-slate-900 text-sm">{activeRecipe.chefName}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 uppercase">
                    {activeRecipe.chefRole}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Thành viên đối tác từ {activeRecipe.chefMemberSince} • Đã duyệt {activeRecipe.chefApprovedCount} công thức • Uy tín: {activeRecipe.chefViolationRate}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => showToast(`Xem hồ sơ chi tiết đầu bếp: ${activeRecipe.chefName}`)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shrink-0 cursor-pointer"
            >
              Hồ sơ đầu bếp
            </button>
          </div>

          {/* AI Inspector Detailed Audit Report */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
                <ShieldCheck className="w-4 h-4 text-[#9c3808]" />
                <span>BÁO CÁO KIỂM TRA TỰ ĐỘNG: AI INSPECTOR</span>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Điểm AI Inspector: {activeRecipe.aiScore}/100 Đạt Chuẩn
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
              {/* Check 1: Copyright */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
                  <span>Bản quyền ảnh &amp; bài</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="font-extrabold text-emerald-800 text-[11px]">100% khớp, an toàn</div>
                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                  Không trùng lặp trên Google/Pinterest. EXIF máy ảnh hợp lệ.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold mt-2">
                  Tỷ lệ nội quyền: 100%
                </div>
              </div>

              {/* Check 2: Nutrition */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
                  <span>Dinh dưỡng &amp; Định lượng</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="font-extrabold text-emerald-800 text-[11px]">Chuẩn định lượng, 520 kcal</div>
                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                  Đủ calo theo gram chín/xào, năng lượng tính toán chính xác.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold mt-2">
                  Natri - Nóng / Calo: chuẩn
                </div>
              </div>

              {/* Check 3: Safety */}
              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80">
                <div className="flex items-center justify-between text-emerald-900 font-bold mb-1">
                  <span>An toàn VSTP (QCVN)</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="font-extrabold text-emerald-800 text-[11px]">Đạt chuẩn 160°C / 15 phút</div>
                <p className="text-[10px] text-slate-600 mt-1 leading-relaxed">
                  Nhiệt độ tâm món đạt tiêu chuẩn tiệt khuẩn, gia vị an toàn.
                </p>
                <div className="text-[10px] text-emerald-700 font-bold mt-2">
                  Tiêu chuẩn: QCVN 12-4:2015
                </div>
              </div>
            </div>
          </div>

          {/* Standardized Ingredients Table with SKU */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Nguyên liệu đã chuẩn hóa định lượng &amp; SKU Siêu thị</span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {activeRecipe.ingredients.length} nguyên liệu chính
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="py-2 px-2">NGUYÊN LIỆU</th>
                    <th className="py-2 px-2">ĐỊNH LƯỢNG</th>
                    <th className="py-2 px-2">ĐÁNH GIÁ AI</th>
                    <th className="py-2 px-2">MÃ ĐỐI TÁC (WINMART/BHX)</th>
                    <th className="py-2 px-2">KHO HÀNG</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {activeRecipe.ingredients.map((ing, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-2 font-bold text-slate-800 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {ing.name}
                      </td>
                      <td className="py-2.5 px-2 text-slate-600">{ing.amount}</td>
                      <td className="py-2.5 px-2">
                        <span className="text-emerald-700 font-semibold">{ing.aiAssessment}</span>
                      </td>
                      <td className="py-2.5 px-2 font-mono text-[11px] text-slate-600">{ing.sku}</td>
                      <td className="py-2.5 px-2 text-slate-600">{ing.inventory}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3 Steps Cooking Procedure */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
              <Flame className="w-4 h-4 text-orange-600" />
              <span>Quy trình 3 Bước Chế biến Thực nghiệm</span>
            </div>

            <div className="space-y-2.5">
              {activeRecipe.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/60 flex items-start gap-3"
                >
                  {/* Step Image or Icon */}
                  {st.image ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-200 shadow-2xs">
                      <img src={st.image} alt={st.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-orange-100/60 border border-orange-200/80 flex flex-col items-center justify-center shrink-0 text-[#9c3808]">
                      <ChefHat className="w-5 h-5 mb-0.5" />
                      <span className="text-[9px] font-black uppercase">BẾP XINH</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[10px] font-bold">
                          {st.stepNumber}
                        </span>
                        <h5 className="font-bold text-slate-900 text-xs">{st.title}</h5>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 shrink-0">
                        {st.time}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>

                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200/60">
                      {st.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Auditor Notes Section */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase">
                <Edit3 className="w-4 h-4 text-orange-600" />
                <span>Ghi chú của Kiểm duyệt viên (Gửi tác giả hoặc Lưu nội bộ)</span>
              </div>

              <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={sendChefNotification}
                  onChange={(e) => setSendChefNotification(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-[#9c3808]"
                />
                <span>Gửi thông báo app cho {activeRecipe.chefName}</span>
              </label>
            </div>

            {/* Quick recommendation tags */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleAddNoteTag('+ Định lượng chuẩn xác & ảnh đẹp')}
                className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Định lượng chuẩn xác &amp; ảnh đẹp
              </button>
              <button
                type="button"
                onClick={() => handleAddNoteTag('+ Khuyến nghị gắn nhãn Món Ngon Cuối Tuần')}
                className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Khuyến nghị gắn nhãn Món Ngon Cuối Tuần
              </button>
              <button
                type="button"
                onClick={() => handleAddNoteTag('+ Đạt chuẩn phát hành ngay')}
                className="px-2.5 py-1 rounded-full bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Đạt chuẩn phát hành ngay
              </button>
            </div>

            {/* Note Textarea */}
            <div className="relative">
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                maxLength={500}
                rows={3}
                placeholder="Nhập nhận xét hoặc lưu ý gửi cho đầu bếp..."
                className="w-full text-xs font-medium text-slate-800 p-3 rounded-xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none leading-relaxed transition-all resize-none"
              />
              <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 font-mono">
                {reviewNote.length} / 500 ký tự
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1 text-slate-600 font-semibold text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kiểm duyệt bởi: <strong className="text-slate-800">Bếp Trưởng Minh (Lead Admin)</strong></span>
              </div>
              <span className="font-mono text-[10px]">Audit ID: TR-AD-2024-9841</span>
            </div>
          </div>

          {/* Sticky Bottom Action Buttons */}
          <div className="sticky bottom-4 z-20 w-full flex items-center justify-end gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl box-border">
            <button
              type="button"
              onClick={handleRejectRecipe}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Từ chối &amp; Lập biên bản</span>
            </button>

            <button
              type="button"
              onClick={handleRequestRevision}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Yêu cầu chỉnh sửa</span>
            </button>

            <button
              type="button"
              onClick={handleApproveRecipe}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <Check className="w-4 h-4 stroke-[3] shrink-0" />
              <span>Phê duyệt &amp; Đăng Toàn Hệ thống</span>
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
