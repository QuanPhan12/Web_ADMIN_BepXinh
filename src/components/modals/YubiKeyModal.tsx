import React, { useState } from 'react'
import { KeyRound, ShieldCheck, X, CheckCircle2, Loader2 } from 'lucide-react'

interface YubiKeyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const YubiKeyModal: React.FC<YubiKeyModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [status, setStatus] = useState<'waiting' | 'verifying' | 'success'>('waiting')

  if (!isOpen) return null

  const handleSimulateTouch = () => {
    setStatus('verifying')
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => {
        onSuccess()
        onClose()
        setStatus('waiting')
      }, 900)
    }, 1200)
  }

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
          <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Xác thực khóa bảo mật YubiKey
            </h3>
            <p className="text-xs text-slate-500">
              FIDO2 / WebAuthn Hardware Token
            </p>
          </div>
        </div>

        <div className="my-6 py-6 px-4 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col items-center text-center">
          {status === 'waiting' && (
            <>
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-amber-100/70 flex items-center justify-center text-amber-600 animate-pulse">
                  <KeyRound className="w-8 h-8" />
                </div>
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Vui lòng cắm và chạm ngón tay vào khóa YubiKey
              </p>
              <p className="text-xs text-slate-500 max-w-xs">
                Đèn tín hiệu trên khóa phần cứng đang nhấp nháy chờ lệnh xác nhận sinh trắc hoặc nút bấm vật lý.
              </p>
            </>
          )}

          {status === 'verifying' && (
            <>
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
              <p className="text-sm font-semibold text-slate-800 mb-1">
                Đang xác thực chứng chỉ số phần cứng...
              </p>
              <p className="text-xs text-slate-500">
                Kiểm tra chữ ký số mật mã học đường cong Elliptic (Ed25519)
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-4 animate-bounce" />
              <p className="text-sm font-bold text-emerald-700 mb-1">
                Xác thực Token thành công!
              </p>
              <p className="text-xs text-slate-500">
                Tự động truyền mã xác thực vào phiên làm việc...
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={status !== 'waiting'}
            onClick={handleSimulateTouch}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#9c3909] hover:bg-[#832f07] disabled:opacity-50 text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Chạm khóa ngay</span>
          </button>
        </div>
      </div>
    </div>
  )
}
