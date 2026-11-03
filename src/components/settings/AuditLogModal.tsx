import React from 'react'
import { X, Clock, ShieldCheck } from 'lucide-react'

interface AuditLogModalProps {
  isOpen: boolean
  onClose: () => void
  hasData?: boolean
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ isOpen, onClose, hasData = true }) => {
  if (!isOpen) return null

  const logs = [
    {
      id: 'AL-901',
      author: 'Bếp Trưởng Minh (Admin)',
      role: 'Quản trị cao cấp',
      time: '10 phút trước',
      type: 'user',
      content: 'Điều chỉnh Ngưỡng tự động phê duyệt AI từ 80 lên 85 điểm.',
      impact: 'Tăng độ chuẩn chỉ công thức và giảm tỷ lệ tranh chấp bản quyền.',
    },
    {
      id: 'AL-900',
      author: 'Hệ thống Tự động (Cron)',
      role: 'System Daemon',
      time: '03:00 Sáng nay',
      type: 'system',
      content: 'Cập nhật chứng chỉ bảo mật SSL & Tokens kết nối WinMart API định kỳ.',
      impact: 'Đảm bảo API mã hóa TLS 1.3 không bị gián đoạn.',
    },
    {
      id: 'AL-899',
      author: 'Lan Huong (Tech Lead)',
      role: 'Kỹ sư trưởng Hệ thống',
      time: 'Hôm qua, 16:45',
      type: 'user',
      content: 'Bật tính năng phát hiện gia vị ngộ độc và kết nối API Viện Dinh Dưỡng.',
      impact: 'Tích hợp bộ dữ liệu độc tố 2024 vào Kitchen Vision.',
    },
    {
      id: 'AL-898',
      author: 'Hệ thống Tự động (Cron)',
      role: 'System Daemon',
      time: '27/10/2024 02:15',
      type: 'system',
      content: 'Đồng bộ danh mục 48,020 SKU với Co.opFood Realtime Webhook.',
      impact: 'Cập nhật giá tươi sống cho 24 chi nhánh.',
    },
    {
      id: 'AL-897',
      author: 'Trần Văn Kiên (OPS)',
      role: 'Vận hành Siêu thị',
      time: '26/10/2024 14:00',
      type: 'user',
      content: 'Điều chỉnh tỷ lệ trượt giá cho phép từ 4.5% lên 5.0% cho WinMart+.',
      impact: 'Hỗ trợ bù trừ chênh lệch thời gian cao điểm.',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-orange-50/40 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9c3808] text-white flex items-center justify-center shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                Nhật Ký Thay Đổi Tham Số Hệ Thống
              </h3>
              <p className="text-xs text-slate-500">
                Toàn bộ lịch sử can thiệp cấu hình được mã hóa và bảo vệ tính toàn vẹn
              </p>
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

        <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
          {!hasData ? (
            <div className="py-12 px-4 text-center space-y-2.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-black text-slate-800 text-sm">Chưa có nhật ký thay đổi nào (0 bản ghi)</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Toàn bộ lịch sử can thiệp tham số hệ thống sẽ được ghi nhận và mã hóa tại đây khi có thao tác phát sinh.
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-1.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${log.type === 'system' ? 'bg-emerald-500' : 'bg-orange-600'}`} />
                    <span className="font-black text-slate-800">{log.author}</span>
                    <span className="text-[10px] text-slate-400 font-medium">({log.role})</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{log.time}</span>
                </div>
                <p className="font-bold text-slate-900 text-xs pl-4">{log.content}</p>
                <p className="text-[11px] text-slate-500 pl-4">{log.impact}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mã hóa SHA-256 đối chiếu bất biến</span>
          </div>
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
