import React, { useState } from 'react'
import {
  ShieldAlert,
  AlertTriangle,
  Gavel,
  FileText,
  CheckCircle2,
  Download,
  Share2,
  ChevronRight,
  Filter,
  Clock,
  Printer,
  Mail,
  AlertOctagon,
  QrCode,
  ShieldCheck,
  Check,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { AuthorAppealModal } from '../modals/AuthorAppealModal'
import { EvidenceComparisonModal } from '../modals/EvidenceComparisonModal'
import { RestoreRecipeModal } from '../modals/RestoreRecipeModal'
import { ExtendBanModal } from '../modals/ExtendBanModal'
import { LegalCertPdfModal } from '../modals/LegalCertPdfModal'

interface RejectedRecipeDetailViewProps {
  currentTab: string
  onNavigateTab: (tab: 'pending' | 'review' | 'approved' | 'rejected' | 'all') => void
  initialSubTab?: 'overview' | 'enforcement' | 'legal_cert'
  onBackToQueue?: () => void
}

interface RejectedListItem {
  id: string
  code: string
  title: string
  author: string
  authorRole: string
  reasonTag: string
  reasonTagColor: 'rose' | 'amber' | 'slate'
  reasonNote: string
  timeAgo: string
  aiScore: number
  badgeOverlay?: string
  image: string
}


export const RejectedRecipeDetailView: React.FC<RejectedRecipeDetailViewProps> = ({
  currentTab: _currentTab = 'rejected',
  onNavigateTab,
  initialSubTab = 'overview',
  onBackToQueue,
}) => {
  const { showToast, isEmptyData } = useProfile()
  const [sampleLoaded] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('sample') === 'true'
      }
    } catch {}
    return false
  })
  const rejectedItems: RejectedListItem[] = []
  const [subTab, setSubTab] = useState<'overview' | 'enforcement' | 'legal_cert'>(() => {
    try {
      if (typeof window !== 'undefined') {
        const s = new URLSearchParams(window.location.search).get('subtab')
        if (s === 'overview' || s === 'enforcement' || s === 'legal_cert') {
          return s
        }
      }
    } catch {}
    return initialSubTab
  })
  const [selectedItemId, setSelectedItemId] = useState<string>('')

  // Modal visibility states for the 5 actions
  const [isAppealModalOpen, setIsAppealModalOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'appeal'
      }
    } catch {}
    return false
  })
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'evidence'
      }
    } catch {}
    return false
  })
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'restore'
      }
    } catch {}
    return false
  })
  const [isExtendBanModalOpen, setIsExtendBanModalOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'extend_ban'
      }
    } catch {}
    return false
  })
  const [isLegalPdfModalOpen, setIsLegalPdfModalOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'legal_pdf'
      }
    } catch {}
    return false
  })
  const [appealCount, setAppealCount] = useState(1)

  // Intervention toggles
  const [delistDiscovery, setDelistDiscovery] = useState<boolean>(true)
  const [deindexSearch, setDeindexSearch] = useState<boolean>(true)
  const [fallbackMode, setFallbackMode] = useState<'author_only' | 'with_warning' | 'block_all'>('with_warning')
  const [tagsWarning1, setTagsWarning1] = useState<boolean>(true)
  const [tagsWarning2, setTagsWarning2] = useState<boolean>(true)
  const [tagsWarning3, setTagsWarning3] = useState<boolean>(true)

  const activeItem = rejectedItems.find((item) => item.id === selectedItemId) || (rejectedItems.length > 0 ? rejectedItems[0] : null)

  const handleResolveAppeal = (decision: 'accept' | 'request_info' | 'reject', _note: string) => {
    setIsAppealModalOpen(false)
    setAppealCount(0)
    if (decision === 'accept') {
      showToast('Đã chấp thuận kháng nghị! Công thức đã được chuyển về trạng thái Cần sửa lại.')
      onNavigateTab('review')
    } else if (decision === 'request_info') {
      showToast('Đã gửi yêu cầu bổ sung video/chứng cứ gốc tới tác giả (Hạn 24 giờ).')
    } else {
      showToast('Đã bác bỏ đơn kháng nghị. Quyết định kỷ luật được giữ nguyên!')
    }
  }

  const handleConfirmRestore = (options: { reason: string; deadlineHours: number; restoreTrustPoints: boolean }) => {
    setIsRestoreModalOpen(false)
    showToast(`Đã phục hồi công thức #${activeItem?.code || 'RC-98540'} về hàng đợi Cần sửa lại (Thời hạn ${options.deadlineHours}h)!`)
    onNavigateTab('review')
  }

  const handleConfirmExtendBan = (options: {
    durationDays: number
    isPermanent: boolean
    deductPoints: number
    reason: string
    noticeContent: string
  }) => {
    setIsExtendBanModalOpen(false)
    if (options.isPermanent) {
      showToast(`Đã khoá vĩnh viễn tài khoản tác giả ${activeItem?.author || 'Trần Bảo'} và cập nhật Danh sách đen!`)
    } else {
      showToast(`Đã gia hạn cấm đăng bài thêm +${options.durationDays} ngày đối với tác giả ${activeItem?.author || 'Trần Bảo'}!`)
    }
  }

  return (
    <div className="p-3.5 sm:p-4 md:p-5 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* 1. Header & Breadcrumb */}
      <div className="pb-3 border-b border-slate-200/90 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>BẾP XINH ADMIN</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <button
              type="button"
              onClick={onBackToQueue || (() => onNavigateTab('pending'))}
              className="hover:text-slate-700 transition-colors cursor-pointer"
            >
              KIỂM DUYỆT CÔNG THỨC
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-rose-600">
              {subTab === 'overview'
                ? 'HỒ SƠ TỪ CHỐI & LẬP BIÊN BẢN'
                : subTab === 'enforcement'
                ? 'BIÊN BẢN CƯỠNG CHẾ & KỶ LUẬT'
                : 'XỬ LÝ CAN THIỆP & CẤP CHỨNG NHẬN PHÁP LÝ'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast('Đang kết xuất báo cáo vi phạm tháng dạng .CSV...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất báo cáo vi phạm (.csv)</span>
            </button>

            <button
              type="button"
              onClick={() => showToast('Đang mở Quy chế Tiêu chuẩn Cộng đồng Bếp Xinh v2.5...')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Quy định cộng đồng</span>
            </button>
          </div>
        </div>

        {/* Title row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md shadow-rose-600/30">
                <Gavel className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                    Không Gian Kiểm Duyệt Công Thức
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ● AI TỰ ĐỘNG QUÉT
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Xác thực bản quyền hình ảnh, bóc tách dinh dưỡng &amp; an toàn thực phẩm chuẩn Bếp Xinh
                </p>
              </div>
            </div>
          </div>

          {/* Subtabs switcher */}
          <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setSubTab('overview')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === 'overview'
                  ? 'bg-white text-rose-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 Hồ sơ từ chối
            </button>
            <button
              type="button"
              onClick={() => setSubTab('enforcement')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === 'enforcement'
                  ? 'bg-white text-rose-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚖️ Biên bản cưỡng chế
            </button>
            <button
              type="button"
              onClick={() => setSubTab('legal_cert')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                subTab === 'legal_cert'
                  ? 'bg-white text-rose-700 shadow-2xs font-black'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📜 Chứng nhận Pháp lý PDF
            </button>
          </div>
        </div>

        {/* Queue Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => onNavigateTab('pending')}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 transition-all cursor-pointer"
          >
            Chờ duyệt ({isEmptyData ? 0 : 48})
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('review')}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 transition-all cursor-pointer"
          >
            Cần sửa lại ({isEmptyData ? 0 : 16})
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('approved')}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200/80 transition-all cursor-pointer"
          >
            Đã phê duyệt ({isEmptyData ? 0 : '1,240'})
          </button>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-xs transition-all cursor-default flex items-center gap-1.5"
          >
            <span>🔴 Từ chối ({isEmptyData ? 0 : 34})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUBTAB 1: HỒ SƠ TỪ CHỐI XUẤT BẢN (media_1793259208473.png) */}
      {/* ========================================================================= */}
      {subTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick violation filter tags */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              BỘ LỌC VI PHẠM:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px] cursor-pointer hover:bg-rose-100 transition-colors">
              ☑ Vi phạm bản quyền ảnh (Watermark/Web copy)
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer hover:bg-slate-100 transition-colors">
              ⚠️ Sai định lượng nguy hiểm
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer hover:bg-slate-100 transition-colors">
              📢 Spam / Quảng cáo ngoài lề
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-[11px] cursor-pointer hover:bg-slate-100 transition-colors">
              🚫 Tác giả có tiền sử vi phạm
            </span>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Column: Danh sách bị từ chối */}
            <div className="lg:col-span-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-black text-slate-700 uppercase tracking-wider px-1">
                <span>Danh sách bị từ chối</span>
                <span className="text-slate-400 font-normal">Hiển thị {isEmptyData ? 0 : rejectedItems.length}/{isEmptyData ? 0 : 34}</span>
              </div>

              {rejectedItems.length === 0 ? (
                <div className="p-8 rounded-2xl border border-slate-200/90 bg-white text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-800">Chưa có công thức bị từ chối</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                      Hiện tại không có công thức nào trong danh sách bị từ chối hoặc vi phạm quy định.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {rejectedItems.map((item) => {
                  const isSelected = item.id === selectedItemId
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-rose-50/20 border-rose-400 shadow-md ring-1 ring-rose-300'
                          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Thumbnail with overlay badge if any */}
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                          {item.badgeOverlay && (
                            <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                              <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-black text-[9px] tracking-wider uppercase">
                                {item.badgeOverlay}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-1 text-[10px]">
                            <span
                              className={`px-1.5 py-0.5 rounded font-bold border ${
                                item.reasonTagColor === 'rose'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : item.reasonTagColor === 'amber'
                                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                                  : 'bg-slate-100 text-slate-700 border-slate-200'
                              }`}
                            >
                              {item.reasonTag}
                            </span>
                            <span className="text-slate-400">{item.timeAgo}</span>
                          </div>

                          <div className="text-[10px] font-bold text-rose-600 uppercase">
                            {item.reasonNote}
                          </div>

                          <h4 className="text-xs font-black text-slate-900 line-clamp-1 leading-snug">
                            {item.title}
                          </h4>

                          <div className="flex items-center justify-between text-[11px] pt-0.5">
                            <div className="flex items-center gap-1 text-slate-600 font-semibold truncate">
                              <span>{item.author}</span>
                              <span className="text-[10px] text-amber-700 font-medium bg-amber-50 px-1 rounded">
                                {item.authorRole}
                              </span>
                            </div>
                            <span className="text-rose-600 font-black text-[10px] shrink-0 font-mono">
                              Điểm AI: {item.aiScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              )}

              {/* Pagination footer */}
              <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-500">
                <span>Xem trang {isEmptyData ? '0 / 0' : '1 / 9'}</span>
                {!isEmptyData && (
                  <button
                    type="button"
                    onClick={() => showToast('Đang tải thêm 30 công thức bị từ chối...')}
                    className="font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
                  >
                    Tải thêm 30 công thức từ chối
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Detailed Rejected Recipe View */}
            <div className="lg:col-span-8 space-y-4">
              {!activeItem ? (
                <div className="p-12 rounded-3xl border border-slate-200/80 bg-white text-center space-y-4 shadow-2xs">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <Gavel className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800">Chưa có hồ sơ vi phạm để hiển thị</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Khi có công thức bị từ chối phê duyệt hoặc vi phạm chính sách kiểm duyệt, hồ sơ chi tiết và bằng chứng sẽ xuất hiện tại đây.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Top metadata bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-slate-700">
                    Mã công thức: <strong className="text-slate-900">{activeItem.code}</strong>
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-200">
                    ĐÃ TỪ CHỐI &amp; LƯU HỒ SƠ
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  Kiểm duyệt viên: <strong className="text-slate-800">Bếp Trưởng Minh</strong> • 24/10/2024 - 14:15
                </div>
              </div>

              {/* Hero Image with Diagonal Rejection Stamp */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-md bg-slate-900 h-64 md:h-72">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="w-full h-full object-cover opacity-85 filter brightness-90"
                />

                {/* Top Right Detection Tag */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[10px] font-mono border border-white/20">
                  PHÁT HIỆN: &quot;FOODY.VN&quot;
                </div>

                {/* Big Diagonal Stamp */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="px-8 py-3 rounded-2xl border-4 border-rose-600 bg-rose-600/90 text-white font-black text-2xl md:text-3xl tracking-widest uppercase transform -rotate-12 shadow-2xl backdrop-blur-xs">
                    TỪ CHỐI XUẤT BẢN
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-2 p-2.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsAppealModalOpen(true)}
                  className={`px-3 py-2 rounded-xl border transition-all cursor-pointer shadow-2xs flex items-center gap-1.5 ${
                    appealCount > 0
                      ? 'bg-blue-50/70 border-blue-200 text-blue-700 hover:bg-blue-100/70 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold'
                  }`}
                  title="Xem đơn kháng nghị từ tác giả và phê duyệt chứng từ"
                >
                  <span>💬 Kháng nghị từ tác giả ({appealCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEvidenceModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  title="So sánh ảnh vi phạm với ảnh gốc đối chứng Foody"
                >
                  <span>🔍 Xem ảnh gốc &amp; Bằng chứng</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsRestoreModalOpen(true)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                  title="Phục hồi công thức về trạng thái Cần sửa lại và giao hạn chót"
                >
                  <span>↩️ Phục hồi &amp; Cho phép sửa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExtendBanModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black transition-all cursor-pointer shadow-xs ml-auto flex items-center gap-1.5"
                  title="Tăng mức kỷ luật cấm đăng bài đối với tài khoản tác giả"
                >
                  <span>⚠️ Gia hạn lệnh cấm tác giả</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsLegalPdfModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  title="Mở biên bản pháp lý chuẩn A4 có dấu mộc và chữ ký số"
                >
                  <span>📜 Mở Biên bản Pháp lý PDF</span>
                </button>
              </div>

              {/* Author mini profile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
                    TB
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{activeItem.author}</span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
                        Cấp độ 1
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Cảnh cáo lần 1
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Tổng công thức đã gửi: <strong>3</strong> • Vi phạm: <strong>2 lần</strong> (Tỉ lệ vi phạm{' '}
                      <strong className="text-rose-600">66.7%</strong>)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => showToast(`Đang mở hồ sơ quản trị viên của tác giả ${activeItem.author}...`)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer self-start sm:self-center"
                >
                  Xem hồ sơ tác giả
                </button>
              </div>

              {/* Red General Notice Box */}
              <div className="p-4 rounded-2xl bg-rose-50/30 border border-rose-300 text-slate-800 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 text-rose-700 font-black text-xs uppercase tracking-tight">
                  <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>
                    CÔNG THỨC ĐÃ BỊ TỪ CHỐI XUẤT BẢN • Mã quyết định #REJ-2024-98540
                  </span>
                  <span className="ml-auto px-2 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black uppercase">
                    Hiệu lực tức thì
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed pl-6">
                  Lý do tổng quát: Phát hiện sao chép ảnh có bản quyền từ nguồn bên ngoài (Foody Network) và cung cấp chỉ dẫn nhiệt độ nướng sườn nguy hiểm, tiềm ẩn ngộ độc thực phẩm do thịt sống chưa đạt chuẩn vi sinh.
                </p>
              </div>

              {/* AI Inspector Violation Report Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 font-black text-slate-800 text-xs uppercase">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Báo cáo Vi Phạm Trí Tuệ Nhân Tạo (Bếp Xinh AI Inspector)</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-200">
                    Độ an toàn: 18 / 100
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {/* Point 1 */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        1. Trùng khớp bản quyền ảnh Foody 94.6%
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                        Trùng khớp 94.6%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      AI Vision phát hiện watermark trong suốt mang nhãn hiệu &quot;Foody.vn Media&quot; ở tọa độ (X:820, Y:1020). Hình ảnh gốc đối chứng được tải lên ngày 14/06/2021 trong bài viết đánh giá nhà hàng của bên thứ ba.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsEvidenceModalOpen(true)}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer pt-0.5"
                    >
                      <span>⊙ So sánh ảnh gốc đối chứng và bản vi phạm</span>
                    </button>
                  </div>

                  {/* Point 2 */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        2. Đánh giá ATTP nguy cơ cao thịt sống
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white">
                        Mức rủi ro: Cao
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Quy trình hướng dẫn nướng dẻ sườn heo dày 3.5cm chỉ trong vòng 8 phút ở nhiệt độ 140°C. Mức nhiệt tâm thực phẩm này sẽ không thể đạt ngưỡng 71°C tối thiểu để tiêu diệt khuẩn Salmonella và ấu trùng giun xoắn trong thịt heo sống.
                    </p>
                  </div>

                  {/* Point 3 */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        3. Chèn SĐT Zalo bán sườn giá rẻ vi phạm quảng cáo
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Cảnh báo Spam
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Chứa số điện thoại cá nhân và lời mời chào mua thịt heo số lượng lớn: &quot;Liên hệ Zalo 0903.xxx.xxx để lấy sỉ sườn tươi giá rẻ&quot; trong phần mô tả bước sơ chế.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notification Sent to Author Card */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>Thông báo cưỡng chế đã gửi tới tác giả</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Đã phân phối qua Push &amp; Email
                  </span>
                </div>

                <div className="text-[11px] text-slate-500">
                  Kênh nhận: <strong className="text-slate-700">Ứng dụng Bếp Xinh iOS/Android &amp; tranbao.chef@gmail.com</strong> • Gửi lúc: 14:15 - 24/10/2024
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed italic">
                  &quot;Chào Trần Bảo, công thức &apos;Sườn nướng sốt BBQ Hàn Quốc siêu cay&apos; của bạn đã bị Ban Quản Trị từ chối xuất bản do vi phạm Tiêu chuẩn Cộng Đồng Bếp Xinh: Sử dụng hình ảnh có watermark từ bên thứ 3 (Foody) và thông số kỹ thuật nướng không đảm bảo an toàn nhiệt tâm thực phẩm. Tài khoản của bạn bị tạm ngưng quyền đăng bài mới trong 48 giờ.&quot;
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 2: BIÊN BẢN CƯỠNG CHẾ & XỬ PHẠT (media_1793259213174.png) */}
      {/* ========================================================================= */}
      {subTab === 'enforcement' && (
        (isEmptyData && !sampleLoaded) ? (
          <div className="p-12 rounded-3xl border border-slate-200/80 bg-white text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Gavel className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Chưa có biên bản cưỡng chế</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hệ thống chưa ghi nhận biên bản xử lý kỷ luật hoặc cưỡng chế vi phạm nào.
              </p>
            </div>
          </div>
        ) : (
        <div className="space-y-4">
          {/* Top Success Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-emerald-950">
                    Xử lý chế tài &amp; Từ chối xuất bản thành công!
                  </h3>
                  <span className="font-mono text-xs font-bold text-emerald-800">#RC-98540</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Đã lập biên bản điện tử
                  </span>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                  Biên bản kỷ luật <strong className="font-mono">#REJ-2024-98540</strong> đã được phát hành và thông báo tức thì tới tác giả <strong>Trần Bảo</strong> qua Web Push Notification và thư điện tử xác thực.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200 text-emerald-800 font-mono text-xs font-bold shadow-2xs">
                SHA: e4c99a81
              </span>
              <button
                type="button"
                onClick={() => onNavigateTab('pending')}
                className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Duyệt bài kế tiếp</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Queue Summary */}
            <div className="lg:col-span-4 space-y-3">
              {/* Queue numbers */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs font-black text-slate-800 uppercase tracking-tight">
                  <span>Hàng đợi kiểm duyệt</span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    ● Live sync
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Chờ duyệt</div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">37</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-500 font-bold uppercase">Đã duyệt</div>
                    <div className="text-xl font-black text-emerald-600 mt-0.5">142</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100">
                    <div className="text-[10px] text-rose-700 font-bold uppercase">Từ chối</div>
                    <div className="text-xl font-black text-rose-600 mt-0.5">35</div>
                  </div>
                </div>
              </div>

              {/* Just Rejected Item Card */}
              <div className="p-3.5 bg-rose-50/20 rounded-2xl border border-rose-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-rose-700">
                  <span className="flex items-center gap-1">
                    <Gavel className="w-3.5 h-3.5" />
                    VỪA BỊ TỪ CHỐI
                  </span>
                  <span className="text-slate-400 font-mono lowercase">1 phút trước</span>
                  <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px] font-black">
                    -50 Điểm
                  </span>
                </div>

                <div className="flex gap-2.5">
                  <img
                    src="/images/food_thit_nuong.png"
                    alt="Sườn nướng"
                    className="w-14 h-14 rounded-xl object-cover border border-rose-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono text-slate-400">#RC-98540</div>
                    <h5 className="text-xs font-black text-slate-900 line-clamp-1">
                      Sườn nướng sốt BBQ Hàn Quốc siêu cay
                    </h5>
                    <div className="text-[11px] text-slate-600 mt-0.5">
                      Tác giả: <strong className="text-slate-800">Trần Bảo</strong> (Tập sự L1)
                    </div>
                    <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                      Đã áp dụng chế tài: Khóa 48h
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Waiting Item */}
              <div className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px] font-black uppercase text-amber-700">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    ĐANG CHỜ DUYỆT KẾ TIẾP
                  </span>
                  <span className="text-slate-400 font-mono lowercase">14:18 hôm nay</span>
                </div>

                <div className="flex gap-2.5">
                  <img
                    src="/images/recipe_hero_dish.png"
                    alt="Thịt ba chỉ"
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-mono text-slate-400">#RC-98541 • Chuyên gia L3</div>
                    <h5 className="text-xs font-black text-slate-900 line-clamp-1">
                      Thịt ba chỉ nướng mật ong sốt tiêu xanh
                    </h5>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Bởi: Lê Hoàng Yến • 4 bước nấu
                    </div>
                    <div className="flex items-center justify-between pt-1 mt-1">
                      <span className="text-[10px] text-emerald-600 font-bold">
                        AI Scan: Sạch 99.2%
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigateTab('pending')}
                        className="px-2 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        Mở thẩm định ngay &gt;
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">TỶ LỆ TỪ CHỐI TUẦN</div>
                  <div className="text-lg font-black text-slate-900 mt-0.5">11.4%</div>
                  <div className="text-[10px] text-rose-600 font-medium">+1.8% vi phạm bản quyền</div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">TÀI KHOẢN BỊ KHÓA</div>
                  <div className="text-lg font-black text-rose-600 mt-0.5">08</div>
                  <div className="text-[10px] text-slate-500">Trong 72 giờ qua</div>
                </div>
              </div>

              {/* Regulatory Box */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-slate-600" />
                  Quy chuẩn Chế tài Bếp Xinh
                </div>
                <p className="leading-relaxed">
                  Vi phạm bản quyền hình ảnh &gt;80% hoặc chèn thông tin quảng cáo trục lợi bên ngoài sẽ tự động kích hoạt mức phạt: Tạm khóa quyền tác giả tối thiểu 48h và trừ từ 40 - 70 điểm uy tín.
                </p>
              </div>
            </div>

            {/* Right Enforcement Record */}
            <div className="lg:col-span-8 space-y-4">
              {/* Record Header */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-black">
                      <Gavel className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-black text-slate-900">
                          Biên bản Cưỡng chế &amp; Xử lý Vi phạm
                        </h2>
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white text-[10px] font-black uppercase">
                          BAN HÀNH
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Số biên bản: <strong className="text-slate-800 font-mono">#REJ-2024-98540</strong> • Cổng quản trị Vận hành
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSubTab('legal_cert')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Xuất PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Đã sao chép link biên bản kỷ luật vào bộ nhớ tạm!')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sao chép Link</span>
                    </button>
                  </div>
                </div>

                {/* 4 Metadata Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">NGƯỜI KÝ QUYẾT</div>
                    <div className="font-black text-slate-900 text-xs">Bếp Trưởng Minh</div>
                    <div className="text-[10px] text-slate-500">Lead Admin • Cấp duyệt 4</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">THỜI GIAN HIỆU LỰC</div>
                    <div className="font-black text-slate-900 text-xs">14:35, 26/10/2024</div>
                    <div className="text-[10px] text-emerald-700 font-bold">Bắt đầu thi hành tức thì</div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-0.5">
                    <div className="text-[10px] text-rose-700 font-bold uppercase">HẾT HẠN CHẾ TÀI</div>
                    <div className="font-black text-rose-700 text-xs">14:35, 28/10/2024</div>
                    <div className="text-[10px] text-rose-600 font-bold">47h 58m còn lại</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">MÃ BẢO MẬT HASH</div>
                    <div className="font-mono font-bold text-slate-900 text-xs">SHA-256 e4c99a81</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Đã ghi nhận Sổ cái</div>
                  </div>
                </div>
              </div>

              {/* Author penalty credit drop */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                      TB
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 text-sm">Trần Bảo</span>
                        <span className="text-[11px] text-slate-500">Tác giả Tập sự L1 • UID: #USR-78210</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Tham gia 3 tháng • 14 công thức đã đăng (3 bị từ chối)
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white self-start sm:self-center">
                    Bị giới hạn (Locked 48h)
                  </span>
                </div>

                {/* Score Drop Meter */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">ĐIỂM UY TÍN TRƯỚC XỬ LÝ</div>
                    <div className="text-xl font-black text-slate-700 mt-0.5">65 <span className="text-xs font-normal">/ 100</span></div>
                    <span className="text-[10px] font-bold text-slate-500">Mức Khá</span>
                  </div>

                  <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center">
                    <div className="text-[10px] text-rose-700 font-bold uppercase">ĐIỂM SAU CHẾ TÀI (-50)</div>
                    <div className="text-2xl font-black text-rose-600 mt-0.5">15 <span className="text-xs font-normal">/ 100</span></div>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white">
                      BÁO ĐỘNG ĐỎ NGUY CẤP
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-rose-700">15% Ngưỡng an toàn</span>
                      <span className="text-slate-400">Mục tiêu 80%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-600 rounded-full w-[15%]" />
                    </div>
                    <p className="text-[10px] text-rose-600 font-medium leading-tight">
                      Chỉ cần 1 vi phạm nữa tài khoản sẽ bị đóng băng vĩnh viễn.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Violations Table / Cards */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Chi tiết 3 lỗi vi phạm quy định được lưu trữ hồ sơ</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Phân loại theo Điều 4 - Bộ Quy tắc 2023
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Error 1 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-rose-700 uppercase">VI PHẠM BẢN QUYỀN</span>
                      <span className="text-[10px] font-bold text-rose-600">Khớp 94.6%</span>
                    </div>
                    <h5 className="font-bold text-slate-900 leading-snug">
                      Hình ảnh sao chép từ Foody.vn
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Ảnh của món sườn nướng có chữ ký watermark gốc bị cắt xén. Hệ thống nhận diện thị giác phát hiện trùng khớp với bài viết ngày 12/04/2021.
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Hình phạt:</span>
                      <strong className="text-rose-600 font-black">-30 Điểm • Lỗi nghiêm trọng</strong>
                    </div>
                  </div>

                  {/* Error 2 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-700 uppercase">TIÊU CHUẨN ATTP</span>
                      <span className="text-[10px] font-bold text-amber-600">Nhiệt độ tâm</span>
                    </div>
                    <h5 className="font-bold text-slate-900 leading-snug">
                      Sai lệch quy chuẩn nhiệt độ
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Bước 3 hướng dẫn nướng sườn dày 3.5cm ở 140°C trong 8 phút. Nhiệt độ tâm thịt heo chưa đạt ngưỡng an toàn 71°C theo khuyến cáo Bếp Xinh.
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Hình phạt:</span>
                      <strong className="text-amber-700 font-black">-10 Điểm • Tiềm ẩn ngộ độc</strong>
                    </div>
                  </div>

                  {/* Error 3 */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-600 uppercase">SPAM THƯƠNG MẠI</span>
                      <span className="text-[10px] font-bold text-slate-500">SĐT / Zalo</span>
                    </div>
                    <h5 className="font-bold text-slate-900 leading-snug">
                      Chèn SĐT sỉ lẻ nguyên liệu
                    </h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Đoạn ghi chú bước 2 chèn số điện thoại cá nhân và lời mời chào mua thịt heo đông lạnh giá buôn, vi phạm chính sách không vụ lợi.
                    </p>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Hình phạt:</span>
                      <strong className="text-slate-700 font-black">-10 Điểm • Trục lợi nền tảng</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Audit Trail */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Nhật ký kiểm toán hệ thống thời gian thực (Audit Trail)</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                    ● Ghi nhận bất biến
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">1</span>
                      <span>14:32:10</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">AI Scanner gắn cờ</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Hệ thống phát hiện ảnh 94.6% &amp; regex SĐT.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">2</span>
                      <span>14:34:02</span>
                    </div>
                    <div className="font-bold text-slate-800 mt-1">Admin đối soát &amp; Duyệt</div>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">
                      Bếp Trưởng Minh xác nhận &amp; áp khung phạt.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-mono">
                      <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">3</span>
                      <span>14:35:12</span>
                    </div>
                    <div className="font-bold text-emerald-900 mt-1">Gửi thông báo &amp; Email</div>
                    <p className="text-[10px] text-emerald-800 mt-0.5 leading-tight">
                      Phát hành push notification app &amp; email chi tiết.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                    <div className="flex items-center gap-1.5 text-rose-700 text-[10px] font-mono">
                      <span className="w-4 h-4 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center font-bold">4</span>
                      <span>14:35:18</span>
                    </div>
                    <div className="font-bold text-rose-900 mt-1">Blacklist Monitoring</div>
                    <p className="text-[10px] text-rose-800 mt-0.5 leading-tight">
                      UID #USR-78210 đưa vào danh sách giám sát 30 ngày.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => showToast('Đang mở hồ sơ quản trị của tác giả Trần Bảo...')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Xem hồ sơ tác giả Trần Bảo
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Mở cổng cho phép tác giả gửi đơn kháng nghị điện tử.')}
                    className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Thu hồi quyết định / Mở kháng nghị
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab('pending')}
                  className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Chuyển sang duyệt công thức kế tiếp</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* ========================================================================= */}
      {/* SUBTAB 3: CHỨNG NHẬN PHÁP LÝ & FILE PDF (media_1793259215043.png) */}
      {/* ========================================================================= */}
      {subTab === 'legal_cert' && (
        (isEmptyData && !sampleLoaded) ? (
          <div className="p-12 rounded-3xl border border-slate-200/80 bg-white text-center space-y-4 shadow-2xs">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-800">Chưa có chứng nhận pháp lý</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hệ thống chưa tạo văn bản chứng nhận pháp lý hoặc hồ sơ xử lý nào.
              </p>
            </div>
          </div>
        ) : (
        <div className="space-y-4">
          {/* Top Info Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-rose-600 text-white">
                  ĐÃ GỠ KHỎI KHÁM PHÁ (DE-LISTED)
                </span>
                <span className="font-mono text-xs font-bold text-slate-600">#RC-98540</span>
                <span className="text-slate-400 text-xs font-mono">
                  SHA-256 : e4c99a818c72...4fe3
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">
                  Xử lý Can thiệp &amp; Cấp Chứng nhận vi phạm
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  MỨC PHẠT: KHẨN CẤP
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Tác phẩm mục tiêu: <strong className="text-slate-800">Sườn nướng sốt BBQ Hàn Quốc siêu cay</strong> | Tác giả: <strong className="text-slate-800">Trần Bảo (#USR-78210)</strong> | Hồ sơ cưỡng chế: <strong className="text-rose-600 font-mono">#REJ-2024-98540</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => showToast('Đã gửi thông báo bổ sung tới tác giả.')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                ✉ Báo cho tác giả
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>In biên bản</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Đang tải file PDF bản gốc có chữ ký số SHA-256...')}
                className="px-3.5 py-1.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tải PDF Bản gốc</span>
              </button>
            </div>
          </div>

          {/* Legal basis card */}
          <div className="p-3.5 bg-rose-50/25 rounded-2xl border border-rose-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <Gavel className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-slate-900">
                  Căn cứ Pháp lý &amp; Biên bản Vi phạm Độc quyền
                </div>
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Vi phạm Khoản 3, Điều 4 - Quy chế Kiểm duyệt v2.5: Đính kèm số điện thoại thương mại trên ảnh &amp; vi phạm bản quyền Cooky/Foody.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold border-t md:border-t-0 pt-2 md:pt-0 border-rose-200">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">ĐIỂM TRỪ UY TÍN</div>
                <div className="text-rose-600 font-black">-50 Điểm</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">KHÓA ĐĂNG TẢI</div>
                <div className="text-slate-800 font-black">48 Giờ</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-400 uppercase">CẤP THẨM QUYỀN</div>
                <div className="text-emerald-700 font-black">Cấp duyệt 4 (Admin)</div>
              </div>
            </div>
          </div>

          {/* Split Screen: Left Controls, Right Official PDF Document */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Controls */}
            <div className="lg:col-span-6 space-y-4">
              {/* 1. Can Thiệp Hiển Thị & Phân Phối */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>1. Can Thiệp Hiển Thị &amp; Phân Phối</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-200">
                    THỰC THI NGAY LẬP TỨC
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Switch 1: Delist Discovery */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          Gỡ khỏi Bảng tin Khám phá (Discovery Feed Delisting)
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white">
                          Đã kích hoạt
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ngăn công thức xuất hiện trên trang chủ, mục &quot;Món ngon thịnh hành&quot; và luồng phân phối tự động.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3">
                      <input
                        type="checkbox"
                        checked={delistDiscovery}
                        onChange={(e) => setDelistDiscovery(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9c3808]"></div>
                    </label>
                  </div>

                  {/* Switch 2: Deindex Search */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          Chặn chỉ mục &amp; Tìm kiếm công khai (De-index Search)
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-rose-600 text-white">
                          Đã kích hoạt
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Ẩn kết quả khỏi công cụ tìm kiếm nội bộ và gửi thẻ noindex, nofollow tới Google/Bing.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer ml-3">
                      <input
                        type="checkbox"
                        checked={deindexSearch}
                        onChange={(e) => setDeindexSearch(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9c3808]"></div>
                    </label>
                  </div>

                  {/* Fallback mode radio group */}
                  <div className="space-y-1.5 pt-1">
                    <span className="font-bold text-slate-700 text-xs">
                      Chế độ lưu hành dự phòng (Fallback Access Mode)
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      <label
                        onClick={() => setFallbackMode('author_only')}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                          fallbackMode === 'author_only'
                            ? 'bg-rose-50 border-rose-400 font-bold text-rose-800'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="text-xs font-bold">Chỉ tác giả</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Xem trong nhật ký</div>
                      </label>

                      <label
                        onClick={() => setFallbackMode('with_warning')}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                          fallbackMode === 'with_warning'
                            ? 'bg-rose-50 border-rose-500 ring-1 ring-rose-400 font-bold text-rose-800'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="text-xs font-bold">Kèm cảnh báo</div>
                        <div className="text-[10px] text-rose-600 mt-0.5">Banner vi phạm ATTP</div>
                      </label>

                      <label
                        onClick={() => setFallbackMode('block_all')}
                        className={`p-2.5 rounded-xl border text-center cursor-pointer transition-all ${
                          fallbackMode === 'block_all'
                            ? 'bg-rose-50 border-rose-400 font-bold text-rose-800'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        <div className="text-xs font-bold">Chặn toàn bộ</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Trả về mã HTTP 451</div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Hiệu Chỉnh Danh Mục & Thanh Lọc Tags */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-black text-slate-800 text-xs uppercase">
                    <Filter className="w-4 h-4 text-orange-600" />
                    <span>2. Hiệu Chỉnh Danh Mục &amp; Thanh Lọc Tags</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Engine: Sanitize v4.8
                  </span>
                </div>

                {/* Category Reassignment */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">DANH MỤC GỐC</span>
                    <div className="font-bold text-slate-500 line-through mt-0.5">Món Nướng Sáng Tạo</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/40 border border-rose-200">
                    <span className="text-[10px] text-rose-700 font-bold uppercase">DANH MỤC PHÂN BỔ LẠI (BẮT BUỘC)</span>
                    <div className="font-bold text-rose-700 mt-0.5">Hàng đợi cách ly &amp; Cần thẩm định lại (#CAT-99)</div>
                  </div>
                </div>

                {/* Revoked Violation Tags */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 text-[11px]">
                      ✂ Tags Vi Phạm Đã Thu Hồi &amp; Cấm Phân Phối:
                    </span>
                    <span className="text-[10px] text-slate-400">3 thẻ bị xóa vĩnh viễn</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-mono text-[11px] line-through">
                      #si_suon_gia_re [Spam]
                    </span>
                    <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-mono text-[11px] line-through">
                      #zalo_0903xxx [SĐT trái phép]
                    </span>
                    <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-mono text-[11px] line-through">
                      #foody_vietnam [Bản quyền ảnh]
                    </span>
                  </div>
                </div>

                {/* Standardized Allowed Tags */}
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-700 text-[11px]">
                    Tags Chuẩn Hóa Được Phép Lưu Hành:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                      #suon_nuong
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                      #bbq_han_quoc
                    </span>
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                      #mon_an_gia_dinh
                    </span>
                    <span className="px-2 py-1 rounded bg-amber-50 text-amber-800 font-mono text-[11px] border border-amber-200">
                      #canh_bao_nhiet_do_tam
                    </span>
                  </div>
                </div>

                {/* Mandatory Warning Checkboxes */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-slate-800 text-[11px]">
                    Thẻ Cảnh Báo An Toàn Vệ Sinh Bắt Buộc (Mục 12 - Luật ATTP):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <label className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tagsWarning1}
                        onChange={(e) => setTagsWarning1(e.target.checked)}
                        className="rounded accent-rose-600"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">Nướng tối thiểu 15 phút</span>
                    </label>

                    <label className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tagsWarning2}
                        onChange={(e) => setTagsWarning2(e.target.checked)}
                        className="rounded accent-rose-600"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">Tiềm ẩn vi khuẩn sống</span>
                    </label>

                    <label className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={tagsWarning3}
                        onChange={(e) => setTagsWarning3(e.target.checked)}
                        className="rounded accent-rose-600"
                      />
                      <span className="text-[11px] font-semibold text-slate-700">Không áp dụng trẻ nhỏ</span>
                    </label>
                  </div>
                </div>

                {/* Save tags button */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => showToast('Đã khôi phục thiết lập tags mặc định.')}
                    className="text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
                  >
                    Khôi phục mặc định
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Đã lưu các thay đổi về Tags và Phân loại Danh mục thành công!')}
                    className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-bold transition-all shadow-2xs cursor-pointer"
                  >
                    Lưu thay đổi Tags &amp; Danh mục
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Embedded Authentic Vietnamese Legal PDF Preview */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 uppercase tracking-tight">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span>Biên Bản Pháp Lý PDF</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    ISO 27001 SECURED
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase">
                  A4 PREVIEW
                </span>
              </div>

              {/* Realistic A4 Document Sheet */}
              <div className="p-6 md:p-8 bg-white rounded-2xl border-2 border-slate-300 shadow-xl space-y-4 text-slate-800 font-serif relative overflow-hidden select-text">
                {/* Official National Header */}
                <div className="text-center space-y-1 border-b pb-3 border-slate-200">
                  <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-900 font-sans">
                    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                  </div>
                  <div className="text-xs font-semibold text-slate-700 underline underline-offset-4 font-sans">
                    Độc lập - Tự do - Hạnh phúc
                  </div>
                  <div className="pt-2 text-[11px] font-bold text-slate-700 font-sans uppercase">
                    HỆ THỐNG KIỂM DUYỆT ẨM THỰC BẾP XINH ENTERPRISE
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">
                    HỘI ĐỒNG THẨM ĐỊNH BẢN QUYỀN &amp; AN TOÀN NỘI DUNG SỐ
                  </div>
                </div>

                {/* Decision Title */}
                <div className="text-center space-y-1 pt-1 font-sans">
                  <h3 className="text-sm md:text-base font-black text-rose-700 uppercase tracking-tight">
                    QUYẾT ĐỊNH XỬ LÝ VI PHẠM &amp; CƯỠNG CHẾ
                  </h3>
                  <div className="text-[11px] font-bold text-slate-600 font-mono">
                    SỐ: 98540/QĐ-XPVPHC/BX-2025
                  </div>
                  <p className="text-[11px] text-slate-500 italic">
                    V/v: Xử lý can thiệp phân phối &amp; Thu hồi quyền tác phẩm vi phạm số #RC-98540
                  </p>
                </div>

                {/* Metadata block */}
                <div className="text-xs font-sans p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500">Đối tượng áp dụng:</span>{' '}
                      <strong className="text-slate-900">Trần Bảo (UID: #USR-782100)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Thời gian can thiệp:</span>{' '}
                      <strong className="text-slate-900">26/10/2025 14:35:19</strong>
                    </div>
                  </div>
                  <div className="text-[11px]">
                    <span className="text-slate-500">Tác phẩm xử lý:</span>{' '}
                    <strong className="text-slate-900">Sườn nướng sốt BBQ Hàn Quốc siêu cay</strong>
                  </div>
                </div>

                {/* Legal Body Articles */}
                <div className="text-xs font-sans space-y-2 text-slate-700 leading-relaxed">
                  <p className="text-[11px] italic">
                    Căn cứ Nghị định 72/2013/NĐ-CP của Chính phủ về quản lý dịch vụ Internet &amp; Quy chế Vận hành Sàn Giao dịch Công thức Ẩm thực Bếp Xinh v2.5.
                  </p>

                  <div className="text-xs font-bold text-slate-900 uppercase pt-1">
                    QUYẾT NGHỊ CÁC BIỆN PHÁP CHẾ TÀI:
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <p>
                      <strong>Điều 1:</strong> Gỡ vĩnh viễn quyền phân phối trên tab Khám Phá &amp; Trang chủ hệ thống đối với công thức #RC-98540.
                    </p>
                    <p>
                      <strong>Điều 2:</strong> Tước quyền đăng tải nội dung mới trong thời hạn <strong>48 giờ</strong> đối với tác giả Trần Bảo.
                    </p>
                    <p>
                      <strong>Điều 3:</strong> Khấu trừ <strong>50 điểm uy tín tác giả</strong> và gửi cảnh báo tự động về Trung tâm Tài khoản.
                    </p>
                  </div>
                </div>

                {/* Digital Stamp & QR Section */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4 font-sans">
                  {/* Left: QR code authentication */}
                  <div className="flex items-center gap-2">
                    <div className="w-14 h-14 p-1 rounded-lg border border-slate-300 bg-white shadow-2xs flex items-center justify-center">
                      <QrCode className="w-12 h-12 text-slate-800" />
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono space-y-0.5">
                      <div className="font-bold text-slate-700">MÃ XÁC THỰC PDF</div>
                      <div>ID: BX-2025-SEC-98540</div>
                      <div className="text-emerald-700 font-bold">XÁC THỰC THỜI GIAN: 14:35:19</div>
                    </div>
                  </div>

                  {/* Right: Red Official Circular Digital Stamp */}
                  <div className="relative text-center shrink-0">
                    <div className="w-28 h-28 rounded-full border-2 border-red-600 flex flex-col items-center justify-center p-2 text-red-600 text-[8px] font-black uppercase tracking-tight transform rotate-[-6deg] shadow-xs select-none">
                      <div className="text-[7px]">★ BẾP TRƯỞNG MINH ★</div>
                      <div className="border-t border-b border-red-600 py-0.5 my-0.5 font-bold text-[8px] w-full text-center">
                        Lead Moderator
                      </div>
                      <div className="text-[7px]">CẤP DUYỆT 4</div>
                      <div className="text-[6px] tracking-tighter text-red-700 mt-0.5">
                        XÁC THỰC CHỮ KÝ ĐIỆN TỬ
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Security hash */}
                <div className="text-[9px] text-slate-400 font-mono pt-2 border-t border-slate-100 flex items-center justify-between font-sans">
                  <span>GHI: CHỨNG THỰC BẢN ĐIỆN TỬ THEO LUẬT GIAO DỊCH ĐIỆN TỬ 2023</span>
                  <span>TRANG 01/01</span>
                </div>
              </div>

              {/* Action Buttons below PDF */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <button
                  type="button"
                  onClick={() => showToast('Đang kết xuất và tải xuống file PDF bản ký số có bảo mật ISO...')}
                  className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Xuất file PDF Bản Ký Số (.pdf)</span>
                </button>

                <button
                  type="button"
                  onClick={() => showToast('Đã gửi bản sao biên bản PDF qua email tranbao.chef@gmail.com!')}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>Gửi qua Email tác giả</span>
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Tự động đồng bộ hóa hồ sơ bảo mật ISO/IEC 27001 • Sync Realtime</span>
              </div>
            </div>
          </div>
        </div>
        )
      )}

      {/* 5 Action Modals */}
      <AuthorAppealModal
        isOpen={isAppealModalOpen}
        onClose={() => setIsAppealModalOpen(false)}
        recipeCode={activeItem?.code || '#RC-98540'}
        recipeTitle={activeItem?.title || 'Sườn nướng sốt BBQ Hàn Quốc siêu cay'}
        authorName={activeItem?.author || 'Trần Bảo'}
        authorUid="#USR-78210"
        onResolve={handleResolveAppeal}
      />

      <EvidenceComparisonModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        submittedImage={activeItem?.image || '/images/food_thit_nuong.png'}
        originalImage="https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80"
        recipeTitle={activeItem?.title || 'Sườn nướng sốt BBQ Hàn Quốc siêu cay'}
        recipeCode={activeItem?.code || '#RC-98540'}
      />

      <RestoreRecipeModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        recipeCode={activeItem?.code || '#RC-98540'}
        recipeTitle={activeItem?.title || 'Sườn nướng sốt BBQ Hàn Quốc siêu cay'}
        authorName={activeItem?.author || 'Trần Bảo'}
        onConfirmRestore={handleConfirmRestore}
      />

      <ExtendBanModal
        isOpen={isExtendBanModalOpen}
        onClose={() => setIsExtendBanModalOpen(false)}
        authorName={activeItem?.author || 'Trần Bảo'}
        authorUid="#USR-78210"
        currentBanExpiry="14:15 - 26/10/2024 (còn 36 giờ)"
        onConfirmExtend={handleConfirmExtendBan}
      />

      <LegalCertPdfModal
        isOpen={isLegalPdfModalOpen}
        onClose={() => setIsLegalPdfModalOpen(false)}
        recipeCode={activeItem?.code || '#RC-98540'}
        recipeTitle={activeItem?.title || 'Sườn nướng sốt BBQ Hàn Quốc siêu cay'}
        authorName={activeItem?.author || 'Trần Bảo'}
        authorUid="#USR-78210"
      />
    </div>
  )
}
