import React, { useState } from 'react'
import {
  X,
  Search,
  ZoomIn,
  ZoomOut,
  Layers,
  Columns2,
  Sliders,
  Download,
  FileText,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface EvidenceComparisonModalProps {
  isOpen: boolean
  onClose: () => void
  recipeCode?: string
  recipeTitle?: string
  authorName?: string
  submittedImage?: string
  originalImage?: string
  matchRate?: number
}

export const EvidenceComparisonModal: React.FC<EvidenceComparisonModalProps> = ({
  isOpen,
  onClose,
  recipeCode = '#RC-98540',
  recipeTitle = 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
  authorName = 'Trần Bảo',
  submittedImage = '/images/food_thit_nuong.png',
  originalImage = '/images/food_thit_nuong.png',
  matchRate = 94.6,
}) => {
  const { showToast } = useProfile()
  const [viewMode, setViewMode] = useState<'side_by_side' | 'slider' | 'overlay'>('side_by_side')
  const [zoomLevel, setZoomLevel] = useState<number>(100)
  const [showHighlight, setShowHighlight] = useState<boolean>(true)
  const [sliderPos, setSliderPos] = useState<number>(50)
  const [overlayOpacity, setOverlayOpacity] = useState<number>(50)

  if (!isOpen) return null

  const handleDownloadEvidence = () => {
    showToast('Đang tạo và tải tệp nén Bằng chứng vi phạm BepXinh_Evidence_RC98540.zip...')
  }

  const handleExportForensicPdf = () => {
    showToast('Đang kết xuất Báo cáo Giám định AI Vision (.PDF) chuẩn ISO...')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">
                  Đối Chiếu Bằng Chứng Bản Quyền &amp; AI Vision
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-2xs">
                  TRÙNG KHỚP {matchRate}%
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500 mt-0.5">
                <span>Hồ sơ: <strong className="text-slate-800 font-mono">{recipeCode}</strong></span>
                <span>•</span>
                <span>Tác phẩm: <strong className="text-slate-800">{recipeTitle}</strong></span>
                <span>•</span>
                <span>Tác giả: <strong className="text-slate-800">{authorName}</strong></span>
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

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
          {/* View Modes */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode('side_by_side')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'side_by_side'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>Song song</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('slider')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'slider'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Thanh trượt cắt đôi</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('overlay')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'overlay'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Chồng mờ (Overlay)</span>
            </button>
          </div>

          {/* Zoom and Highlight Toggles */}
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs">
              <input
                type="checkbox"
                checked={showHighlight}
                onChange={() => setShowHighlight(!showHighlight)}
                className="accent-rose-600 w-3.5 h-3.5 cursor-pointer"
              />
              <span>Khoanh vùng vi phạm</span>
            </label>

            <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.max(100, z - 25))}
                disabled={zoomLevel <= 100}
                className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-40 cursor-pointer"
                title="Thu nhỏ"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono font-bold text-xs px-1 text-slate-700">{zoomLevel}%</span>
              <button
                type="button"
                onClick={() => setZoomLevel((z) => Math.min(200, z + 25))}
                disabled={zoomLevel >= 200}
                className="p-1 rounded text-slate-500 hover:text-slate-800 disabled:opacity-40 cursor-pointer"
                title="Phóng to"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Canvas Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 bg-slate-100/60">
          {/* MODE 1: Side by Side */}
          {viewMode === 'side_by_side' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Submitted Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase text-slate-800 px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600"></span>
                    ẢNH TÁC GIẢ NỘP (CẮT XÉN GÓC)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">1200 x 800px • sRGB</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-rose-400 bg-slate-900 shadow-md aspect-4/3 flex items-center justify-center">
                  <div
                    className="w-full h-full relative overflow-hidden transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  >
                    <img
                      src={submittedImage}
                      alt="Ảnh nộp vi phạm"
                      className="w-full h-full object-cover"
                    />

                    {/* Bounding box highlight on bottom right */}
                    {showHighlight && (
                      <div className="absolute bottom-4 right-4 w-32 h-14 border-2 border-dashed border-rose-500 bg-rose-500/20 backdrop-blur-2xs rounded-lg animate-pulse flex items-center justify-center">
                        <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono text-[9px] font-black uppercase shadow-xs">
                          Watermark bị xoá: 94.6%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-white font-mono text-[10px]">
                    EXIF: Stripped (Đã xóa Metadata)
                  </div>
                </div>
              </div>

              {/* Right: Original Partner Image */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-black uppercase text-slate-800 px-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    ẢNH GỐC ĐỐI TÁC (FOODY.VN 14/06/2021)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">foody.vn/ha-noi/suon-bbq</span>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-400 bg-slate-900 shadow-md aspect-4/3 flex items-center justify-center">
                  <div
                    className="w-full h-full relative overflow-hidden transition-transform duration-200"
                    style={{ transform: `scale(${zoomLevel / 100})` }}
                  >
                    <img
                      src={originalImage}
                      alt="Ảnh gốc đối tác"
                      className="w-full h-full object-cover"
                    />

                    {/* Original Watermark representation */}
                    {showHighlight && (
                      <div className="absolute bottom-4 right-4 w-32 h-14 border-2 border-emerald-400 bg-emerald-500/20 backdrop-blur-2xs rounded-lg flex items-center justify-center">
                        <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-mono text-[10px] font-black uppercase shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Watermark: Foody.vn
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-emerald-950/80 backdrop-blur-md text-emerald-200 font-mono text-[10px]">
                    Xuất bản gốc: 14/06/2021 - 10:15
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODE 2: Split Screen Slider */}
          {viewMode === 'slider' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span>Kéo thanh trượt để so sánh mức độ trùng khớp giữa ảnh nộp (Trái) và ảnh gốc (Phải)</span>
                <span className="font-mono text-rose-600">{sliderPos}% / 100%</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 shadow-md h-96 select-none">
                {/* Background image (Original) */}
                <img
                  src={originalImage}
                  alt="Ảnh gốc"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Foreground image (Submitted - clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={submittedImage}
                    alt="Ảnh nộp"
                    className="absolute inset-0 w-full h-full object-cover max-w-none"
                    style={{ width: '100%', height: '100%' }}
                  />
                  <div className="absolute top-3 left-3 px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-black uppercase">
                    Ảnh nộp vi phạm
                  </div>
                </div>

                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-emerald-600 text-white text-[10px] font-black uppercase">
                  Ảnh gốc Foody.vn
                </div>

                {/* Split line */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-xl pointer-events-none"
                  style={{ left: `${sliderPos}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-lg border-2 border-slate-800 flex items-center justify-center text-slate-800 font-black text-xs">
                    ↔
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                />
              </div>
            </div>
          )}

          {/* MODE 3: Crossfade Overlay */}
          {viewMode === 'overlay' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                <span>Điều chỉnh độ trong suốt để kiểm tra tính đồng nhất của từng điểm ảnh (Pixel Match)</span>
                <span className="font-mono text-slate-800">Độ phủ: {overlayOpacity}%</span>
              </div>

              <div className="relative rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 shadow-md h-96">
                <img
                  src={originalImage}
                  alt="Ảnh gốc"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <img
                  src={submittedImage}
                  alt="Ảnh nộp chồng lên"
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-75"
                  style={{ opacity: overlayOpacity / 100 }}
                />

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 flex items-center gap-3">
                  <span className="text-[11px] text-emerald-300 font-bold">Gốc (0%)</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={overlayOpacity}
                    onChange={(e) => setOverlayOpacity(Number(e.target.value))}
                    className="w-48 accent-rose-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-rose-300 font-bold">Nộp (100%)</span>
                </div>
              </div>
            </div>
          )}

          {/* AI Forensic Vision Metric Cards */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black uppercase text-slate-900 tracking-tight">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>CHỈ SỐ GIÁM ĐỊNH AI VISION FORENSIC MODEL V3</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600">
                ResNet-50 + Perceptual Hash
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">FEATURE MATCH POINTS</div>
                <div className="text-base font-black text-slate-900">1,420 điểm</div>
                <div className="text-[10px] text-rose-600 font-medium">Khớp góc cạnh &amp; bóng đổ</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">SSIM STRUCTURAL INDEX</div>
                <div className="text-base font-black text-rose-600">0.946 / 1.0</div>
                <div className="text-[10px] text-slate-500">Ngưỡng vi phạm &gt; 0.85</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-0.5">
                <div className="text-[10px] text-slate-400 font-bold uppercase">COLOR HISTOGRAM</div>
                <div className="text-base font-black text-slate-900">98.2% Phù hợp</div>
                <div className="text-[10px] text-slate-500">Chỉ chỉnh sáng +3%</div>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 space-y-0.5">
                <div className="text-[10px] text-rose-700 font-bold uppercase">PHÁT HIỆN CẮT XÉN (CROP)</div>
                <div className="text-base font-black text-rose-700">15% góc dưới phải</div>
                <div className="text-[10px] text-rose-600 font-bold">Xóa viền chữ &quot;oody.vn&quot;</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
              <strong>Kết luận Giám định:</strong> Hình ảnh do tác giả nộp đã sao chép từ bài viết của nhà hàng đối tác đăng tải trên Foody.vn từ năm 2021. Tác giả đã dùng phần mềm chỉnh sửa cắt xén góc 15% để loại bỏ watermark nhận diện, vi phạm nghiêm trọng Tiêu chuẩn Bản quyền Nội dung Bếp Xinh.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-t border-slate-200 bg-white">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadEvidence}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Tải gói bằng chứng (.ZIP)</span>
            </button>

            <button
              type="button"
              onClick={handleExportForensicPdf}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-all cursor-pointer shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất Biên Bản Giám Định PDF</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
