import React, { useState } from 'react'
import { X, Store, Plus } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface NewPartnerIntegrationModalProps {
  isOpen: boolean
  onClose: () => void
  onAddPartner: (partner: any) => void
}

export const NewPartnerIntegrationModal: React.FC<NewPartnerIntegrationModalProps> = ({
  isOpen,
  onClose,
  onAddPartner,
}) => {
  const { showToast } = useProfile()
  const [name, setName] = useState('')
  const [partnerId, setPartnerId] = useState('#LTT-7701')
  const [protocol, setProtocol] = useState<'REST' | 'GraphQL' | 'SAP' | 'MQTT'>('REST')
  const [endpoint, setEndpoint] = useState('https://api.lottemart.vn/v1/sync')
  const [hub, setHub] = useState('Toàn quốc (TP.HCM & Hà Nội)')
  const [skuTarget, setSkuTarget] = useState('8,500')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    onAddPartner({
      id: partnerId,
      name,
      shortName: name.slice(0, 3).toUpperCase(),
      code: partnerId,
      protocol: protocol === 'REST' ? 'RESTful Webhook Stream Hub' : protocol === 'GraphQL' ? 'GraphQL Inventory Subscription' : protocol === 'SAP' ? 'Gateway ERP SAP Direct Connect' : 'Cloud MQTT Broker Event Bus',
      endpoint,
      latency: '52ms',
      skuCount: skuTarget,
      lastSync: 'Vừa xong',
      uptime: '100.0%',
      status: 'active',
      badge: '● ACTIVE',
    })
    showToast(`Đã thiết lập cổng kết nối mới cho đối tác ${name}!`)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9c3808] flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">
                Tích Hợp Đối Tác Chuỗi Siêu Thị Mới
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cấu hình API Gateway, phân luồng Webhook và đồng bộ tồn kho thực phẩm tự động
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tên Chuỗi Siêu Thị / Thương Hiệu</label>
              <input
                type="text"
                placeholder="Ví dụ: Lotte Mart Việt Nam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#9c3808]"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Mã Định Danh Đối Tác (Partner ID)</label>
              <input
                type="text"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Giao Thức Đồng Bộ (Protocol)</label>
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#9c3808]"
              >
                <option value="REST">RESTful Webhook Stream Hub</option>
                <option value="GraphQL">GraphQL Inventory Subscription</option>
                <option value="SAP">Gateway ERP SAP Direct Connect</option>
                <option value="MQTT">Cloud MQTT Broker Event Bus</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ước Lượng Quy Mô SKU</label>
              <input
                type="text"
                value={skuTarget}
                onChange={(e) => setSkuTarget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">API Host Gateway Endpoint</label>
            <input
              type="url"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Phạm Vi Địa Lý / Hub Trung Tâm</label>
            <input
              type="text"
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-[#9c3808]"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 space-y-1">
            <div className="font-bold text-slate-700">Yêu cầu mTLS &amp; Rate-limit:</div>
            <p className="text-[11px]">
              Tất cả các endpoint mới bắt buộc phải chấp nhận chứng chỉ SSL/TLS SHA-256 từ hệ thống Bếp Xinh Enterprise và hỗ trợ tối thiểu 300 req/min.
            </p>
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
              className="px-5 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Thiết lập &amp; Đăng ký Gateway</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
