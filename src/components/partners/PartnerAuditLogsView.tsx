import React, { useState, useMemo } from 'react'
import {
  Search,
  Download,
  Clock,
  RefreshCw,
  AlertCircle,
  Activity,
  Layers,
  Copy,
  Check,
  Share2,
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Archive,
  Terminal,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface PartnerAuditLogsViewProps {
  onBack: () => void
}

export interface AuditLogItem {
  id: string
  traceId: string
  time: string
  date: string
  partnerName: string
  gatewayCode: string
  partnerColor: string
  actionTitle: string
  actionActor: string
  dataMetric: string
  statusBadge: string
  statusColor: 'emerald' | 'rose' | 'amber' | 'slate' | 'indigo'
  httpCode: string
  httpStatus: '200 OK' | '401 UNAUTHORIZED' | '429 TOO MANY REQUESTS' | '504 TIMEOUT'
  executor: string
  sourceIp: string
  startTime: string
  duration: string
  durationColor?: string
  progressTitle: string
  progressPercent: number
  matchedSkus?: number
  priceChangedSkus?: number
  outOfStockSkus?: number
  protocolDetails: {
    mtlsCert: string
    signature: string
    userAgent: string
    correlationId: string
    extra?: string
  }
  rawPayload: Record<string, any>
}

const INITIAL_AUDIT_LOGS: AuditLogItem[] = []

export const PartnerAuditLogsView: React.FC<PartnerAuditLogsViewProps> = ({ onBack }) => {
  const { showToast, isEmptyData } = useProfile()

  const [sampleLoaded] = useState<boolean>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        return params.get('sample') === 'true'
      }
    } catch {}
    return false
  })

  const hasData = !isEmptyData || sampleLoaded

  // State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPartner, setSelectedPartner] = useState<string>('all')
  const [selectedEventType, setSelectedEventType] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | '7days'>('today')
  const [selectedLogId, setSelectedLogId] = useState<string>('trc-1')
  const [isCopiedJson, setIsCopiedJson] = useState(false)
  const [copiedTraceId, setCopiedTraceId] = useState<string | null>(null)
  const [isRetentionModalOpen, setIsRetentionModalOpen] = useState(false)

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (!hasData) return []
    return INITIAL_AUDIT_LOGS.filter((item) => {
      // Search
      const matchSearch =
        item.traceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.partnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actionTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.actionActor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gatewayCode.toLowerCase().includes(searchTerm.toLowerCase())

      if (!matchSearch) return false

      // Partner filter
      if (selectedPartner !== 'all') {
        if (selectedPartner === 'winmart' && !item.partnerName.includes('WinMart')) return false
        if (selectedPartner === 'tops' && !item.partnerName.includes('Tops')) return false
        if (selectedPartner === 'coop' && !item.partnerName.includes('Co.op')) return false
        if (selectedPartner === 'bhx' && !item.partnerName.includes('Bách Hóa')) return false
        if (selectedPartner === 'aeon' && !item.partnerName.includes('AEON')) return false
        if (selectedPartner === 'sandbox' && !item.partnerName.includes('Sandbox')) return false
      }

      // Event Type filter
      if (selectedEventType !== 'all') {
        if (selectedEventType === 'forcesync' && !item.actionTitle.includes('Force Sync')) return false
        if (selectedEventType === 'cron' && !item.actionTitle.includes('Cron')) return false
        if (selectedEventType === 'error' && !item.actionTitle.includes('lỗi')) return false
        if (selectedEventType === 'token' && !item.actionTitle.includes('OAuth2')) return false
        if (selectedEventType === 'mapping' && !item.actionTitle.includes('Ánh xạ')) return false
      }

      // Severity filter
      if (selectedSeverity !== 'all') {
        if (selectedSeverity === 'error' && item.statusColor !== 'rose') return false
        if (selectedSeverity === 'warning' && item.statusColor !== 'amber') return false
        if (selectedSeverity === 'success' && item.statusColor !== 'emerald') return false
      }

      return true
    })
  }, [hasData, searchTerm, selectedPartner, selectedEventType, selectedSeverity])

  // Selected Log item
  const activeLog = useMemo(() => {
    if (!hasData) return null
    return INITIAL_AUDIT_LOGS.find((l) => l.id === selectedLogId) || INITIAL_AUDIT_LOGS[0] || null
  }, [hasData, selectedLogId])

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm('')
    setSelectedPartner('all')
    setSelectedEventType('all')
    setSelectedSeverity('all')
    setSelectedTimeRange('today')
    showToast('Đã đặt lại tất cả bộ lọc kiểm tra.')
  }

  // Copy Trace ID
  const handleCopyTrace = (trace: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard?.writeText(trace)
    setCopiedTraceId(trace)
    showToast(`Đã sao chép mã Trace ID: ${trace}`)
    setTimeout(() => setCopiedTraceId(null), 2000)
  }

  // Copy JSON Payload
  const handleCopyJson = () => {
    if (!activeLog) return
    navigator.clipboard?.writeText(JSON.stringify(activeLog.rawPayload, null, 2))
    setIsCopiedJson(true)
    showToast(`Đã sao chép Raw JSON Payload của ${activeLog.traceId}`)
    setTimeout(() => setIsCopiedJson(false), 2000)
  }

  // Export CSV
  const handleExport = (format: 'CSV' | 'JSON') => {
    showToast(`Đang xuất ${filteredLogs.length} bản ghi Audit Log dạng ${format}...`)
    setTimeout(() => {
      showToast(`Xuất tệp ${format} thành công!`)
    }, 1000)
  }

  return (
    <div className="space-y-6 select-none font-sans max-w-7xl mx-auto">
      {/* Retention Policy Modal */}
      {isRetentionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsRetentionModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Archive className="w-5 h-5 text-[#9c3808]" />
                <h3 className="font-black text-slate-900 text-sm">Chính Sách Lưu Trữ Log 90 Ngày</h3>
              </div>
              <button
                onClick={() => setIsRetentionModalOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-2.5 leading-relaxed">
              <p>
                Toàn bộ nhật ký API Gateway và sự kiện đồng bộ tồn kho được lưu trữ bất biến (Immutable Audit Storage)
                trong <strong>90 ngày</strong> theo chuẩn bảo mật <strong>ISO/IEC 27001</strong>.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] space-y-1">
                <div>• Retention Window: 90 Days (Active Cold Storage)</div>
                <div>• Encryption: AES-256 at Rest &amp; in Transit</div>
                <div>• Checksum: SHA-256 Daily Tamper-Proof Hash</div>
              </div>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsRetentionModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#9c3808] text-white font-bold text-xs hover:bg-[#832f07] transition-all cursor-pointer shadow-xs"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#9c3808] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Bếp Xinh Admin</span>
            </button>
            <span>›</span>
            <button
              type="button"
              onClick={onBack}
              className="hover:text-[#9c3808] transition-colors cursor-pointer"
            >
              Đối tác Siêu thị API
            </button>
            <span>›</span>
            <span className="text-[#9c3808] font-bold">Lịch sử kiểm tra (Audit Logs)</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Lịch sử Kiểm tra &amp; Nhật ký Đồng bộ API
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-extrabold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ISO/IEC 27001 Validated
            </span>
          </div>

          <p className="text-xs text-slate-500 max-w-3xl leading-relaxed">
            Truy vết toàn bộ nhật ký giao dịch API Gateway, các đợt quét tồn kho tự động/thủ công, nhật ký đổi khóa xác thực
            và lịch sử cảnh báo lỗi kỹ thuật theo chuẩn bảo mật doanh nghiệp.
          </p>
        </div>

        {/* Action Buttons Top Right */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
          <button
            type="button"
            onClick={handleResetFilters}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <X className="w-3.5 h-3.5 text-slate-400" />
            <span>Xóa bộ lọc</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('CSV')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Xuất CSV / JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRetentionModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9c3808] text-white hover:bg-[#832f07] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Clock className="w-3.5 h-3.5 text-white/90" />
            <span>Lưu trữ Log: 90 ngày</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              TỔNG SỰ KIỆN 24H QUA
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
            {hasData ? '1,420,890' : '0'}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className={`font-extrabold flex items-center gap-0.5 ${hasData ? 'text-emerald-600' : 'text-slate-400'}`}>
              {hasData ? '↗ +8.4% vs hôm qua' : '0.0% vs hôm qua'}
            </span>
            <span className="text-slate-400 font-medium">{hasData ? '99.98% HTTP 2xx' : '0% HTTP 2xx'}</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              ĐỢT QUÉT TỒN KHO (SYNC JOBS)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
            {hasData ? '142 phiên' : '0 phiên'}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-600 font-medium">{hasData ? '138 Tự động (Cron)' : '0 Tự động (Cron)'}</span>
            <span className={`font-bold ${hasData ? 'text-[#9c3808]' : 'text-slate-400'}`}>{hasData ? '4 Force Sync' : '0 Force Sync'}</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              SỰ CỐ &amp; NGOẠI LỆ
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${hasData ? 'text-rose-600' : 'text-slate-900'}`}>
            {hasData ? '03 sự cố' : '0 sự cố'}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-600 font-medium truncate max-w-[140px]">
              {hasData ? '1 Lỗi Auth 401 (Đã khắc phục)' : '0 Lỗi Auth 401'}
            </span>
            <span className={`font-extrabold ${hasData ? 'text-emerald-600' : 'text-slate-400'}`}>
              {hasData ? '2 Timeout < 2s' : '0 Timeout'}
            </span>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
              THỜI GIAN PHẢN HỒI TB
            </span>
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-none">
            {hasData ? '46 ms' : '0 ms'}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className={`font-extrabold flex items-center gap-1 ${hasData ? 'text-emerald-600' : 'text-slate-400'}`}>
              <Check className="w-3.5 h-3.5" /> {hasData ? 'Tối ưu hoàn toàn' : 'Hệ thống rảnh'}
            </span>
            <span className="text-slate-400 font-medium">SLA &lt; 250ms</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo Trace ID, Partner..."
            className="w-full pl-9 pr-12 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#9c3808]/20 focus:border-[#9c3808] transition-all"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </div>

        {/* Dropdown 1: Partner */}
        <select
          value={selectedPartner}
          onChange={(e) => setSelectedPartner(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#9c3808]/20 focus:border-[#9c3808] transition-all cursor-pointer"
        >
          <option value="all">Tất cả đối tác (WinMart+, Tops, Co.op...)</option>
          <option value="winmart">WinMart+ Hub</option>
          <option value="tops">Tops Market Central</option>
          <option value="coop">Co.op Food TP.HCM</option>
          <option value="bhx">Bách Hóa Xanh</option>
          <option value="aeon">AEON Mall Celadon</option>
          <option value="sandbox">Toàn hệ thống (Sandbox)</option>
        </select>

        {/* Dropdown 2: Event Type */}
        <select
          value={selectedEventType}
          onChange={(e) => setSelectedEventType(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#9c3808]/20 focus:border-[#9c3808] transition-all cursor-pointer"
        >
          <option value="all">Tất cả loại sự kiện</option>
          <option value="forcesync">Quét lại toàn bộ (Force Sync)</option>
          <option value="cron">Đồng bộ tồn kho định kỳ (Cron)</option>
          <option value="error">Cảnh báo lỗi (Error 401 / 429)</option>
          <option value="token">Gia hạn OAuth2 Token</option>
          <option value="mapping">Ánh xạ SKU mới</option>
        </select>

        {/* Dropdown 3: Severity */}
        <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="all">Mức độ: Tất cả</option>
            <option value="error">Lỗi (Error 401/429)</option>
            <option value="warning">Cảnh báo (Warning)</option>
            <option value="success">Thành công (200 OK)</option>
          </select>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSelectedTimeRange('today')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
              selectedTimeRange === 'today'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={() => setSelectedTimeRange('7days')}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTimeRange === '7days'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>7 ngày qua</span>
            <Calendar className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Table + Right Audit Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Bảng Truy Vết Giao Dịch Gateway (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col">
          {/* Table Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="font-black text-slate-900 text-sm tracking-tight">
                Bảng Truy Vết Giao Dịch Gateway
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-200">
                Live Feed
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px]">Tự động làm mới mỗi 15 giây</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-3">THỜI GIAN</th>
                  <th className="py-3 px-2.5">MÃ TRACE ID</th>
                  <th className="py-3 px-2.5">ĐỐI TÁC / GATEWAY</th>
                  <th className="py-3 px-2.5">HÀNH ĐỘNG / TÁC VỤ</th>
                  <th className="py-3 px-3 text-right">DỮ LIỆU / PHẠM VI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-16 text-center text-slate-400">
                      <div className="max-w-sm mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 text-[#9c3808] flex items-center justify-center mx-auto shadow-xs">
                          <Clock className="w-6 h-6" />
                        </div>
                        <p className="text-sm font-black text-slate-800">Chưa có bản ghi nhật ký kiểm tra nào (0 bản ghi)</p>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Toàn bộ lịch sử truy vết giao dịch API Gateway đã được xóa và đặt lại thông tin là 0.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((item) => {
                    const isSelected = selectedLogId === item.id
                    const isError = item.statusColor === 'rose'
                    const isWarning = item.statusColor === 'amber'

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedLogId(item.id)}
                        className={`transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50/40 border-l-4 border-l-[#9c3808]'
                            : isError
                            ? 'bg-rose-50/30 hover:bg-rose-50/60'
                            : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* 1. Time */}
                        <td className="py-3.5 px-3 font-mono whitespace-nowrap">
                          <span
                            className={`font-bold block ${
                              isError
                                ? 'text-rose-600'
                                : isWarning
                                ? 'text-amber-700'
                                : 'text-slate-800'
                            }`}
                          >
                            {item.time}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-sans">
                            {item.date}
                          </span>
                        </td>

                        {/* 2. Trace ID */}
                        <td className="py-3.5 px-2.5 font-mono whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => handleCopyTrace(item.traceId, e)}
                            className={`inline-flex items-center gap-1 font-bold group ${
                              isSelected
                                ? 'text-[#9c3808]'
                                : isError
                                ? 'text-rose-600'
                                : isWarning
                                ? 'text-amber-700'
                                : 'text-slate-700 hover:text-[#9c3808]'
                            }`}
                          >
                            <span>{item.traceId}</span>
                            {copiedTraceId === item.traceId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                            )}
                          </button>
                        </td>

                        {/* 3. Partner / Gateway */}
                        <td className="py-3.5 px-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-slate-800">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                isError
                                  ? 'bg-rose-500'
                                  : isWarning
                                  ? 'bg-amber-500'
                                  : item.partnerColor === 'text-blue-600'
                                  ? 'bg-blue-500'
                                  : item.partnerColor === 'text-indigo-600'
                                  ? 'bg-indigo-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                            <span className="truncate max-w-[125px]">{item.partnerName}</span>
                          </div>
                          <span
                            className={`font-mono text-[10px] block mt-0.5 ${
                              isError ? 'text-rose-500 font-bold' : 'text-slate-400'
                            }`}
                          >
                            {item.gatewayCode}
                          </span>
                        </td>

                        {/* 4. Action / Actor */}
                        <td className="py-3.5 px-2.5 max-w-[185px]">
                          <span
                            className={`font-bold block truncate ${
                              isError
                                ? 'text-rose-600'
                                : isWarning
                                ? 'text-amber-800'
                                : 'text-slate-900'
                            }`}
                          >
                            {item.actionTitle}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                            {item.actionActor}
                          </span>
                        </td>

                        {/* 5. Data / Scope */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <span
                            className={`font-black block font-mono ${
                              isError ? 'text-rose-600' : 'text-slate-800'
                            }`}
                          >
                            {item.dataMetric}
                          </span>
                          <span
                            className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              isError
                                ? 'bg-rose-100 text-rose-700'
                                : isWarning
                                ? 'bg-amber-100 text-amber-800'
                                : 'text-emerald-700 bg-emerald-50'
                            }`}
                          >
                            {item.statusBadge}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Hiển thị <strong className="text-slate-800">{hasData ? `1 - ${filteredLogs.length}` : 0}</strong> trong tổng số{' '}
              <strong className="text-slate-800">{hasData ? '4,820' : 0}</strong> bản ghi kiểm tra
            </div>

            <div className="flex items-center gap-1 font-mono text-xs">
              <button
                disabled
                className="w-7 h-7 rounded-lg border border-slate-200 text-slate-300 flex items-center justify-center cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#9c3808] text-white font-bold flex items-center justify-center shadow-2xs">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center">
                2
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button className="w-8 h-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center">
                603
              </button>
              <button className="w-7 h-7 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center">
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AUDIT INSPECTOR (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4 sticky top-6">
          {!activeLog ? (
            <div className="py-20 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">Chưa có bản ghi nào được chọn</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                0 bản ghi giao dịch được chọn. Hãy chọn một bản ghi từ bảng khi có dữ liệu đồng bộ.
              </p>
            </div>
          ) : (
            <>
              {/* Header of Inspector */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                AUDIT INSPECTOR
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black font-mono ${
                  activeLog.httpCode === '200'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeLog.httpCode === '401'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                HTTP {activeLog.httpStatus}
              </span>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href)
                  showToast('Đã sao chép liên kết phiên kiểm tra!')
                }}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Chia sẻ"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  showToast('Đã thu gọn bảng kiểm tra chi tiết.')
                }}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Đóng chi tiết"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Trace ID Big Title */}
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 font-mono tracking-tight">
              {activeLog.traceId}
            </h3>
          </div>

          {/* Transaction Metadata List */}
          <div className="space-y-2 text-xs divide-y divide-slate-100">
            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-400 text-[11px]">Tác vụ:</span>
              <span className="font-bold text-slate-900 text-right">{activeLog.actionTitle}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">Người thực hiện:</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1.5 text-right">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {activeLog.executor}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">Địa chỉ IP nguồn:</span>
              <span className="font-mono text-slate-700 font-medium text-right">
                {activeLog.sourceIp}
              </span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">Thời gian bắt đầu:</span>
              <span className="font-mono text-slate-700 text-right">{activeLog.startTime}</span>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400 text-[11px]">Tổng thời lượng quét:</span>
              <span className={`font-mono font-bold text-right ${activeLog.durationColor || 'text-slate-800'}`}>
                {activeLog.duration}
              </span>
            </div>
          </div>

          {/* Gateway Verification Progress Bar */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                TIẾN TRÌNH XÁC THỰC GATEWAY
              </span>
              <span
                className={`font-bold font-mono text-[11px] ${
                  activeLog.statusColor === 'rose' ? 'text-rose-600' : 'text-emerald-700'
                }`}
              >
                {activeLog.progressTitle}
              </span>
            </div>

            {/* Tri-color Segmented Progress */}
            <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                style={{ width: `${activeLog.progressPercent > 80 ? 95 : activeLog.progressPercent}%` }}
                className={`${
                  activeLog.statusColor === 'rose' ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              />
              {activeLog.priceChangedSkus && activeLog.priceChangedSkus > 0 && (
                <div style={{ width: '4%' }} className="bg-amber-400" />
              )}
              {activeLog.outOfStockSkus && activeLog.outOfStockSkus > 0 && (
                <div style={{ width: '1%' }} className="bg-rose-500" />
              )}
            </div>

            {/* Breakdown Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {activeLog.matchedSkus?.toLocaleString('vi-VN') || 0} SKU Khớp
              </span>
              <span className="flex items-center gap-1 font-semibold text-amber-700">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                {activeLog.priceChangedSkus?.toLocaleString('vi-VN') || 0} Thay đổi giá
              </span>
              <span className="flex items-center gap-1 font-semibold text-rose-700">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                {activeLog.outOfStockSkus?.toLocaleString('vi-VN') || 0} Hết hàng
              </span>
            </div>
          </div>

          {/* Section: Protocol & mTLS Info */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-extrabold uppercase text-slate-400 block">
              THÔNG SỐ GIAO THỨC &amp; MTLS
            </span>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 font-mono text-[10.5px] text-slate-700 leading-relaxed space-y-1 select-text">
              <div>
                <strong className="text-slate-900">mTLS Cert:</strong>{' '}
                {activeLog.protocolDetails.mtlsCert}
              </div>
              <div>
                <strong className="text-slate-900">Signature:</strong>{' '}
                {activeLog.protocolDetails.signature}
              </div>
              <div>
                <strong className="text-slate-900">User-Agent:</strong>{' '}
                {activeLog.protocolDetails.userAgent}
              </div>
              <div className="truncate">
                <strong className="text-slate-900">X-Correlation-ID:</strong>{' '}
                {activeLog.protocolDetails.correlationId}
              </div>
              {activeLog.protocolDetails.extra && (
                <div className="text-rose-600 font-bold pt-0.5">
                  {activeLog.protocolDetails.extra}
                </div>
              )}
            </div>
          </div>

          {/* Section: Raw Payload (Response Snippet) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>RAW PAYLOAD (RESPONSE SNIPPET)</span>
              </div>
              <button
                type="button"
                onClick={handleCopyJson}
                className="text-[11px] font-bold text-[#9c3808] hover:text-[#832f07] flex items-center gap-1 transition-colors cursor-pointer"
              >
                {isCopiedJson ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Đã sao chép</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[10.5px] overflow-x-auto max-h-48 border border-slate-800 leading-relaxed select-text">
              <pre className="whitespace-pre">
                {JSON.stringify(activeLog.rawPayload, null, 2)}
              </pre>
            </div>
          </div>
        </>
      )}
    </div>
  </div>
</div>
  )
}
