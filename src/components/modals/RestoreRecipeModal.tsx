import React, { useState } from 'react'
import {
  X,
  RotateCcw,
  Clock,
  Sparkles,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface RestoreRecipeModalProps {
  isOpen: boolean
  onClose: () => void
  recipeCode?: string
  recipeTitle?: string
  authorName?: string
  authorRole?: string
  onRestoreSuccess?: () => void
  onConfirmRestore?: (options: { reason: string; deadlineHours: number; restoreTrustPoints: boolean }) => void
}

export const RestoreRecipeModal: React.FC<RestoreRecipeModalProps> = ({
  isOpen,
  onClose,
  recipeCode = '#RC-98540',
  recipeTitle = 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
  authorName = 'Trần Bảo',
  authorRole = 'Tác giả Tập sự L1',
  onRestoreSuccess,
  onConfirmRestore,
}) => {
  const { showToast } = useProfile()
  const [reason, setReason] = useState<string>('explanation_accepted')
  const [deadline, setDeadline] = useState<'24h' | '48h' | '72h'>('48h')
  const [refundReputation, setRefundReputation] = useState<boolean>(true)
  const [reqPhoto, setReqPhoto] = useState<boolean>(true)
  const [reqTemp, setReqTemp] = useState<boolean>(true)
  const [reqPhone, setReqPhone] = useState<boolean>(true)
  const [reqSeasoning, setReqSeasoning] = useState<boolean>(false)
  const [adminNote, setAdminNote] = useState<string>(
    'Ban Quản Trị đã phục hồi công thức của bạn về trạng thái "Cần sửa lại". Bạn có thời hạn 48 giờ để cập nhật ảnh tự chụp đạt chuẩn và điều chỉnh nhiệt độ nướng theo khuyến cáo ATTP trước khi công thức được duyệt xuất bản chính thức.'
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const handleConfirmRestore = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      showToast(
        `Đã phục hồi thành công công thức ${recipeCode}! Đã chuyển sang trạng thái "Cần sửa lại" và hoàn +30 điểm uy tín cho tác giả ${authorName}.`
      )
      if (onRestoreSuccess) {
        onRestoreSuccess()
      }
      if (onConfirmRestore) {
        const hours = deadline === '24h' ? 24 : deadline === '48h' ? 48 : 72
        onConfirmRestore({
          reason,
          deadlineHours: hours,
          restoreTrustPoints: refundReputation,
        })
      }
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Phục Hồi Công Thức &amp; Cho Phép Sửa Đổi
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-100 text-blue-800">
                  REVERT STATUS
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Chuyển từ <strong className="text-rose-600">Từ chối (Rejected)</strong> sang{' '}
                <strong className="text-amber-700">Cần sửa lại (Review Queue)</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Recipe Card */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-slate-700 text-xs">{recipeCode}</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                  {authorRole}
                </span>
              </div>
              <h4 className="font-black text-slate-900 text-sm mt-0.5">{recipeTitle}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Tác giả: <strong>{authorName}</strong></p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Hành động hệ thống</span>
              <span className="text-xs font-black text-blue-700">Gỡ phong tỏa 48h</span>
            </div>
          </div>

          {/* 1. Reason Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
              1. CĂN CỨ VÀ LÝ DO PHỤC HỒI
            </label>
            <div className="grid grid-cols-1 gap-2">
              <label
                onClick={() => setReason('explanation_accepted')}
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                  reason === 'explanation_accepted'
                    ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="restore_reason"
                  checked={reason === 'explanation_accepted'}
                  onChange={() => setReason('explanation_accepted')}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    Tác giả giải trình hợp lý và đã xuất trình tệp RAW ảnh gốc
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Đã kiểm tra chứng minh thư viện ảnh và hóa đơn mua sắm nguyên liệu tươi hợp lệ.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setReason('minor_violation')}
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                  reason === 'minor_violation'
                    ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="restore_reason"
                  checked={reason === 'minor_violation'}
                  onChange={() => setReason('minor_violation')}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    Vi phạm thứ yếu có thể khắc phục được qua biên tập lại
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cho phép tác giả thay thế ảnh chụp mới và sửa lại nhiệt độ nướng an toàn.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setReason('false_positive')}
                className={`flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer ${
                  reason === 'false_positive'
                    ? 'bg-blue-50/40 border-blue-500 ring-1 ring-blue-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="restore_reason"
                  checked={reason === 'false_positive'}
                  onChange={() => setReason('false_positive')}
                  className="mt-0.5 accent-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    Nhầm lẫn nhận diện của thuật toán AI Vision (False Positive)
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hoa văn viền gốm men rạn bị AI quét nhầm thành logo watermark Foody.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Mandatory Revision Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
                2. DANH MỤC YÊU CẦU BẮT BUỘC TÁC GIẢ PHẢI SỬA
              </label>
              <span className="text-[11px] text-blue-700 font-bold">Tác giả phải tick hoàn thành</span>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqPhoto}
                  onChange={(e) => setReqPhoto(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  Thay thế ảnh bìa &amp; các bước bằng ảnh chụp rõ ràng, không dính logo bên ngoài
                </span>
              </label>

              <label className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqTemp}
                  onChange={(e) => setReqTemp(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  Điều chỉnh nhiệt độ nướng đạt tối thiểu 180°C trong 25 phút để bảo đảm ATTP (tiêu diệt Salmonella)
                </span>
              </label>

              <label className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqPhone}
                  onChange={(e) => setReqPhone(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  Xóa bỏ toàn bộ thông tin SĐT / liên hệ Zalo mua bán sỉ thịt tươi ngoài luồng
                </span>
              </label>

              <label className="flex items-center gap-2 p-1.5 hover:bg-white rounded-lg transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={reqSeasoning}
                  onChange={(e) => setReqSeasoning(e.target.checked)}
                  className="accent-blue-600 w-4 h-4 rounded cursor-pointer"
                />
                <span className="font-medium text-slate-600">
                  Quy chuẩn lại định lượng sốt ướp theo đơn vị gam / muỗng canh
                </span>
              </label>
            </div>
          </div>

          {/* 3. Settings: Deadline & Reputation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Deadline */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>THỜI HẠN TÁC GIẢ HOÀN TẤT</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeadline('24h')}
                  className={`py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    deadline === '24h'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  24 Giờ
                </button>
                <button
                  type="button"
                  onClick={() => setDeadline('48h')}
                  className={`py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    deadline === '48h'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  48 Giờ
                </button>
                <button
                  type="button"
                  onClick={() => setDeadline('72h')}
                  className={`py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                    deadline === '72h'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  72 Giờ
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Hết thời hạn bài sẽ tự động bị huỷ nếu chưa sửa.</p>
            </div>

            {/* Reputation Refund */}
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>ĐIỂM UY TÍN TÀI KHOẢN</span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={refundReputation}
                  onChange={(e) => setRefundReputation(e.target.checked)}
                  className="mt-0.5 accent-blue-600 w-4 h-4 rounded cursor-pointer"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">
                    Khôi phục +30 điểm uy tín cho tác giả
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Đưa điểm uy tín từ 15 điểm lên 45 điểm (thoát báo động đỏ).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 4. Message to Author */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
              <span>Thông báo gửi tác giả qua Email &amp; In-app Notification:</span>
              <span className="font-mono text-[10px] text-slate-400">{adminNote.length} ký tự</span>
            </label>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
              className="w-full text-xs font-sans text-slate-800 p-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none leading-relaxed transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleConfirmRestore}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-xs font-black shadow-md shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang phục hồi công thức...' : 'Xác nhận Phục Hồi & Cho Phép Sửa'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
