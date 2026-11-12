import {
  Download,
  FolderPlus,
  PackagePlus,
  RefreshCw,
  Trash2,
} from 'lucide-react'

interface CatalogPageHeaderProps {
  hasIngredients: boolean
  isSyncing: boolean
  onClearIngredients: () => void
  onExport: () => void
  onSync: () => void
  onAddCategory: () => void
  onAddIngredient: () => void
}

export const CatalogPageHeader = ({
  hasIngredients,
  isSyncing,
  onClearIngredients,
  onExport,
  onSync,
  onAddCategory,
  onAddIngredient,
}: CatalogPageHeaderProps) => (
  <section className="space-y-3">
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
        {hasIngredients && (
          <button
            type="button"
            onClick={onClearIngredients}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Xóa dữ liệu (0)</span>
          </button>
        )}

        <button
          type="button"
          onClick={onExport}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Xuất Data (.xlsx)</span>
        </button>

        <button
          type="button"
          onClick={onSync}
          disabled={isSyncing}
          className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-indigo-600 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ Master SKU'}</span>
        </button>

        <button
          type="button"
          onClick={onAddCategory}
          className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>+ Thêm danh mục món</span>
        </button>

        <button
          type="button"
          onClick={onAddIngredient}
          className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <PackagePlus className="w-3.5 h-3.5" />
          <span>+ Thêm nguyên liệu chuẩn</span>
        </button>
      </div>
    </div>
  </section>
)
