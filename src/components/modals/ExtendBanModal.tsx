import React, { useState } from 'react'
import {
  X,
  AlertTriangle,
  Gavel,
  Ban,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface ExtendBanModalProps {
  isOpen: boolean
  onClose: () => void
  authorName?: string
  authorUid?: string
  authorRole?: string
  recipeCode?: string
  recipeTitle?: string
  currentBanExpiry?: string
  onBanSuccess?: (days: string, reason: string) => void
  onConfirmExtend?: (options: {
    durationDays: number
    isPermanent: boolean
    deductPoints: number
    reason: string
    noticeContent: string
  }) => void
}

export const ExtendBanModal: React.FC<ExtendBanModalProps> = ({
  isOpen,
  onClose,
  authorName = 'Trần Bảo',
  authorUid = '#USR-78210',
  authorRole = 'Tác giả Tập sự L1',
  recipeCode = '#RC-98540',
  recipeTitle = 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
  currentBanExpiry: _currentBanExpiry = '14:15 - 26/10/2024 (còn 36 giờ)',
  onBanSuccess,
  onConfirmExtend,
}) => {
  const { showToast } = useProfile()
  const [extensionPeriod, setExtensionPeriod] = useState<'7d' | '14d' | '30d' | 'perm'>('14d')
  const [penaltyReason, setPenaltyReason] = useState<string>('deliberate_copyright')
  const [reputationDeduct, setReputationDeduct] = useState<number>(20)
  const [banNotice, setBanNotice] = useState<string>(
    `Ban Quản Trị Bếp Xinh thông báo: Tài khoản của bạn (${authorName}) đã bị GIA HẠN THỜI GIAN CẤM ĐĂNG TẢI THÊM 14 NGÀY do cố tình cắt xén hình ảnh vi phạm bản quyền đối tác Foody.vn trong công thức "${recipeTitle}". Điểm uy tín của bạn bị trừ thêm 20 điểm. Mọi hành vi tái phạm tiếp theo sẽ dẫn đến việc đình chỉ vĩnh viễn tài khoản.`
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const handleApplySanction = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const periodLabel =
        extensionPeriod === '7d'
          ? 'thêm 7 ngày'
          : extensionPeriod === '14d'
          ? 'thêm 14 ngày'
          : extensionPeriod === '30d'
          ? 'thêm 30 ngày'
          : 'VĨNH VIỄN (Blacklist)'
      showToast(
        `Đã gia hạn cấm đăng tải ${periodLabel} đối với tác giả ${authorName} (${authorUid})!`
      )
      if (onBanSuccess) {
        onBanSuccess(extensionPeriod, banNotice)
      }
      if (onConfirmExtend) {
        const days = extensionPeriod === '7d' ? 7 : extensionPeriod === '14d' ? 14 : extensionPeriod === '30d' ? 30 : 999
        onConfirmExtend({
          durationDays: days,
          isPermanent: extensionPeriod === 'perm',
          deductPoints: reputationDeduct,
          reason: penaltyReason,
          noticeContent: banNotice,
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
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Gia Hạn Lệnh Cấm &amp; Tăng Mức Chế Tài
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white">
                  ENFORCEMENT
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Áp dụng biện pháp xử lý kỷ luật bổ sung đối với tác giả vi phạm chính sách
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
          {/* Author Bio Box */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                TB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{authorName}</span>
                  <span className="font-mono text-[10px] text-slate-500">{authorUid}</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {authorRole}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Liên quan công thức: <strong className="text-slate-800 font-mono">{recipeCode}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:border-l sm:border-slate-200 sm:pl-4 self-start sm:self-auto">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Án phạt hiện hành</span>
                <span className="text-xs font-black text-rose-600">Khóa 48h (còn 47h 58m)</span>
              </div>
            </div>
          </div>

          {/* 1. Extension Duration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
                1. THỜI GIAN GIA HẠN LỆNH CẤM ĐĂNG BÀI
              </label>
              <span className="text-[10px] text-slate-400 font-medium">Chọn một mức độ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 7 days */}
              <label
                onClick={() => {
                  setExtensionPeriod('7d')
                  setBanNotice(
                    `Ban Quản Trị Bếp Xinh thông báo: Tài khoản ${authorName} đã bị GIA HẠN THỜI GIAN CẤM ĐĂNG TẢI THÊM 07 NGÀY do vi phạm quy định nội dung trong bài viết "${recipeTitle}". Điểm uy tín bị trừ thêm 10 điểm.`
                  )
                  setReputationDeduct(10)
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  extensionPeriod === '7d'
                    ? 'bg-rose-50/40 border-rose-500 ring-1 ring-rose-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="ban_period"
                  checked={extensionPeriod === '7d'}
                  onChange={() => {}}
                  className="mt-0.5 accent-rose-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Gia hạn thêm 07 ngày</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Khóa quyền đăng bài đến 04/11/2024.</p>
                </div>
              </label>

              {/* Option 14 days */}
              <label
                onClick={() => {
                  setExtensionPeriod('14d')
                  setBanNotice(
                    `Ban Quản Trị Bếp Xinh thông báo: Tài khoản ${authorName} đã bị GIA HẠN THỜI GIAN CẤM ĐĂNG TẢI THÊM 14 NGÀY do cố tình cắt xén hình ảnh vi phạm bản quyền đối tác Foody.vn trong công thức "${recipeTitle}". Điểm uy tín bị trừ thêm 20 điểm.`
                  )
                  setReputationDeduct(20)
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  extensionPeriod === '14d'
                    ? 'bg-rose-50/40 border-rose-500 ring-1 ring-rose-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="ban_period"
                  checked={extensionPeriod === '14d'}
                  onChange={() => {}}
                  className="mt-0.5 accent-rose-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <span>Gia hạn thêm 14 ngày</span>
                    <span className="text-[9px] font-black uppercase bg-rose-600 text-white px-1.5 py-0.2 rounded">
                      Khuyến nghị
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Khóa quyền đăng bài đến 11/11/2024.</p>
                </div>
              </label>

              {/* Option 30 days */}
              <label
                onClick={() => {
                  setExtensionPeriod('30d')
                  setBanNotice(
                    `Ban Quản Trị Bếp Xinh thông báo: Tài khoản ${authorName} đã bị ĐÌNH CHỈ QUYỀN TÁC GIẢ TRONG 30 NGÀY do vi phạm nghiêm trọng Tiêu chuẩn Cộng Đồng Bếp Xinh. Toàn bộ công thức đang hiển thị sẽ bị tạm ẩn.`
                  )
                  setReputationDeduct(35)
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  extensionPeriod === '30d'
                    ? 'bg-rose-50/40 border-rose-500 ring-1 ring-rose-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="ban_period"
                  checked={extensionPeriod === '30d'}
                  onChange={() => {}}
                  className="mt-0.5 accent-rose-600"
                />
                <div>
                  <div className="font-bold text-slate-900 text-xs">Đình chỉ 30 ngày (1 Tháng)</div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Tước quyền tác giả và tạm ẩn công thức.</p>
                </div>
              </label>

              {/* Option Permanent */}
              <label
                onClick={() => {
                  setExtensionPeriod('perm')
                  setBanNotice(
                    `Ban Quản Trị Bếp Xinh ban hành quyết định: ĐÌNH CHỈ VĨNH VIỄN TÀI KHOẢN VÀ ĐƯA VÀO DANH SÁCH ĐEN (BLACKLIST) đối với tác giả ${authorName} (${authorUid}). Khóa dải IP, số điện thoại và chặn số tài khoản nhận tiền thưởng.`
                  )
                  setReputationDeduct(50)
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                  extensionPeriod === 'perm'
                    ? 'bg-rose-50/40 border-rose-500 ring-1 ring-rose-400 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="ban_period"
                  checked={extensionPeriod === 'perm'}
                  onChange={() => {}}
                  className="mt-0.5 accent-rose-600"
                />
                <div>
                  <div className="font-bold text-rose-700 text-xs flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5" />
                    <span>Khóa Vĩnh Viễn (Blacklist)</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Xóa vĩnh viễn tư cách tác giả hệ thống.</p>
                </div>
              </label>
            </div>
          </div>

          {/* 2. Reason Selection */}
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-800 tracking-wider">
              2. CĂN CỨ VÀ LÝ DO GIA HẠN KỶ LUẬT
            </label>
            <div className="space-y-1.5">
              <label
                onClick={() => setPenaltyReason('deliberate_copyright')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-800 font-medium"
              >
                <input
                  type="radio"
                  name="penalty_reason"
                  checked={penaltyReason === 'deliberate_copyright'}
                  onChange={() => setPenaltyReason('deliberate_copyright')}
                  className="accent-rose-600"
                />
                <span>Cố tình cắt xén ảnh đối tác Foody.vn nhằm qua mặt hệ thống kiểm duyệt tự động</span>
              </label>

              <label
                onClick={() => setPenaltyReason('false_appeal')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-800 font-medium"
              >
                <input
                  type="radio"
                  name="penalty_reason"
                  checked={penaltyReason === 'false_appeal'}
                  onChange={() => setPenaltyReason('false_appeal')}
                  className="accent-rose-600"
                />
                <span>Kháng nghị không có căn cứ, thái độ không hợp tác và gian dối chứng cứ</span>
              </label>

              <label
                onClick={() => setPenaltyReason('repeat_offender')}
                className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer text-slate-800 font-medium"
              >
                <input
                  type="radio"
                  name="penalty_reason"
                  checked={penaltyReason === 'repeat_offender'}
                  onChange={() => setPenaltyReason('repeat_offender')}
                  className="accent-rose-600"
                />
                <span>Tái phạm hành vi vi phạm tiêu chuẩn cộng đồng từ 2 lần trở lên</span>
              </label>
            </div>
          </div>

          {/* 3. Reputation Deduction Metric */}
          <div className="p-3.5 rounded-2xl bg-rose-50/50 border border-rose-200 flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-rose-950 text-xs">Điểm uy tín tài khoản bị trừ thêm:</div>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Điểm hiện tại: <strong>15/100</strong> → Sau khi áp dụng: <strong>{Math.max(0, 15 - reputationDeduct)}/100</strong>
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-rose-600 text-white font-black text-sm shadow-xs font-mono">
              -{reputationDeduct} Điểm
            </span>
          </div>

          {/* 4. Notice Editor */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
              <span>Nội dung thông báo kỷ luật chính thức gửi đến tác giả:</span>
              <span className="font-mono text-[10px] text-slate-400">{banNotice.length} ký tự</span>
            </label>
            <textarea
              value={banNotice}
              onChange={(e) => setBanNotice(e.target.value)}
              rows={3}
              className="w-full text-xs font-sans text-slate-800 p-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none leading-relaxed transition-all resize-none"
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
            onClick={handleApplySanction}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-black shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Gavel className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang ban hành chế tài...' : 'Ban Hành Gia Hạn Lệnh Cấm'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
