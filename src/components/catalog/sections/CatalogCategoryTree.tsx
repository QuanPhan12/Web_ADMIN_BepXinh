import { FolderPlus, Network } from 'lucide-react'
import type { Category } from '../../../models/catalogs/categories.model'

interface CatalogCategoryTreeProps {
  categories: Category[]
  isLoading: boolean
  error: string
  onAddCategory: () => void
  onNotify: (message: string) => void
}

export const CatalogCategoryTree = ({
  categories,
  isLoading,
  error,
  onAddCategory,
  onNotify,
}: CatalogCategoryTreeProps) => {
  const sortedCategories = [...categories].sort((a, b) => a.sortOrder - b.sortOrder)

  return (
    <section className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 space-y-3.5 text-xs">
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

      {isLoading ? (
        <div className="p-6 text-center text-xs text-slate-500">Đang tải danh mục...</div>
      ) : error ? (
        <div role="alert" className="p-6 text-center text-xs text-rose-600">{error}</div>
      ) : sortedCategories.length > 0 ? (
        <div className="space-y-2 text-xs">
          {sortedCategories.map((category) => (
            <div
              key={category.id}
              className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between font-bold text-slate-700"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-700">📁</span>
                <span>{category.name}</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">#{category.sortOrder}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center space-y-2.5 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
          <div className="text-2xl">🌱</div>
          <div className="text-xs font-bold text-slate-700">Cây danh mục ẩm thực chưa có nhánh</div>
          <p className="text-[11px] text-slate-400">0 phân nhánh đã cấu hình</p>
          <button
            type="button"
            onClick={onAddCategory}
            className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs inline-flex items-center gap-1 cursor-pointer"
          >
            <FolderPlus className="w-3.5 h-3.5 text-[#9c3808]" />
            <span>+ Thêm danh mục món đầu tiên</span>
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => onNotify(sortedCategories.length
          ? `Đang hiển thị ${sortedCategories.length} danh mục mẫu.`
          : 'Cây danh mục ẩm thực hiện chưa có dữ liệu nhánh.')}
        className="w-full py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <Network className="w-3.5 h-3.5 text-slate-500" />
        <span>Quản lý Cây Danh mục Chi tiết ({sortedCategories.length} nhóm)</span>
      </button>
    </section>
  )
}
