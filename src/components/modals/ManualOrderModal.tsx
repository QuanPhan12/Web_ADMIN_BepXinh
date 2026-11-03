import React, { useState } from 'react'
import { X, PlusCircle, Store, User, Utensils, DollarSign, FileText, CheckCircle2 } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface ManualOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onOrderCreated?: (order: {
    code: string
    supermarket: string
    customerName: string
    customerPhone: string
    recipeName: string
    skuCount: number
    totalAmount: number
    reason: string
  }) => void
}

export const ManualOrderModal: React.FC<ManualOrderModalProps> = ({
  isOpen,
  onClose,
  onOrderCreated,
}) => {
  const { showToast } = useProfile()
  const [supermarket, setSupermarket] = useState('WinMart Landmark 81 (#WM-VN-884)')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [recipeName, setRecipeName] = useState('Sườn nướng sốt BBQ Hàn Quốc')
  const [skuCount, setSkuCount] = useState(4)
  const [amount, setAmount] = useState('12000')
  const [reason, setReason] = useState('price_discrepancy')
  const [note, setNote] = useState('Bù phần chênh lệch giá niêm yết tại siêu thị WinMart chưa đồng bộ API Webhook.')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) {
      showToast('Vui lòng nhập tên khách hàng nhận đơn bù!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const newCode = `#BX-ORD-2024-${Math.floor(93000 + Math.random() * 999)}`
      showToast(`Đã tạo thành công đơn bù thủ công ${newCode}!`)
      if (onOrderCreated) {
        onOrderCreated({
          code: newCode,
          supermarket,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim() || '0900.000.000',
          recipeName,
          skuCount,
          totalAmount: parseInt(amount, 10) || 12000,
          reason,
        })
      }
      onClose()
      setCustomerName('')
      setCustomerPhone('')
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 text-[#9c3808] flex items-center justify-center shrink-0 shadow-2xs">
              <PlusCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Tạo Đơn Bù Đi Chợ Thủ Công
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bù trừ chênh lệch giá, xuất thiếu hàng hoặc hóa đơn đối soát phát sinh
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {/* Supermarket Partner */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>Chuỗi siêu thị đối tác liên kết <span className="text-rose-600">*</span></span>
            </label>
            <select
              value={supermarket}
              onChange={(e) => setSupermarket(e.target.value)}
              className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#9c3808] outline-none transition-all cursor-pointer font-medium"
            >
              <option value="WinMart Landmark 81 (#WM-VN-884)">WinMart Landmark 81 (#WM-VN-884)</option>
              <option value="WinMart+ Thảo Điền (#WM-VN-302)">WinMart+ Thảo Điền (#WM-VN-302)</option>
              <option value="Tops Market An Phú (#TM-HCM-09)">Tops Market An Phú (#TM-HCM-09)</option>
              <option value="Co.op Food Sala (#CF-Q2-114)">Co.op Food Sala (#CF-Q2-114)</option>
              <option value="Bách Hóa Xanh Mai Chí Thọ (#BHX-882)">Bách Hóa Xanh Mai Chí Thọ (#BHX-882)</option>
            </select>
          </div>

          {/* Customer info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Khách hàng nhận đơn bù <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="VD: Lê Thu Trang"
                required
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span>Số điện thoại</span>
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0912.xxx.xxx"
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] outline-none transition-all"
              />
            </div>
          </div>

          {/* Recipe and SKU */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Utensils className="w-3.5 h-3.5 text-slate-400" />
                <span>Món ăn / Công thức liên kết</span>
              </label>
              <input
                type="text"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <span>Số lượng SKU nguyên liệu</span>
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={skuCount}
                onChange={(e) => setSkuCount(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] outline-none transition-all"
              />
            </div>
          </div>

          {/* Amount and Reason */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                <span>Giá trị đơn bù (VNĐ) <span className="text-rose-600">*</span></span>
              </label>
              <input
                type="text"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full text-xs font-mono font-bold text-rose-700 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Lý do lập đơn bù</span>
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#9c3808] outline-none transition-all cursor-pointer font-medium"
              >
                <option value="price_discrepancy">Lệch giá niêm yết siêu thị</option>
                <option value="missing_item">Siêu thị xuất thiếu hàng</option>
                <option value="spoiled_food">Hư hỏng / Dập nát khi giao</option>
                <option value="pos_error">Lỗi phần mềm POS đối tác</option>
              </select>
            </div>
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700">
              Ghi chú hạch toán đối soát:
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] outline-none transition-all resize-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-[11px] text-blue-900 leading-relaxed flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Đơn bù sẽ được tự động đồng bộ hóa vào kỳ đối soát chu kỳ tuần này và trừ vào công nợ siêu thị.</span>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang hạch toán...' : 'Xác nhận tạo đơn bù'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
