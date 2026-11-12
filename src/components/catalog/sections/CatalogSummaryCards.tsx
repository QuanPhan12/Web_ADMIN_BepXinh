import {
  AlertTriangle,
  BookOpen,
  Network,
  Share2,
} from 'lucide-react'

interface CatalogSummaryCardsProps {
  hasIngredients: boolean
  categoryCount: number
  isLoadingCategories: boolean
}

export const CatalogSummaryCards = ({
  hasIngredients,
  categoryCount,
  isLoadingCategories,
}: CatalogSummaryCardsProps) => (
  <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>TỔNG NGUYÊN LIỆU CHUẨN HÓA</span>
        <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center">
          <BookOpen className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
          {hasIngredients ? '1,420' : '0'}
        </span>
        <span className="text-xs font-normal text-slate-400">
          {hasIngredients ? '/ 24,000 SKU' : '/ 0 SKU'}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
          {hasIngredients ? '+38 món mới tháng này' : '0 món mới tháng này'}
        </span>
        <span className="text-slate-500 text-[11px] font-medium">
          {hasIngredients ? '99.2% Calo' : '0.0% Calo'}
        </span>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>CÂY DANH MỤC MÓN ĂN</span>
        <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Network className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
          {categoryCount}
        </span>
        <span className="text-xs font-normal text-slate-400">Danh mục</span>
      </div>
      <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
        <div className="font-semibold text-slate-700">
          {isLoadingCategories ? 'Đang tải danh mục...' : `${categoryCount} danh mục`}
        </div>
        <div className="text-slate-400 truncate">
          {categoryCount > 0 ? 'Dữ liệu danh mục mẫu' : 'Chưa có phân loại danh mục'}
        </div>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>TỶ LỆ ÁNH XẠ SKU SIÊU THỊ</span>
        <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Share2 className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
          {hasIngredients ? '96.8%' : '0.0%'}
        </span>
        <span className={`text-xs font-bold ${hasIngredients ? 'text-emerald-600' : 'text-slate-400'}`}>
          {hasIngredients ? 'Đã khớp' : 'Chưa ánh xạ'}
        </span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
        <span>{hasIngredients ? '48,020 SKUs liên kết' : '0 SKUs liên kết'}</span>
        <span className="text-slate-700 font-bold">{hasIngredients ? '5 Chuỗi lớn' : '0 Chuỗi lớn'}</span>
      </div>
    </div>

    <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
        <span>CẢNH BÁO DỊ ỨNG &amp; ATTP</span>
        <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1.5">
          <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${hasIngredients ? 'text-rose-600' : 'text-slate-900'}`}>
            {hasIngredients ? '12' : '0'}
          </span>
          <span className={`text-xs font-bold ${hasIngredients ? 'text-rose-600' : 'text-slate-400'}`}>
            Nhóm nguy cơ
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
          hasIngredients ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-500'
        }`}>
          {hasIngredients ? '100% Active' : '0% Active'}
        </span>
      </div>
      <div className={`text-[11px] truncate pt-1 font-medium ${hasIngredients ? 'text-rose-700' : 'text-slate-400'}`}>
        {hasIngredients ? 'Giáp xác, Đậu phộng, Gluten, Sữa bò' : 'Chưa ghi nhận nhóm nguy cơ nào'}
      </div>
    </div>
  </section>
)
