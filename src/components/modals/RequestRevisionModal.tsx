import React, { useState } from 'react'
import {
  X,
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Square,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Paperclip,
  Send,
  Save,
  Clock,
  Globe,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface RevisionCriterion {
  id: string
  title: string
  tag: string
  tagVariant: 'rose' | 'amber' | 'emerald' | 'teal'
  desc: string
  checked: boolean
}

const DEFAULT_CRITERIA: RevisionCriterion[] = [
  {
    id: 'crit-1',
    title: 'Hình ảnh & Video các bước thực hiện',
    tag: 'Nghiêm trọng - Ảnh chụp',
    tagVariant: 'rose',
    desc: 'Ảnh Bước 02 thiếu sáng trầm trọng (Histogram < 35%), góc máy bị khuất trong lòng nồi chiên không dầu. Yêu cầu tác giả gắp thịt ra đĩa chụp cận cảnh sần giòn và màu sốt óng để đạt chuẩn hiển thị trên App.',
    checked: true,
  },
  {
    id: 'crit-2',
    title: 'Định lượng gia vị & Quy chuẩn nguyên liệu',
    tag: 'Cần bổ sung',
    tagVariant: 'amber',
    desc: "Chuẩn hóa định lượng thìa cà phê / gam cho nước mắm nhĩ cốt và mật ong hoa rừng. Việc ghi chung chung 'nêm vừa ăn' khiến thuật toán AI Nutrition không tính toán chuẩn khẩu phần calo.",
    checked: true,
  },
  {
    id: 'crit-3',
    title: 'Thời gian & Nhiệt độ chế biến',
    tag: 'Đã đạt chuẩn',
    tagVariant: 'emerald',
    desc: 'Nhiệt độ nướng 180°C trong 25 phút đã được AI xác thực phù hợp.',
    checked: false,
  },
  {
    id: 'crit-4',
    title: 'Tiêu chuẩn An toàn thực phẩm & Cảnh báo dị ứng',
    tag: 'Đã đạt chuẩn',
    tagVariant: 'emerald',
    desc: 'Quy trình rửa nước muối loãng đạt quy chuẩn phòng nhiễm khuẩn heo tươi.',
    checked: false,
  },
  {
    id: 'crit-5',
    title: 'Bản quyền ảnh & Watermark thương mại',
    tag: 'Hợp lệ',
    tagVariant: 'teal',
    desc: 'Độ phân giải 1080p, không chứa logo ngoài, chỉ số tương đồng bản quyền đạt 0.12.',
    checked: false,
  },
]

const DEFAULT_MESSAGE = `Chào bạn Lan C.! Công thức của bạn ướp rất thơm và đạt chuẩn định lượng calo. Tuy nhiên ở Bước 2 (Nướng thịt), ảnh chụp trong lồng nồi chiên không dầu bị sập bóng tối, chưa thấy rõ độ giòn vàng của lớp bì.

Chị hỗ trợ chụp lại ảnh đĩa thịt nướng mẻ mới giúp team duyệt lên Banner nổi bật của tuần nhé! Đồng thời quy chuẩn giúp em mật ong về định lượng 'muỗng canh / ml'. Cảm ơn chị nhiều!`

interface RequestRevisionModalProps {
  isOpen: boolean
  onClose: () => void
  recipeCode?: string
  recipeTitle?: string
  chefName?: string
  chefRole?: string
  chefAvatar?: string
  aiScore?: number
  onSuccess?: () => void
}

export const RequestRevisionModal: React.FC<RequestRevisionModalProps> = ({
  isOpen,
  onClose,
  recipeCode = '#RC-98621',
  recipeTitle = 'Thịt ba chỉ nướng mật ong sốt tiêu xanh',
  chefName = 'Hoàng Lan Chef',
  chefRole = 'Cấp độ 4: Bếp Vàng • 120 công thức đã đăng',
  chefAvatar = '/images/approved_chef.png',
  aiScore = 94,
  onSuccess,
}) => {
  const { showToast, isEmptyData } = useProfile()
  const displayRecipeCode = isEmptyData && recipeCode === '#RC-98621' ? '#RC-00000' : recipeCode
  const displayRecipeTitle = isEmptyData && recipeTitle === 'Thịt ba chỉ nướng mật ong sốt tiêu xanh' ? 'Chưa chọn công thức' : recipeTitle
  const displayChefName = isEmptyData && chefName === 'Hoàng Lan Chef' ? 'Chưa có tác giả' : chefName
  const displayChefRole = isEmptyData && chefRole === 'Cấp độ 4: Bếp Vàng • 120 công thức đã đăng' ? 'Chưa có thông tin' : chefRole
  const displayChefAvatar = isEmptyData && chefAvatar === '/images/approved_chef.png' ? '/images/admin_avatar.png' : chefAvatar
  const displayAiScore = isEmptyData && aiScore === 94 ? 0 : aiScore

  const [criteria, setCriteria] = useState<RevisionCriterion[]>(() =>
    isEmptyData ? DEFAULT_CRITERIA.map((c) => ({ ...c, checked: false })) : DEFAULT_CRITERIA
  )
  const [message, setMessage] = useState<string>(() => (isEmptyData ? '' : DEFAULT_MESSAGE))

  if (!isOpen) return null

  const checkedCount = criteria.filter((c) => c.checked).length

  const toggleCriterion = (id: string) => {
    setCriteria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    )
  }

  const handleAddTemplate = (text: string) => {
    setMessage((prev) => (prev ? `${prev}\n- ${text}` : text))
    showToast(`Đã thêm mẫu: "${text}"`)
  }

  const handleSaveDraft = () => {
    showToast('Đã lưu bản nháp yêu cầu chỉnh sửa vào bộ nhớ tạm.')
  }

  const handleSendRevision = () => {
    showToast(`Đã gửi YÊU CẦU CHỈNH SỬA công thức ${recipeCode} thành công cho tác giả ${chefName}!`)
    if (onSuccess) {
      onSuccess()
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-100 bg-white">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9c3808] text-white flex items-center justify-center shadow-md shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Tạo Yêu Cầu Chỉnh Sửa Công Thức
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-orange-100 text-[#9c3808] text-[11px] font-mono font-bold">
                  {displayRecipeCode}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                <span>Người tạo công thức: <strong>{displayChefName}</strong></span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-50 inline" />
                <span>•</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 text-[10px] font-bold border border-amber-200/60">
                  {displayChefRole}
                </span>
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

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5 bg-[#fbfcfd]">
          {/* Subheader Recipe Card */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-orange-100 border border-slate-200 shrink-0">
                <img
                  src={displayChefAvatar}
                  alt={displayRecipeTitle}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                  }}
                />
              </div>

              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  MÓN ĂN ĐANG KIỂM DUYỆT
                </div>
                <h3 className="text-sm font-black text-slate-900 mt-0.5">
                  {displayRecipeTitle}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs shrink-0 self-start sm:self-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4">
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Điểm AI Inspector</div>
                <div className={`text-xs font-black ${displayAiScore === 0 ? 'text-slate-400' : 'text-emerald-600'}`}>
                  {displayAiScore}/100 <span className="font-bold text-slate-500">({displayAiScore === 0 ? 'Chưa đánh giá' : 'Hạng Tốt'})</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-400 font-medium">Tỉ lệ vi phạm</div>
                <div className="text-xs font-black text-slate-800">
                  0.0% <span className="font-bold text-slate-500">(Uy tín cao)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Choose Criteria */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase">
                <span className="text-[#9c3808]">📋 1.</span>
                <span>Chọn các tiêu chí cần tác giả sửa đổi</span>
              </div>

              <span className="text-xs font-medium text-slate-500">
                Đã đánh dấu <strong className="text-[#9c3808]">{checkedCount} mục</strong> cần can thiệp
              </span>
            </div>

            <div className="space-y-2.5">
              {criteria.map((item) => {
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCriterion(item.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      item.checked
                        ? 'bg-orange-50/20 border-[#9c3808]/40 ring-1 ring-orange-200/80 shadow-2xs'
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0 text-[#9c3808]">
                        {item.checked ? (
                          <CheckSquare className="w-4 h-4 text-[#9c3808] fill-orange-50" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>

                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                              item.tagVariant === 'rose'
                                ? 'bg-rose-100 text-rose-700'
                                : item.tagVariant === 'amber'
                                ? 'bg-amber-100 text-amber-800'
                                : item.tagVariant === 'teal'
                                ? 'bg-teal-100 text-teal-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.tag}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Section 2: Detailed Message to Author */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase">
                <span className="text-[#9c3808]">✏️ 2.</span>
                <span>Tin nhắn hướng dẫn chi tiết gửi tác giả</span>
              </div>

              <span className="text-xs text-slate-400">
                Hỗ trợ định dạng Rich-text &amp; Biến động
              </span>
            </div>

            {/* Quick Template Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 text-[11px] font-medium mr-1">
                Mẫu phản hồi nhanh:
              </span>
              <button
                type="button"
                onClick={() => handleAddTemplate('Ảnh chụp Bước 2 bị mờ / tối lồng nồi chiên không dầu.')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Ảnh mờ/tối lồng nồi
              </button>

              <button
                type="button"
                onClick={() => handleAddTemplate('Cần ghi rõ định lượng gram hoặc ml cho gia vị nêm.')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Thiếu định lượng gram
              </button>

              <button
                type="button"
                onClick={() => handleAddTemplate('Mô tả quy trình bước nấu còn sơ sài, cần nêu rõ nhiệt độ.')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Mô tả bước chưa rõ
              </button>

              <button
                type="button"
                onClick={() => handleAddTemplate('Bổ sung thêm mẹo nhỏ giúp da heo giòn lâu không bị ỉu.')}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-orange-50 text-slate-700 hover:text-[#9c3808] border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer"
              >
                + Bổ sung mẹo bếp
              </button>
            </div>

            {/* Rich Editor Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              {/* Toolbar */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/60">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title="Bold"
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Italic"
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="List"
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <div className="h-4 w-px bg-slate-200 mx-1"></div>
                  <button
                    type="button"
                    title="Chèn ảnh minh họa"
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Đính kèm tài liệu"
                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                  </button>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {message.length} / 1000 ký tự
                </span>
              </div>

              {/* Textarea */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                rows={5}
                className="w-full p-4 text-xs font-medium text-slate-800 leading-relaxed outline-none resize-none bg-transparent"
                placeholder="Nhập hướng dẫn chi tiết gửi tới tác giả..."
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              Nhật ký Kiểm duyệt: <strong className="text-slate-700">RAUD-2025-08</strong>
            </span>
            <span>•</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#9c3808] text-[10px] font-bold border border-orange-200/60 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#9c3808]" />
              Bản thảo v2 • Thời hạn phản hồi tác giả: 48h
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-slate-500" />
              <span>Lưu bản nháp yêu cầu</span>
            </button>

            <button
              type="button"
              onClick={handleSendRevision}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Gửi yêu cầu chỉnh sửa cho Tác giả</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
