import React, { useState } from 'react'
import { X, ImagePlus, Sparkles } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ImageUploadDropzone } from '../common/ImageUploadDropzone'

interface AddBannerModalProps {
  isOpen: boolean
  onClose: () => void
  onBannerAdded?: (banner: any) => void
}

export const AddBannerModal: React.FC<AddBannerModalProps> = ({
  isOpen,
  onClose,
  onBannerAdded,
}) => {
  const { showToast } = useProfile()
  const today = new Date().toISOString().slice(0, 10)
  const nextMonth = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)

  const [title, setTitle] = useState('')
  const [slot, setSlot] = useState('Slot #1')
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(nextMonth)
  const [targetUrl, setTargetUrl] = useState('')
  const [status, setStatus] = useState<'running' | 'draft' | 'hidden'>('running')
  const [imageUrl, setImageUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Vui lòng nhập tiêu đề chiến dịch banner!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const newBanner = {
        id: `bn-${Date.now()}`,
        title: title.trim(),
        slot,
        startDate: startDate || today,
        endDate: endDate || nextMonth,
        targetUrl: targetUrl.trim() || 'https://bepxinh.vn',
        status,
        ctr: status === 'running' ? '0.0%' : '0.0%',
        clicks: '0',
        image: imageUrl || 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=80',
      }

      if (onBannerAdded) {
        onBannerAdded(newBanner)
      }
      showToast(`Đã thêm banner "${title}" vào hệ thống CMS thành công!`)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-[#9c3808] flex items-center justify-center font-bold">
              <ImagePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Thêm Banner Quảng Cáo Mới</h3>
              <p className="text-xs text-slate-500">Hiển thị trên Trang chủ Desktop 1440x480 &amp; Hero App</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ thêm banner"
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề chiến dịch / Khuyến mãi <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: Lễ hội Nồi chiên không dầu - Deal siêu hời..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none font-bold text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vị trí hiển thị (Slot)</label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                aria-label="Vị trí hiển thị Banner"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 cursor-pointer"
              >
                <option value="Slot #1">Slot #1 (Ưu tiên số 1 - Hero đầu)</option>
                <option value="Slot #2">Slot #2 (Hero thứ 2)</option>
                <option value="Slot #3">Slot #3 (Hero thứ 3)</option>
                <option value="Slot #4">Slot #4 (Khuyến mãi tuần)</option>
                <option value="Popup Banner">Popup Mở App</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Trạng thái phát hành</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                aria-label="Trạng thái phát hành banner"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 cursor-pointer"
              >
                <option value="running">● Đang chạy ngay</option>
                <option value="draft">Bản nháp / Chưa chiếu</option>
                <option value="hidden">Đã ẩn / Lưu trữ</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                aria-label="Ngày bắt đầu chiến dịch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                aria-label="Ngày kết thúc chiến dịch"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium text-slate-800 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Đường dẫn điều hướng (Target URL / Deep Link)</label>
            <input
              type="text"
              placeholder="VD: https://bepxinh.vn/khuyen-mai hoặc bepxinh://deal/123"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-800 font-mono text-[11px] focus:outline-none focus:border-[#9c3808]"
            />
          </div>

          <ImageUploadDropzone
            value={imageUrl}
            onChange={(val) => setImageUrl(val)}
            label="Chọn ảnh Banner quảng cáo từ thiết bị"
            recommendedSize="Khuyến nghị 1440 × 480 px (Tỷ lệ 3:1 hoặc 16:9), Max 5MB"
            aspectRatio="banner"
          />

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2 text-amber-900 text-[11px] leading-relaxed">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Khuyến nghị kích thước: <strong>1440 × 480 px (Max 2MB)</strong>. Banner sẽ tự động tối ưu hóa WebP và kích hoạt tracking tỷ lệ nhấp (CTR).
            </span>
          </div>

          {/* Buttons */}
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
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang tạo...' : '+ Xác nhận đăng banner'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
