import React, { useState } from 'react'
import {
  ShieldCheck,
  CheckCircle2,
  Download,
  Rocket,
  Search,
  ExternalLink,
  Eye,
  Bookmark,
  ShoppingCart,
  Check,
  Sparkles,
  FileCheck,
  Pin,
  Tag,
  Ban,
  FileText,
  Star,
  UtensilsCrossed,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ExploreLiveModal } from '../modals/ExploreLiveModal'

interface ApprovedRecipeDetailViewProps {
  onNavigateTab: (tab: 'all' | 'pending' | 'review' | 'approved' | 'rejected') => void
  currentTab: string
}

interface ApprovedRecipeItem {
  id: string
  code: string
  title: string
  chefName: string
  chefRole: string
  chefAvatar: string
  aiScore: number
  badgeText: string
  badgeType: 'ai' | 'hot' | 'clean' | 'family'
  approvedAgo: string
  viewsCount: string
  savedCount: string
  ordersCount: string
  salesGmv: string
  category: string
  image: string
  heroImage: string
  servings: string
  prepTime: string
  publishedAt: string
  isExplorePushed: boolean
  isHomePinned: boolean
}


export const ApprovedRecipeDetailView: React.FC<ApprovedRecipeDetailViewProps> = ({
  onNavigateTab,
}) => {
  const { showToast, isEmptyData } = useProfile()
  const [recipes, setRecipes] = useState<ApprovedRecipeItem[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilterPill, setActiveFilterPill] = useState<string | null>(null)
  const [isExploreModalOpen, setIsExploreModalOpen] = useState(false)

  const activeItem = recipes.find((r) => r.id === selectedId) || (isEmptyData ? null : recipes[0])

  // Toggle Explore Push
  const handleToggleExplore = () => {
    if (!activeItem) return
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === activeItem.id ? { ...r, isExplorePushed: !r.isExplorePushed } : r
      )
    )
    if (activeItem.isExplorePushed) {
      showToast(`Đã gỡ món ăn ${activeItem.code} (${activeItem.title}) khỏi Trang Khám Phá!`)
    } else {
      showToast(`Đã ĐẨY LÊN BANNER KHÁM PHÁ cho món ăn ${activeItem.code} (${activeItem.title})!`)
      setIsExploreModalOpen(true)
    }
  }

  // Toggle Home Banner Pin
  const handleToggleHomePin = () => {
    if (!activeItem) return
    setRecipes((prev) =>
      prev.map((r) =>
        r.id === activeItem.id ? { ...r, isHomePinned: !r.isHomePinned } : r
      )
    )
    if (activeItem.isHomePinned) {
      showToast(`Đã huỷ ghim món ăn khỏi Banner Trang Chủ!`)
    } else {
      showToast(`Đã GHIM món ăn ${activeItem.code} lên Banner Trang Chủ Bếp Xinh!`)
    }
  }

  // Export Data
  const handleExportData = () => {
    showToast('Đang kết xuất dữ liệu công thức đã phê duyệt (.xlsx)...')
    setTimeout(() => {
      showToast('Đã tải xuống file BepXinh_CongThuc_DaPheDuyet.xlsx thành công!')
    }, 600)
  }

  // PDF Certificate
  const handleDownloadPdf = () => {
    if (!activeItem) return
    showToast(`Đang tạo file chứng nhận kiểm định PDF cho mã ${activeItem.code}...`)
    setTimeout(() => {
      showToast('Đã tải xuống Chứng Chỉ Kiểm Duyệt Chuẩn Bếp Xinh (PDF)!')
    }, 800)
  }

  return (
    <div className="p-3.5 sm:p-4 md:p-5 space-y-5 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* Live Explore App Modal */}
      {activeItem && (
        <ExploreLiveModal
          isOpen={isExploreModalOpen}
          onClose={() => setIsExploreModalOpen(false)}
          recipeTitle={activeItem.title}
          chefName={activeItem.chefName}
          heroImage={activeItem.heroImage}
        />
      )}

      {/* 1. Header Card (Matching user design) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-2xs">
            <CheckCircle2 className="w-6 h-6" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                Không Gian Kiểm Duyệt Công Thức
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AI TỰ ĐỘNG QUÉT: Đang hiển thị trên ứng dụng (Live)
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Xác thực bản quyền hình ảnh, bóc tách dinh dưỡng &amp; an toàn thực phẩm chuẩn Bếp Xinh
            </p>
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất dữ liệu (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={handleToggleExplore}
            disabled={!activeItem}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-white text-xs font-black shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
              activeItem?.isExplorePushed
                ? 'bg-[#9c3808] hover:bg-[#832f07]'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>
              {activeItem?.isExplorePushed ? 'Đang trên Banner Khám Phá' : 'Đẩy lên Banner Khám Phá'}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Search & Tabs & Quick Filter Pills */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-3.5">
        {/* Row 1: Search Input & Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Thịt ba chỉ nướng mật ong..."
              className="w-full pl-9 pr-12 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 text-xs font-semibold text-slate-800 outline-none transition-all"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-400 bg-white border border-slate-200">
              ⌘K
            </span>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => onNavigateTab('pending')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Chờ duyệt <span className="font-extrabold text-slate-800">{isEmptyData ? 0 : 48}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('review')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Cần sửa lại <span className="font-extrabold text-slate-800">{isEmptyData ? 0 : 16}</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('approved')}
              className="px-4 py-1.5 rounded-full bg-[#009b62] text-white shadow-xs font-black transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Đã phê duyệt ({isEmptyData ? 0 : '1,240'})</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('rejected')}
              className="px-3.5 py-1.5 rounded-full text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 hover:bg-slate-50 transition-all cursor-pointer"
            >
              Từ chối <span className="font-extrabold text-slate-800">{isEmptyData ? 0 : 34}</span>
            </button>
          </div>
        </div>

        {/* Row 2: Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            LỌC NHANH:
          </span>

          <button
            type="button"
            onClick={() => setActiveFilterPill(activeFilterPill === 'pinned' ? null : 'pinned')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilterPill === 'pinned'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <Pin className="w-3 h-3" />
            <span>Đã ghim Trang chủ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilterPill(activeFilterPill === 'ai100' ? null : 'ai100')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilterPill === 'ai100'
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Điểm AI tuyệt đối (100đ)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilterPill(activeFilterPill === 'video' ? null : 'video')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilterPill === 'video'
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>🎬 Có video hướng dẫn</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFilterPill(activeFilterPill === 'shop' ? null : 'shop')}
            className={`px-3 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
              activeFilterPill === 'shop'
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span>🔗 Liên kết mua sắm 100%</span>
          </button>
        </div>
      </div>

      {/* 3. Main Two-Column Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-4 xl:gap-5">
        {/* Left Column: Danh sách đã phê duyệt */}
        <div className="w-full lg:w-[270px] xl:w-[290px] shrink-0 space-y-3">
          <div className="flex items-center justify-between px-1 text-xs">
            <h3 className="font-bold text-slate-800 uppercase tracking-tight">
              Danh sách đã phê duyệt
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">
              Hiển thị {isEmptyData ? 0 : recipes.length} / {isEmptyData ? 0 : '1,240'}
            </span>
          </div>

          {recipes.length === 0 ? (
            <div className="p-8 rounded-2xl border border-slate-200/90 bg-white text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800">Chưa có công thức đã duyệt</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Hiện tại không có công thức nào trong danh sách đã phê duyệt.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recipes.map((item) => {
                const isSelected = item.id === activeItem?.id

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative bg-white ${
                    isSelected
                      ? 'border-[#009b62] ring-2 ring-emerald-100 shadow-md border-l-4 border-l-[#009b62]'
                      : 'border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                          {item.code}
                        </span>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            item.badgeType === 'ai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.badgeType === 'hot'
                              ? 'bg-rose-100 text-rose-800'
                              : item.badgeType === 'clean'
                              ? 'bg-teal-100 text-teal-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.badgeText}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1 mb-1">
                        {item.title}
                      </h4>

                      <div className="flex items-center gap-1 text-[10px] text-slate-500 truncate mb-1">
                        <span>👤 {item.chefName}</span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>{item.approvedAgo}</span>
                        <span className="font-semibold text-slate-600 flex items-center gap-0.5">
                          <Eye className="w-3 h-3 text-slate-400" />
                          {item.viewsCount} xem
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          )}

          {/* Load More Button */}
          {!isEmptyData && (
            <button
              type="button"
              onClick={() => showToast('Đang tải thêm 20 công thức lưu trữ từ kho dữ liệu...')}
              className="w-full py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-xs font-bold text-slate-600 text-center transition-colors cursor-pointer"
            >
              Tải thêm 20 công thức lưu trữ...
            </button>
          )}
        </div>

        {/* Right Column: Recipe Detail Inspector */}
        <div className="flex-1 min-w-0 w-full space-y-4">
          {!activeItem ? (
            <div className="p-12 rounded-3xl border border-slate-200/80 bg-white text-center space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-800">Chưa có công thức phê duyệt nào được chọn</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Khi có công thức được duyệt thành công, chi tiết và chỉ số tương tác sẽ hiển thị tại đây.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Hero Card with Recipe Image (Matches user design) */}
              <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 bg-slate-900 group">
            <img
              src="/images/approved_full_hero_dish.png"
              alt={activeItem.title}
              className="w-full h-auto object-cover group-hover:scale-101 transition-transform duration-500"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
              }}
            />

            {/* Clickable button for 'Xem trên App (Live)' */}
            <button
              type="button"
              onClick={() => setIsExploreModalOpen(true)}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-emerald-800 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md border border-emerald-200/80 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-600" />
              <span>Xem trên App (Live)</span>
            </button>
          </div>

          {/* Chef Profile Bio Card */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 border-2 border-orange-200 shrink-0">
                <img
                  src={activeItem.chefAvatar}
                  alt={activeItem.chefName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/images/admin_avatar.png'
                  }}
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-black text-slate-900">{activeItem.chefName}</h4>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{activeItem.chefRole}</p>
              </div>
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Thời gian nộp: <strong className="text-slate-700">14:05 - Hôm nay</strong>
            </div>
          </div>

          {/* Green Certificate Banner (CÔNG THỨC ĐÃ XUẤT BẢN THÀNH CÔNG) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#009b62] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Check className="w-6 h-6 stroke-[3] text-white" />
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-wider text-emerald-100">
                  CHỨNG CHỈ PHÊ DUYỆT HỆ THỐNG
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  CÔNG THỨC ĐÃ XUẤT BẢN THÀNH CÔNG
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-50 mt-0.5">
                  <span>Mã số kiểm duyệt: <strong>AAPR-2024-98621</strong></span>
                  <span>•</span>
                  <span>Duyệt lúc: <strong>{activeItem.publishedAt}</strong></span>
                  <span>•</span>
                  <span>Bởi: <strong>Bếp Trưởng Minh (Lead Admin)</strong></span>
                </div>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-white text-[#009b62] font-black text-xs shrink-0 self-start sm:self-auto shadow-sm">
              AI SCORE {activeItem.aiScore}/100
            </div>
          </div>

          {/* 3 Performance KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* KPI 1 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Lượt xem ứng dụng</span>
                <Eye className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900">{activeItem.viewsCount}</div>
              <div className="text-[11px] font-bold text-emerald-600 mt-1">
                +18% so với trung bình
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Lưu vào Sổ tay nấu ăn</span>
                <Bookmark className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900">{activeItem.savedCount}</div>
              <div className="text-[11px] font-bold text-emerald-600 mt-1">
                Tỉ lệ chuyển đổi 17.4%
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Đơn đi chợ liên kết</span>
                <ShoppingCart className="w-4 h-4 text-slate-400" />
              </div>
              <div className="text-2xl font-black text-slate-900">{activeItem.ordersCount}</div>
              <div className="text-[11px] font-bold text-slate-600 mt-1">
                Doanh số: <strong className="text-emerald-700">{activeItem.salesGmv}</strong>
              </div>
            </div>
          </div>

          {/* AI Inspector Verification Standard Section */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase">
                  Biên bản AI Inspector đã xác thực (Chuẩn chất lượng 100%)
                </h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                4/4 Tiêu chuẩn Đạt
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Box 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Độ phân giải &amp; Bản quyền ảnh</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    100% Khớp
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Sắc nét 2400×1600px HDR, không chứa watermark ngoại lai, không sao chép từ kho mở (Cosine similarity = 0.05 với nguồn công khai).
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Mã kiểm chứng: SHA-256_d4c9f1a01
                </div>
              </div>

              {/* Box 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Định lượng Calo &amp; Dinh dưỡng</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Chuẩn dinh dưỡng
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Khẩu phần tính toán: 520 kcal. Bóc tách Macro chuẩn: Protein 18.5g, Lipid 43.2g, Carbs 0.1g. Cân bằng gia vị không dư lượng muối Natri vượt ngưỡng khuyến nghị.
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Đo lường bởi: NutriEngine v3.2
                </div>
              </div>

              {/* Box 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>An toàn thực phẩm &amp; Nhiệt độ</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Chuẩn HACCP Gia Đình
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Quy trình nướng 180°C trong 25 phút bảo đảm diệt khuẩn sâu cho thịt ba chỉ lợn tươi sống. Không phát hiện thành phần gây dị ứng ẩn (No undisclosed allergen).
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  Quy chuẩn QCVN 12-4:2025/BYT
                </div>
              </div>

              {/* Box 4 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Ánh xạ Siêu thị đối tác</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    3/3 Chuỗi có hàng
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Tất cả 4 nguyên liệu chính đều có sẵn tại hệ thống: WinMart+, Co.opmart, Tops Market, Bách Hóa Xanh, AEON Mall với giá tham chiếu 165.000đ/phần.
                </p>
                <div className="text-[10px] text-slate-400 font-mono">
                  API Sync: 100% SKU Active
                </div>
              </div>
            </div>
          </div>

          {/* Standardized Ingredients (4 Components) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs sm:text-sm font-black text-slate-900">
                  Khối nguyên liệu đã chuẩn hóa (4 thành phần)
                </h4>
              </div>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                Đã kết nối giỏ hàng đi chợ hộ
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold truncate">Thịt ba chỉ quế</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900">600</span>
                  <span className="text-[11px] text-slate-400 font-medium">gram</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold truncate">Mật ong hoa nhãn</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900">3</span>
                  <span className="text-[11px] text-slate-400 font-medium">thìa canh</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold truncate">Tiêu xanh tươi</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900">2</span>
                  <span className="text-[11px] text-slate-400 font-medium">nhánh</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="font-semibold truncate">Nước mắm nhĩ</span>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900">2</span>
                  <span className="text-[11px] text-slate-400 font-medium">thìa cà phê</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standardized Cooking Steps (2 Steps) */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3.5">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <h4 className="text-xs sm:text-sm font-black text-slate-900">
                Quy trình nấu đã kiểm duyệt (2 bước có minh họa AI đã duyệt)
              </h4>
            </div>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center gap-3.5">
                <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src="/images/approved_step_1.png"
                    alt="Sơ chế & Ướp thịt"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                    }}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">
                      BƯỚC 01 • SƠ CHẾ &amp; ƯỚP THỊT (15 PHÚT)
                    </h5>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✔ Đạt chuẩn ánh sáng
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Thịt ba chỉ rửa sạch với nước muối loãng, cắt miếng dày cỡ 1.5 cm. Giã dập 2 nhánh tiêu xanh, trộn đều với 3 thìa mật ong và nước mắm. Ướp thịt ngấm trong 15 phút.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center gap-3.5">
                <div className="w-full sm:w-28 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <img
                    src="/images/approved_step_2.png"
                    alt="Nướng nhiệt độ 180°C"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                    }}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-slate-900">
                      BƯỚC 02 • NƯỚNG NHIỆT ĐỘ 180°C (25 PHÚT)
                    </h5>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✔ Đạt chuẩn thời gian
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Làm nóng nồi chiên không dầu ở 180°C trong 5 phút. Xếp thịt ba chỉ vào khay nướng không xếp chồng. Nướng 15 phút một đầu, lật mặt và phết thêm sốt mật ong nướng thêm 10 phút.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Action Buttons */}
          <div className="sticky bottom-4 z-20 w-full flex items-center justify-end gap-2 sm:gap-2.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl box-border">
            {/* Button 1: Gỡ khỏi Khám Phá */}
            <button
              type="button"
              onClick={handleToggleExplore}
              className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <Ban className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>{activeItem.isExplorePushed ? 'Gỡ khỏi Khám Phá' : 'Đưa lên Khám Phá'}</span>
            </button>

            {/* Button 2: Sửa Tags & Danh mục */}
            <button
              type="button"
              onClick={() => showToast('Mở hộp thoại chỉnh sửa Tags và Phân loại danh mục...')}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <Tag className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Sửa Tags &amp; Danh mục</span>
            </button>

            {/* Button 3: Tải Chứng Nhận PDF */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs whitespace-nowrap shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>Tải Chứng Nhận PDF</span>
            </button>

            {/* Button 4: Ghim Lên Banner Trang Chủ */}
            <button
              type="button"
              onClick={handleToggleHomePin}
              className={`px-4 py-2 rounded-xl text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeItem.isHomePinned
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#009b62] hover:bg-emerald-700'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-white shrink-0" />
              <span>{activeItem.isHomePinned ? 'Đã Ghim Trang Chủ' : 'Ghim Lên Banner Trang Chủ'}</span>
            </button>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
