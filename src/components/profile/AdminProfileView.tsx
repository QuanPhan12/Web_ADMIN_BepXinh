import React, { useState, useRef, useEffect } from 'react'
import {
  ShieldCheck,
  Camera,
  CheckCircle2,
  Lock,
  Smartphone,
  KeyRound,
  Laptop,
  Tablet,
  AlertTriangle,
  Send,
  Mail,
  Phone,
  Globe,
  User,
  Briefcase,
  Save,
  ExternalLink,
  Upload,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

export const AdminProfileView: React.FC = () => {
  const {
    profile,
    updateProfile,
    uploadAvatar,
    resetToDefault,
    showToast,
  } = useProfile()

  // Local editing form state
  const [formData, setFormData] = useState({
    displayName: profile.displayName,
    reviewTitle: profile.reviewTitle,
    alertEmail: profile.alertEmail,
    verifyPhone: profile.verifyPhone,
    language: profile.language,
    delegationNotes: profile.delegationNotes,
  })

  // Sync formData whenever profile changes
  useEffect(() => {
    setFormData({
      displayName: profile.displayName,
      reviewTitle: profile.reviewTitle,
      alertEmail: profile.alertEmail,
      verifyPhone: profile.verifyPhone,
      language: profile.language,
      delegationNotes: profile.delegationNotes,
    })
  }, [profile])

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  // Avatar upload reference & drag state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  // Check if form has unsaved modifications
  const hasUnsavedChanges =
    formData.displayName !== profile.displayName ||
    formData.reviewTitle !== profile.reviewTitle ||
    formData.alertEmail !== profile.alertEmail ||
    formData.verifyPhone !== profile.verifyPhone ||
    formData.language !== profile.language ||
    formData.delegationNotes !== profile.delegationNotes

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    if (!formData.displayName.trim()) {
      showToast('Tên hiển thị công khai không được để trống!')
      return
    }

    if (!formData.alertEmail.includes('@')) {
      showToast('Email tiếp nhận báo cáo không hợp lệ!')
      return
    }

    updateProfile({
      displayName: formData.displayName,
      reviewTitle: formData.reviewTitle,
      alertEmail: formData.alertEmail,
      verifyPhone: formData.verifyPhone,
      language: formData.language,
      delegationNotes: formData.delegationNotes,
    })
  }

  const handleResetForm = () => {
    setFormData({
      displayName: profile.displayName,
      reviewTitle: profile.reviewTitle,
      alertEmail: profile.alertEmail,
      verifyPhone: profile.verifyPhone,
      language: profile.language,
      delegationNotes: profile.delegationNotes,
    })
    showToast('Đã hủy bỏ các thay đổi chưa lưu!')
  }

  // Handle file chosen from file picker dialog
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      await uploadAvatar(file)
    } catch {
      // Handled in context
    } finally {
      setIsUploading(false)
      // Reset input value so re-selecting same file triggers onChange
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      setIsUploading(true)
      try {
        await uploadAvatar(file)
      } catch {
        // Handled in context
      } finally {
        setIsUploading(false)
      }
    }
  }

  const isCustomAvatar = profile.avatarUrl !== '/images/admin_avatar.png'

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hidden File Input for Device Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Bếp Xinh Admin</span>
            <span>&gt;</span>
            <span>Quản trị viên</span>
            <span>&gt;</span>
            <span className="text-[#9c3808] font-bold">Cài đặt Trang cá nhân &amp; Bảo mật</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Đang hoạt động • Phiên làm việc mã hóa AES-GCM</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Hồ sơ Quản trị viên &amp; Thiết lập Bảo mật
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {hasUnsavedChanges && (
            <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Có thay đổi chưa lưu
            </span>
          )}

          <button
            type="button"
            onClick={handleResetForm}
            disabled={!hasUnsavedChanges}
            className="px-4 py-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            Hủy thay đổi
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="px-5 py-2 rounded-full bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu thay đổi hồ sơ</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* Left: User Info & Avatar Upload Area */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Camera Overlay & Drag-Drop */}
          <div className="flex flex-col items-center">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer rounded-full p-1 transition-all ${
                isDragging
                  ? 'ring-4 ring-orange-400 scale-105 bg-orange-50'
                  : 'hover:ring-2 hover:ring-orange-300'
              }`}
              title="Nhấn để tải ảnh đại diện từ thiết bị của bạn hoặc kéo thả ảnh vào đây"
            >
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-orange-200/80 shadow-md relative bg-slate-100">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />

                {/* Hover overlay with upload prompt */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-center p-1">
                  <Upload className="w-5 h-5 mb-0.5 text-amber-300 animate-bounce" />
                  <span className="text-[10px] font-bold leading-tight">Tải ảnh lên</span>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-slate-900/75 flex items-center justify-center text-white">
                    <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  </div>
                )}
              </div>

              {/* Floating Camera Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-[#9c3808] text-white shadow-md hover:bg-[#832f07] transition-transform group-hover:scale-110 cursor-pointer"
                title="Chọn ảnh từ máy tính / thiết bị"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Avatar controls: Device badge */}
            <div className="mt-2 text-center">
              {isCustomAvatar ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                  <Sparkles className="w-2.5 h-2.5" />
                  Ảnh từ thiết bị
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  Bấm ảnh để tải từ máy
                </span>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900">{profile.displayName}</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-extrabold uppercase">
                {profile.roleTag}
              </span>
            </div>

            <div className="inline-block px-2.5 py-0.5 rounded-lg bg-orange-50 text-[#9c3808] text-xs font-bold">
              {profile.reviewTitle}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {profile.department}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                <Mail className="w-3.5 h-3.5 text-[#9c3808]" />
                {profile.alertEmail}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-100">
                <Phone className="w-3.5 h-3.5 text-[#9c3808]" />
                {profile.verifyPhone}
              </span>
            </div>

            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2 text-[11px] text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded">ID: <strong>{profile.adminId}</strong></span>
              <span>•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Gia nhập: <strong>{profile.joinedDate}</strong></span>
              <span>•</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded">Quyền lực: <strong>{profile.permissionLevel}</strong></span>
              <span>•</span>
              <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-semibold">2FA-FIDO2 Hợp lệ</span>
            </div>
          </div>
        </div>

        {/* Right: Security Score Meter */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
              CHỈ SỐ AN TOÀN TÀI KHOẢN
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Cực kỳ an toàn
            </span>
          </div>

          <div className="flex items-baseline gap-1 my-1">
            <span className="text-4xl font-black text-slate-900">98</span>
            <span className="text-sm font-bold text-slate-400">/100</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed mb-3">
            Tài khoản đã được bảo vệ với khóa thực phần cứng YubiKey kết hợp ứng dụng TOTP 6 số.
          </p>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                2FA TOTP: Kích hoạt
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Khóa FIDO2: Đã ghép nối
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Mật khẩu: Đổi 44 ngày trước
              </span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
          </div>

          <button
            onClick={() => alert('Mở nhật ký kiểm toán phiên')}
            className="mt-3 pt-2 border-t border-slate-200/60 text-xs font-bold text-[#9c3808] hover:underline flex items-center justify-between cursor-pointer"
          >
            <span>Kiểm tra nhật ký kiểm toán (Audit Log)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Row 2: Form & RBAC Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form: Update Admin Information (Editable) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center font-bold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cập nhật Thông tin Quản trị
                </h3>
                <p className="text-xs text-slate-400">
                  Thông tin hiển thị trên biên bản thẩm định công thức
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50/60 hover:bg-orange-100 text-[#9c3808] text-xs font-bold transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Đổi ảnh đại diện</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Input 1: Display Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>TÊN HIỂN THỊ CÔNG KHAI</span>
                {formData.displayName !== profile.displayName && (
                  <span className="text-[9px] text-amber-600 font-bold lowercase">• chưa lưu</span>
                )}
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] focus-within:border-orange-500 focus-within:bg-white text-xs font-semibold text-slate-800 transition-all">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => handleInputChange('displayName', e.target.value)}
                  placeholder="Nhập tên hiển thị..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Input 2: Title */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>CHỨC DANH BAN KIỂM DUYỆT</span>
                {formData.reviewTitle !== profile.reviewTitle && (
                  <span className="text-[9px] text-amber-600 font-bold lowercase">• chưa lưu</span>
                )}
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] focus-within:border-orange-500 focus-within:bg-white text-xs font-semibold text-slate-800 transition-all">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.reviewTitle}
                  onChange={(e) => handleInputChange('reviewTitle', e.target.value)}
                  placeholder="Nhập chức danh..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Input 3: Email */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span>EMAIL TIẾP NHẬN BÁO CÁO KHẨN</span>
              {formData.alertEmail !== profile.alertEmail && (
                <span className="text-[9px] text-amber-600 font-bold lowercase">• chưa lưu</span>
              )}
            </label>
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] focus-within:border-orange-500 focus-within:bg-white text-xs font-semibold text-slate-800 transition-all">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="email"
                value={formData.alertEmail}
                onChange={(e) => handleInputChange('alertEmail', e.target.value)}
                placeholder="example@bepxinh.vn"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Input 4: Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>SỐ ĐIỆN THOẠI XÁC MINH</span>
                {formData.verifyPhone !== profile.verifyPhone && (
                  <span className="text-[9px] text-amber-600 font-bold lowercase">• chưa lưu</span>
                )}
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] focus-within:border-orange-500 focus-within:bg-white text-xs font-semibold text-slate-800 transition-all">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.verifyPhone}
                  onChange={(e) => handleInputChange('verifyPhone', e.target.value)}
                  placeholder="Số điện thoại..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Input 5: Language */}
            <div className="space-y-1">
              <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                <span>NGÔN NGỮ GIAO DIỆN ADMIN</span>
                {formData.language !== profile.language && (
                  <span className="text-[9px] text-amber-600 font-bold lowercase">• chưa lưu</span>
                )}
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8fafc] focus-within:border-orange-500 focus-within:bg-white text-xs font-semibold text-slate-800 transition-all">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  placeholder="Ngôn ngữ..."
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Textarea: Delegation notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-extrabold text-slate-600 uppercase tracking-wider flex items-center justify-between">
              <span>GHI CHÚ BÀN GIAO &amp; QUYỀN ỦY QUYỀN KHẨN</span>
              {formData.delegationNotes !== profile.delegationNotes && (
                <span className="text-[9px] text-amber-600 font-bold lowercase">• chưa lưu</span>
              )}
            </label>
            <textarea
              rows={3}
              value={formData.delegationNotes}
              onChange={(e) => handleInputChange('delegationNotes', e.target.value)}
              placeholder="Nhập ghi chú ủy quyền bàn giao..."
              className="w-full p-3 rounded-xl border border-slate-200 bg-[#f8fafc] focus:border-orange-500 focus:bg-white text-xs text-slate-800 leading-relaxed outline-none transition-all"
            />
          </div>

          {/* Form Bottom Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleResetForm}
              disabled={!hasUnsavedChanges}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Khôi phục bản ghi gần nhất</span>
            </button>

            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-5 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Lưu dữ liệu cá nhân</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn đặt lại toàn bộ thông tin cá nhân và ảnh đại diện về mặc định?')) {
                  resetToDefault()
                }
              }}
              className="ml-auto text-xs text-slate-400 hover:text-slate-600 underline font-medium cursor-pointer"
            >
              Đặt lại mặc định hệ thống
            </button>
          </div>
        </div>

        {/* RBAC Permission Matrix */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Quyền Hạn Thực Thi (RBAC Matrix)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Phạm vi tác vụ được gắn bởi hệ thống Bếp Xinh Core
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-extrabold">
                Level: Super Admin
              </span>
            </div>

            <div className="space-y-2.5 mt-3 text-xs">
              {/* Item 1 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Duyệt công thức món ăn</div>
                  <div className="text-[11px] text-slate-500">Phê duyệt, chỉnh sửa bước nấu, ghim trang chủ</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0">
                  Toàn quyền (Full)
                </span>
              </div>

              {/* Item 2 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Cấp Tích xanh cho Đầu bếp</div>
                  <div className="text-[11px] text-slate-500">Thẩm định chứng chỉ nghề, cấp huy hiệu Chuyên gia</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] shrink-0">
                  Toàn quyền (Full)
                </span>
              </div>

              {/* Item 3 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Xử lý vi phạm &amp; Xóa nội dung</div>
                  <div className="text-[11px] text-slate-500">Khóa tài khoản, gỡ bài vi phạm bản quyền</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-orange-100 text-amber-900 font-extrabold text-[10px] shrink-0">
                  Toàn quyền (Full)
                </span>
              </div>

              {/* Item 4 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Quản lý giá nguyên liệu Siêu thị</div>
                  <div className="text-[11px] text-slate-500">Tra cứu giá niêm yết WinMart, Co.opMart, Bách Hóa Xanh</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px] shrink-0">
                  Read &amp; Audit
                </span>
              </div>

              {/* Item 5 */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Mã nguồn AI Vision nhận diện món</div>
                  <div className="text-[11px] text-slate-500">Bộ tham số mô hình Core Vision và embedding gia vị</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-extrabold text-[10px] shrink-0">
                  Chỉ xem (Read Only)
                </span>
              </div>
            </div>
          </div>

          {/* Caution Alert Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Yêu cầu nâng cấp phân quyền can thiệp sâu AI Pipeline cần chữ ký xác thực điện tử từ Ban Giám đốc kỹ thuật (CTO Office).
            </p>
          </div>
        </div>
      </div>

      {/* Row 3: MFA / 2FA Settings */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Thiết Lập An Toàn &amp; Xác Thực Đa Yếu Tố (MFA/2FA)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Bảo vệ tài khoản quản trị trước nguy cơ rò rỉ dữ liệu phiên
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold self-start sm:self-auto">
            2FA: Đang Hoạt Động
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: TOTP Authenticator */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-slate-500" />
                  Ứng dụng xác thực (TOTP)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Đã bật
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Đã liên kết tài khoản với <strong>Google Authenticator</strong>. Cung cấp mã OTP 6 số cập nhật mỗi 30 giây.
              </p>
              <div className="mt-3 text-[11px] text-slate-600 font-semibold flex items-center justify-between">
                <span>Mã dự phòng:</span>
                <span className="font-bold text-slate-900">8 mã khả dụng</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => showToast('Mã QR mới đã được gửi về email an ninh!')}
                className="flex-1 py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Làm mới mã QR
              </button>
              <button
                onClick={() => showToast('Đang tải danh sách 8 mã dự phòng bảo mật...')}
                className="py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Tải mã dự phòng
              </button>
            </div>
          </div>

          {/* Card 2: FIDO2 Hardware Key */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-[#9c3808]" />
                  Khóa bảo mật vật lý (FIDO2)
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  FIDO2 Hợp lệ
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Thiết bị ghép nối: <strong>YubiKey 5 NFC</strong>. Lần cuối chạm khóa vật lý: 2 ngày trước tại Văn phòng Bếp Xinh.
              </p>
              <div className="mt-3 text-[11px] text-slate-600 font-semibold flex items-center justify-between">
                <span>Mã chứng thư:</span>
                <span className="font-mono font-bold text-slate-900">YK-5NFC-8842</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <button
                onClick={() => showToast('Chế độ thêm khóa YubiKey dự phòng đã kích hoạt!')}
                className="w-full py-1.5 px-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Thêm khóa vật lý dự phòng
              </button>
            </div>
          </div>

          {/* Card 3: Change Password */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-slate-500" />
                  Đổi mật khẩu quản trị
                </span>
                <span className="text-[10px] text-slate-500 font-medium">Chu kỳ: 90 ngày</span>
              </div>

              <div className="space-y-1.5">
                <input
                  type="password"
                  placeholder="Mật khẩu hiện tại"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-orange-500"
                />
                <input
                  type="password"
                  placeholder="Mật khẩu mới (Tối thiểu 12 ký tự)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-orange-500"
                />
              </div>

              <div className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Ít nhất 12 ký tự gồm chữ hoa, số &amp; ký hiệu</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!currentPassword || !newPassword) {
                  showToast('Vui lòng nhập đầy đủ thông tin mật khẩu!')
                  return
                }
                showToast('Mật khẩu quản trị đã được cập nhật an toàn!')
                setCurrentPassword('')
                setNewPassword('')
              }}
              className="w-full py-1.5 px-3 rounded-lg bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              Cập nhật mật khẩu an toàn
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Devices & Emergency Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Devices & Sessions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Thiết Bị &amp; Phiên Đăng Nhập
              </h3>
              <p className="text-xs text-slate-400">
                3 thiết bị đang duy trì token ủy quyền bảo mật
              </p>
            </div>
            <button
              onClick={() => showToast('Đã hủy token phiên đăng nhập trên toàn bộ thiết bị khác!')}
              className="px-3 py-1 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
            >
              Đăng xuất khỏi tất cả thiết bị khác
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Device 1: Current */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-emerald-200 text-emerald-700 shadow-2xs">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">MacBook Pro 16" M3 Max</span>
                    <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      THIẾT BỊ HIỆN TẠI
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Chrome 124 • Hà Nội, Việt Nam
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    IP: 14.161.28.xx • SSL/TLS 1.3
                  </div>
                </div>
              </div>
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                Đang hoạt động
              </span>
            </div>

            {/* Device 2: iPhone */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-2xs">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">iPhone 15 Pro Max</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Bếp Xinh Admin App v3.2 • TP. Hồ Chí Minh
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hoạt động 35 phút trước qua Wi-Fi 6E
                  </div>
                </div>
              </div>
              <button
                onClick={() => showToast('Đã hủy phiên đăng nhập trên iPhone 15 Pro Max')}
                className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
              >
                Hủy phiên
              </button>
            </div>

            {/* Device 3: iPad */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-2xs">
                  <Tablet className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">iPad Pro M2 12.9"</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Safari Mobile • Văn phòng Bếp Xinh Huế
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Hoạt động hôm qua lúc 17:42
                  </div>
                </div>
              </div>
              <button
                onClick={() => showToast('Đã hủy phiên đăng nhập trên iPad Pro')}
                className="text-rose-600 hover:text-rose-800 font-bold text-xs cursor-pointer"
              >
                Hủy phiên
              </button>
            </div>
          </div>
        </div>

        {/* Right: Emergency Alerts & Telegram Integration */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900">
              Cảnh Báo Điều Hành Khẩn
            </h3>
            <p className="text-xs text-slate-400">
              Kênh nhận đẩy qua Telegram Bot &amp; Slack Dev
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Trigger 1 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Vi phạm bản quyền &gt; 90%
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  AI quét thấy công thức trùng lặp nội dung hoặc sao chép ảnh thương hiệu
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#9c3808]" />
            </div>

            {/* Trigger 2 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Khiếu nại từ Đầu bếp Tích Xanh
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tin nhắn trực tiếp và báo lỗi bài đăng từ đối tác sáng tạo uy tín
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#9c3808]" />
            </div>

            {/* Trigger 3 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Lỗi API Siêu thị (WinMart / Co.op)
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Giỏ giỏ nguyên liệu không phản hồi hoặc mất kết nối webhook tồn kho
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded accent-[#9c3808]" />
            </div>
          </div>

          {/* Telegram Bot Card */}
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-sky-500 text-white flex items-center justify-center">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-sky-950">Telegram Alert Bot</div>
                <div className="text-[11px] text-sky-700">@bepxinh_security_bot • Đã liên kết</div>
              </div>
            </div>
            <button
              onClick={() => showToast('Đã gửi thông điệp Ping thử nghiệm qua Telegram!')}
              className="px-3 py-1.5 rounded-xl bg-white text-sky-800 font-bold border border-sky-200 hover:bg-sky-100/50 shadow-2xs cursor-pointer"
            >
              Kiểm tra Ping
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
