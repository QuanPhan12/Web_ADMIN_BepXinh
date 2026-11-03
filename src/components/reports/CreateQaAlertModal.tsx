import React, { useState } from 'react'
import { X, Bell, AlertTriangle, Send } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface CreateQaAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onAlertCreated?: (alertData: any) => void
}

export const CreateQaAlertModal: React.FC<CreateQaAlertModalProps> = ({
  isOpen,
  onClose,
  onAlertCreated,
}) => {
  const { showToast, addNotification } = useProfile()
  const [title, setTitle] = useState('')
  const [targetGroup, setTargetGroup] = useState('all')
  const [severity, setSeverity] = useState<'standard' | 'important' | 'critical'>('important')
  const [category, setCategory] = useState('copyright')
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      showToast('Vui lòng nhập đầy đủ tiêu đề và nội dung cảnh báo!')
      return
    }

    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      addNotification({
        title: `[CẢNH BÁO QA] ${title}`,
        category: severity === 'critical' ? 'urgent' : 'policy',
        targetAudience: targetGroup === 'creators' ? 'chefs' : 'all',
        branchScope: 'Toàn quốc (0 Chi Nhánh)',
        channels: ['push', 'banner', 'email'],
        content,
        priority: severity === 'critical' ? 'high' : 'normal',
        sendMode: 'now',
      })
      if (onAlertCreated) {
        onAlertCreated({ title, targetGroup, severity, category, content })
      }
      showToast('Đã phát hành cảnh báo tuân thủ QA tới toàn bộ hệ thống!')
      onClose()
      setTitle('')
      setContent('')
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 to-amber-50/50 border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9c3808] text-white flex items-center justify-center shadow-xs shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Tạo Cảnh Báo Tuân Thủ &amp; QA
              </h3>
              <p className="text-xs text-slate-500">
                Phát lệnh cảnh báo chất lượng nội dung &amp; văn hóa cộng đồng Bếp Xinh
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto text-xs">
          {/* Alert Title */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 flex items-center justify-between">
              <span>Tiêu đề thông báo cảnh báo <span className="text-rose-500">*</span></span>
              <span className="text-[11px] text-slate-400 font-normal">{title.length}/100</span>
            </label>
            <input
              type="text"
              required
              maxLength={100}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cảnh báo nghiêm ngặt về việc sao chép hình ảnh ẩm thực..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] focus:ring-2 focus:ring-orange-100 outline-none text-xs font-semibold text-slate-800"
            />
          </div>

          {/* Target & Severity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Target Group */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Đối tượng nhận cảnh báo</label>
              <select
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer bg-white"
              >
                <option value="all">Toàn bộ tác giả &amp; độc giả</option>
                <option value="creators">Chỉ Đầu bếp &amp; Creator Pro</option>
                <option value="readers">Độc giả &amp; Người mua hàng</option>
                <option value="unverified">Tài khoản chưa định danh</option>
              </select>
            </div>

            {/* Severity */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Mức độ cảnh báo</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer bg-white"
              >
                <option value="standard">Tiêu chuẩn (Thông báo thường)</option>
                <option value="important">Quan trọng (Banner vàng)</option>
                <option value="critical">Khẩn cấp (Popup đỏ bắt buộc xem)</option>
              </select>
            </div>
          </div>

          {/* Violation Category */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Nhóm hành vi vi phạm trọng tâm</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'copyright', label: 'Bản quyền ảnh' },
                { id: 'food_safety', label: 'Vệ sinh ATTP' },
                { id: 'hate_speech', label: 'Ngôn từ xúc phạm' },
                { id: 'spam', label: 'Quảng cáo rác' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCategory(item.id)}
                  className={`py-2 px-2.5 rounded-xl text-center font-bold transition-all cursor-pointer border ${
                    category === item.id
                      ? 'bg-orange-50 border-[#9c3808] text-[#9c3808] shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">
              Chi tiết hướng dẫn tuân thủ &amp; chế tài <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung nhắc nhở, trích dẫn điều khoản Tiêu chuẩn Cộng đồng 2025 và mức phạt áp dụng nếu tái phạm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] focus:ring-2 focus:ring-orange-100 outline-none text-xs text-slate-800 leading-relaxed resize-none"
            />
          </div>

          {/* Notice box */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
              Thông báo này sẽ được gắn cờ ưu tiên cao trong <strong>Trung tâm Thông báo</strong> và gửi Push Notification tức thời tới ứng dụng di động Bếp Xinh.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSending ? 'Đang gửi...' : 'Phát hành cảnh báo QA'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
