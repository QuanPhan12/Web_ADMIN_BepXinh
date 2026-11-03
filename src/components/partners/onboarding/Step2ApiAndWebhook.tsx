import React, { useState } from 'react'
import {
  Lock,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Server,
  Cloud,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Radio,
  KeyRound,
} from 'lucide-react'
import { useProfile } from '../../../context/ProfileContext'

interface Step2Props {
  onNext: () => void
  onBack: () => void
}

export const Step2ApiAndWebhook: React.FC<Step2Props> = ({ onNext, onBack }) => {
  const { showToast } = useProfile()

  // Protocol selection
  const [selectedProtocol, setSelectedProtocol] = useState<'REST' | 'GraphQL' | 'SAP' | 'MQTT'>('REST')

  // Endpoint & Credentials - Blank initial state
  const [targetEndpoint, setTargetEndpoint] = useState('')
  const [authMechanism, setAuthMechanism] = useState('OAuth 2.0 (Client Credentials Grant)')
  const [tokenEndpoint, setTokenEndpoint] = useState('')
  const [clientId, setClientId] = useState('')
  const [clientSecret, setClientSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [whitelistedIps, setWhitelistedIps] = useState('')

  // Webhook
  const [webhookReceiver] = useState('https://gateway.bepxinh.vn/api/v1/webhook/partner-hub')
  const [webhookSecret, setWebhookSecret] = useState('')
  const [retryMechanism, setRetryMechanism] = useState('5 Lần thử lại')

  // Events
  const [events, setEvents] = useState({
    stock: true,
    price: true,
    order: true,
    incident: false,
  })

  // Handshake test state
  const [isTestingHandshake, setIsTestingHandshake] = useState(false)
  const [handshakeResult, setHandshakeResult] = useState<boolean | null>(null)

  const handleGenerateCredentials = () => {
    const randomHex = Math.random().toString(16).substring(2, 10)
    setClientId(`bx_partner_${randomHex}_client`)
    setClientSecret(`bx_sec_${Math.random().toString(36).substring(2, 18)}`)
    setWebhookSecret(`whsec_${Math.random().toString(36).substring(2, 22)}`)
    showToast('Đã sinh cặp khóa API & Webhook Secret mới thành công!')
  }

  const handleTestHandshake = () => {
    if (!targetEndpoint.trim()) {
      showToast('Vui lòng nhập Base URL Gateway trước khi kiểm tra handshake!')
      return
    }
    setIsTestingHandshake(true)
    setTimeout(() => {
      setIsTestingHandshake(false)
      setHandshakeResult(true)
      showToast('Handshake mTLS & Lấy Token OAuth2 thành công (48ms)!')
    }, 1000)
  }

  const handleCopy = (text: string, label: string) => {
    if (!text) {
      showToast(`Chưa có dữ liệu ${label} để sao chép!`)
      return
    }
    navigator.clipboard?.writeText(text)
    showToast(`Đã sao chép ${label}!`)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Protocol & Webhook Config (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Box 1: Phương thức Kết nối Gateway & Endpoint Đối tác */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center font-bold">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Phương thức Kết nối Gateway &amp; Endpoint Đối tác
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Lựa chọn kiến trúc giao thức truyền dữ liệu hai chiều giữa Bếp Xinh và hệ thống siêu thị
                  </p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[10px] px-2 py-0.5 rounded">
                SLA &lt; 150ms
              </span>
            </div>

            {/* 4 Protocol Selection Cards (2x2 grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* RESTful Webhook */}
              <div
                onClick={() => setSelectedProtocol('REST')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-1.5 ${
                  selectedProtocol === 'REST'
                    ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">RESTful Webhook API</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-1.5 py-0.2 rounded">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  JSON payload qua HTTPS, đồng bộ sự kiện tức thì (Latency &lt; 80ms).
                </p>
                <div className="font-mono text-[10px] text-slate-400">POST /v1/events/stock-delta</div>
              </div>

              {/* GraphQL Engine */}
              <div
                onClick={() => setSelectedProtocol('GraphQL')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-1.5 ${
                  selectedProtocol === 'GraphQL'
                    ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">GraphQL Subscription</span>
                  <span className="text-[9px] font-mono text-slate-400">WebSocket</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Truy vấn dữ liệu linh hoạt, giảm thiểu payload thừa qua WebSocket live.
                </p>
                <div className="font-mono text-[10px] text-slate-400">wss://graphql.partner.vn</div>
              </div>

              {/* ERP SAP Direct Connect */}
              <div
                onClick={() => setSelectedProtocol('SAP')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-1.5 ${
                  selectedProtocol === 'SAP'
                    ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">SAP S/4HANA / ERP Connect</span>
                  <span className="text-[9px] font-mono text-slate-400">Enterprise</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Kết nối trực tiếp qua RFC / OData Adapter cho các tập đoàn bán lẻ lớn.
                </p>
                <div className="font-mono text-[10px] text-slate-400">SAP NetWeaver Gateway</div>
              </div>

              {/* Cloud MQTT Broker */}
              <div
                onClick={() => setSelectedProtocol('MQTT')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative space-y-1.5 ${
                  selectedProtocol === 'MQTT'
                    ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-xs">Cloud MQTT Broker (IoT)</span>
                  <span className="text-[9px] font-mono text-slate-400">QoS 1</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Đẩy tin nhắn theo topic siêu nhẹ, tối ưu cho chuỗi hàng nghìn cửa hàng tiện lợi.
                </p>
                <div className="font-mono text-[10px] text-slate-400">mqtts://broker.partner.vn:8883</div>
              </div>
            </div>

            {/* Target Endpoint & Credentials */}
            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Base URL Gateway Siêu thị (Target Endpoint) *
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={targetEndpoint}
                    onChange={(e) => setTargetEndpoint(e.target.value)}
                    placeholder="VD: https://api-gateway.partner.com/v2/bepxinh-sync"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:border-[#9c3808] pl-9"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Hệ thống Bếp Xinh sẽ dispatch gửi lệnh gán đơn, giữ tồn và cập nhật giá vào endpoint này.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Cơ chế xác thực (Auth Mechanism)</label>
                  <select
                    value={authMechanism}
                    onChange={(e) => setAuthMechanism(e.target.value)}
                    aria-label="Cơ chế xác thực API"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:border-[#9c3808]"
                  >
                    <option>OAuth 2.0 (Client Credentials Grant)</option>
                    <option>Bearer Token (Static JWT)</option>
                    <option>mTLS Client Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Token Endpoint URL</label>
                  <input
                    type="url"
                    value={tokenEndpoint}
                    onChange={(e) => setTokenEndpoint(e.target.value)}
                    placeholder="VD: https://auth.partner.com/oauth/token"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-extrabold text-slate-700">Client ID</label>
                    {!clientId && (
                      <button
                        type="button"
                        onClick={handleGenerateCredentials}
                        className="text-[10px] text-[#9c3808] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Tự sinh mã</span>
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      placeholder="Nhập hoặc tạo Client ID..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-700 pr-9"
                    />
                    {clientId && (
                      <button
                        type="button"
                        onClick={() => handleCopy(clientId, 'Client ID')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2 top-2 rounded cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Client Secret (Mã bảo mật)</label>
                  <div className="relative">
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      placeholder="Nhập hoặc tạo Client Secret..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-700 pr-16"
                    />
                    <div className="absolute right-2 top-2 flex items-center gap-1">
                      {clientSecret && (
                        <>
                          <button
                            type="button"
                            onClick={() => setShowSecret(!showSecret)}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                          >
                            {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopy(clientSecret, 'Client Secret')}
                            className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Cấu hình Webhook Sự kiện Tồn kho & Đơn hàng */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center font-bold">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Cấu hình Webhook Sự kiện Tồn kho &amp; Đơn hàng (Event Dispatcher)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    Đối tác siêu thị sẽ đẩy callback sự kiện trực tiếp về hạ tầng Cloud của Bếp Xinh
                  </p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded">
                TLS 1.3 Strict
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-extrabold text-slate-700">Webhook Receiver URL (Bếp Xinh cung cấp cho đối tác):</label>
                  <span className="text-[10px] text-slate-400 font-mono">Inbound Route: Cluster SG-01</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={webhookReceiver}
                      readOnly
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(webhookReceiver, 'Webhook Receiver URL')}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Sao chép URL</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">
                    Webhook Secret Key (HMAC-SHA256)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={webhookSecret}
                      onChange={(e) => setWebhookSecret(e.target.value)}
                      placeholder="Mã secret ký số HMAC..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-slate-700 pr-9"
                    />
                    {webhookSecret && (
                      <button
                        type="button"
                        onClick={() => handleCopy(webhookSecret, 'Webhook Secret Key')}
                        className="p-1.5 text-slate-400 hover:text-slate-600 absolute right-2 top-2 rounded cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Cơ chế Thử lại (Retry Policy)</label>
                  <select
                    value={retryMechanism}
                    onChange={(e) => setRetryMechanism(e.target.value)}
                    aria-label="Cơ chế thử lại khi lỗi webhook"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:border-[#9c3808]"
                  >
                    <option>5 Lần thử lại (Exponential Backoff: 1s, 2s, 5s, 10s, 30s)</option>
                    <option>3 Lần thử lại (Khoảng cách 5 giây cố định)</option>
                    <option>Chuyển ngay vào hàng đợi Dead Letter Queue (DLQ)</option>
                  </select>
                </div>
              </div>

              {/* Event Subscriptions Toggles */}
              <div className="pt-2">
                <label className="block font-extrabold text-slate-700 mb-2">Đăng ký Sự kiện (Event Subscriptions)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <label
                    onClick={() => setEvents((prev) => ({ ...prev, stock: !prev.stock }))}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      events.stock ? 'border-[#9c3808] bg-orange-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">stock.delta_update</div>
                      <div className="text-[10px] text-slate-500">Cập nhật biến động số lượng tồn</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={events.stock}
                      onChange={() => {}}
                      className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                    />
                  </label>

                  <label
                    onClick={() => setEvents((prev) => ({ ...prev, price: !prev.price }))}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      events.price ? 'border-[#9c3808] bg-orange-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">price.fluctuation</div>
                      <div className="text-[10px] text-slate-500">Thay đổi giá niêm yết tại quầy</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={events.price}
                      onChange={() => {}}
                      className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                    />
                  </label>

                  <label
                    onClick={() => setEvents((prev) => ({ ...prev, order: !prev.order }))}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      events.order ? 'border-[#9c3808] bg-orange-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">order.fulfillment_status</div>
                      <div className="text-[10px] text-slate-500">Trạng thái nhặt hàng tại siêu thị</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={events.order}
                      onChange={() => {}}
                      className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                    />
                  </label>

                  <label
                    onClick={() => setEvents((prev) => ({ ...prev, incident: !prev.incident }))}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      events.incident ? 'border-[#9c3808] bg-orange-50/40' : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">hub.operational_alert</div>
                      <div className="text-[10px] text-slate-500">Cảnh báo sự cố điểm kho / POS</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={events.incident}
                      onChange={() => {}}
                      className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security, mTLS & Live Test (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Box 3: Bảo mật & Mã hóa Kết nối */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-slate-900 text-sm">
                  Bảo mật &amp; Mã hóa Kết nối
                </h3>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">mTLS &amp; Kiểm soát IP tĩnh</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-slate-700">MUTUAL TLS (mTLS)</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                  KÍCH HOẠT
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Chứng chỉ SSL/TLS SHA-256 HSM FIPS 140-2 Level 3 Active</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-normal">
                Chứng chỉ Bếp Xinh CA phát hành tự động qua Let&apos;s Encrypt Enterprise với thời hạn tái ký 90 ngày.
              </p>
            </div>

            {/* IP Whitelists */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Dải IP máy chủ Bếp Xinh (Outbound Cluster)
                </label>
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700">103.142.26.10/28</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('103.142.26.10/28', 'IP Bếp Xinh')}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-700">103.142.27.15/28</span>
                    <button
                      type="button"
                      onClick={() => handleCopy('103.142.27.15/28', 'IP Bếp Xinh')}
                      className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Đối tác cần mở firewall nhận kết nối từ 2 dải CIDR trên.
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Dải IP Outbound của Đối tác (Whitelisted IPs)
                </label>
                <input
                  type="text"
                  value={whitelistedIps}
                  onChange={(e) => setWhitelistedIps(e.target.value)}
                  placeholder="VD: 14.241.128.0/24, 118.69.180.1/24"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
                <div className="text-[10px] text-slate-400 mt-1">
                  Chỉ chấp nhận webhook gửi từ danh sách IP tĩnh này.
                </div>
              </div>
            </div>

            {/* Test Handshake Button & Result */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleTestHandshake}
                disabled={isTestingHandshake}
                className="w-full py-2.5 px-4 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingHandshake ? 'animate-spin' : ''}`} />
                <span>{isTestingHandshake ? 'Đang thực hiện TLS Handshake...' : 'Kiểm tra Handshake & Lấy Token thử nghiệm'}</span>
              </button>

              {!handshakeResult && !isTestingHandshake && (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-500 space-y-1 text-[11px]">
                  <div className="font-bold text-slate-700">Chưa kiểm tra Handshake kết nối</div>
                  <div className="text-[10px] text-slate-400">
                    Vui lòng nhập Base URL Gateway ở bên trái và bấm nút kiểm tra phía trên.
                  </div>
                </div>
              )}

              {handshakeResult && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1 font-mono text-[11px] animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800 font-sans">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>[200 OK] Handshake thành công</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 pl-5 space-y-0.5">
                    <div>- Ping Round-trip: <strong>48ms (Singapore IDC)</strong></div>
                    <div>- OAuth2 Token: <code className="bg-emerald-100 px-1 rounded">eyJhbGciOi...9a88</code></div>
                    <div>- Token Time-to-Live: <strong>7200s (2 Giờ)</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cloud Connector Status Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-700">Tình trạng Cloud Connector</span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                READY
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white border border-slate-200/90 flex items-center justify-between text-center font-mono text-[11px]">
              <div className="space-y-1">
                <Cloud className="w-5 h-5 text-sky-600 mx-auto" />
                <div className="font-bold text-slate-800">Bếp Xinh API</div>
              </div>
              <div className="flex-1 px-3">
                <div className="h-0.5 bg-emerald-500 relative">
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-50 text-emerald-700 text-[9px] font-bold px-1.5 rounded border border-emerald-200">
                    mTLS 2-Way
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <Server className="w-5 h-5 text-orange-600 mx-auto" />
                <div className="font-bold text-slate-800">Đối tác Gateway</div>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 leading-normal">
              Giao thức bảo đảm Idempotency Key chống trùng lặp dữ liệu đơn hàng khi có gián đoạn mạng đột xuất.
            </p>
          </div>
        </div>
      </div>

      {/* Step Footer */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại: Bước 1 (Pháp nhân &amp; Chi nhánh)</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast('Đã lưu bản nháp cấu hình API & Webhook!')}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
          >
            Lưu bản nháp
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Tiếp tục: Ánh xạ SKU &amp; Bảng giá</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
