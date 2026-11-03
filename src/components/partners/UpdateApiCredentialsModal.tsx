import React, { useState } from 'react'
import { X, Key, ShieldCheck, RefreshCw, Lock, ExternalLink, AlertCircle } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface UpdateApiCredentialsModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccessRecovery: () => void
  partnerName?: string
  partnerId?: string
}

export const UpdateApiCredentialsModal: React.FC<UpdateApiCredentialsModalProps> = ({
  isOpen,
  onClose,
  onSuccessRecovery,
  partnerName = 'Tops Market Central Retail',
  partnerId = '#TOP-0021',
}) => {
  const { showToast } = useProfile()
  const [clientId, setClientId] = useState('tops_bepxinh_client_prod_v2')
  const [clientSecret, setClientSecret] = useState('sec_live_9983427189a08fbc8921e0b')
  const [oauthEndpoint, setOauthEndpoint] = useState('https://auth.topsmarket.vn/oauth/token')
  const [scope, setScope] = useState('inventory:read inventory:write pos:sync')
  const [isTesting, setIsTesting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsTesting(true)
    setTimeout(() => {
      setIsTesting(false)
      showToast('Đã xác thực và tái cấp Token OAuth2 thành công cho Tops Market!')
      onSuccessRecovery()
      onClose()
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9c3808] flex items-center justify-center shrink-0">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">
                Cập nhật API Key &amp; OAuth2 Secret
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {partnerName} • <strong className="font-mono text-slate-700">{partnerId}</strong>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Sự cố HTTP 401 Unauthorized:</strong> Token truy cập hiện tại đã bị từ chối bởi máy chủ Tops Market. Vui lòng cập nhật Client Secret mới từ Cổng đối tác (Central Retail Developer Portal).
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">OAuth2 Client ID</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Client Secret (Ký số HMAC SHA-256)</label>
              <div className="relative">
                <input
                  type="password"
                  value={clientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">OAuth2 Token Endpoint URL</label>
              <input
                type="url"
                value={oauthEndpoint}
                onChange={(e) => setOauthEndpoint(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Scopes Được Cấp Phép</label>
              <input
                type="text"
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-slate-500">
            <a
              href="#docs"
              onClick={(e) => {
                e.preventDefault()
                showToast('Mở tài liệu API integration v2.5...')
              }}
              className="text-[#9c3808] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>Xem tài liệu Tops API v2</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[11px]">Tự động mã hóa Vault AES-256</span>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isTesting}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang thử lại &amp; Tái ký JWT...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Lưu &amp; Tái kết nối tức thời</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
