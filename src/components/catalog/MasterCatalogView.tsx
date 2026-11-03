import React, { useState } from 'react'
import {
  Download,
  RefreshCw,
  FolderPlus,
  PackagePlus,
  Search,
  Filter,
  Columns,
  BookOpen,
  Network,
  FlaskConical,
  HeartPulse,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  TrendingDown,
  Share2,
  Trash2,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { AddCategoryModal } from '../modals/AddCategoryModal'
import { AddIngredientModal } from '../modals/AddIngredientModal'
import { EditMappingModal } from '../modals/EditMappingModal'

interface MasterIngredient {
  id: string
  code: string
  name: string
  subName: string
  group: string
  standardTag: string
  tagColor: string
  image: string
  calories: number
  unit: string
  protein: number
  fat: number
  carbs: number
  sodium?: number
  coverageCount: number
  coverageTotal: number
  coveragePercent: number
  supermarkets: string[]
  refPrice: number
  refPriceChange: string
  skus: {
    partner: string
    code: string
    sku: string
    matchRate: number
    stock: string
    tagBg: string
    tagColor: string
  }[]
  portion: string
  dietaryLabel: string
}


export const MasterCatalogView: React.FC = () => {
  const { showToast } = useProfile()
  const [ingredients, setIngredients] = useState<MasterIngredient[]>([])
  const [activeIngredientId, setActiveIngredientId] = useState<string>('')
  const [activeMainTab, setActiveMainTab] = useState<'ingredients' | 'categories' | 'spices' | 'nutrition'>('ingredients')
  const [selectedGroup, setSelectedGroup] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  
  // Modals state
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddIngredientOpen, setIsAddIngredientOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'ingredient'
      }
    } catch {}
    return false
  })
  const [isEditMappingOpen, setIsEditMappingOpen] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const hasData = ingredients.length > 0
  const activeIngredient = ingredients.find((i) => i.id === activeIngredientId) || (hasData ? ingredients[0] : null)

  // Filtered ingredients
  const filteredIngredients = ingredients.filter((item) => {
    if (selectedGroup !== 'all' && item.group !== selectedGroup) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchName = item.name.toLowerCase().includes(q)
      const matchCode = item.code.toLowerCase().includes(q)
      const matchSub = item.subName.toLowerCase().includes(q)
      if (!matchName && !matchCode && !matchSub) return false
    }
    return true
  })

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredIngredients.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredIngredients.map((i) => i.id))
    }
  }

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleSyncMasterSKU = () => {
    setIsSyncing(true)
    showToast('Đang kích hoạt tiến trình đồng bộ dữ liệu với 5 chuỗi siêu thị API...')
    setTimeout(() => {
      setIsSyncing(false)
      showToast('Đồng bộ thành công 48,020 SKUs liên kết. Tỷ lệ khớp chuẩn đạt 96.8%!')
    }, 1500)
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* Modals */}
      <AddCategoryModal
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
        onCategoryAdded={(cat) => {
          showToast(`Đã ghi nhận danh mục "${cat.name}" vào cây phân loại!`)
        }}
      />
      <AddIngredientModal
        isOpen={isAddIngredientOpen}
        onClose={() => setIsAddIngredientOpen(false)}
        onIngredientAdded={(newIng) => {
          setIngredients([newIng, ...ingredients])
          setActiveIngredientId(newIng.id)
        }}
      />
      <EditMappingModal
        isOpen={isEditMappingOpen}
        onClose={() => setIsEditMappingOpen(false)}
        ingredient={activeIngredient}
        onSaved={(updated) => {
          setIngredients(ingredients.map((i) => (i.id === updated.id ? updated : i)))
        }}
      />

      {/* 1. Top Bar / Breadcrumb & Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>BẾP XINH ADMIN</span>
          <span>&rsaquo;</span>
          <span>DANH MỤC &amp; NGUYÊN LIỆU</span>
          <span>&rsaquo;</span>
          <span className="text-[#9c3808]">QUẢN LÝ MASTER CATALOG</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Quản lý Danh mục Ẩm thực &amp; Nguyên liệu Chuẩn hóa
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Master Taxonomy v2.5.4 Verified
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Chuẩn hóa cây danh mục món ăn (Taxonomy tree), từ điển nguyên liệu quốc gia, định mức dinh dưỡng và quy tắc ánh xạ SKU bán lẻ tự động.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {hasData && (
              <button
                type="button"
                onClick={() => {
                  setIngredients([])
                  setActiveIngredientId('')
                  setSelectedIds([])
                  showToast('Đã xóa toàn bộ từ điển danh mục & nguyên liệu, đặt lại là 0!')
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa dữ liệu (0)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => showToast('Đang xuất toàn bộ từ điển Master Catalog (.xlsx)...')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất Data (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handleSyncMasterSKU}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Master SKU'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddCategoryOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FolderPlus className="w-3.5 h-3.5" />
              <span>+ Thêm danh mục món</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddIngredientOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PackagePlus className="w-3.5 h-3.5" />
              <span>+ Thêm nguyên liệu chuẩn</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng nguyên liệu chuẩn hóa */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỔNG NGUYÊN LIỆU CHUẨN HÓA</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasData ? '1,420' : '0'}
            </span>
            <span className="text-xs font-normal text-slate-400">
              {hasData ? '/ 24,000 SKU' : '/ 0 SKU'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              {hasData ? '+38 món mới tháng này' : '0 món mới tháng này'}
            </span>
            <span className="text-slate-500 text-[11px] font-medium">
              {hasData ? '99.2% Calo' : '0.0% Calo'}
            </span>
          </div>
        </div>

        {/* Card 2: Cây danh mục món ăn */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>CÂY DANH MỤC MÓN ĂN</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Network className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasData ? '48' : '0'}
            </span>
            <span className="text-xs font-normal text-slate-400">Phân loại</span>
          </div>
          <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
            <div className="font-semibold text-slate-700">
              {hasData ? '6 Nhóm gốc: 40 Phân nhánh ẩm thực' : '0 Nhóm gốc: 0 Phân nhánh ẩm thực'}
            </div>
            <div className="text-slate-400 truncate">
              {hasData ? 'Món canh, Kho, Xào, Nướng, Eat Clean...' : 'Chưa có phân loại danh mục'}
            </div>
          </div>
        </div>

        {/* Card 3: Tỷ lệ ánh xạ SKU siêu thị */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỶ LỆ ÁNH XẠ SKU SIÊU THỊ</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasData ? '96.8%' : '0.0%'}
            </span>
            <span className={`text-xs font-bold ${hasData ? 'text-emerald-600' : 'text-slate-400'}`}>
              {hasData ? 'Đã khớp' : 'Chưa ánh xạ'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>{hasData ? '48,020 SKUs liên kết' : '0 SKUs liên kết'}</span>
            <span className="text-slate-700 font-bold">{hasData ? '5 Chuỗi lớn' : '0 Chuỗi lớn'}</span>
          </div>
        </div>

        {/* Card 4: Cảnh báo dị ứng & ATTP */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>CẢNH BÁO DỊ ỨNG &amp; ATTP</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${hasData ? 'text-rose-600' : 'text-slate-900'}`}>
                {hasData ? '12' : '0'}
              </span>
              <span className={`text-xs font-bold ${hasData ? 'text-rose-600' : 'text-slate-400'}`}>
                Nhóm nguy cơ
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              hasData ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
            }`}>
              {hasData ? '100% Active' : '0% Active'}
            </span>
          </div>
          <div className={`text-[11px] truncate pt-1 font-medium ${hasData ? 'text-rose-700' : 'text-slate-400'}`}>
            {hasData ? 'Giáp xác, Đậu phộng, Gluten, Sữa bò' : 'Chưa ghi nhận nhóm nguy cơ nào'}
          </div>
        </div>
      </div>

      {/* 3. Master Tabs Strip (Mode Switcher) */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Tab 1 */}
          <button
            type="button"
            onClick={() => setActiveMainTab('ingredients')}
            className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'ingredients'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Từ điển Nguyên liệu Chuẩn (Master Ingredients)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeMainTab === 'ingredients' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
            }`}>
              {hasData ? '1,420' : '0'}
            </span>
          </button>

          {/* Tab 2 */}
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('categories')
              showToast('Xem Cây danh mục món ăn (Recipe Categories)...')
            }}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'categories'
                ? 'bg-[#9c3808] text-white shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Network className="w-4 h-4 text-slate-400" />
            <span>Cây Danh mục Món ăn (Recipe Categories)</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {hasData ? '48' : '0'}
            </span>
          </button>

          {/* Tab 3 */}
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('spices')
              showToast('Xem Nhóm Gia vị & Nước sốt Nấu ăn...')
            }}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'spices'
                ? 'bg-[#9c3808] text-white shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FlaskConical className="w-4 h-4 text-slate-400" />
            <span>Nhóm Gia vị &amp; Nước sốt Nấu ăn</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
              {hasData ? '165' : '0'}
            </span>
          </button>

          {/* Tab 4 */}
          <button
            type="button"
            onClick={() => {
              setActiveMainTab('nutrition')
              showToast('Xem Bảng Dinh dưỡng & Calo (USDA / Viện DD VN)...')
            }}
            className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeMainTab === 'nutrition'
                ? 'bg-[#9c3808] text-white shadow-xs font-black'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-slate-400" />
            <span>Bảng Dinh dưỡng &amp; Calo (USDA / Viện DD VN)</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs px-3 py-1 font-medium">
          <Clock className="w-3.5 h-3.5" />
          <span>Cập nhật lúc: Hôm nay, 14:32</span>
        </div>
      </div>

      {/* 4. Search & Filters Bar */}
      <div className="space-y-3">
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Thịt ba chỉ"
                className="w-full pl-9 pr-12 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 text-xs outline-none focus:bg-white focus:border-[#9c3808]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-600">
                ⌘K
              </span>
            </div>

            {/* Advanced Filter Button */}
            <button
              type="button"
              onClick={() => showToast('Mở bộ lọc nâng cao thuộc tính nguyên liệu...')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Bộ lọc nâng cao</span>
              <span className="w-2 h-2 rounded-full bg-[#9c3808]" />
            </button>

            {/* Customize Columns Button */}
            <button
              type="button"
              onClick={() => showToast('Mở tùy chỉnh hiển thị cột dữ liệu...')}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Columns className="w-3.5 h-3.5 text-slate-500" />
              <span>Tùy chỉnh cột</span>
            </button>
          </div>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-orange-600 font-bold hover:underline cursor-pointer text-xs"
            >
              Xóa tìm kiếm
            </button>
          )}
        </div>

        {/* Sub-category Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          <span className="text-slate-400 uppercase text-[11px] mr-1">NHÓM:</span>
          {[
            { id: 'all', label: `Tất cả (${hasData ? '1,420' : 0})` },
            { id: 'Thịt & Gia cầm', label: `Thịt & Gia cầm (${hasData ? '182' : 0})` },
            { id: 'Thủy hải sản', label: `Thủy hải sản (${hasData ? '145' : 0})` },
            { id: 'Rau củ quả tươi', label: `Rau củ quả tươi (${hasData ? '342' : 0})` },
            { id: 'Gia vị & Thảo mộc', label: `Gia vị & Thảo mộc (${hasData ? '285' : 0})` },
            { id: 'Đồ khô & Hạt', label: `Đồ khô & Hạt (${hasData ? '210' : 0})` },
            { id: 'Sữa & Trứng', label: `Sữa & Trứng (${hasData ? '78' : 0})` },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedGroup(cat.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedGroup === cat.id
                  ? 'bg-[#9c3808] text-white shadow-2xs font-black'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Main Split View: Left Table + Right Detail & Taxonomy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Master Ingredients Table */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              {filteredIngredients.length === 0 ? (
                <div className="py-16 px-6 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#9c3808] shadow-xs">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1 max-w-md mx-auto">
                    <h3 className="text-base font-black text-slate-800">
                      Chưa có nguyên liệu chuẩn nào trong hệ thống
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Cơ sở dữ liệu Master Catalog hiện đang trống (0 nguyên liệu). Bạn có thể thêm nguyên liệu mới để bắt đầu cấu hình định mức &amp; ánh xạ SKU siêu thị.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddIngredientOpen(true)}
                      className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <PackagePlus className="w-4 h-4" />
                      <span>+ Thêm nguyên liệu chuẩn</span>
                    </button>
                  </div>
                </div>
              ) : (
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={selectedIds.length === filteredIngredients.length && filteredIngredients.length > 0}
                          onChange={toggleSelectAll}
                          className="w-4 h-4 rounded border-slate-300 text-[#9c3808] focus:ring-orange-200 cursor-pointer accent-[#9c3808]"
                        />
                      </th>
                      <th className="py-3 px-4">MÃ &amp; TÊN NGUYÊN LIỆU CHUẨN</th>
                      <th className="py-3 px-4">ĐỊNH MỨC &amp; DINH DƯỠNG</th>
                      <th className="py-3 px-4">PHỦ SÓNG SIÊU THỊ &amp; ÁNH XẠ SKU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredIngredients.map((item) => {
                      const isSelected = activeIngredientId === item.id
                      const isChecked = selectedIds.includes(item.id)

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setActiveIngredientId(item.id)}
                          className={`transition-colors cursor-pointer ${
                            isSelected ? 'bg-orange-50/40' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-3.5 px-3.5 text-center relative" onClick={(e) => e.stopPropagation()}>
                            {isSelected && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#9c3808]" />
                            )}
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleSelectOne(item.id)}
                              className="w-4 h-4 rounded border-slate-300 text-[#9c3808] focus:ring-orange-200 cursor-pointer accent-[#9c3808]"
                            />
                          </td>

                          {/* Col 1: Mã & Tên nguyên liệu */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                              />
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[11px] font-black text-amber-900 bg-amber-50 px-1.5 py-0.2 rounded">
                                    {item.code}
                                  </span>
                                  <span className={`px-2 py-0.2 rounded-full text-[10px] font-extrabold border ${item.tagColor}`}>
                                    {item.standardTag}
                                  </span>
                                </div>
                                <h4 className="font-black text-slate-900 text-sm">{item.name}</h4>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{item.subName}</p>
                              </div>
                            </div>
                          </td>

                          {/* Col 2: Định mức & Dinh dưỡng */}
                          <td className="py-3.5 px-4 font-mono">
                            <div className="space-y-1">
                              <span className="font-black text-slate-900 text-xs">
                                {item.calories} kcal / {item.unit}
                              </span>
                              <div className="text-[11px] text-slate-500 font-medium flex items-center gap-2">
                                <span>P: <strong className="text-slate-800">{item.protein}g</strong></span>
                                <span>F: <strong className="text-slate-800">{item.fat}g</strong></span>
                                <span>C: <strong className="text-slate-800">{item.carbs}g</strong></span>
                                {item.sodium && <span>Na: <strong className="text-slate-800">{item.sodium}mg</strong></span>}
                              </div>
                            </div>
                          </td>

                          {/* Col 3: Phủ sóng siêu thị & Ánh xạ SKU */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-emerald-700 font-black text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{item.coverageCount}/{item.coverageTotal} chuỗi ({item.coveragePercent}%)</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-1">
                                {item.supermarkets.map((sm) => (
                                  <span
                                    key={sm}
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                                  >
                                    {sm}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Table Pagination */}
            <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-500 font-medium">
                Hiển thị <strong>{hasData ? `1 - ${filteredIngredients.length}` : '0'}</strong> trên tổng số <strong>{hasData ? '1,420' : '0'}</strong> nguyên liệu chuẩn
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center cursor-not-allowed"
                >
                  &lsaquo;
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-lg bg-[#9c3808] text-white font-bold flex items-center justify-center shadow-xs"
                >
                  1
                </button>
                <button
                  type="button"
                  disabled={!hasData}
                  onClick={() => showToast('Chuyển trang 2...')}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  2
                </button>
                <button
                  type="button"
                  disabled={!hasData}
                  onClick={() => showToast('Chuyển trang 3...')}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  3
                </button>
                <span className="px-1 text-slate-400">...</span>
                <button
                  type="button"
                  disabled={!hasData}
                  onClick={() => showToast('Chuyển trang 237...')}
                  className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  {hasData ? 237 : 1}
                </button>
                <button
                  type="button"
                  disabled={!hasData}
                  onClick={() => showToast('Chuyển trang tiếp theo...')}
                  className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  &rsaquo;
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Master Inspector Drawer & Taxonomy Tree */}
        <div className="lg:col-span-4 space-y-5">
          {/* Panel 1: Master Inspector Active */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
            {activeIngredient ? (
              <>
                {/* Inspector Header */}
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-black text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>MASTER INSPECTOR ACTIVE</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    ID #{activeIngredient.code}
                  </span>
                </div>

                <div className="p-4 space-y-4 text-xs">
                  {/* Hero Image Card */}
                  <div className="relative rounded-2xl overflow-hidden aspect-video border border-slate-200 shadow-xs">
                    <img
                      src="/images/kitchen-photo.png"
                      alt={activeIngredient.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 text-white">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          VietGAP Certified
                        </span>
                        <span className="bg-white/20 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          HACCP Standard
                        </span>
                      </div>
                      <h3 className="text-base font-black tracking-tight">{activeIngredient.name}</h3>
                    </div>
                  </div>

                  {/* Reference Market Price */}
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">Giá thị trường tham chiếu:</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-black text-slate-900 font-mono">
                          {activeIngredient.refPrice.toLocaleString('vi-VN')}
                        </span>
                        <span className="text-xs font-bold text-slate-500">đ/kg</span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-xl flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{activeIngredient.refPriceChange}</span>
                    </span>
                  </div>

                  {/* Supermarket SKUs Currently Mapped */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-black text-slate-800">
                      <span>SKU Siêu thị Đang Ánh Xạ</span>
                      <span className="text-[11px] font-bold text-emerald-600">3/5 đối tác chính</span>
                    </div>

                    <div className="space-y-2">
                      {activeIngredient.skus.map((skuItem, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className={`px-2 py-1 rounded-lg font-black text-[10px] ${skuItem.tagBg} ${skuItem.tagColor}`}>
                              {skuItem.code}
                            </span>
                            <div>
                              <span className="font-bold text-slate-800 block text-xs">{skuItem.partner}</span>
                              <span className="text-[11px] font-mono text-slate-400">SKU: {skuItem.sku}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              Khớp {skuItem.matchRate}%
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5">{skuItem.stock}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nutritional Rules & Portions */}
                  <div className="space-y-2">
                    <span className="font-black text-slate-800 block">Quy tắc &amp; Khuyến nghị dinh dưỡng</span>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-bold block mb-1">Định mức 1 khẩu phần</span>
                        <span className="font-mono font-black text-slate-800 text-xs">{activeIngredient.portion}</span>
                      </div>
                      <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold block mb-1">Nhãn kiêng tương thích</span>
                        <span className="font-bold text-emerald-800 text-xs">{activeIngredient.dietaryLabel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    type="button"
                    onClick={() => setIsEditMappingOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Chỉnh sửa Ánh xạ Master &amp; Quy tắc</span>
                  </button>
                </div>
              </>
            ) : (
              <div>
                <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-black text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    <span>MASTER INSPECTOR (CHƯA CHỌN)</span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
                    ID: --
                  </span>
                </div>
                <div className="p-8 text-center space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#9c3808]">
                    <Sliders className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-slate-800">Chưa chọn nguyên liệu</h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Chọn một nguyên liệu từ danh sách bảng bên trái hoặc tạo mới để xem chi tiết định mức dinh dưỡng và ánh xạ SKU siêu thị.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddIngredientOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black text-xs shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer mt-2"
                  >
                    <PackagePlus className="w-3.5 h-3.5" />
                    <span>+ Thêm nguyên liệu chuẩn</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Panel 2: Popular Recipe Categories (Taxonomy Tree) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🌿</span>
                <h3 className="font-black text-slate-900 text-sm">Cây Danh mục Món ăn Phổ biến</h3>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200">
                Taxonomy Root
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Cấu trúc phân loại theo phân cấp logic phục vụ tìm kiếm theo tâm lý học hành vi người nội trợ.
            </p>

            {/* Tree Nodes */}
            {hasData ? (
              <div className="space-y-2 text-xs">
                {/* Root 1 */}
                <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between font-extrabold text-slate-800 cursor-pointer">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700">📁</span>
                      <span>Ẩm thực Cơm gia đình</span>
                    </div>
                    <span className="text-[10px] font-black bg-amber-100/80 text-amber-900 px-2 py-0.2 rounded-full">
                      245 món
                    </span>
                  </div>

                  <div className="pl-6 space-y-1.5 text-[11px] text-slate-600 border-l-2 border-amber-200 ml-2">
                    <div className="flex items-center justify-between py-0.5 hover:text-slate-900 cursor-pointer">
                      <span>Món kho đậm đà (ba chỉ, Cá, Sườn)</span>
                      <span className="text-[10px] font-semibold text-slate-400">44 món</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5 hover:text-slate-900 cursor-pointer">
                      <span>Món canh thanh mát &amp; Tiềm hầm</span>
                      <span className="text-[10px] font-semibold text-slate-400">72 món</span>
                    </div>
                    <div className="flex items-center justify-between py-0.5 hover:text-slate-900 cursor-pointer">
                      <span>Xào nhanh đưa cơm</span>
                      <span className="text-[10px] font-semibold text-slate-400">85 món</span>
                    </div>
                  </div>
                </div>

                {/* Root 2 */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <span>🥗</span>
                    <span>Thực dưỡng &amp; Eat Clean (Keto/Salad)</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.2 rounded-full">
                    128 món
                  </span>
                </div>

                {/* Root 3 */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <span>🍲</span>
                    <span>Lẩu &amp; Tiệc Cuối Tuần</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.2 rounded-full">
                    75 món
                  </span>
                </div>

                {/* Root 4 */}
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2">
                    <span>🥟</span>
                    <span>Món cuốn &amp; Bánh truyền thống</span>
                  </div>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.2 rounded-full">
                    45 món
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-6 text-center space-y-2.5 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <div className="text-2xl">🌱</div>
                <div className="text-xs font-bold text-slate-700">Cây danh mục ẩm thực chưa có nhánh</div>
                <p className="text-[11px] text-slate-400">0 phân nhánh đã cấu hình</p>
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-[#9c3808]" />
                  <span>+ Thêm danh mục món đầu tiên</span>
                </button>
              </div>
            )}

            {/* Bottom Button */}
            <button
              type="button"
              onClick={() => showToast(hasData ? 'Mở toàn bộ 48 phân nhánh Cây danh mục ẩm thực Bếp Xinh...' : 'Cây danh mục ẩm thực hiện chưa có dữ liệu nhánh.')}
              className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-slate-500" />
              <span>Quản lý Cây Danh mục Chi tiết ({hasData ? '48 nhóm' : '0 nhóm'})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
