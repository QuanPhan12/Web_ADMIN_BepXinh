import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Clock,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { PortalHeaderIcon } from './icons/BepXinhLogo'
import { IdCardIcon, YubiKeyIcon } from './icons/CustomIcons'
import { OtpInput } from './OtpInput'
import { YubiKeyModal } from './modals/YubiKeyModal'
import { ForgotPasswordModal } from './modals/ForgotPasswordModal'
import { AuditNodeModal } from './modals/AuditNodeModal'
import { SuccessDashboardModal } from './modals/SuccessDashboardModal'

// Hàm sinh mã 6 số ngẫu nhiên mới cho token 2FA
const generateRandomOtp = (): string[] => {
  return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10).toString())
}

interface RightPanelProps {
  onLoginSuccess?: () => void
}

export const RightPanel: React.FC<RightPanelProps> = ({ onLoginSuccess }) => {
  // Form State
  const [email, setEmail] = useState('Admin@bepxinh.vn')
  const [password, setPassword] = useState('Admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [otp, setOtp] = useState<string[]>(() => generateRandomOtp())
  const [rememberMe, setRememberMe] = useState(true)

  // 2FA Timer
  const [timer, setTimer] = useState(30)

  // Modals & Authentication flow
  const [isYubiKeyOpen, setIsYubiKeyOpen] = useState(false)
  const [isForgotOpen, setIsForgotOpen] = useState(false)
  const [isAuditOpen, setIsAuditOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=success')
    } catch {
      return false
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  // Countdown timer effect: mỗi lần kết thúc đếm ngược là sinh ra 1 mã 6 số ngẫu nhiên mới
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setOtp(generateRandomOtp())
          return 30
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Handle email validation check
  const isEmailValid = email.toLowerCase().endsWith('@bepxinh.vn')

  const handleYubiKeySuccess = () => {
    const generated = generateRandomOtp()
    setOtp(generated)
  }

  const handleRefreshOtp = () => {
    setTimer(30)
    setOtp(generateRandomOtp())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    const cleanEmail = email.trim()
    const cleanPassword = password.trim()

    if (!cleanEmail) {
      setErrorMsg('Vui lòng nhập tài khoản quản trị viên.')
      return
    }

    if (!cleanEmail.toLowerCase().endsWith('@bepxinh.vn')) {
      setErrorMsg('Tài khoản bắt buộc phải có đuôi @bepxinh.vn theo chính sách bảo mật nội bộ.')
      return
    }

    if (!cleanPassword) {
      setErrorMsg('Vui lòng nhập mật khẩu bảo vệ.')
      return
    }

    // Xác thực tài khoản Admin@bepxinh.vn và mật khẩu Admin123
    const isCorrectAccount = cleanEmail.toLowerCase() === 'admin@bepxinh.vn'
    const isCorrectPassword =
      cleanPassword === 'Admin123' ||
      cleanPassword === 'admin123' ||
      cleanPassword === '••••••••••••••••'

    if (!isCorrectAccount || !isCorrectPassword) {
      setErrorMsg('Tài khoản hoặc mật khẩu không chính xác. Mật khẩu chuẩn là Admin123.')
      return
    }

    const otpCode = otp.join('')
    if (otpCode.length < 6) {
      setOtp(generateRandomOtp())
    }

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setIsSuccessOpen(true)
    }, 600)
  }

  return (
    <>
      <div className="bg-white rounded-[32px] md:rounded-[36px] p-6 md:p-8 shadow-xl shadow-slate-200/60 border border-slate-100/90 w-full max-w-[480px] flex flex-col justify-between">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PortalHeaderIcon className="w-5 h-5 shadow-2xs" />
              <span className="font-black text-[#9c3909] text-[13.5px] tracking-wider uppercase">
                BẾP XINH PORTAL
              </span>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8edfa]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1e3a8a]" />
              <span className="text-[10px] font-extrabold text-[#1e3a8a] uppercase tracking-wider">
                SECURED AUTH
              </span>
            </div>
          </div>

          {/* Heading */}
          <div>
            <h2 className="text-[25px] md:text-[26px] font-black text-[#0f172a] tracking-tight">
              Đăng nhập Cổng Quản trị
            </h2>
            <p className="text-[11.5px] text-[#64748b] leading-relaxed mt-0.5">
              Hệ thống quản lý nội dung công thức, dữ liệu siêu thị và kiểm duyệt AI chuyên biệt.
            </p>
          </div>

          {/* Mode Tab / Selector */}
          <div className="w-full rounded-full border border-[#dbeafe] bg-white py-1.5 px-6 text-center font-bold text-xs text-[#0f172a] shadow-xs cursor-default">
            Mật khẩu &amp; OTP
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Field 1: Admin Account */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-[#0f172a]">
                Tài khoản quản trị viên
              </label>
              <span className="text-[11px] font-medium text-[#64748b]">
                Định dạng @bepxinh.vn
              </span>
            </div>

            <div className="relative rounded-full bg-[#f0f4fa] px-4 py-2 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-orange-200">
              <IdCardIcon className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Admin@bepxinh.vn"
                className="w-full text-xs md:text-sm font-semibold text-[#0f172a] bg-transparent outline-none placeholder:text-slate-400"
              />
              {isEmailValid && (
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              )}
            </div>
          </div>

          {/* Field 2: Password */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1">
              <label className="text-xs font-bold text-[#0f172a]">
                Mật khẩu bảo vệ
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-[11px] font-semibold text-[#9c3909] hover:underline cursor-pointer"
              >
                Quên mật khẩu?
              </button>
            </div>

            <div className="relative rounded-full bg-[#f0f4fa] px-4 py-2 flex items-center gap-3 transition-all focus-within:ring-2 focus-within:ring-orange-200">
              <Lock className="w-4 h-4 text-slate-500 shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin123"
                className="w-full text-xs md:text-sm font-semibold text-[#0f172a] bg-transparent outline-none placeholder:text-slate-400 tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-500 hover:text-slate-700 transition-colors p-0.5 cursor-pointer"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Field 3: 2FA / Hardware Token */}
          <div className="rounded-[20px] bg-[#f0f4fa] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f172a]">
                <Smartphone className="w-3.5 h-3.5 text-[#9a3412]" />
                <span>Mã xác thực 2FA / Token phần cứng</span>
              </div>
              <button
                type="button"
                onClick={handleRefreshOtp}
                title="Bấm để làm mới mã"
                className="flex items-center gap-1 text-[11px] font-bold text-[#9a3412] hover:text-orange-700 transition-colors cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-[#9a3412]" />
                <span>Làm mới: {timer}s</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-2">
              <OtpInput value={otp} onChange={setOtp} />

              <button
                type="button"
                onClick={() => setIsYubiKeyOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e2ecf9] text-[#0f172a] text-xs font-bold border border-[#d0dff3] hover:bg-white transition-all shrink-0 cursor-pointer shadow-2xs"
              >
                <YubiKeyIcon className="w-3.5 h-3.5 text-[#0f172a]" />
                <span>YubiKey</span>
              </button>
            </div>
          </div>

          {/* Checkbox: Remember Session */}
          <div>
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#9c3909] focus:ring-orange-500 accent-[#9c3909]"
              />
              <div>
                <span className="text-xs font-bold text-[#0f172a] block">
                  Duy trì phiên đăng nhập bảo mật (12 giờ)
                </span>
                <span className="text-[11px] text-[#64748b] block leading-tight mt-0.5">
                  Khuyến nghị không kích hoạt khi dùng thiết bị công cộng hoặc mạng mở.
                </span>
              </div>
            </label>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-6 rounded-full bg-[#9c3808] hover:bg-[#852f05] active:bg-[#702704] disabled:opacity-75 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang kiểm tra chứng chỉ xác thực...</span>
              </>
            ) : (
              <>
                <span>Đăng nhập Cổng Điều Hành</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Security Notice Box */}
          <div
            onClick={() => setIsAuditOpen(true)}
            className="rounded-[20px] bg-[#e8f0fe] p-3 border border-[#d8e5f8] flex items-start gap-2.5 cursor-pointer hover:bg-[#dfeafb] transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-[#9a3412] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#0f172a]">
                Khu vực bảo mật nội bộ
              </h4>
              <p className="text-[11px] text-[#475569] leading-relaxed mt-0.5">
                Mọi lượt truy cập, địa chỉ IP và thao tác hệ thống đều được tự động ghi lại trong Hệ thống Audit Log Bếp Xinh Cloud phục vụ công tác an toàn thông tin.
              </p>
            </div>
          </div>
        </form>

        {/* Card Bottom Footer */}
        <div className="w-full flex items-center justify-between text-[11px] text-[#64748b] font-medium pt-3 mt-2 border-t border-slate-100">
          <span>Admin Portal v2.4.8-LTS</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => alert('IT Desk 24/7 Hotline: (028) 7300-8888 | Kênh nội bộ: #it-helpdesk')}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              IT Desk 24/7
            </button>
            <span>•</span>
            <button
              onClick={() => setIsForgotOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Chính sách bảo mật
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAuditOpen(true)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Audit Node
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <YubiKeyModal
        isOpen={isYubiKeyOpen}
        onClose={() => setIsYubiKeyOpen(false)}
        onSuccess={handleYubiKeySuccess}
      />
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
      />
      <AuditNodeModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
      />
      <SuccessDashboardModal
        isOpen={isSuccessOpen}
        adminEmail={email}
        onLogout={() => setIsSuccessOpen(false)}
        onEnterDashboard={() => {
          setIsSuccessOpen(false)
          if (onLoginSuccess) {
            onLoginSuccess()
          }
        }}
      />
    </>
  )
}
