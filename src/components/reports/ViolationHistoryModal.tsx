import React from 'react'
import { X, Clock } from 'lucide-react'

interface ViolationHistoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ViolationHistoryModal: React.FC<ViolationHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  const resolvedLogs = [
    {
      id: 'LOG-7819',
      recipeCode: '#RC-98540',
      recipeTitle: 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
      author: 'Trần Bảo (BX-U98342)',
      reporter: 'Ẩm Thực Sài Gòn Food',
      violationType: 'Bản quyền ảnh món ăn',
      resolvedTime: 'Hôm qua, 16:45',
      auditor: 'Admin Bếp Xinh',
      action: 'Bác bỏ & Khôi phục (Hợp lệ)',
      status: 'restored',
      actionColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'LOG-7818',
      recipeCode: '#RC-98522',
      recipeTitle: 'Bò nướng tảng sốt tiêu đen',
      author: 'Nguyễn Văn Long',
      reporter: 'AI Guard v2.6',
      violationType: 'Ảnh sao chép từ Unsplash',
      resolvedTime: '26/10/2024 11:20',
      auditor: 'Admin Bếp Xinh',
      action: 'Đã gỡ bài & Cảnh cáo tác giả',
      status: 'banned',
      actionColor: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      id: 'LOG-7817',
      recipeCode: '#RC-98501',
      recipeTitle: 'Chè dưỡng nhan tuyết yến hạt chia',
      author: 'Mai Hoa Cook',
      reporter: 'Bác sĩ dinh dưỡng',
      violationType: 'Sai định mức thảo dược',
      resolvedTime: '24/10/2024 09:15',
      auditor: 'Ban Thẩm định Dinh dưỡng',
      action: 'Yêu cầu chỉnh sửa định lượng',
      status: 'revised',
      actionColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-orange-50/40 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-xs shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Nhật Ký Xử Lý Khiếu Nại &amp; Vi Phạm Gần Đây
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                  Audit Trail
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Toàn bộ biên bản giải quyết vi phạm bản quyền và kháng nghị tác giả đã lưu trữ
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

        {/* Logs Table */}
        <div className="p-5 overflow-y-auto space-y-3 text-xs">
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-2.5 px-3.5">MÃ &amp; CÔNG THỨC</th>
                  <th className="py-2.5 px-3">TÁC GIẢ &amp; BÊN BÁO CÁO</th>
                  <th className="py-2.5 px-3">HÀNH VI</th>
                  <th className="py-2.5 px-3 text-right">KẾT LUẬN XỬ LÝ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {resolvedLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3.5">
                      <div className="space-y-0.5">
                        <span className="font-mono font-bold text-[11px] text-[#9c3808]">
                          {log.recipeCode}
                        </span>
                        <h4 className="font-black text-slate-800 text-xs line-clamp-1">
                          {log.recipeTitle}
                        </h4>
                        <span className="text-[10px] text-slate-400 block">{log.resolvedTime}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 block text-xs">{log.author}</span>
                        <span className="text-[11px] text-slate-400 block">Báo cáo: {log.reporter}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.violationType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="space-y-1 inline-flex flex-col items-end">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${log.actionColor}`}>
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400">Xử lý bởi: {log.auditor}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium text-[11px]">
            Hàng đợi hiện tại: <strong>0 khiếu nại đang chờ</strong> (Hệ thống sạch 100%)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold shadow-xs transition-colors cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  )
}
