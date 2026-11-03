import React from 'react'
import { X, AlertTriangle, RotateCcw } from 'lucide-react'

interface ResetDefaultsConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ResetDefaultsConfirmModal: React.FC<ResetDefaultsConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-xs shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-base font-black text-slate-900 tracking-tight">
              Khôi phục tham số mặc định?
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Thao tác này sẽ thiết lập lại toàn bộ Ngưỡng tự động duyệt AI Kitchen Vision về <strong>85 điểm</strong>, khôi phục tần suất đồng bộ API siêu thị về <strong>30 phút/lần</strong> và đặt lại các cờ kiểm định an toàn theo chuẩn Bếp Xinh v2.4.8.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Các tham số sẽ được hoàn tác:</div>
            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
              <li>Ngưỡng duyệt bài viết: 85/100 điểm</li>
              <li>Quét bản quyền ảnh (Reverse OCR): BẬT (&gt; 75%)</li>
              <li>Cảnh báo dị ứng kỵ thực phẩm: BẬT</li>
              <li>Tỷ lệ hoa hồng Giỏ Đi Chợ: 8.0%</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5 text-xs">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 font-bold transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Xác nhận khôi phục</span>
          </button>
        </div>
      </div>
    </div>
  )
}
