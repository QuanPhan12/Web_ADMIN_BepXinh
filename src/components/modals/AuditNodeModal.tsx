import React from 'react'
import { Server, Activity, ShieldCheck, X, HardDrive, Cpu, Terminal } from 'lucide-react'

interface AuditNodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AuditNodeModal: React.FC<AuditNodeModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  const logs = [
    {
      time: '08:47:12',
      event: 'TLS Handshake Completed (ECDHE-ECDSA-AES256-GCM-SHA384)',
      level: 'INFO',
    },
    {
      time: '08:47:19',
      event: 'Edge WAF Firewall: IP 118.69.182.10 verified (Vietnam VNPT)',
      level: 'INFO',
    },
    {
      time: '08:47:45',
      event: 'Mô-đun AI Auto-Audit V3.2: 0 recipes checked in past hour',
      level: 'SUCCESS',
    },
    {
      time: '08:48:01',
      event: 'Session Gateway Ready: Auth Node [HCM-SEC-CLUSTER-09] Healthy',
      level: 'SUCCESS',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-700">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Trạng thái Cụm Audit Node &amp; An ninh
            </h3>
            <p className="text-xs text-slate-500">
              Hệ thống Bếp Xinh Cloud Enterprise Telemetry
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-4">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <Cpu className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
            <div className="text-[11px] text-slate-500">Node Cluster</div>
            <div className="text-xs font-bold text-slate-800">HCM-SEC-09</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <Activity className="w-4 h-4 mx-auto text-blue-600 mb-1" />
            <div className="text-[11px] text-slate-500">Độ trễ Mạng</div>
            <div className="text-xs font-bold text-slate-800">4.2 ms</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <HardDrive className="w-4 h-4 mx-auto text-amber-600 mb-1" />
            <div className="text-[11px] text-slate-500">Mã hóa lưu trữ</div>
            <div className="text-xs font-bold text-slate-800">AES-XTS 512</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              Nhật ký kiểm toán thời gian thực (Audit Stream)
            </span>
            <span className="text-emerald-600 font-mono text-[10px] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              STREAMING
            </span>
          </div>

          <div className="bg-slate-950 text-slate-300 font-mono text-[11px] p-3.5 rounded-xl border border-slate-800 space-y-2 max-h-48 overflow-y-auto">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span
                  className={
                    log.level === 'SUCCESS'
                      ? 'text-emerald-400 font-semibold'
                      : 'text-sky-300'
                  }
                >
                  {log.level}:
                </span>
                <span className="text-slate-200">{log.event}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Chữ ký xác thực toàn vẹn SHA-256
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
