import React, { useState } from 'react'
import {
  X,
  Gavel,
  AlertOctagon,
  Copy,
  Phone,
  Send,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface ViolationItem {
  id: string
  title: string
  tag: string
  tagColor: 'rose' | 'amber' | 'slate'
  desc: string
  checked: boolean
}

interface RejectViolationModalProps {
  isOpen: boolean
  onClose: () => void
  recipeCode?: string
  decisionCode?: string
  recipeTitle?: string
  category?: string
  chefName?: string
  chefRole?: string
  chefStats?: string
  chefAvatar?: string
  aiScore?: number
  onSubmit?: (data: {
    selectedViolations: string[]
    sanctionLevel: string
    noticeMessage: string
  }) => void
}

const DEFAULT_VIOLATIONS: ViolationItem[] = [
  {
    id: 'v1',
    title: 'Vi phạm bản quyền ảnh',
    tag: 'Watermark Foody.vn trùng khớp 94.6%',
    tagColor: 'rose',
    desc: 'AI Vision đối chiếu hình ảnh tác phẩm phát hiện watermark chìm của thương hiệu đối tác Foody.vn xuất bản ngày 14/06/2021 mà chưa có văn bản nhượng quyền.',
    checked: true,
  },
  {
    id: 'v2',
    title: 'Nguy cơ ngộ độc ATTP',
    tag: 'Nướng sườn dày 3.5cm chỉ 8 phút ở 140°C',
    tagColor: 'amber',
    desc: 'Thời gian và nhiệt lượng không đạt: nhiệt độ tâm tối thiểu 71°C để tiêu diệt Salmonella theo QCVN 12-4:2015/BYT, gây nguy cơ ngộ độc cấp tính cho người dùng làm theo.',
    checked: true,
  },
  {
    id: 'v3',
    title: 'Chèn SĐT Zalo bán sỉ sườn tươi',
    tag: 'Spam quảng cáo thương mại',
    tagColor: 'slate',
    desc: 'Cố tình chèn văn bản kêu gọi giao dịch mua bán ngoài "Liên hệ Zalo 0903.xxx.xxx để lấy sỉ sườn tươi giao trong ngày" trong phần ghi chú sơ chế.',
    checked: true,
  },
]

export const RejectViolationModal: React.FC<RejectViolationModalProps> = ({
  isOpen,
  onClose,
  recipeCode = '#RC-98540',
  decisionCode = '#REJ-2024-98540',
  recipeTitle = 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
  category = 'Món nướng than hoa',
  chefName = 'Trần Bảo',
  chefRole = 'Tập sự L1 • 2 lần vi phạm',
  chefStats = 'Đã gửi: 3 bài • Tỷ lệ vi phạm: 66.7%',
  chefAvatar = '/images/food_thit_nuong.png',
  aiScore = 18,
  onSubmit,
}) => {
  const { showToast, isEmptyData } = useProfile()
  const displayRecipeCode = isEmptyData && recipeCode === '#RC-98540' ? '#RC-00000' : recipeCode
  const displayDecisionCode = isEmptyData && decisionCode === '#REJ-2024-98540' ? '#REJ-0000-00000' : decisionCode
  const displayRecipeTitle = isEmptyData && recipeTitle === 'Sườn nướng sốt BBQ Hàn Quốc siêu cay' ? 'Chưa chọn công thức vi phạm' : recipeTitle
  const displayCategory = isEmptyData && category === 'Món nướng than hoa' ? 'Chưa phân loại' : category
  const displayChefName = isEmptyData && chefName === 'Trần Bảo' ? 'Chưa xác định' : chefName
  const displayChefRole = isEmptyData && chefRole === 'Tập sự L1 • 2 lần vi phạm' ? 'Chưa có thông tin' : chefRole
  const displayChefStats = isEmptyData && chefStats === 'Đã gửi: 3 bài • Tỷ lệ vi phạm: 66.7%' ? 'Đã gửi: 0 bài • Tỷ lệ vi phạm: 0%' : chefStats
  const displayChefAvatar = isEmptyData && chefAvatar === '/images/food_thit_nuong.png' ? '/images/admin_avatar.png' : chefAvatar
  const displayAiScore = isEmptyData && aiScore === 18 ? 0 : aiScore

  const [violations, setViolations] = useState<ViolationItem[]>(() =>
    isEmptyData ? DEFAULT_VIOLATIONS.map((v) => ({ ...v, checked: false })) : DEFAULT_VIOLATIONS
  )
  const [sanctionLevel, setSanctionLevel] = useState<'48h' | '30days' | 'perm'>('48h')
  const [noticeMessage, setNoticeMessage] = useState<string>(() =>
    isEmptyData
      ? ''
      : `Kính gửi tác giả Trần Bảo,\n\nBan Quản Trị Bếp Xinh thông báo: Công thức "Sườn nướng sốt BBQ Hàn Quốc siêu cay" của bạn đã bị TỪ CHỐI XUẤT BẢN do vi phạm nghiêm trọng Tiêu chuẩn Cộng đồng và Quy chuẩn An toàn Vệ sinh Thực phẩm Bếp Xinh.\n\nCụ thể:\n1. Bản quyền hình ảnh: Phát hiện Watermark của Foody.vn (độ trùng khớp 94.6%).\n2. Quy chuẩn ATTP: Hướng dẫn nướng sườn dày 3.5cm chỉ trong 8 phút ở 140°C gây nguy cơ ngộ độc cấp tính (Salmonella).\n3. Quảng cáo trái phép: Chèn số điện thoại Zalo mua bán sỉ nguyên liệu ngoài luồng.\n\nChế tài áp dụng: Tạm khóa quyền đăng bài trong 48 giờ & Trừ 50 điểm uy tín tài khoản.`
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const toggleViolation = (id: string) => {
    setViolations((prev) =>
      prev.map((v) => (v.id === id ? { ...v, checked: !v.checked } : v))
    )
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    showToast('Đang ký số biên bản điện tử và áp dụng chế tài...')
    setTimeout(() => {
      setIsSubmitting(false)
      showToast('Đã ban hành quyết định từ chối & lập biên bản kỷ luật thành công!')
      if (onSubmit) {
        onSubmit({
          selectedViolations: violations.filter((v) => v.checked).map((v) => v.title),
          sanctionLevel,
          noticeMessage,
        })
      }
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/65 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                Xác nhận Từ Chối &amp; Lập Biên Bản Vi Phạm
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                <span>Hồ sơ kiểm duyệt: <strong className="text-slate-700 font-mono">{displayRecipeCode}</strong></span>
                <span>•</span>
                <span>Quyết định kỷ luật: <strong className="text-rose-600 font-mono">{displayDecisionCode}</strong></span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Target Recipe Card */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={displayChefAvatar}
                alt={displayRecipeTitle}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
              />
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-rose-100 text-rose-700 border border-rose-200/80 mb-1">
                  CÔNG THỨC VI PHẠM
                </span>
                <h3 className="text-sm font-black text-slate-900 leading-tight">
                  {displayRecipeTitle}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Chuyên mục: <span className="font-semibold text-slate-700">{displayCategory}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
              {/* Author profile */}
              <div className="border-r border-slate-200 pr-5">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  HỒ SƠ TÁC GIẢ
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-black text-slate-800 text-xs">{displayChefName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {displayChefRole}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {displayChefStats}
                </div>
              </div>

              {/* AI Score */}
              <div className="text-center shrink-0">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  AI INSPECTOR SCORE
                </div>
                <div className={`text-2xl font-black ${displayAiScore === 0 ? 'text-slate-400' : 'text-rose-600'} tracking-tight leading-none mt-1`}>
                  {displayAiScore} <span className="text-xs text-slate-400 font-bold">/ 100</span>
                </div>
                {displayAiScore === 0 ? (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-slate-200 text-slate-600">
                    ● Chưa đánh giá
                  </span>
                ) : (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white">
                    ● Báo động Đỏ
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* 1. Violation Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase tracking-tight">
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">
                  ❶
                </span>
                <span>BÓC TÁCH {isEmptyData ? violations.filter(v => v.checked).length : '3'} HÀNH VI VI PHẠM CHUẨN KIỂM DUYỆT</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[10px]">
                bắt buộc xử lý
              </span>
            </div>

            <div className="space-y-2">
              {violations.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleViolation(item.id)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    item.checked
                      ? 'bg-rose-50/20 border-rose-200 shadow-2xs'
                      : 'bg-white border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleViolation(item.id)}
                        className="w-4 h-4 rounded border-rose-400 accent-rose-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                        {item.id === 'v1' && <Copy className="w-3.5 h-3.5 text-rose-600" />}
                        {item.id === 'v2' && <AlertOctagon className="w-3.5 h-3.5 text-amber-600" />}
                        {item.id === 'v3' && <Phone className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{item.title}</span>
                      </div>
                    </label>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.tagColor === 'rose'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : item.tagColor === 'amber'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 pl-6 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Sanction Selection */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase tracking-tight">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                  ❷
                </span>
                <span>THIẾT LẬP CHẾ TÀI KỶ LUẬT TÁC GIẢ</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">
                Chọn mức kỷ luật tương ứng quy chế
              </span>
            </div>

            <div className="space-y-2">
              {/* Option 1 */}
              <label
                onClick={() => setSanctionLevel('48h')}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  sanctionLevel === '48h'
                    ? 'bg-rose-50/30 border-rose-500 ring-1 ring-rose-500 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="sanction"
                    checked={sanctionLevel === '48h'}
                    onChange={() => setSanctionLevel('48h')}
                    className="mt-0.5 accent-rose-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Tạm khóa quyền đăng công thức mới 48 giờ &amp; Trừ 50 điểm uy tín
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Chặn quyền tạo và gửi duyệt bài viết mới trong 48 giờ, đồng thời ghi nhận điểm cảnh cáo hệ thống.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-600 text-white shrink-0 mt-0.5">
                  KHUYẾN NGHỊ: VI PHẠM LẦN 1
                </span>
              </label>

              {/* Option 2 */}
              <label
                onClick={() => setSanctionLevel('30days')}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  sanctionLevel === '30days'
                    ? 'bg-rose-50/30 border-rose-500 ring-1 ring-rose-500 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="sanction"
                    checked={sanctionLevel === '30days'}
                    onChange={() => setSanctionLevel('30days')}
                    className="mt-0.5 accent-rose-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-slate-900 text-xs">
                      Khóa quyền đăng bài 30 ngày (Vi phạm lần 2)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Tước quyền tác giả tạm thời trong 30 ngày và ẩn tất cả công thức đang công khai để tái thẩm định.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 3 */}
              <label
                onClick={() => setSanctionLevel('perm')}
                className={`flex items-start justify-between gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  sanctionLevel === 'perm'
                    ? 'bg-rose-50/30 border-rose-500 ring-1 ring-rose-500 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <input
                    type="radio"
                    name="sanction"
                    checked={sanctionLevel === 'perm'}
                    onChange={() => setSanctionLevel('perm')}
                    className="mt-0.5 accent-rose-600 w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="font-bold text-rose-700 text-xs">
                      Đình chỉ vĩnh viễn tài khoản &amp; Đưa vào danh sách đen (Blacklist)
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Khóa vĩnh viễn ID tác giả, chặn số điện thoại, tài khoản nhận nhuận bút, và dải IP thiết bị.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Enforcement Notice Editor */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase tracking-tight">
                <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center text-[10px]">
                  ❸
                </span>
                <span>SOẠN THẢO THÔNG BÁO CƯỠNG CHẾ GỬI TÁC GIẢ QUA EMAIL &amp; IN-APP NOTIFICATION</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Template: #NOTIF-DISMISS-V2
              </span>
            </div>

            <textarea
              value={noticeMessage}
              onChange={(e) => setNoticeMessage(e.target.value)}
              placeholder="Nhập nội dung thông báo cưỡng chế gửi tác giả qua Email & In-app Notification..."
              rows={6}
              className="w-full text-xs font-mono text-slate-800 p-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-100 outline-none leading-relaxed transition-all resize-none"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-500">
                <Send className="w-3.5 h-3.5 text-rose-600" />
                Hệ thống sẽ gửi kèm link kháng nghị trực tuyến có hiệu lực trong 48 giờ.
              </span>
              <span className="font-mono text-[10px]">{noticeMessage.length} ký tự</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-200 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white text-xs font-black shadow-md shadow-rose-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Gavel className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang ban hành quyết định...' : 'Gửi quyết định xử lý & Lập biên bản'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
