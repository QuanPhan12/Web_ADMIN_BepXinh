import React, { useState } from 'react'
import {
  X,
  Megaphone,
  Bell,
  Smartphone,
  Globe,
  Mail,
  MessageSquare,
  AlertTriangle,
  Sparkles,
  Send,
  CheckCircle2,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import type { BroadcastNotification } from '../../types'
import { BepXinhLogo } from '../icons/BepXinhLogo'

interface CreateNotificationModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CreateNotificationModal: React.FC<CreateNotificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addNotification } = useProfile()

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<BroadcastNotification['category']>('urgent')
  const [targetAudience, setTargetAudience] = useState<BroadcastNotification['targetAudience']>('all')
  const [branchScope, setBranchScope] = useState('Toàn quốc (0 Chi Nhánh)')
  const [channels, setChannels] = useState<('push' | 'banner' | 'email' | 'sms')[]>(['push', 'banner'])
  const [content, setContent] = useState('')
  const [actionLabel, setActionLabel] = useState('Xem chi tiết')
  const [actionUrl, setActionUrl] = useState('')
  const [priority, setPriority] = useState<BroadcastNotification['priority']>('high')
  const [sendMode, setSendMode] = useState<'now' | 'scheduled'>('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  // Preview Mode
  const [previewTab, setPreviewTab] = useState<'mobile' | 'inapp'>('mobile')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  // Quick Template Auto-fill
  const applyTemplate = (templateType: 'maintenance' | 'contest' | 'copyright') => {
    if (templateType === 'maintenance') {
      setTitle('Bảo trì kết nối Webhook API WinMart & Tops Market')
      setCategory('urgent')
      setTargetAudience('partners')
      setChannels(['push', 'banner', 'email'])
      setContent('Từ 01:00 đến 03:00 sáng ngày 30/10, hệ thống Bếp Xinh sẽ tiến hành nâng cấp Gateway API v3.2. Quá trình đồng bộ SKU và giá giỏ đi chợ có thể bị gián đoạn cục bộ.')
      setActionLabel('Kiểm tra cổng API')
      setActionUrl('/partners')
      setPriority('high')
    } else if (templateType === 'contest') {
      setTitle('Phát động Thử Thách Sáng Tạo Master Chef: Hương Vị Mùa Thu')
      setCategory('event')
      setTargetAudience('chefs')
      setChannels(['push', 'banner'])
      setContent('Mời toàn thể Master Chef và Creator tham gia cuộc thi công thức món ấm mùa thu 2026. Tổng giải thưởng 45 triệu VNĐ cùng quyền lợi mở giỏ tiếp thị nguyên liệu liên kết!')
      setActionLabel('Đăng ký tham gia')
      setActionUrl('/events/master-chef')
      setPriority('normal')
    } else if (templateType === 'copyright') {
      setTitle('Cập nhật Tiêu Chuẩn Thẩm Định Hình Ảnh & Bản Quyền AI')
      setCategory('policy')
      setTargetAudience('all')
      setChannels(['push', 'banner'])
      setContent('Hệ thống AI Quality Vision sẽ tự động từ chối các công thức sử dụng ảnh stock chưa qua xử lý hoặc trùng lặp bản quyền từ ngày 01/11/2026. Vui lòng sử dụng ảnh chụp thực tế quá trình nấu.')
      setActionLabel('Đọc quy định chi tiết')
      setActionUrl('/guidelines/copyright')
      setPriority('normal')
    }
  }

  // Channel toggle helper
  const toggleChannel = (channel: 'push' | 'banner' | 'email' | 'sms') => {
    setChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo!')
      return
    }

    if (channels.length === 0) {
      alert('Vui lòng chọn ít nhất 1 kênh phát sóng thông báo!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      addNotification({
        title: title.trim(),
        category,
        targetAudience,
        branchScope,
        channels,
        content: content.trim(),
        actionLabel: actionLabel.trim() || undefined,
        actionUrl: actionUrl.trim() || undefined,
        priority,
        sendMode,
        scheduledTime: sendMode === 'scheduled' ? `${scheduledDate} ${scheduledTime}` : undefined,
      })

      setIsSubmitting(false)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-50 border border-orange-200 text-[#9c3808] flex items-center justify-center shadow-xs">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Tạo Thông Báo Mới Toàn Hệ Thống
                </h2>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Broadcast Center v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Soạn thảo và điều phối phát sóng thông báo đa kênh tới người dùng, đầu bếp và đối tác siêu thị.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-50/40">
          {/* Left Form: 7 Columns */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-100 shadow-2xs">
            {/* Quick Templates Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                Mẫu soạn thảo nhanh (Quick Templates)
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate('maintenance')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold text-slate-700 transition-all border border-slate-200 cursor-pointer"
                >
                  🚨 Bảo trì API Siêu thị
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('contest')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-xs font-semibold text-slate-700 transition-all border border-slate-200 cursor-pointer"
                >
                  🏆 Cuộc thi Master Chef
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate('copyright')}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-xs font-semibold text-slate-700 transition-all border border-slate-200 cursor-pointer"
                >
                  📜 Bản quyền AI Vision
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Tiêu đề thông báo <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{title.length}/100 ký tự</span>
              </div>
              <input
                type="text"
                required
                maxLength={100}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="VD: Cập nhật đồng bộ giá nguyên liệu WinMart & Tops Market"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all font-medium text-slate-900 bg-white"
              />
            </div>

            {/* Category & Priority Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Phân loại thông báo
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BroadcastNotification['category'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="urgent">🚨 Khẩn cấp / Cảnh báo hệ thống</option>
                  <option value="feature">🚀 Tính năng &amp; Vận hành</option>
                  <option value="event">🏆 Sự kiện &amp; Thử thách Creator</option>
                  <option value="policy">📜 Chính sách &amp; Bản quyền</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Mức độ ưu tiên
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as BroadcastNotification['priority'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="high">🔴 Cao (Ghim đầu trang &amp; Báo chuông)</option>
                  <option value="normal">🟡 Bình thường (Tiêu chuẩn)</option>
                  <option value="low">⚪ Thấp (Thông tin lưu trữ)</option>
                </select>
              </div>
            </div>

            {/* Target Audience & Branch Scope */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Đối tượng nhận tin
                </label>
                <select
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value as BroadcastNotification['targetAudience'])}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="all">👥 Tất cả người dùng &amp; Độc giả</option>
                  <option value="chefs">👨‍🍳 Chỉ Đầu bếp &amp; Creator</option>
                  <option value="partners">🛒 Đối tác Siêu thị &amp; API SKU</option>
                  <option value="internal">🛡️ Ban Quản trị Nội bộ &amp; Kiểm duyệt</option>
                </select>
              </div>

              {/* Branch Scope */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Phạm vi chi nhánh
                </label>
                <select
                  value={branchScope}
                  onChange={(e) => setBranchScope(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-800 outline-none focus:border-orange-500 cursor-pointer"
                >
                  <option value="Toàn quốc (0 Chi Nhánh)">Toàn quốc (0 Chi Nhánh)</option>
                  <option value="Miền Bắc - Hà Nội (0 Chi Nhánh)">Miền Bắc - Hà Nội (0 Chi Nhánh)</option>
                  <option value="Miền Nam - TP.HCM (0 Chi Nhánh)">Miền Nam - TP.HCM (0 Chi Nhánh)</option>
                  <option value="Miền Trung - Đà Nẵng (0 Chi Nhánh)">Miền Trung - Đà Nẵng (0 Chi Nhánh)</option>
                </select>
              </div>
            </div>

            {/* Delivery Channels */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Kênh phát sóng đa nền tảng <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => toggleChannel('push')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    channels.includes('push')
                      ? 'bg-orange-50/80 border-[#9c3808] text-[#9c3808]'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Push Mobile</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel('banner')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    channels.includes('banner')
                      ? 'bg-orange-50/80 border-[#9c3808] text-[#9c3808]'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span>Banner In-App</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel('email')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    channels.includes('email')
                      ? 'bg-orange-50/80 border-[#9c3808] text-[#9c3808]'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email Broadcast</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleChannel('sms')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all cursor-pointer ${
                    channels.includes('sms')
                      ? 'bg-orange-50/80 border-[#9c3808] text-[#9c3808]'
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Zalo ZNS / SMS</span>
                </button>
              </div>
            </div>

            {/* Content Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800">
                  Nội dung chi tiết thông báo <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">{content.length}/500 ký tự</span>
              </div>
              <textarea
                required
                rows={4}
                maxLength={500}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung thông báo chi tiết gửi tới toàn bộ thành viên..."
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all font-medium text-slate-900 bg-white resize-none"
              />
            </div>

            {/* Action CTA Link (Optional) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Nhãn nút hành động (CTA)
                </label>
                <input
                  type="text"
                  value={actionLabel}
                  onChange={(e) => setActionLabel(e.target.value)}
                  placeholder="VD: Xem chi tiết"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Đường dẫn liên kết (URL / Deep Link)
                </label>
                <input
                  type="text"
                  value={actionUrl}
                  onChange={(e) => setActionUrl(e.target.value)}
                  placeholder="VD: https://bepxinh.vn/events/tet"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white font-medium font-mono text-[11px]"
                />
              </div>
            </div>

            {/* Send Timing */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Thời gian phát thông báo
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sendMode"
                    checked={sendMode === 'now'}
                    onChange={() => setSendMode('now')}
                    className="accent-orange-600"
                  />
                  <span>⚡ Phát ngay lập tức</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="sendMode"
                    checked={sendMode === 'scheduled'}
                    onChange={() => setSendMode('scheduled')}
                    className="accent-orange-600"
                  />
                  <span>⏰ Lên lịch gửi sau</span>
                </label>
              </div>

              {sendMode === 'scheduled' && (
                <div className="flex items-center gap-3 mt-3">
                  <input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  />
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                  />
                </div>
              )}
            </div>
          </form>

          {/* Right Column: Live Mockup Preview: 5 Columns */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Xem Trước Hiển Thị Trực Quan</span>
              </span>

              {/* Preview Toggle Tabs */}
              <div className="bg-white p-0.5 rounded-xl border border-slate-200 flex text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setPreviewTab('mobile')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    previewTab === 'mobile' ? 'bg-[#9c3808] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📱 Mobile Push
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab('inapp')}
                  className={`px-2.5 py-1 rounded-lg cursor-pointer transition-all ${
                    previewTab === 'inapp' ? 'bg-[#9c3808] text-white shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📢 In-App Banner
                </button>
              </div>
            </div>

            {/* Mobile Lockscreen Mockup */}
            {previewTab === 'mobile' && (
              <div className="bg-slate-900 rounded-3xl p-5 text-white shadow-xl border border-slate-800 relative overflow-hidden">
                {/* Smartphone Notch / Top */}
                <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-4 opacity-75"></div>

                {/* Clock header */}
                <div className="text-center mb-6">
                  <div className="text-3xl font-light tracking-tight font-mono">09:41</div>
                  <div className="text-[11px] text-slate-400">Thứ Năm, 29 tháng 10</div>
                </div>

                {/* Push Notification Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 space-y-2 text-xs">
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#9c3808] flex items-center justify-center p-0.5">
                        <BepXinhLogo className="w-full h-full text-white" />
                      </div>
                      <span className="font-extrabold text-[11px] uppercase tracking-wide text-slate-200">
                        Bếp Xinh
                      </span>
                      <span className="text-[10px] text-slate-400">• Vừa xong</span>
                    </div>

                    <span
                      className={`text-[9px] font-black px-1.5 py-0.2 rounded uppercase ${
                        category === 'urgent'
                          ? 'bg-rose-500/30 text-rose-300'
                          : category === 'event'
                          ? 'bg-emerald-500/30 text-emerald-300'
                          : category === 'policy'
                          ? 'bg-purple-500/30 text-purple-300'
                          : 'bg-blue-500/30 text-blue-300'
                      }`}
                    >
                      {category === 'urgent'
                        ? 'Khẩn'
                        : category === 'event'
                        ? 'Sự kiện'
                        : category === 'policy'
                        ? 'Quy định'
                        : 'Tính năng'}
                    </span>
                  </div>

                  {/* Title & Content */}
                  <div>
                    <h4 className="font-bold text-white text-xs leading-snug">
                      {title || 'Tiêu đề thông báo mẫu sẽ hiển thị tại đây...'}
                    </h4>
                    <p className="text-[11px] text-slate-300 line-clamp-3 mt-1 leading-relaxed">
                      {content || 'Nội dung chi tiết của bản tin thông báo gửi đến người dùng và các đối tác liên quan trong hệ thống Bếp Xinh.'}
                    </p>
                  </div>

                  {/* CTA button inside push */}
                  {actionLabel && (
                    <div className="pt-1.5 flex justify-end">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:underline">
                        <span>{actionLabel}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-center text-slate-500 mt-6">
                  Mô phỏng hiển thị trên iOS &amp; Android Push Notifications
                </div>
              </div>
            )}

            {/* In-App Banner Mockup */}
            {previewTab === 'inapp' && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xl space-y-4">
                <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Mô phỏng Banner Đầu Trang Web/App</span>
                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                    Live In-App
                  </span>
                </div>

                {/* Banner Box */}
                <div
                  className={`p-4 rounded-2xl border space-y-2.5 ${
                    category === 'urgent'
                      ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                      : category === 'event'
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : category === 'policy'
                      ? 'bg-purple-50/70 border-purple-200 text-purple-950'
                      : 'bg-blue-50/70 border-blue-200 text-blue-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                          category === 'urgent'
                            ? 'bg-rose-500 text-white'
                            : category === 'event'
                            ? 'bg-emerald-500 text-white'
                            : category === 'policy'
                            ? 'bg-purple-500 text-white'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {category === 'urgent' ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : category === 'event' ? (
                          <Sparkles className="w-4 h-4" />
                        ) : category === 'policy' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <Bell className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs leading-tight">
                          {title || 'Tiêu đề thông báo in-app'}
                        </h4>
                        <div className="text-[10px] opacity-75 mt-0.5">
                          Gửi tới: {targetAudience === 'all' ? 'Tất cả thành viên' : targetAudience} • {branchScope}
                        </div>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-[11px] leading-relaxed opacity-90">
                    {content || 'Nội dung thông báo thông tin quan trọng sẽ được ghim nổi bật tại khu vực này.'}
                  </p>

                  {actionLabel && (
                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-900 text-white text-[11px] font-bold hover:bg-slate-800 transition-colors"
                      >
                        <span>{actionLabel}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Audit summary */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] space-y-1 text-slate-500">
                  <div className="flex justify-between">
                    <span>Kênh phát:</span>
                    <strong className="text-slate-800 uppercase">{channels.join(', ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Độ ưu tiên:</span>
                    <strong className="text-slate-800 capitalize">{priority}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Thời gian gửi:</span>
                    <strong className="text-slate-800">{sendMode === 'now' ? 'Tức thì' : 'Lên lịch'}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Thông báo sẽ được ký số bảo mật bởi Super Admin</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Huỷ bỏ
            </button>

            <button
              type="button"
              onClick={() => {
                alert('Đã lưu bản nháp thông báo vào hệ thống!')
                onClose()
              }}
              className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Lưu bản nháp
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#9c3808] hover:bg-[#832f07] disabled:opacity-50 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Đang phát thông báo...' : 'Phát thông báo ngay'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
