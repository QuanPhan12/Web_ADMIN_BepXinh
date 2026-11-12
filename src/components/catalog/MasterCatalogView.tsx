import React, { useEffect, useState } from 'react'
import {
  PackagePlus,
  BookOpen,
  CheckCircle2,
  Sliders,
  TrendingDown,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { AddCategoryModal } from '../modals/AddCategoryModal'
import { AddIngredientModal } from '../modals/AddIngredientModal'
import { EditMappingModal } from '../modals/EditMappingModal'
import { catalogsRepository } from '../../repositories/catelogs.repository'
import type { Category } from '../../models/catalogs/categories.model'
import { CatalogCategoryTree } from './sections/CatalogCategoryTree'
import { CatalogNavigation, type CatalogTab } from './sections/CatalogNavigation'
import { CatalogPageHeader } from './sections/CatalogPageHeader'
import { CatalogSummaryCards } from './sections/CatalogSummaryCards'

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
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [activeIngredientId, setActiveIngredientId] = useState<string>('')
  const [activeMainTab, setActiveMainTab] = useState<CatalogTab>('ingredients')
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

  useEffect(() => {
    let isMounted = true

    catalogsRepository.getAll()
      .then((result) => {
        if (isMounted) setCategories(result)
      })
      .catch((error: unknown) => {
        console.error('Error loading categories:', error)
        if (isMounted) setCategoriesError('Không thể tải danh mục. Vui lòng thử lại sau.')
      })
      .finally(() => {
        if (isMounted) setIsLoadingCategories(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

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

      <CatalogPageHeader
        hasIngredients={hasData}
        isSyncing={isSyncing}
        onClearIngredients={() => {
          setIngredients([])
          setActiveIngredientId('')
          setSelectedIds([])
          showToast('Đã xóa toàn bộ từ điển danh mục & nguyên liệu, đặt lại là 0!')
        }}
        onExport={() => showToast('Đang xuất toàn bộ từ điển Master Catalog (.xlsx)...')}
        onSync={handleSyncMasterSKU}
        onAddCategory={() => setIsAddCategoryOpen(true)}
        onAddIngredient={() => setIsAddIngredientOpen(true)}
      />

      <CatalogSummaryCards
        hasIngredients={hasData}
        categoryCount={categories.length}
        isLoadingCategories={isLoadingCategories}
      />

      <CatalogNavigation
        activeTab={activeMainTab}
        onTabChange={setActiveMainTab}
        hasIngredients={hasData}
        categoryCount={categories.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
        onNotify={showToast}
      />

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

          <CatalogCategoryTree
            categories={categories}
            isLoading={isLoadingCategories}
            error={categoriesError}
            onAddCategory={() => setIsAddCategoryOpen(true)}
            onNotify={showToast}
          />
        </div>
      </div>
    </div>
  )
}
