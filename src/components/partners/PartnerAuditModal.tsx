import React, { useState } from 'react'
import { X, Search, Shield, Download } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface PartnerAuditModalProps {
  isOpen: boolean
  onClose: () => void
}

interface AuditLogEntry {
  id: string
  timestamp: string
  partner: string
  action: string
  status: 'SUCCESS' | 'ERROR' | 'WARNING'
  code: string
  latency: string
  details: string
}

const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8891',
    timestamp: '10:14:16',
    partner: 'Tops Market Central',
    action: 'POST /v2/inventory/sync',
    status: 'ERROR',
    code: '401 Unauthorized',
    latency: '1,240ms',
    details: 'Bearer token expired. Remote host rejected credentials. Circuit breaker incremented.',
  },
  {
    id: 'LOG-8890',
    timestamp: '10:14:02',
    partner: 'Tops Market Central',
    action: 'POST /oauth/token (refresh_token)',
    status: 'ERROR',
    code: '401 Unauthorized',
    latency: '890ms',
    details: 'Invalid refresh_token secret signature. Signature verification failed.',
  },
  {
    id: 'LOG-8889',
    timestamp: '10:12:45',
    partner: 'WinMart+ Flagship',
    action: 'PATCH /v1/pos-sync (Batch #8021)',
    status: 'SUCCESS',
    code: '200 OK',
    latency: '42ms',
    details: 'Synced 500 items, delta_updated: 14, unmapped: 0. SAP ERP direct stream.',
  },
  {
    id: 'LOG-8888',
    timestamp: '10:11:03',
    partner: 'Co.op Food TP.HCM',
    action: 'GraphQL Subscription Delta',
    status: 'SUCCESS',
    code: '200 OK',
    latency: '62ms',
    details: 'WS_MESSAGE inventory_delta (batch: 48 items). Auto-reconciled.',
  },
  {
    id: 'LOG-8887',
    timestamp: '10:09:50',
    partner: 'AEON Gourmet & Mart',
    action: 'MQTT PUB /grocers/stock (QoS 1)',
    status: 'SUCCESS',
    code: '200 OK',
    latency: '54ms',
    details: 'Broker Event ACK id:91823. Flash sale price updated for 8,200 SKU.',
  },
  {
    id: 'LOG-8886',
    timestamp: '10:05:12',
    partner: 'Bách Hóa Xanh Online',
    action: 'POST /v3/warehouse/webhook',
    status: 'SUCCESS',
    code: '200 OK',
    latency: '89ms',
    details: 'JWT token auto-renewed. Fresh food batch stock 11,070 SKU.',
  },
]

export const PartnerAuditModal: React.FC<PartnerAuditModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useProfile()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'ERROR'>('ALL')

  if (!isOpen) return null

  const filteredLogs = AUDIT_LOGS.filter((log) => {
    const matchesSearch =
      log.partner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'ALL' || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9c3808] flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base tracking-tight">
                Nhật Ký Kiểm Tra &amp; Đối Soát Gateway API (Audit Logs)
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ghi nhận bất biến toàn bộ luồng request, response, token refresh và sự cố mạng đa kênh
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

        {/* Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo chuỗi, action, mã log..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#9c3808]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['ALL', 'SUCCESS', 'ERROR'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-md font-bold text-[11px] transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {st === 'ALL' ? 'Tất cả' : st === 'SUCCESS' ? 'Thành công (200)' : 'Lỗi (4xx/5xx)'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => showToast('Đang kết xuất tệp nhật ký đối soát CSV...')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4">Thời gian &amp; ID</th>
                <th className="py-2.5 px-4">Đối tác &amp; Action</th>
                <th className="py-2.5 px-4">HTTP Status</th>
                <th className="py-2.5 px-4">Độ trễ</th>
                <th className="py-2.5 px-4">Chi tiết phản hồi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono">
                    <div className="font-bold text-slate-800">{log.timestamp}</div>
                    <div className="text-[10px] text-slate-400">{log.id}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800">{log.partner}</div>
                    <div className="font-mono text-[10px] text-slate-500">{log.action}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black font-mono inline-block ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-100 text-emerald-800'
                          : log.status === 'ERROR'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {log.code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] font-bold text-slate-700">
                    {log.latency}
                  </td>
                  <td className="py-3 px-4 text-slate-600 text-[11px] max-w-xs truncate">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs text-slate-500">
          <span>Hiển thị 6 / 2,480 bản ghi trong 24h qua</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
