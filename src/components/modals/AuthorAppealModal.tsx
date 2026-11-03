import React, { useState } from 'react'
import {
  X,
  MessageSquare,
  FileText,
  Download,
  Eye,
  Camera,
  Film,
  Send,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface AuthorAppealModalProps {
  isOpen: boolean
  onClose: () => void
  recipeCode?: string
  recipeTitle?: string
  authorName?: string
  authorRole?: string
  authorUid?: string
  appealCode?: string
  onDecision?: (decision: 'approved' | 'rejected' | 'request_info', note: string) => void
  onResolve?: (decision: 'accept' | 'request_info' | 'reject', note: string) => void
}

export const AuthorAppealModal: React.FC<AuthorAppealModalProps> = ({
  isOpen,
  onClose,
  recipeCode = '#RC-98540',
  recipeTitle = 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
  authorName = 'Trần Bảo',
  authorRole = 'Tác giả Tập sự L1',
  authorUid = '#USR-78210',
  appealCode = '#APL-2024-082',
  onDecision,
  onResolve,
}) => {
  const { showToast } = useProfile()
  const [activeTab, setActiveTab] = useState<'appeal_detail' | 'evidence_files' | 'history'>('appeal_detail')
  const [decision, setDecision] = useState<'approved' | 'request_info' | 'rejected'>('approved')
  const [adminNote, setAdminNote] = useState<string>(
    'Sau khi đối chiếu tệp RAW gốc đính kèm có đầy đủ EXIF Metadata máy ảnh Canon EOS R6 ngày 10/10/2024, BQT xác nhận hoa văn trên đĩa gốm trùng khớp. Chấp thuận gỡ bỏ vi phạm bản quyền và khôi phục 50 điểm uy tín cho tác giả.'
  )
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  if (!isOpen) return null

  const handleSubmitDecision = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      if (decision === 'approved') {
        showToast(`Đã CHẤP THUẬN đơn kháng nghị ${appealCode}! Hoàn trả +50 điểm uy tín cho tác giả ${authorName}.`)
      } else if (decision === 'request_info') {
        showToast(`Đã gửi YÊU CẦU BỔ SUNG TÀI LIỆU tới tác giả ${authorName} (Thời hạn 24h).`)
      } else {
        showToast(`Đã BÁC BỎ đơn kháng nghị ${appealCode}. Giữ nguyên quyết định xử phạt kỷ luật!`)
      }
      if (onDecision) {
        onDecision(decision, adminNote)
      }
      if (onResolve) {
        const mappedDecision = decision === 'approved' ? 'accept' : decision === 'rejected' ? 'reject' : 'request_info'
        onResolve(mappedDecision, adminNote)
      }
      onClose()
    }, 500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Đơn Kháng Nghị &amp; Khiếu Nại Bản Quyền
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                  CHỜ GIẢI QUYẾT
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                <span>Mã khiếu nại: <strong className="text-slate-800 font-mono">{appealCode}</strong></span>
                <span>•</span>
                <span>Hồ sơ: <strong className="text-slate-800 font-mono">{recipeCode}</strong></span>
              </div>
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

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 pt-3 border-b border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={() => setActiveTab('appeal_detail')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'appeal_detail'
                ? 'text-[#9c3808] border-[#9c3808]'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            📝 Nội dung giải trình
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('evidence_files')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evidence_files'
                ? 'text-[#9c3808] border-[#9c3808]'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            📎 Tài liệu &amp; File RAW đính kèm
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-[#9c3808] text-[10px] font-black">
              3
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
              activeTab === 'history'
                ? 'text-[#9c3808] border-[#9c3808]'
                : 'text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            🕒 Lịch sử vi phạm (2 lần)
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Author Card Info */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black flex items-center justify-center text-sm shadow-xs shrink-0">
                TB
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{authorName}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    {authorRole}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">{authorUid}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Công thức: <strong className="text-slate-800">{recipeTitle}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500 self-start sm:self-auto">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Gửi lúc: <strong>14:45 hôm nay</strong> (15p sau khi từ chối)</span>
            </div>
          </div>

          {/* TAB 1: Appeal Details */}
          {activeTab === 'appeal_detail' && (
            <div className="space-y-4">
              {/* Author statement */}
              <div className="space-y-2">
                <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                  1. LỜI GIẢI TRÌNH CỦA TÁC GIẢ
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/80 text-slate-800 leading-relaxed font-sans text-xs shadow-2xs">
                  &ldquo;Kính gửi Ban Quản Trị Bếp Xinh, tôi là tác giả Trần Bảo. Tôi hoàn toàn không sao chép hình ảnh từ Foody.vn như cảnh báo của AI Vision. Bộ ảnh sườn nướng BBQ này do chính tôi setup ánh sáng và bấm máy tại phòng bếp gia đình ngày 10/10/2024. Vệt mờ ở góc đĩa mà AI nghi ngờ là watermark Foody thực chất là hoa văn viền chìm của đĩa gốm men rạn Bát Tràng mà gia đình tôi sử dụng. Tôi xin gửi kèm tệp RAW gốc từ máy ảnh Canon EOS R6 có đầy đủ thông số EXIF ngày giờ chụp và video quay cảnh ướp sốt để chứng minh quyền sở hữu.&rdquo;
                </div>
              </div>

              {/* Quick File Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[11px]">
                    <Camera className="w-3.5 h-3.5" />
                    <span>File RAW Máy Ảnh</span>
                  </div>
                  <div className="font-mono text-slate-800 font-bold truncate">IMG_8941_RAW.CR2</div>
                  <div className="text-[10px] text-slate-400">28.4 MB • Canon R6</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                    <Film className="w-3.5 h-3.5" />
                    <span>Video Hậu Trường</span>
                  </div>
                  <div className="font-mono text-slate-800 font-bold truncate">HauTruong_UopSot.mp4</div>
                  <div className="text-[10px] text-slate-400">42 MB • 4K 60fps</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-600 font-bold text-[11px]">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Hóa Đơn Nguyên Liệu</span>
                  </div>
                  <div className="font-mono text-slate-800 font-bold truncate">HoaDon_SuonHeo.pdf</div>
                  <div className="text-[10px] text-slate-400">1.2 MB • VAT VinMart</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Evidence Files */}
          {activeTab === 'evidence_files' && (
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                DANH SÁCH 3 CHỨNG CỨ ĐÍNH KÈM TỪ TÁC GIẢ
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-slate-900 text-xs">IMG_8941_RAW.CR2</div>
                    <div className="text-[11px] text-slate-500">
                      Canon EOS R6 • Lens RF 50mm f/1.8 • f/2.8, 1/160s, ISO 400 • Chụp: 10/10/2024 - 11:22:18
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Đang tải file gốc RAW 28.4 MB để phân tích chuyên sâu...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tải tệp RAW</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-slate-900 text-xs">HauTruong_UopSot.mp4</div>
                    <div className="text-[11px] text-slate-500">
                      Đoạn phim 15 giây quay bàn bếp và quá trình quết sốt BBQ lên sườn tươi
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Đang phát video hậu trường 1080p trong trình phát...')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Xem Video</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-mono font-bold text-slate-900 text-xs">HoaDon_SuonHeo_VinMart.pdf</div>
                    <div className="text-[11px] text-slate-500">
                      Hóa đơn điện tử số #HD-781290 ngày 09/10/2024 - 1.5kg Sườn non heo C.P
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast('Đã mở hóa đơn điện tử xác thực mua hàng.')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Tải Hóa Đơn</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Author History */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                TIỀN SỬ VI PHẠM CỦA TÁC GIẢ ({authorName})
              </div>
              <div className="space-y-2 font-sans">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">15/08/2024 • Vi phạm quy chuẩn định lượng calo</div>
                    <div className="text-[11px] text-slate-500">Món: Salad ức gà sốt mè • Xử lý: Yêu cầu sửa đổi và đã hoàn thành</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">Cảnh cáo nhẹ</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-800 text-xs">24/10/2024 • Vi phạm nghi vấn bản quyền ảnh &amp; thiếu nhiệt ATTP</div>
                    <div className="text-[11px] text-slate-500">Món: Sườn nướng sốt BBQ • Đang thực hiện kháng nghị #APL-2024-082</div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">Đang kháng nghị</span>
                </div>
              </div>
            </div>
          )}

          {/* Decision Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#9c3808]" />
                <span>PHÁN QUYẾT XỬ LÝ CỦA QUẢN TRỊ VIÊN</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Chọn một hướng giải quyết</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Option 1: Approve */}
              <label
                onClick={() => {
                  setDecision('approved')
                  setAdminNote('Sau khi đối chiếu tệp RAW gốc đính kèm có đầy đủ EXIF Metadata máy ảnh Canon EOS R6 ngày 10/10/2024, BQT xác nhận hoa văn trên đĩa gốm trùng khớp. Chấp thuận gỡ bỏ vi phạm bản quyền và khôi phục 50 điểm uy tín cho tác giả.')
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  decision === 'approved'
                    ? 'bg-emerald-50/50 border-emerald-500 ring-2 ring-emerald-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="appeal_decision"
                    checked={decision === 'approved'}
                    onChange={() => {}}
                    className="mt-0.5 accent-emerald-600"
                  />
                  <div>
                    <div className="font-bold text-emerald-900 text-xs">Chấp thuận kháng nghị</div>
                    <p className="text-[10px] text-emerald-700 mt-0.5 leading-snug">
                      Gỡ vi phạm, hoàn lại +50 điểm uy tín và mở khóa tài khoản tức thì.
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded self-start">
                  Khuyến nghị duyệt
                </span>
              </label>

              {/* Option 2: Request More Info */}
              <label
                onClick={() => {
                  setDecision('request_info')
                  setAdminNote('Ảnh RAW đính kèm hợp lệ, tuy nhiên tác giả cần cập nhật lại thông số nhiệt độ nướng trong phần mô tả công thức lên tối thiểu 180°C/25 phút trước khi công khai lên ứng dụng.')
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  decision === 'request_info'
                    ? 'bg-amber-50/50 border-amber-500 ring-2 ring-amber-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="appeal_decision"
                    checked={decision === 'request_info'}
                    onChange={() => {}}
                    className="mt-0.5 accent-amber-600"
                  />
                  <div>
                    <div className="font-bold text-amber-900 text-xs">Yêu cầu bổ sung</div>
                    <p className="text-[10px] text-amber-700 mt-0.5 leading-snug">
                      Yêu cầu tác giả chỉnh sửa công đoạn nhiệt độ ATTP trong 24 giờ.
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-amber-800 uppercase bg-amber-100 px-2 py-0.5 rounded self-start">
                  Cho phép sửa
                </span>
              </label>

              {/* Option 3: Reject Appeal */}
              <label
                onClick={() => {
                  setDecision('rejected')
                  setAdminNote('BQT đối chiếu nhận thấy ảnh RAW nộp vẫn có dấu vết chỉnh sửa và không khớp với góc chụp món nướng Foody. Giữ nguyên án phạt và bác bỏ đơn khiếu nại.')
                }}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  decision === 'rejected'
                    ? 'bg-rose-50/50 border-rose-500 ring-2 ring-rose-200 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="appeal_decision"
                    checked={decision === 'rejected'}
                    onChange={() => {}}
                    className="mt-0.5 accent-rose-600"
                  />
                  <div>
                    <div className="font-bold text-rose-900 text-xs">Bác đơn kháng nghị</div>
                    <p className="text-[10px] text-rose-700 mt-0.5 leading-snug">
                      Bằng chứng không xác thực, giữ nguyên quyết định xử lý kỷ luật.
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-black text-rose-800 uppercase bg-rose-100 px-2 py-0.5 rounded self-start">
                  Giữ nguyên phạt
                </span>
              </label>
            </div>

            {/* Admin Note Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                <span>Nội dung phản hồi chính thức gửi tới tác giả:</span>
                <span className="text-[10px] text-slate-400 font-mono">{adminNote.length} ký tự</span>
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={3}
                className="w-full text-xs font-sans text-slate-800 p-3 rounded-xl border border-slate-200 bg-slate-50/70 focus:bg-white focus:border-[#9c3808] focus:ring-2 focus:ring-orange-100 outline-none leading-relaxed transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleSubmitDecision}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9c3808] to-orange-700 hover:from-[#832f07] hover:to-orange-800 text-white text-xs font-black shadow-md shadow-orange-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Đang gửi phán quyết...' : 'Ban hành Phán Quyết Kháng Nghị'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
