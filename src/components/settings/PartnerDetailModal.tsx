import React from 'react'
import { X, Store, CheckCircle2, RefreshCw, Shield } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface PartnerDetailModalProps {
  isOpen: boolean
  onClose: () => void
  partner: {
    name: string
    code: string
    status: string
    protocol: string
    desc: string
    syncFreq: string
    slipRate: string
    stockSku: string
    endpoint: string
  } | null
}

export const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({
  isOpen,
  onClose,
  partner,
}) => {
  const { showToast } = useProfile()
  if (!isOpen || !partner) return null

  const handleTestPing = () => {
    showToast(`Đang gửi tín hiệu kiểm tra (Ping API) tới ${partner.name}... Phản hồi 200 OK (Latency: 118ms)`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50/50 border-b border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  {partner.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  {partner.protocol}
                </span>
              </div>
              <p className="text-xs text-slate-500">{partner.desc}</p>
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

        <div className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">TẦN SUẤT ĐỒNG BỘ</span>
              <span className="font-mono font-black text-slate-800 text-sm">{partner.syncFreq}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">TRƯỢT GIÁ CHO PHÉP</span>
              <span className="font-mono font-black text-slate-800 text-sm">{partner.slipRate}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">TỒN KHO KHẢ DỤNG</span>
              <span className="font-mono font-black text-emerald-700 text-sm">{partner.stockSku}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold block mb-0.5">TRẠNG THÁI GATEWAY</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{partner.status}</span>
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 block">Endpoint API Webhook</label>
            <div className="p-2.5 bg-slate-100 rounded-xl font-mono text-[11px] text-slate-700 break-all select-all border border-slate-200">
              {partner.endpoint}
            </div>
          </div>

          <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-start gap-2 text-blue-900">
            <Shield className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Dữ liệu được bảo vệ bằng khóa API kép (HMAC SHA-256) và đổi mới token tự động mỗi 24 giờ.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleTestPing}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Test Ping API</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
