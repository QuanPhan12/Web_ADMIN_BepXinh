import React, { useState } from 'react'
import { X, FolderPlus, Sparkles } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onCategoryAdded?: (category: {
    name: string
    parentGroup: string
    code: string
    itemCount: number
    dietaryTag: string
  }) => void
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryAdded,
}) => {
  const { showToast } = useProfile()
  const [categoryName, setCategoryName] = useState('')
  const [parentGroup, setParentGroup] = useState('Ẩm thực Cơm gia đình')
  const [categoryCode, setCategoryCode] = useState('CAT-HOME-')
  const [dietaryTag, setDietaryTag] = useState('Tiết kiệm / Đưa cơm')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      showToast('Vui lòng nhập tên danh mục món ăn!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const fullCode = categoryCode.endsWith('-')
        ? `${categoryCode}${Math.floor(100 + Math.random() * 900)}`
        : categoryCode

      if (onCategoryAdded) {
        onCategoryAdded({
          name: categoryName.trim(),
          parentGroup,
          code: fullCode,
          itemCount: 0,
          dietaryTag,
        })
      }
      showToast(`Đã thêm danh mục "${categoryName}" vào cây phân loại thành công!`)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#9c3808] flex items-center justify-center font-bold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Thêm Danh mục Món ăn Mới</h3>
              <p className="text-xs text-slate-500">Phân nhánh Taxonomy cho hệ thống tìm kiếm thông minh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tên danh mục món ăn <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Món om chuối đậu, Canh chua thanh nhiệt..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none font-medium text-slate-800 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Thuộc nhóm gốc (Root)</label>
              <select
                value={parentGroup}
                onChange={(e) => setParentGroup(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="Ẩm thực Cơm gia đình">Ẩm thực Cơm gia đình (245 món)</option>
                <option value="Thực dưỡng & Eat Clean">Thực dưỡng & Eat Clean (128 món)</option>
                <option value="Lẩu & Tiệc Cuối Tuần">Lẩu & Tiệc Cuối Tuần (75 món)</option>
                <option value="Món cuốn & Bánh truyền thống">Món cuốn & Bánh truyền thống (45 món)</option>
                <option value="Ăn vặt & Giải khát">Ăn vặt & Giải khát (92 món)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã định danh (Code Prefix)</label>
              <input
                type="text"
                value={categoryCode}
                onChange={(e) => setCategoryCode(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none font-mono text-slate-800 text-xs uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Thẻ dinh dưỡng & Lối sống (Tag)</label>
            <div className="grid grid-cols-3 gap-2">
              {['Tiết kiệm / Đưa cơm', 'Low-Carb / Keto', 'Thuần chay / Healthy', 'Giàu Protein', 'Nhanh dưới 20p', 'Giải nhiệt'].map(
                (tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setDietaryTag(tag)}
                    className={`px-2.5 py-2 rounded-xl text-center font-bold text-[11px] border transition-all cursor-pointer ${
                      dietaryTag === tag
                        ? 'bg-orange-50 border-[#9c3808] text-[#9c3808]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {tag}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô tả hành vi tìm kiếm của người dùng</label>
            <textarea
              rows={2}
              placeholder="VD: Phù hợp bữa tối gia đình 3-4 người, chuẩn bị dưới 30 phút..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none text-slate-700 text-xs resize-none"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-900 text-[11px] leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Danh mục mới sẽ lập tức xuất hiện trong bộ gợi ý thông minh của ứng dụng di động Bếp Xinh và quy tắc gom nhóm đi chợ.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang tạo...' : '+ Xác nhận tạo danh mục'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
