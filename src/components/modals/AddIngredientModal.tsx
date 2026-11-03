import React, { useState } from 'react'
import { X, PackagePlus, Sparkles } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ImageUploadDropzone } from '../common/ImageUploadDropzone'
import { FOOD_ILLUSTRATIONS } from '../common/foodIllustrationData'

const INGREDIENT_IMAGE_PRESETS = [
  { label: 'Thịt thăn bò tươi', url: FOOD_ILLUSTRATIONS.beef },
  { label: 'Rau củ quả sạch', url: FOOD_ILLUSTRATIONS.vegetables },
  { label: 'Cá hồi phi lê', url: FOOD_ILLUSTRATIONS.salmon },
  { label: 'Gia vị & Tiêu xanh', url: FOOD_ILLUSTRATIONS.spices },
]

interface AddIngredientModalProps {
  isOpen: boolean
  onClose: () => void
  onIngredientAdded?: (ingredient: any) => void
}

export const AddIngredientModal: React.FC<AddIngredientModalProps> = ({
  isOpen,
  onClose,
  onIngredientAdded,
}) => {
  const { showToast } = useProfile()
  const [code, setCode] = useState(`BX-ING-${Math.floor(100 + Math.random() * 899)}`)
  const [name, setName] = useState('')
  const [subName, setSubName] = useState('')
  const [group, setGroup] = useState('Thịt & Gia cầm')
  const [standardTag, setStandardTag] = useState('VietGAP')
  const [calories, setCalories] = useState(250)
  const [protein, setProtein] = useState(18.5)
  const [fat, setFat] = useState(12.0)
  const [carbs, setCarbs] = useState(1.2)
  const [refPrice, setRefPrice] = useState(150000)
  const [unit, setUnit] = useState('kg')
  const [allergen, setAllergen] = useState('Không có')
  const [image, setImage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Vui lòng nhập tên nguyên liệu chuẩn!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const newIng = {
        id: `ing-${Date.now()}`,
        code,
        name: name.trim(),
        subName: subName.trim() || 'Nguyên liệu đạt chuẩn kiểm định Bếp Xinh',
        group,
        standardTag,
        calories,
        protein,
        fat,
        carbs,
        refPrice,
        unit,
        allergen,
        coverage: '5/5 chuỗi (100%)',
        coveragePercent: 100,
        supermarkets: ['WinMart', 'Co.op', 'BHX', 'Tops', 'AEON'],
        image: image || FOOD_ILLUSTRATIONS.beef,
      }

      if (onIngredientAdded) {
        onIngredientAdded(newIng)
      }
      showToast(`Đã thêm nguyên liệu chuẩn "${name}" vào từ điển quốc gia!`)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#9c3808] flex items-center justify-center font-bold">
              <PackagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Thêm Nguyên Liệu Chuẩn Hóa</h3>
              <p className="text-xs text-slate-500">Đăng ký vào Từ điển Master Ingredients phục vụ AI tính calo & ánh xạ</p>
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
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã nguyên liệu</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-900 font-bold uppercase outline-none focus:border-[#9c3808]"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-bold text-slate-700 mb-1">
                Tên nguyên liệu chuẩn <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="VD: Thịt thăn lưng bò Úc, Cải kale xoăn..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none focus:border-[#9c3808]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô tả quy cách phẩm cấp</label>
            <input
              type="text"
              placeholder="VD: Tươi mát chuẩn Hạng A, đóng gói hút chân không 500g..."
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 outline-none focus:border-[#9c3808]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nhóm ngành hàng</label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="Thịt & Gia cầm">Thịt & Gia cầm (182)</option>
                <option value="Thủy hải sản">Thủy hải sản (145)</option>
                <option value="Rau củ quả tươi">Rau củ quả tươi (342)</option>
                <option value="Gia vị & Thảo mộc">Gia vị & Thảo mộc (285)</option>
                <option value="Đồ khô & Hạt">Đồ khô & Hạt (210)</option>
                <option value="Sữa & Trứng">Sữa & Trứng (78)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tiêu chuẩn chất lượng</label>
              <select
                value={standardTag}
                onChange={(e) => setStandardTag(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="VietGAP">VietGAP Certified</option>
                <option value="GlobalGAP">GlobalGAP</option>
                <option value="Organic">Organic Hữu Cơ</option>
                <option value="HACCP">HACCP Tiêu Chuẩn</option>
                <option value="Chỉ dẫn ĐL">Chỉ dẫn Địa lý Quốc gia</option>
                <option value="100% Raw">100% Tự nhiên Nguyên bản</option>
              </select>
            </div>
          </div>

          {/* Dinh dưỡng per 100g */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-slate-700 block">Định mức Dinh dưỡng (USDA / 100g)</span>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Năng lượng (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono font-bold bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Protein (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={protein}
                  onChange={(e) => setProtein(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono font-bold bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Lipid / Fat (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={fat}
                  onChange={(e) => setFat(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono font-bold bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 font-bold block mb-0.5">Carbs (g)</label>
                <input
                  type="number"
                  step="0.1"
                  value={carbs}
                  onChange={(e) => setCarbs(Number(e.target.value))}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* Giá tham chiếu & Dị ứng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700">Giá tham chiếu trung bình</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="text-[10px] font-bold text-slate-600 bg-slate-100 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                >
                  <option value="kg">đ/kg</option>
                  <option value="100g">đ/100g</option>
                  <option value="gói">đ/gói</option>
                  <option value="chai">đ/chai</option>
                </select>
              </div>
              <input
                type="number"
                value={refPrice}
                onChange={(e) => setRefPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-900"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Cảnh báo Dị ứng ATTP</label>
              <select
                value={allergen}
                onChange={(e) => setAllergen(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 bg-white cursor-pointer"
              >
                <option value="Không có">Không có dị ứng đặc thù</option>
                <option value="Giáp xác (Tôm, Cua)">Giáp xác (Tôm, Cua)</option>
                <option value="Đậu phộng / Hạt cây">Đậu phộng / Hạt cây</option>
                <option value="Gluten (Lúa mì)">Gluten (Lúa mì)</option>
                <option value="Sữa bò & Lactose">Sữa bò & Lactose</option>
                <option value="Đậu nành & Đậu tương">Đậu nành & Đậu tương</option>
              </select>
            </div>
          </div>

          {/* Ảnh minh họa nguyên liệu */}
          <ImageUploadDropzone
            value={image}
            onChange={(val) => setImage(val)}
            label="Ảnh minh họa nguyên liệu chuẩn"
            recommendedSize="Khuyến nghị ảnh vuông hoặc 4:3, Max 5MB"
            aspectRatio="square"
            presetImages={INGREDIENT_IMAGE_PRESETS}
          />

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-[11px]">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Hệ thống sẽ tự động tạo webhook gửi mã SKU ánh xạ tới 5 chuỗi siêu thị liên kết (WinMart, Tops, BHX, Co.op, AEON).
            </span>
          </div>

          {/* Buttons */}
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
              {isSubmitting ? 'Đang lưu...' : '+ Đăng ký nguyên liệu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
