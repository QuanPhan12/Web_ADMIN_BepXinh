import {
  BookOpen,
  Clock,
  Columns,
  Filter,
  FlaskConical,
  HeartPulse,
  Network,
  Search,
} from 'lucide-react'

export type CatalogTab = 'ingredients' | 'categories' | 'spices' | 'nutrition'

interface CatalogNavigationProps {
  activeTab: CatalogTab
  onTabChange: (tab: CatalogTab) => void
  hasIngredients: boolean
  categoryCount: number
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedGroup: string
  onGroupChange: (group: string) => void
  onNotify: (message: string) => void
}

export const CatalogNavigation = ({
  activeTab,
  onTabChange,
  hasIngredients,
  categoryCount,
  searchQuery,
  onSearchChange,
  selectedGroup,
  onGroupChange,
  onNotify,
}: CatalogNavigationProps) => (
  <>
    <section className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onTabChange('ingredients')}
          className={`px-4 py-2.5 rounded-xl font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'ingredients' ? 'bg-[#9c3808] text-white shadow-xs' : 'text-slate-700 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Từ điển Nguyên liệu Chuẩn (Master Ingredients)</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
            activeTab === 'ingredients' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {hasIngredients ? '1,420' : '0'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onTabChange('categories')
            onNotify('Xem Cây danh mục món ăn (Recipe Categories)...')
          }}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'categories' ? 'bg-[#9c3808] text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Network className="w-4 h-4 text-slate-400" />
          <span>Cây Danh mục Món ăn (Recipe Categories)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
            {categoryCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onTabChange('spices')
            onNotify('Xem Nhóm Gia vị & Nước sốt Nấu ăn...')
          }}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'spices' ? 'bg-[#9c3808] text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FlaskConical className="w-4 h-4 text-slate-400" />
          <span>Nhóm Gia vị &amp; Nước sốt Nấu ăn</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 font-bold">
            {hasIngredients ? '165' : '0'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            onTabChange('nutrition')
            onNotify('Xem Bảng Dinh dưỡng & Calo (USDA / Viện DD VN)...')
          }}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'nutrition' ? 'bg-[#9c3808] text-white shadow-xs font-black' : 'text-slate-600 hover:bg-slate-50'
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
    </section>

    <section className="space-y-3">
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Thịt ba chỉ"
              className="w-full pl-9 pr-12 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 text-xs outline-none focus:bg-white focus:border-[#9c3808]"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-200 text-slate-600">
              ⌘K
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNotify('Mở bộ lọc nâng cao thuộc tính nguyên liệu...')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Bộ lọc nâng cao</span>
            <span className="w-2 h-2 rounded-full bg-[#9c3808]" />
          </button>

          <button
            type="button"
            onClick={() => onNotify('Mở tùy chỉnh hiển thị cột dữ liệu...')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Columns className="w-3.5 h-3.5 text-slate-500" />
            <span>Tùy chỉnh cột</span>
          </button>
        </div>

        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="text-orange-600 font-bold hover:underline cursor-pointer text-xs"
          >
            Xóa tìm kiếm
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className="text-slate-400 uppercase text-[11px] mr-1">NHÓM:</span>
        {[
          { id: 'all', label: `Tất cả (${hasIngredients ? '1,420' : 0})` },
          { id: 'Thịt & Gia cầm', label: `Thịt & Gia cầm (${hasIngredients ? '182' : 0})` },
          { id: 'Thủy hải sản', label: `Thủy hải sản (${hasIngredients ? '145' : 0})` },
          { id: 'Rau củ quả tươi', label: `Rau củ quả tươi (${hasIngredients ? '342' : 0})` },
          { id: 'Gia vị & Thảo mộc', label: `Gia vị & Thảo mộc (${hasIngredients ? '285' : 0})` },
          { id: 'Đồ khô & Hạt', label: `Đồ khô & Hạt (${hasIngredients ? '210' : 0})` },
          { id: 'Sữa & Trứng', label: `Sữa & Trứng (${hasIngredients ? '78' : 0})` },
        ].map((group) => (
          <button
            key={group.id}
            type="button"
            onClick={() => onGroupChange(group.id)}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedGroup === group.id
                ? 'bg-[#9c3808] text-white shadow-2xs font-black'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {group.label}
          </button>
        ))}
      </div>
    </section>
  </>
)
