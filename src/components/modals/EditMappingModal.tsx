import React, { useState } from 'react'
import { X, Sliders } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface EditMappingModalProps {
  isOpen: boolean
  onClose: () => void
  ingredient: any
  onSaved?: (updated: any) => void
}

export const EditMappingModal: React.FC<EditMappingModalProps> = ({
  isOpen,
  onClose,
  ingredient,
  onSaved,
}) => {
  const { showToast } = useProfile()
  const [portionMin, setPortionMin] = useState(150)
  const [portionMax, setPortionMax] = useState(200)
  const [dietaryLabel, setDietaryLabel] = useState('Low-Carb / Keto')
  const [refPrice, setRefPrice] = useState(ingredient?.refPrice || 185000)
  const [winmartSku, setWinmartSku] = useState('LST-MEAT-921')
  const [winmartRate] = useState(100)
  const [coopSku, setCoopSku] = useState('CPF-PORK-402')
  const [coopRate] = useState(100)
  const [topsSku, setTopsSku] = useState('TOP-3341')
  const [topsRate] = useState(98)
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen || !ingredient) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      showToast(`Đã cập nhật quy tắc dinh dưỡng & ánh xạ siêu thị cho "${ingredient.name}"!`)
      if (onSaved) {
        onSaved({
          ...ingredient,
          refPrice,
          portion: `${portionMin}g - ${portionMax}g`,
          dietaryLabel,
        })
      }
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-[#9c3808] flex items-center justify-center font-bold">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Cấu hình Ánh xạ & Quy tắc Dinh dưỡng</h3>
              <p className="text-xs text-slate-500">{ingredient.name} ({ingredient.code})</p>
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

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Section 1: Quy tắc dinh dưỡng */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-extrabold text-slate-800 block">Quy tắc Khẩu phần & Lối sống</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Định mức 1 khẩu phần (min - max gram)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={portionMin}
                    onChange={(e) => setPortionMin(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={portionMax}
                    onChange={(e) => setPortionMax(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-mono font-bold"
                  />
                  <span className="font-bold text-slate-500">gram</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nhãn ăn kiêng tương thích</label>
                <select
                  value={dietaryLabel}
                  onChange={(e) => setDietaryLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 cursor-pointer"
                >
                  <option value="Low-Carb / Keto">Low-Carb / Keto</option>
                  <option value="High-Protein / Gym">High-Protein / Gym</option>
                  <option value="Dinh dưỡng Cơm mẹ nấu">Dinh dưỡng Cơm mẹ nấu</option>
                  <option value="Eat Clean / Healthy">Eat Clean / Healthy</option>
                  <option value="Thuần chay Vegan">Thuần chay Vegan</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Giá thị trường tham chiếu (VNĐ / kg)</label>
              <input
                type="number"
                value={refPrice}
                onChange={(e) => setRefPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Section 2: Ánh xạ SKU Siêu thị đối tác */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="font-extrabold text-slate-800 block">Ánh xạ SKU Chuỗi Siêu thị Đối tác</span>
            
            {/* WinMart */}
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-rose-50 text-rose-700 font-black text-[10px]">WM+</span>
                <div>
                  <span className="font-bold text-slate-800 block">WinMart+ Phổ Thông</span>
                  <input
                    type="text"
                    value={winmartSku}
                    onChange={(e) => setWinmartSku(e.target.value)}
                    className="text-[11px] font-mono text-slate-600 border-b border-slate-200 outline-none w-36"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Khớp {winmartRate}%
                </span>
              </div>
            </div>

            {/* Co.op Food */}
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-amber-50 text-amber-700 font-black text-[10px]">CPF</span>
                <div>
                  <span className="font-bold text-slate-800 block">Co.op Food Meat Deli</span>
                  <input
                    type="text"
                    value={coopSku}
                    onChange={(e) => setCoopSku(e.target.value)}
                    className="text-[11px] font-mono text-slate-600 border-b border-slate-200 outline-none w-36"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Khớp {coopRate}%
                </span>
              </div>
            </div>

            {/* Tops Market */}
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-black text-[10px]">TOP</span>
                <div>
                  <span className="font-bold text-slate-800 block">Tops Market Fresh Cut</span>
                  <input
                    type="text"
                    value={topsSku}
                    onChange={(e) => setTopsSku(e.target.value)}
                    className="text-[11px] font-mono text-slate-600 border-b border-slate-200 outline-none w-36"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                  Khớp {topsRate}%
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSaving ? 'Đang lưu...' : 'Lưu Thay Đổi Ánh Xạ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
