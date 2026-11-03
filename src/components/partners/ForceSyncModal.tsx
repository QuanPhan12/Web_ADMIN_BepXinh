import React, { useState, useEffect } from 'react'
import {
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface ForceSyncModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccessRecovery?: () => void
}

export const ForceSyncModal: React.FC<ForceSyncModalProps> = ({
  isOpen,
  onClose,
  onSuccessRecovery,
}) => {
  const { showToast } = useProfile()
  const [targetScope, setTargetScope] = useState<'all' | 'custom'>('all')
  const [selectedPartners, setSelectedPartners] = useState<string[]>([
    'winmart',
    'coop',
    'tops',
    'bhx',
    'aeon',
  ])

  // Data sync options
  const [options, setOptions] = useState({
    stock: true,
    price: true,
    token: true,
    unmapped: true,
  })

  // Simulated sync execution state
  const [isExecuting, setIsExecuting] = useState(true)
  const [progress, setProgress] = useState(68.0)
  const [syncedSku, setSyncedSku] = useState(33265)
  const totalSku = 48920

  useEffect(() => {
    if (!isOpen) return
    setIsExecuting(true)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExecuting(false)
          return 100
        }
        return Math.min(100, +(prev + 3.2).toFixed(1))
      })
      setSyncedSku((prev) => Math.min(totalSku, prev + 1540))
    }, 1200)

    return () => clearInterval(interval)
  }, [isOpen])

  if (!isOpen) return null

  const togglePartner = (key: string) => {
    if (selectedPartners.includes(key)) {
      if (selectedPartners.length > 1) {
        setSelectedPartners(selectedPartners.filter((p) => p !== key))
      }
    } else {
      setSelectedPartners([...selectedPartners, key])
    }
  }

  const handleFinish = () => {
    showToast('Đã hoàn tất đồng bộ toàn bộ 5 cổng Gateway siêu thị!')
    if (onSuccessRecovery) {
      onSuccessRecovery()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center shrink-0 shadow-xs">
              <RefreshCw className={`w-5 h-5 ${isExecuting ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base tracking-tight">
                  Cấu hình &amp; Kích hoạt Quét lại toàn bộ (Force Sync Now)
                </h3>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                  LIVE DISPATCH
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                <span>Mã phiên thực thi: <strong className="font-mono text-slate-700">JOB_DISPATCH_FORCE_20251024_089</strong></span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Socket Kênh đôi (Bidirectional)
                </span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
          {/* Warning Banner */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 text-amber-900">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5 leading-relaxed">
              <div className="font-black text-[12px] text-amber-900">
                Lưu ý an toàn vận hành &amp; Giới hạn tốc độ (Rate Limiting)
              </div>
              <p className="text-[11px] text-amber-800 font-medium">
                Thao tác này gửi lệnh ghi đè đồng thời đến toàn bộ 5 cổng Gateway siêu thị (WinMart+, Co.op Food, Tops Market, Bách Hóa Xanh, AEON Mart). Ước tính xử lý ~<strong>48,920 SKU</strong> và tạo đỉnh lưu lượng xấp xỉ ~<strong>850 req/sec</strong> trong vòng 3-5 phút tới.
              </p>
            </div>
          </div>

          {/* 2-Column Configuration Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. Đối tác mục tiêu áp dụng */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 text-[12px]">
                  1. Đối tác mục tiêu áp dụng
                </span>
                <span className="text-[11px] font-bold text-slate-500">
                  5 Gateway được cấp phép
                </span>
              </div>

              <div className="space-y-2">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#9c3808]/40 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scope"
                      checked={targetScope === 'all'}
                      onChange={() => setTargetScope('all')}
                      className="text-[#9c3808] focus:ring-[#9c3808]"
                    />
                    <span className="font-bold text-slate-700">Toàn bộ đối tác (5/5 chuỗi siêu thị trực tiếp)</span>
                  </div>
                  <span className="font-black font-mono text-slate-900">48,920 SKU</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-white hover:border-[#9c3808]/40 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="scope"
                      checked={targetScope === 'custom'}
                      onChange={() => setTargetScope('custom')}
                      className="text-[#9c3808] focus:ring-[#9c3808]"
                    />
                    <span className="font-semibold text-slate-700">Hoặc chọn lọc từng đối tác riêng biệt</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium">Tùy biến endpoint</span>
                </label>
              </div>

              {/* Partner Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  { id: 'winmart', label: 'WinMart+', count: '12,450', active: selectedPartners.includes('winmart') },
                  { id: 'coop', label: 'Co.op Food', count: '14,120', active: selectedPartners.includes('coop') },
                  { id: 'tops', label: 'Tops Market', count: '11,280', active: selectedPartners.includes('tops') },
                  { id: 'bhx', label: 'BHX', count: '11,070', active: selectedPartners.includes('bhx') },
                  { id: 'aeon', label: 'AEON', count: '8,200', active: selectedPartners.includes('aeon') },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => togglePartner(item.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1.5 border transition-all ${
                      item.active
                        ? 'bg-slate-100 text-slate-800 border-slate-300 shadow-2xs'
                        : 'bg-white text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                    <span>{item.label}</span>
                    <span className="text-[10px] font-mono font-normal text-slate-500">{item.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Tùy chọn khối dữ liệu */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-50/60 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-800 text-[12px]">
                  2. Tùy chọn khối dữ liệu
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Tối ưu I/O
                </span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    key: 'stock',
                    title: 'Biến động tồn kho tức thời',
                    desc: 'Delta & Real-time Stock [Bắt buộc]',
                    checked: options.stock,
                  },
                  {
                    key: 'price',
                    title: 'Bảng giá niêm yết & Flash-sale POS',
                    desc: 'Đồng bộ giá khuyến mãi 30 phút',
                    checked: options.price,
                  },
                  {
                    key: 'token',
                    title: 'Khóa phiên OAuth2 / Bearer Token',
                    desc: 'Tái ký JWT Signature xác thực',
                    checked: options.token,
                  },
                  {
                    key: 'unmapped',
                    title: 'Đối soát SKU mới phát sinh',
                    desc: 'Lập chỉ mục Unmapped catalog',
                    checked: options.unmapped,
                  },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white transition-colors cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={opt.checked}
                      onChange={() =>
                        setOptions((prev) => ({
                          ...prev,
                          [opt.key]: !prev[opt.key as keyof typeof options],
                        }))
                      }
                      className="mt-0.5 text-[#9c3808] rounded focus:ring-[#9c3808]"
                    />
                    <div>
                      <div className="font-bold text-slate-800 text-[11px]">{opt.title}</div>
                      <div className="text-[10px] text-slate-500">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Realtime Sync Progress Section */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-[13px]">
                  Tiến độ Đồng bộ Hệ thống
                </span>
                <span className="font-black font-mono text-orange-600 text-[13px]">
                  {progress}%
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
                <span>
                  Đã nạp: <strong className="font-mono text-slate-800">{syncedSku.toLocaleString()}</strong> / {totalSku.toLocaleString()} SKU
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-emerald-700 font-bold flex items-center gap-1 font-mono">
                  ⚡ 412 SKU/giây
                </span>
              </div>
            </div>

            {/* Visual Striped Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-[#9c3808] to-emerald-600 rounded-full transition-all duration-300 relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute inset-0 opacity-25 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.7)_10px,rgba(255,255,255,0.7)_20px)] animate-[pulse_2s_infinite]"></div>
              </div>
            </div>

            {/* 5 Partner Mini Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
              {/* WinMart */}
              <div className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">WinMart+ Flagship</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="text-[10px] text-emerald-700 font-extrabold">Hoàn tất 100%</div>
                <div className="text-[10px] text-slate-500 font-mono">12,450 SKU • 18s</div>
                <div className="text-[9px] text-slate-400 font-medium">RUM Latency 42ms</div>
              </div>

              {/* Co.op Food */}
              <div className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Co.op Food TP.HCM</span>
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                </div>
                <div className="text-[10px] text-amber-700 font-extrabold">Đang quét 85%</div>
                <div className="text-[10px] text-slate-500 font-mono">12,002 / 14,120 SKU</div>
                <div className="text-[9px] text-slate-400 font-medium">ETA Còn lại ~6s</div>
              </div>

              {/* Tops Market */}
              <div className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">Tops Market Central</span>
                  <RefreshCw className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                </div>
                <div className="text-[10px] text-orange-700 font-extrabold">Đang quét 45%</div>
                <div className="text-[10px] text-slate-500 font-mono">5,076 / 11,280 SKU</div>
                <div className="text-[9px] text-slate-400 font-medium">ETA Còn lại ~14s</div>
              </div>

              {/* BHX */}
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">BHX Online API</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 font-bold">Xếp hàng chờ</div>
                <div className="text-[10px] text-slate-400 font-mono">11,070 SKU sẵn sàng</div>
                <div className="text-[9px] text-slate-400 font-medium">Thứ tự Pool #4 Active</div>
              </div>

              {/* AEON */}
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-[11px]">AEON Gourmet</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="text-[10px] text-slate-500 font-bold">Xếp hàng chờ</div>
                <div className="text-[10px] text-slate-400 font-mono">8,200 SKU sẵn sàng</div>
                <div className="text-[9px] text-slate-400 font-medium">Thứ tự Pool #5 Active</div>
              </div>
            </div>

            {/* Console Tail inside Modal */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
              <div className="flex items-center justify-between text-[10px] text-slate-400 pb-1.5 border-b border-slate-800">
                <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  CONSOLE TAIL /PROC/SYNC_GATEWAY.STDOUT
                </span>
                <span className="text-[9px] font-bold text-slate-500">AUTO-SCROLL: ON</span>
              </div>
              <div className="text-slate-400 font-mono leading-relaxed pt-1 space-y-0.5">
                <p>
                  <span className="text-slate-500">[15:10:02.110]</span> <span className="text-sky-400">[INFO]</span> Dispatching batch #84 (size: 500) to <span className="text-slate-300">https://api.winmart.masangroup.com/v1/sync</span>
                </p>
                <p>
                  <span className="text-slate-500">[15:10:02.488]</span> <span className="text-emerald-400">[200 OK]</span> WinMart ACK 500 items, delta_updated: 14, unmapped: 0, thread_latency: 38ms
                </p>
                <p>
                  <span className="text-slate-500">[15:10:03.015]</span> <span className="text-sky-400">[INFO]</span> Streaming Co.op Food GraphQL delta mutations (cluster worker-sg-c2-02)...
                </p>
                <p>
                  <span className="text-slate-500">[15:10:03.740]</span> <span className="text-amber-400">[WARN]</span> Tops Market rate-limit token bucket at 78% capacity (auto backoff 250ms engaged)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <strong>Redis Worker Pool:</strong> 8/8 Threads Active
            </span>
            <span className="text-slate-300">•</span>
            <span>
              Bắt đầu: <strong className="font-mono text-slate-700">15:09:44</strong> • Dự kiến xong: <strong className="font-mono text-slate-700">15:13:20 (~2m còn)</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              Chạy ngầm (Run in Background)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100 font-bold transition-colors cursor-pointer"
            >
              ⊘ Hủy bỏ tác vụ
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExecuting ? 'animate-spin' : ''}`} />
              <span>{isExecuting ? 'Đang thực thi đồng bộ...' : 'Hoàn tất quét thành công'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
