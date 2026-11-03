import React, { useState, useRef } from 'react'
import {
  Store,
  RefreshCw,
  Clock,
  Layers,
  Activity,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Key,
  ShieldCheck,
  Search,
  Download,
  Terminal,
  Copy,
  Trash2,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Lock,
  Plus,
  SlidersHorizontal,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import type { AppView } from '../../types'
import { ForceSyncModal } from './ForceSyncModal'
import { UpdateApiCredentialsModal } from './UpdateApiCredentialsModal'
import { PartnerAuditModal } from './PartnerAuditModal'
import { CertificateDetailsModal } from './CertificateDetailsModal'
import { NewPartnerIntegrationModal } from './NewPartnerIntegrationModal'
import { PartnerOnboardingWizard } from './onboarding/PartnerOnboardingWizard'
import { PartnerAuditLogsView } from './PartnerAuditLogsView'

interface SupermarketPartnersViewProps {
  onNavigate?: (view: AppView) => void
}

interface SupermarketItem {
  id: string
  name: string
  shortName: string
  code: string
  protocol: string
  endpoint: string
  latency: string
  skuCount: string
  skuSuccessRate: string
  lastSync: string
  syncBatch?: string
  uptime: string
  status: 'active' | 'error' | 'syncing'
  badge: string
  badgeColor?: string
  logoColor: string
  isPinging?: boolean
}

const INITIAL_PARTNERS: SupermarketItem[] = []

export const SupermarketPartnersView: React.FC<SupermarketPartnersViewProps> = ({ onNavigate }) => {
  const { showToast } = useProfile()

  // State: whether the Tops Market incident is active
  const [isIncidentActive, setIsIncidentActive] = useState<boolean>(false)

  // Layout mode: 'cards' vs 'table'
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table')

  const [partners, setPartners] = useState<SupermarketItem[]>([])

  const hasData = partners.length > 0

  const [isBannerDismissed, setIsBannerDismissed] = useState<boolean>(false)

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHub, setSelectedHub] = useState('all')

  // Modals state
  const [isForceSyncOpen, setIsForceSyncOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return params.get('modal') === 'force-sync'
    } catch {}
    return false
  })
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)
  const [isAuditLogsViewOpen, setIsAuditLogsViewOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return (
        params.get('subview') === 'audit_logs' ||
        params.get('subview') === 'audit' ||
        params.get('tab') === 'audit' ||
        params.get('view_mode') === 'audit'
      )
    } catch {}
    return false
  })
  const [isCertModalOpen, setIsCertModalOpen] = useState(false)
  const [isNewPartnerModalOpen, setIsNewPartnerModalOpen] = useState(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      return (
        params.get('subview') === 'onboarding' ||
        params.has('step') ||
        params.has('doc')
      )
    } catch {}
    return false
  })

  // Terminal scroll & logs
  const terminalRef = useRef<HTMLDivElement>(null)
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])

  // Reconnection state
  const [isReconnecting, setIsReconnecting] = useState(false)

  // Handle Recovery of Tops Market
  const handleRecoverTopsMarket = () => {
    setIsReconnecting(true)
    setTimeout(() => {
      setIsReconnecting(false)
      setIsIncidentActive(false)
      setPartners((prev) =>
        prev.map((p) => {
          if (p.id === 'tops') {
            return {
              ...p,
              status: 'active',
              badge: '● REFRESHED',
              badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
              logoColor: 'bg-amber-100 text-amber-800 border-amber-200',
              latency: '78ms',
              skuSuccessRate: '99.7% thành công',
              lastSync: '25 giây trước (Bearer Auth Active)',
            }
          }
          return p
        })
      )
      setTerminalLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] [AUTH] [OAuthMgr] Token successfully refreshed with Tops Market Central Retail!`,
        `[${new Date().toLocaleTimeString()}] [200 OK] [Worker#3] GET https://api.topsmarket.vn/v2/inventory synced 11,280 items in 78ms.`,
      ])
      showToast('Khôi phục kết nối Tops Market Central Retail thành công! Trạng thái: REFRESHED.')
    }, 1200)
  }

  // Handle Simulating Incident again
  const handleSimulateIncident = () => {
    setIsIncidentActive(true)
    setIsBannerDismissed(false)
    setPartners(INITIAL_PARTNERS)
    showToast('Đã chuyển về trạng thái mô phỏng Sự cố P1 (Tops Market Disconnected).')
  }

  // Handle Ping test on a specific partner
  const handlePing = (partnerId: string) => {
    setPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, isPinging: true } : p))
    )
    setTimeout(() => {
      setPartners((prev) =>
        prev.map((p) => {
          if (p.id === partnerId) {
            const randomLatency = Math.floor(Math.random() * 30) + 38
            return {
              ...p,
              isPinging: false,
              latency: `${randomLatency}ms`,
            }
          }
          return p
        })
      )
      showToast(`Ping tới ${partnerId.toUpperCase()} thành công! Thời gian phản hồi: 42ms.`)
    }, 600)
  }

  // Add new partner
  const handleAddPartner = (newP: SupermarketItem) => {
    setPartners((prev) => [...prev, newP])
  }

  // Filtered partners
  const filteredPartners = partners.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.endpoint.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (isOnboardingOpen) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none font-sans">
        <PartnerOnboardingWizard
          onCancel={() => setIsOnboardingOpen(false)}
          onCompleteGoLive={(newP) => {
            handleAddPartner(newP)
            setIsOnboardingOpen(false)
          }}
        />
      </div>
    )
  }

  if (isAuditLogsViewOpen) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none font-sans">
        <PartnerAuditLogsView onBack={() => setIsAuditLogsViewOpen(false)} />
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none font-sans">
      {/* Modals */}
      <ForceSyncModal
        isOpen={isForceSyncOpen}
        onClose={() => setIsForceSyncOpen(false)}
        onSuccessRecovery={handleRecoverTopsMarket}
      />
      <UpdateApiCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => setIsCredentialsModalOpen(false)}
        onSuccessRecovery={handleRecoverTopsMarket}
      />
      <PartnerAuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
      />
      <CertificateDetailsModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
      <NewPartnerIntegrationModal
        isOpen={isNewPartnerModalOpen}
        onClose={() => setIsNewPartnerModalOpen(false)}
        onAddPartner={handleAddPartner}
      />

      {/* Breadcrumb & Global Pipeline Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <button
            type="button"
            onClick={() => onNavigate?.('dashboard')}
            className="hover:text-slate-600 cursor-pointer"
          >
            Đối tác &amp; Tích hợp
          </button>
          <span>›</span>
          <span className="hover:text-slate-600">Đối tác Siêu thị API</span>
          <span>›</span>
          <span className="font-semibold text-slate-700">
            {isIncidentActive ? 'Cấu hình kết nối & Tồn kho' : 'GATEWAY_V2_PROD'}
          </span>
        </div>

        {hasData ? (
          !isIncidentActive ? (
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ALL PIPELINES HEALTHY • Sync Clock: 08:52:53.512 GMT+7
            </span>
          ) : (
            <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
              1 Đối tác gián đoạn P1 (Tops Market)
            </span>
          )
        ) : (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            CHƯA CÓ KẾT NỐI • 0 Pipelines Active
          </span>
        )}
      </div>

      {/* Top Banner (Shown when Incident is Active and Has Data) */}
      {hasData && isIncidentActive && !isBannerDismissed && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-50 border border-rose-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-rose-900 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-[12px] tracking-tight uppercase text-rose-900">
                  CẢNH BÁO HỆ THỐNG CẤP ĐỘ P1 ● ERR_SYNC_GATEWAY_TIMEOUT
                </span>
              </div>
              <p className="text-[11px] text-rose-700 font-medium mt-0.5">
                01 đối tác siêu thị đang bị gián đoạn kết nối API thời gian thực. Các đơn hàng đi chợ qua chuỗi này tạm thời chuyển sang xử lý bán tự động.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => {
                terminalRef.current?.scrollIntoView({ behavior: 'smooth' })
                showToast('Chuyển tới bảng điều khiển Syslog thời gian thực...')
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-800 hover:bg-rose-100 font-bold text-[11px] flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Kiểm tra Log lỗi</span>
            </button>
            <button
              type="button"
              onClick={() => setIsBannerDismissed(true)}
              className="p-1.5 text-rose-400 hover:text-rose-700 rounded-lg hover:bg-rose-100/60 transition-colors cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Header & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#9c3808] text-white flex items-center justify-center shadow-xs shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Quản lý Kết nối Đối tác Siêu thị &amp; Tồn kho API
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Giám sát trạng thái pipeline Webhook, API Gateway và đồng bộ catalog thực phẩm đa kênh theo thời gian thực (WinMart+, Tops Market, Co.op Food, Bách Hóa Xanh, AEON Gourmet).
            </p>
          </div>
        </div>

        {/* Primary Action Buttons (Matching Mockup) */}
        <div className="flex flex-col sm:flex-col gap-1.5 shrink-0 self-start sm:self-center">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsAuditLogsViewOpen(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>📋 Lịch sử kiểm tra (Audit Logs)</span>
            </button>

            {hasData && (
              <button
                type="button"
                onClick={() => {
                  setPartners([])
                  setIsIncidentActive(false)
                  showToast('Đã xóa toàn bộ dữ liệu đối tác siêu thị API và đặt lại thông tin là 0!')
                }}
                className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title="Xóa toàn bộ dữ liệu và đặt các chỉ số là 0"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Xóa dữ liệu (0)</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsForceSyncOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#9c3808]" />
            <span>🔄 Quét lại toàn bộ (Force Sync Now)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm đối tác siêu thị (+ New Integration)</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Đối tác hoạt động */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              ĐỐI TÁC HOẠT ĐỘNG
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {hasData ? (isIncidentActive ? '4 / 5' : '5 / 5') : '0 / 0'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {hasData ? (isIncidentActive ? 'đối tác' : '100% ONLINE') : '0% ONLINE'}
            </span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-[11px]">
            {hasData ? (
              isIncidentActive ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" />
                  -1 đối tác gián đoạn từ 10:14 AM
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  0 sự cố gián đoạn • Uptime 99.98%
                </span>
              )
            ) : (
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Store className="w-3.5 h-3.5" />
                0 sự cố gián đoạn • Uptime 0.0%
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Tồn kho đồng bộ / SKU Live */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              {hasData && isIncidentActive ? 'TỒN KHO ĐỒNG BỘ' : 'TỔNG SKU ĐỒNG BỘ LIVE'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {hasData ? (isIncidentActive ? '92.4%' : '48,920') : '0'}
            </span>
            <span className="text-xs font-semibold text-slate-500 font-mono">
              {hasData ? (isIncidentActive ? '/ 48,920 SKU' : '+1,240 mới') : '+0 mới'}
            </span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-[11px]">
            {hasData ? (
              isIncidentActive ? (
                <span className="text-amber-600 font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Giảm 7.6% (Tops Market chưa sync)
                </span>
              ) : (
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Khớp giá &amp; kho: 99.4% (+2.8%)
                </span>
              )
            ) : (
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Khớp giá &amp; kho: 0.0% (+0.0%)
              </span>
            )}
          </div>
        </div>

        {/* Card 3: Độ trễ API TB */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              {hasData && isIncidentActive ? 'ĐỘ TRỄ API TB' : 'ĐỘ TRỄ API DISPATCH'}
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {hasData ? (isIncidentActive ? '1.2s' : '48ms') : '0ms'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {hasData ? (isIncidentActive ? 'chuẩn: < 240ms' : '-15% vs w-1') : '0% vs w-1'}
            </span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-[11px]">
            {hasData ? (
              isIncidentActive ? (
                <span className="text-rose-600 font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Tăng 400% do timeout retry loops
                </span>
              ) : (
                <div className="w-full flex items-center gap-2">
                  <span className="text-slate-500 text-[10px]">Tiêu chuẩn SLA: &lt;250ms</span>
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="w-1/4 h-full bg-emerald-500 rounded-full"></div>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full flex items-center gap-2">
                <span className="text-slate-400 text-[10px]">Tiêu chuẩn SLA: &lt;250ms</span>
                <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className="w-0 h-full bg-slate-300 rounded-full"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 4: Sự cố đang mở / MTTR */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              {hasData && isIncidentActive ? 'SỰ CỐ ĐANG MỞ' : 'SỰ CỐ MỞ (MTTR)'}
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${hasData && isIncidentActive ? 'bg-rose-100 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-tight ${hasData && isIncidentActive ? 'text-rose-600' : 'text-slate-900'}`}>
              {hasData && isIncidentActive ? '1' : '0'}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              {hasData && isIncidentActive ? 'Sự cố nghiêm trọng P1' : '100% SLA Tuần'}
            </span>
          </div>
          <div className="pt-1 flex items-center gap-1.5 text-[11px]">
            {hasData && isIncidentActive ? (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Kéo dài: 48 phút 21 giây
              </span>
            ) : (
              <span className="text-slate-500 font-medium">
                Thời gian phản hồi TB: <strong className="text-slate-700">{hasData ? '1.2m' : '0m'}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Section Title, View Mode Switch & Status (Shown in Cards Mode) */}
      {viewMode === 'cards' && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Danh sách Gateways Siêu thị
            </h2>
            <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono">
              {partners.length} Đơn vị tích hợp
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Status indicators */}
            <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {isIncidentActive ? '4 Hoạt động' : '5 Hoạt động'}
            </span>
            {isIncidentActive && (
              <span className="flex items-center gap-1.5 text-rose-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                1 Lỗi cấp độ cao
              </span>
            )}

            <span className="text-slate-300">•</span>

            {/* Quick Simulation Trigger */}
            <button
              type="button"
              onClick={isIncidentActive ? handleRecoverTopsMarket : handleSimulateIncident}
              className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
              title="Nhấn để kiểm tra tự động phục hồi kết nối Tops Market hoặc chuyển về sự cố P1"
            >
              <Activity className="w-3 h-3 text-slate-400" />
              <span>{isIncidentActive ? '⚡ Khôi phục Tops Market' : '⚠ Mô phỏng Sự cố P1'}</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer bg-white text-slate-800 shadow-2xs"
              >
                Thẻ (Image 1)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer text-slate-500 hover:text-slate-700"
              >
                Bảng (Image 3)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: CARD & INCIDENT VIEW (Image 1 Style) */}
      {viewMode === 'cards' && (
        <div className="space-y-4">
          {!hasData ? (
            <div className="py-16 px-6 text-center space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#9c3808] shadow-xs">
                <Store className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-black text-slate-800">
                  Chưa có đối tác siêu thị nào được kết nối
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hệ thống API Gateway hiện tại chưa có chuỗi siêu thị nào được cấu hình (0/0 đối tác). Toàn bộ dữ liệu kết nối, SKU và tồn kho đã được đặt lại là 0.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm đối tác siêu thị (+ New Integration)</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Main Incident Card: Tops Market Central Retail */}
              {isIncidentActive && (
                <div className="p-5 rounded-2xl border-2 border-rose-300 bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-rose-100">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 font-black text-sm flex items-center justify-center border border-rose-200 shadow-2xs">
                          TOPS
                        </div>
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">
                          !
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-900 text-base">
                            Tops Market Central Retail
                          </h3>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold">
                            PARTNER_ID: #TOP-0021
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          Khu vực phân phối: Toàn quốc • Trung tâm điều phối chính: TP. Hồ Chí Minh &amp; Hà Nội
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black tracking-wide shadow-2xs flex items-center gap-1.5 animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-white"></span>
                        MẤT KẾT NỐI (DISCONNECTED)
                      </span>
                    </div>
                  </div>

                  {/* Error Details Callout */}
                  <div className="p-4 rounded-xl bg-rose-100/60 border border-rose-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-black text-rose-900 text-xs">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Mất kết nối API (Lỗi 401: Unauthorized)</span>
                      </div>
                      <span className="bg-rose-600 text-white text-[10px] font-black font-mono px-2 py-0.5 rounded">
                        HTTP CODE: 401 UNAUTHORIZED
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 leading-relaxed">
                      Access Token đối tác đã hết hạn vào lúc <strong className="font-mono bg-rose-200/80 px-1 rounded">10:14:02 hôm nay</strong> hoặc chứng chỉ SSL/Client Secret không hợp lệ. Endpoint không phản hồi token làm mới tự động OAuth2.
                    </p>

                    {/* Target Endpoint container */}
                    <div className="p-2.5 rounded-lg bg-white/90 border border-rose-200 text-[11px] font-mono text-slate-700 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">Target Endpoint:</span>
                        <span className="font-semibold text-rose-800">https://api.topsmarket.vn/v2/inventory</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-500 text-[10px]">
                        <span>Auth Scheme: <strong>Bearer Token</strong></span>
                        <span>Retry attempts: <strong className="text-rose-600">12/12 Failed</strong></span>
                        <span>TTL: <strong className="text-rose-600">0s (Expired)</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Mini Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-rose-200/70 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400">
                        SKU BỊ TREO ĐỒNG BỘ
                      </div>
                      <div className="text-lg font-black text-slate-900 font-mono">11,280 SKU</div>
                      <div className="text-[10px] text-amber-700 font-medium">Chuyển sang mode Cache tĩnh</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-rose-200/70 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400">
                        ĐƠN CHỜ XÁC NHẬN KHO
                      </div>
                      <div className="text-lg font-black text-slate-900 font-mono">37 Đơn hàng</div>
                      <div className="text-[10px] text-slate-500 font-medium">Tạm chuyển sang điều phối thủ công</div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-rose-200/70 space-y-1">
                      <div className="text-[10px] font-extrabold uppercase text-slate-400">
                        THỜI GIAN OFFLINE
                      </div>
                      <div className="text-lg font-black text-rose-600 font-mono">00:48:21</div>
                      <div className="text-[10px] text-rose-600 font-bold">SLA Vi phạm SLA &gt; 15 phút</div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isReconnecting}
                        onClick={handleRecoverTopsMarket}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isReconnecting ? 'animate-spin' : ''}`} />
                        <span>{isReconnecting ? 'Đang thử lại kết nối...' : 'Thử kết nối lại'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          terminalRef.current?.scrollIntoView({ behavior: 'smooth' })
                          showToast('Đang theo dõi log luồng topsmarket-sync-worker.log...')
                        }}
                        className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Terminal className="w-3.5 h-3.5 text-slate-500" />
                        <span>Xem Log lỗi (401)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsCredentialsModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>Cập nhật API Key &amp; Secret</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <a
                        href="#docs"
                        onClick={(e) => {
                          e.preventDefault()
                          showToast('Mở tài liệu API v2.5...')
                        }}
                        className="text-[#9c3808] hover:underline font-semibold"
                      >
                        Xem hướng dẫn cấu hình Tops API v2
                      </a>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => showToast('Đã gửi SMS khẩn cấp tới Tech Lead chuỗi Tops Market!')}
                        className="hover:text-slate-800 text-slate-500 font-medium underline cursor-pointer"
                      >
                        Gửi SMS khẩn cấp tới Tech Lead Tops
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4 Healthy Gateways Grid (2x2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partners
                  .filter((p) => p.id !== 'tops' || !isIncidentActive)
                  .map((partner) => (
                    <div
                      key={partner.id}
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#9c3808]/40 transition-all space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-xl font-black text-xs flex items-center justify-center border shadow-2xs ${partner.logoColor}`}>
                            {partner.shortName}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-slate-900 text-sm">
                                {partner.name}
                              </h3>
                              <span className="font-mono text-[10px] text-slate-400 font-bold">
                                {partner.code}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                              {partner.protocol}
                            </p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold flex items-center gap-1.5 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {partner.badge.replace('● ', '')}
                        </span>
                      </div>

                      {/* 3 Metric Stats */}
                      <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-slate-50/70 border border-slate-100 text-center font-mono">
                        <div>
                          <div className="text-[10px] font-sans font-bold text-slate-400">Độ trễ Ping</div>
                          <div className="text-xs font-black text-emerald-600 mt-0.5">{partner.latency}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-sans font-bold text-slate-400">Tổng SKU</div>
                          <div className="text-xs font-black text-slate-800 mt-0.5">{partner.skuCount} SKU</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-sans font-bold text-slate-400">Sync cuối</div>
                          <div className="text-[11px] font-sans font-medium text-slate-600 mt-0.5 truncate">{partner.lastSync}</div>
                        </div>
                      </div>

                      {/* Endpoint & SSL */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        <span className="truncate max-w-[280px]">{partner.endpoint}</span>
                        <span className="text-emerald-600 font-bold font-sans text-[10px] flex items-center gap-1 shrink-0">
                          <Lock className="w-3 h-3" />
                          SSL Valid
                        </span>
                      </div>

                      {/* Footer & Actions */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                        <span className="text-slate-400 text-[11px]">
                          Uptime 30 ngày: <strong className="text-slate-700 font-mono">{partner.uptime}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handlePing(partner.id)}
                            disabled={partner.isPinging}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <RefreshCw className={`w-3 h-3 ${partner.isPinging ? 'animate-spin' : ''}`} />
                            <span>{partner.isPinging ? 'Pinging...' : 'Ping'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              showToast(`Mở cấu hình chi tiết cho ${partner.name}...`)
                            }}
                            className="text-[#9c3808] hover:text-[#832f07] font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <span>Chi tiết Gateway</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          {/* Bottom Live Syslog Terminal (Matches Image 1) */}
          <div
            ref={terminalRef}
            className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs select-text"
          >
            {/* Terminal Window Header */}
            <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                </div>
                <span className="font-bold text-slate-300">
                  live-syslog.bepxinh-backend-04 / topsmarket-sync-worker.log
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="bg-rose-950/80 text-rose-400 border border-rose-800/60 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  TAIL -F [AUTO-SCROLL]
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(terminalLogs.join('\n'))
                    showToast('Đã sao chép toàn bộ nhật ký Syslog vào clipboard!')
                  }}
                  className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>Sao chép Log</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTerminalLogs([])
                    showToast('Đã xóa trắng màn hình console.')
                  }}
                  className="px-2 py-0.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Xóa màn hình</span>
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-1 text-slate-300 leading-relaxed max-h-72 overflow-y-auto">
              {terminalLogs.length === 0 ? (
                <p className="text-slate-600 italic">Màn hình console đang trống.</p>
              ) : (
                terminalLogs.map((log, idx) => {
                  const isErr = log.includes('[ERR]') || log.includes('error') || log.includes('Failed')
                  const isWarn = log.includes('[WRN]')
                  const isSuccess = log.includes('[200 OK]') || log.includes('successfully')
                  return (
                    <div
                      key={idx}
                      className={`${
                        isErr
                          ? 'text-rose-400'
                          : isWarn
                          ? 'text-amber-300'
                          : isSuccess
                          ? 'text-emerald-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {log}
                    </div>
                  )
                })
              )}
            </div>

            {/* Terminal Window Footer */}
            <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-2">
                <span>Channel: <strong className="text-slate-400">TLS 1.3 / AES-256-GCM</strong></span>
                <span>•</span>
                <span>Cluster: <strong className="text-slate-400">mgp-prod-k8s-pod-99</strong></span>
              </span>

              <span className={`font-bold flex items-center gap-1 ${isIncidentActive ? 'text-rose-500' : 'text-emerald-500'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isIncidentActive ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                {isIncidentActive ? 'GATEWAY_DISCONNECTED' : 'GATEWAY_CONNECTED_OK'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: TABLE & FULL CATALOG RECONCILIATION (Image 3 Style) */}
      {viewMode === 'table' && (
        <div className="space-y-6">
          {/* Table Filter Bar */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm chuỗi đối tác, Partner ID, Host Endpoint..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-12 py-2 border border-slate-200 bg-slate-50/50 rounded-xl text-slate-700 focus:outline-none focus:border-[#9c3808]"
              />
              <span className="absolute right-3 top-2.5 font-mono text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">
                ⌘K
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
              <select
                aria-label="Lọc theo trạng thái kết nối"
                className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-bold focus:outline-none focus:border-[#9c3808] cursor-pointer"
              >
                <option>Tất cả trạng thái ({hasData ? partners.length : 0})</option>
                <option>Đang hoạt động (Active)</option>
                <option>Có cảnh báo</option>
              </select>

              <select
                aria-label="Lọc theo khu vực trung tâm phân phối"
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-bold focus:outline-none focus:border-[#9c3808] cursor-pointer"
              >
                <option value="all">Toàn quốc (All Hubs)</option>
                <option value="hcm">TP. Hồ Chí Minh</option>
                <option value="hn">Hà Nội</option>
                <option value="dnb">Đông Nam Bộ</option>
              </select>

              <button
                type="button"
                onClick={() => showToast('Đang kết xuất báo cáo hiệu suất Gateway PDF/CSV...')}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Xuất báo cáo</span>
              </button>

              <button
                type="button"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
                title="Tùy chỉnh cột"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section Title & Live Refresh Status (Matches Mockup) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Đầu mối API Siêu thị Đang kết nối
              </h2>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                hasData ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {hasData ? `${partners.length} ACTIVE` : '0 ACTIVE'}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{hasData ? 'Tự động làm mới chu kỳ 10 giây một lần' : 'Chưa kích hoạt luồng đồng bộ'}</span>
            </div>
          </div>

          {/* Table Container or Empty State */}
          {filteredPartners.length === 0 ? (
            <div className="py-16 px-6 text-center space-y-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#9c3808] shadow-xs">
                <Store className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1.5">
                <h3 className="text-base font-black text-slate-800">
                  Chưa có đối tác siêu thị nào được kết nối
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Hệ thống API Gateway hiện tại chưa có chuỗi siêu thị nào được cấu hình (0/0 đối tác). Toàn bộ dữ liệu kết nối, SKU và tồn kho đã được đặt lại là 0.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm đối tác siêu thị (+ New Integration)</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">CHUỖI SIÊU THỊ / ĐỐI TÁC</th>
                      <th className="py-3 px-4">PHƯƠNG THỨC &amp; ENDPOINT</th>
                      <th className="py-3 px-4">ĐỘ TRỄ (PING)</th>
                      <th className="py-3 px-4">SKU QUẢN LÝ</th>
                      <th className="py-3 px-4">ĐỒNG BỘ CUỐI</th>
                      <th className="py-3 px-4">UPTIME 30D</th>
                      <th className="py-3 px-4 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPartners.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Name & Badge */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center border shadow-2xs ${p.logoColor}`}>
                              {p.shortName}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-black text-slate-900">{p.name}</span>
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                                  p.status === 'error'
                                    ? 'bg-rose-100 text-rose-700'
                                    : p.id === 'tops'
                                    ? 'bg-teal-50 text-teal-700 border border-teal-200'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                }`}>
                                  {p.status === 'error' ? 'DISCONNECTED' : p.id === 'tops' ? '● REFRESHED' : '● ACTIVE'}
                                </span>
                              </div>
                              <div className="font-mono text-[10px] text-slate-400">
                                PARTNER_ID: {p.code}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Protocol & Endpoint */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-bold text-slate-800 font-sans text-xs">{p.protocol}</div>
                          <div className="text-[10px] text-slate-400 truncate max-w-xs flex items-center gap-1 mt-0.5">
                            <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                            <span className="truncate">{p.endpoint}</span>
                          </div>
                        </td>

                        {/* Ping */}
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span className={`flex items-center gap-1 ${p.status === 'error' ? 'text-rose-600' : 'text-emerald-600'}`}>
                            <span>{p.latency}</span>
                            {p.status !== 'error' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          </span>
                        </td>

                        {/* SKU */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="font-black text-slate-900 text-xs">{p.skuCount}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{p.skuSuccessRate}</div>
                        </td>

                        {/* Last Sync */}
                        <td className="py-3.5 px-4 font-mono">
                          <div className="text-xs text-slate-700 font-bold">{p.lastSync}</div>
                          {p.syncBatch && (
                            <div className={`text-[10px] font-bold ${
                              p.syncBatch.includes('OK') || p.syncBatch.includes('Active')
                                ? 'text-emerald-600'
                                : p.syncBatch.includes('Sync') || p.syncBatch.includes('QoS')
                                ? 'text-teal-600'
                                : 'text-slate-500'
                            }`}>
                              {p.syncBatch}
                            </div>
                          )}
                        </td>

                        {/* Uptime */}
                        <td className="py-3.5 px-4 font-mono">
                          <span className="font-bold text-slate-800">{p.uptime}</span>
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1.5 align-middle"></span>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handlePing(p.id)}
                            disabled={p.isPinging}
                            className="px-3 py-1 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer shadow-2xs"
                          >
                            {p.isPinging ? 'Pinging...' : 'Ping'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bottom Split Section: Catalog Reconciliation & Live Console (Image 3) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Left Column: Ánh xạ Danh mục Thực phẩm & Tồn kho */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-amber-600">❖</span>
                  <h3 className="font-black text-slate-900 text-sm">
                    Ánh xạ Danh mục Thực phẩm &amp; Tồn kho
                  </h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                  hasData
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {hasData ? 'AUTO-RECONCILED' : 'CHƯA ÁNH XẠ (0 SKU)'}
                </span>
              </div>

              {/* 3 Category Progress Bars */}
              <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-slate-500 font-bold text-[10px]">
                    <span>Rau củ quả hữu cơ</span>
                    <span className={hasData ? "text-emerald-600 font-mono" : "text-slate-400 font-mono"}>
                      {hasData ? '100%' : '0%'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: hasData ? '100%' : '0%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400">{hasData ? '14,200 / 14,200 SKU' : '0 / 0 SKU'}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-slate-500 font-bold text-[10px]">
                    <span>Thịt, cá &amp; hải sản tươi</span>
                    <span className={hasData ? "text-emerald-600 font-mono" : "text-slate-400 font-mono"}>
                      {hasData ? '99.2%' : '0%'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: hasData ? '99.2%' : '0%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400">{hasData ? '18,410 / 18,550 SKU' : '0 / 0 SKU'}</div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-sans text-slate-500 font-bold text-[10px]">
                    <span>Gia vị &amp; đồ khô tuyển</span>
                    <span className={hasData ? "text-teal-600 font-mono" : "text-slate-400 font-mono"}>
                      {hasData ? '99.8%' : '0%'}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: hasData ? '99.8%' : '0%' }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400">{hasData ? '16,310 / 16,340 SKU' : '0 / 0 SKU'}</div>
                </div>
              </div>

              {/* Realtime Ingredients Table */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex justify-between">
                  <span>NGUYÊN LIỆU TRỌNG ĐIỂM</span>
                  <span>ĐỐI TÁC CUNG CẤP / TỒN KHO REALTIME</span>
                </div>

                {!hasData ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Store className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">Chưa có dữ liệu tồn kho thời gian thực</p>
                    <p className="text-[11px] text-slate-400">0 nguyên liệu trọng điểm được ánh xạ • Cần kết nối API đối tác để đồng bộ</p>
                  </div>
                ) : (
                  <div className="space-y-2 text-xs">
                    {/* Row 1 */}
                    <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-black text-lg border border-rose-200 shadow-2xs shrink-0">
                          🥩
                        </div>
                        <div>
                          <div className="font-black text-slate-800">Thịt ba chỉ rút sườn heo sạch</div>
                          <div className="text-[10px] font-mono text-slate-400">Mã SKU: BX-MEAT-4921</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 font-mono">
                          185,000 đ/kg <span className="text-slate-400 font-sans text-[10px]">WinMart+ Flagship</span>
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          428 kg Sẵn sàng giao
                        </span>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-lg border border-amber-200 shadow-2xs shrink-0">
                          🥩
                        </div>
                        <div>
                          <div className="font-black text-slate-800">Thăn bò mềm thượng hạng</div>
                          <div className="text-[10px] font-mono text-slate-400">Mã SKU: TM-BEEF-6810</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 font-mono">
                          340,000 đ/kg <span className="text-slate-400 font-sans text-[10px]">Tops Market Central</span>
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          158 kg Ổn định
                        </span>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg border border-emerald-200 shadow-2xs shrink-0">
                          🌿
                        </div>
                        <div>
                          <div className="font-black text-slate-800">Tiêu xanh Phú Quốc nguyên chùm</div>
                          <div className="text-[10px] font-mono text-slate-400">Mã SKU: CPF-SPICE-110</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 font-mono">
                          48,000 đ/hộp <span className="text-slate-400 font-sans text-[10px]">Co.op Food ĐNB</span>
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          92 hộp Tươi mới
                        </span>
                      </div>
                    </div>

                    {/* Row 4 */}
                    <div className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100/70 transition-colors flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-black text-lg border border-orange-200 shadow-2xs shrink-0">
                          🍯
                        </div>
                        <div>
                          <div className="font-black text-slate-800">Mật ong hoa nhãn rừng nguyên chất</div>
                          <div className="text-[10px] font-mono text-slate-400">Mã SKU: AN-HONEY-900</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-slate-900 font-mono">
                          160,000 đ/hũ <span className="text-slate-400 font-sans text-[10px]">AEON Gourmet Mart</span>
                        </div>
                        <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          310 hũ Đủ kho
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live API Dispatch Console */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden font-mono text-xs select-text flex flex-col justify-between">
              <div>
                {/* Console Header */}
                <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                    </div>
                    {hasData ? (
                      <span className="font-bold text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        LIVE_API_DISPATCH_CONSOLE
                      </span>
                    ) : (
                      <span className="font-bold text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                        API_DISPATCH_CONSOLE (STANDBY)
                      </span>
                    )}
                  </div>
                  <span className="text-slate-500 text-[10px]">
                    {hasData ? 'TLS 1.3 / AES-256' : 'TLS 1.3 / AES-256 • STANDBY'}
                  </span>
                </div>

                {/* Console Log stream */}
                <div className="p-4 space-y-1.5 text-slate-300 leading-relaxed max-h-80 overflow-y-auto">
                  {hasData ? (
                    <>
                      <p className="text-slate-500">
                        [SYS_INIT] Connected to Enterprise Edge Gateway cluster (SG-01). Subscribed to topics: /wh/stock, /wh/price, /wh/catalog...
                      </p>
                      <p>
                        <span className="text-emerald-400">[200 OK]</span> 10:42:11 WM-1048: PATCH /sku/WM-MEAT-4921 stock_qty: 420 -&gt; ACK (24ms)
                      </p>
                      <p>
                        <span className="text-emerald-400">[200 OK]</span> 10:42:13 CPF-339: WS_MESSAGE inventory_delta (batch: 48 items) [62ms]
                      </p>
                      <p>
                        <span className="text-amber-400">[AUTH]</span> 10:42:16 TOP-0021: OAuth2 token refresh granted. Expires in 7200s
                      </p>
                      <p>
                        <span className="text-emerald-400">[200 OK]</span> 10:42:17 AON-901: MQTT PUB /grocery/stock (QoS 1) id:91823 ACK (18ms)
                      </p>
                      <p>
                        <span className="text-emerald-400">[200 OK]</span> 10:42:19 BHX-5510: POST /v3/webhook/ack (payload: 1.2KB) synced_items=14
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-slate-500">
                        [SYS_INIT] Connected to Enterprise Edge Gateway cluster (SG-01).
                      </p>
                      <p className="text-slate-400">
                        [SYS_IDLE] No active partner streams connected (0 partners active). Polling suspended.
                      </p>
                      <p className="text-slate-500">
                        [SYS_WAIT] Listening on webhook endpoints: /api/v2/partners/*/callback (Standby)...
                      </p>
                      <p className="text-slate-500">
                        [SYS_INFO] Stock delta reconciliation engine paused. Standby mode active (0 events/sec).
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Console Footer */}
              <div className="px-4 py-2.5 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-slate-400">
                  {hasData ? 'Channel: masan-coop-tops-aeon.stream' : 'Channel: standby.stream (0 packets)'}
                </span>
                <button
                  type="button"
                  onClick={() => showToast('Màn hình stream đã được làm mới')}
                  className="hover:text-slate-300 cursor-pointer text-slate-500 text-[10px]"
                >
                  Xóa màn hình
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Mutual TLS Security Capsule (Matches Image 3) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-sm tracking-tight">
              Bảo mật Tích hợp Mutual TLS (mTLS) &amp; Quản trị Chứng chỉ Số
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Tất cả {hasData ? 5 : 0} kết nối siêu thị đều được ký số SHA-256 HSM FIPS 140-2 Level 3. Chứng chỉ kết nối: {hasData ? <strong className="text-slate-700">Tháng 11/2026</strong> : <strong className="text-slate-500">Đang chờ cấu hình (0 chứng chỉ hoạt động)</strong>}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <span className={`px-2.5 py-1 rounded-md text-[11px] font-black tracking-wide border ${
            hasData
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-slate-100 text-slate-600 border-slate-200'
          }`}>
            {hasData ? 'Zero Trust Ingress Active' : '0 Ingress Certificates'}
          </span>
          <button
            type="button"
            onClick={() => setIsCertModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer shadow-2xs"
          >
            Xem Chứng chỉ
          </button>
        </div>
      </div>
    </div>
  )
}
