import React, { useState } from 'react'
import { X, Cpu, CheckCircle2 } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface AiGuardConfigModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AiGuardConfigModal: React.FC<AiGuardConfigModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useProfile()
  const [imageThreshold, setImageThreshold] = useState(90)
  const [textThreshold, setTextThreshold] = useState(85)
  const [fakeRecipeThreshold, setFakeRecipeThreshold] = useState(92)
  const [autoHideEnabled, setAutoHideEnabled] = useState(true)
  const [autoAlertEmail, setAutoAlertEmail] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      showToast('Đã lưu cấu hình ngưỡng AI Guard v2.6 thành công!')
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Cấu Hình Ngưỡng Tự Động Gắn Cờ AI
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  AI Guard v2.6
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Hiệu chỉnh độ nhạy máy học để tự động phát hiện ngôn từ độc hại &amp; ảnh giả mạo
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 space-y-5 overflow-y-auto text-xs">
          {/* Slider 1: Image Copyright Threshold */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800">Ngưỡng tương đồng ảnh sao chép</span>
              <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {imageThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="99"
              value={imageThreshold}
              onChange={(e) => setImageThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Công thức có độ tương đồng ảnh từ {imageThreshold}% trở lên sẽ tự động bị chặn duyệt hoặc đưa vào hàng đợi xác minh bản quyền.
            </p>
          </div>

          {/* Slider 2: Toxic Text Sentiment Threshold */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800">Độ nhạy phân tích ngôn từ công kích</span>
              <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {textThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={textThreshold}
              onChange={(e) => setTextThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Tự động ẩn bình luận mang yếu tố xúc phạm cá nhân hoặc spam link thương mại.
            </p>
          </div>

          {/* Slider 3: Fake recipe / impossible cooking physics */}
          <div className="space-y-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="font-black text-slate-800">Ngưỡng phát hiện định mức phi thực tế</span>
              <span className="font-mono font-black text-emerald-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-xs">
                {fakeRecipeThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="75"
              max="98"
              value={fakeRecipeThreshold}
              onChange={(e) => setFakeRecipeThreshold(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">
              Cảnh báo công thức sử dụng lượng gia vị gây nguy hại sức khỏe (muối &gt; 50g/suất, độc tố tự nhiên).
            </p>
          </div>

          {/* Auto Actions Toggles */}
          <div className="space-y-2.5 pt-1">
            <span className="font-black text-slate-800 block text-xs">Quy tắc tự động thi hành</span>
            
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-800 block">Tự động tạm ẩn bài viết khi vượt ngưỡng 95%</span>
                <span className="text-[11px] text-slate-400 block">Tránh việc nội dung vi phạm hiển thị cho người dùng ứng dụng</span>
              </div>
              <input
                type="checkbox"
                checked={autoHideEnabled}
                onChange={(e) => setAutoHideEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200 accent-emerald-600 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <div className="space-y-0.5 pr-2">
                <span className="font-bold text-slate-800 block">Gửi email thông báo khẩn tới Trưởng ban Thẩm định</span>
                <span className="text-[11px] text-slate-400 block">Nhận thông báo qua alertEmail cấu hình trong Hồ sơ Admin</span>
              </div>
              <input
                type="checkbox"
                checked={autoAlertEmail}
                onChange={(e) => setAutoAlertEmail(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-200 accent-emerald-600 cursor-pointer"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Đang lưu...' : 'Áp dụng ngưỡng AI'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
