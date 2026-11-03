import React from 'react'
import { AlertCircle, HelpCircle, PhoneCall, X, ShieldAlert } from 'lucide-react'

interface ForgotPasswordModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#9c3909]">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Quy trình khôi phục tài khoản
            </h3>
            <p className="text-xs text-slate-500">
              Chính sách an toàn thông tin Cấp độ 3
            </p>
          </div>
        </div>

        <div className="space-y-3.5 my-4 text-xs text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-amber-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              Tài khoản quản trị viên mang đặc quyền cấp cao trên hệ thống Bếp Xinh Core Engine. Vì lý do bảo mật, mật khẩu không thể tự đặt lại qua email thông thường.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-600" />
              Các bước để cấp lại thông tin:
            </div>
            <ol className="list-decimal pl-4 space-y-1 text-slate-600">
              <li>Liên hệ trực tiếp với Trưởng bộ phận An ninh Thông tin (InfoSec).</li>
              <li>Xuất trình mã định danh nhân sự &amp; thẻ phần cứng YubiKey vật lý.</li>
              <li>Chờ phê duyệt kép (Dual-approval) từ 2 quản trị viên cấp Root.</li>
            </ol>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100/80 text-slate-700 font-medium">
            <span className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#9c3909]" />
              Hotline IT Desk Nội bộ:
            </span>
            <span className="font-bold text-slate-900 font-mono">
              +84 (028) 7300-8888 (Ext: 901)
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#9c3909] hover:bg-[#832f07] text-xs font-bold text-white shadow-sm transition-colors text-center"
        >
          Tôi đã hiểu quy trình
        </button>
      </div>
    </div>
  )
}
