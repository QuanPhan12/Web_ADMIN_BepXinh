import React, { useState } from 'react'
import { X, UserPlus, ShieldCheck, Smartphone, Mail, Phone, User } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ImageUploadDropzone } from '../common/ImageUploadDropzone'

const USER_AVATAR_PRESETS = [
  { label: 'Đầu bếp Nam', url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80' },
  { label: 'Nữ chuyên gia', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { label: 'Bếp trưởng', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Người dùng VIP', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
]

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated?: (user: {
    name: string
    email: string
    phone: string
    role: 'VIP' | 'Creator' | 'Độc giả' | 'Tài khoản mới'
    platform: 'iOS' | 'Android' | 'Web Portal'
    avatar?: string
  }) => void
}

export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onUserCreated,
}) => {
  const { showToast } = useProfile()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'VIP' | 'Creator' | 'Độc giả' | 'Tài khoản mới'>('Độc giả')
  const [platform, setPlatform] = useState<'iOS' | 'Android' | 'Web Portal'>('iOS')
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      showToast('Vui lòng nhập họ và tên người dùng!')
      return
    }
    if (!email.trim() && !phone.trim()) {
      showToast('Vui lòng nhập ít nhất Email hoặc Số điện thoại!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      showToast(`Đã thêm người dùng mới "${name}" thành công!`)
      if (onUserCreated) {
        onUserCreated({
          name: name.trim(),
          email: email.trim() || 'user@bepxinh.vn',
          phone: phone.trim() || '0900.000.000',
          role,
          platform,
          avatar,
        })
      }
      onClose()
      setName('')
      setEmail('')
      setPhone('')
    }, 500)
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
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Thêm Người Dùng &amp; Độc Giả Mới
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Cấp tài khoản định danh mới trên hệ sinh thái Bếp Xinh Enterprise
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
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Full name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Họ và tên người dùng <span className="text-rose-600">*</span></span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Nguyễn Hải Nam"
              required
              className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Địa chỉ Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hainam.cook@gmail.com"
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>Số điện thoại</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0918.xxx.xxx"
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#9c3808] focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          </div>

          {/* Role & Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Phân loại tài khoản</span>
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#9c3808] outline-none transition-all cursor-pointer"
              >
                <option value="Độc giả">Độc giả thường</option>
                <option value="VIP">Độc giả VIP</option>
                <option value="Creator">Creator / Đầu bếp</option>
                <option value="Tài khoản mới">Tài khoản mới</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                <span>Nền tảng thiết bị</span>
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as any)}
                className="w-full text-xs text-slate-800 p-2.5 rounded-xl border border-slate-200 bg-white focus:border-[#9c3808] outline-none transition-all cursor-pointer"
              >
                <option value="iOS">iOS (Apple iPhone/iPad)</option>
                <option value="Android">Android</option>
                <option value="Web Portal">Web Portal</option>
              </select>
            </div>
          </div>

          {/* Avatar Upload */}
          <ImageUploadDropzone
            value={avatar}
            onChange={(val) => setAvatar(val)}
            label="Ảnh đại diện (Avatar)"
            recommendedSize="Ảnh vuông tỷ lệ 1:1, Max 5MB"
            aspectRatio="square"
            presetImages={USER_AVATAR_PRESETS}
          />

          <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 text-[11px] text-slate-600 leading-relaxed">
            Hệ thống sẽ tự động gán mã người dùng định danh <strong className="font-mono text-slate-900">#BX-U{Math.floor(10000 + Math.random() * 90000)}</strong> và gửi thông báo xác thực tới tài khoản.
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
              <UserPlus className="w-4 h-4" />
              <span>{isSubmitting ? 'Đang tạo...' : 'Lưu & Cấp tài khoản'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
