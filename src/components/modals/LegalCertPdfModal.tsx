import React, { useState } from 'react'
import {
  X,
  Printer,
  Download,
  Copy,
  Check,
  ShieldCheck,
  QrCode,
  FileText,
  Lock,
  Award
} from 'lucide-react'

interface LegalCertPdfModalProps {
  isOpen: boolean
  onClose: () => void
  recipeCode?: string
  recipeTitle?: string
  authorName?: string
  authorUid?: string
}

export const LegalCertPdfModal: React.FC<LegalCertPdfModalProps> = ({
  isOpen,
  onClose,
  recipeCode = '#RC-98540',
  recipeTitle = 'Sườn nướng sốt BBQ Hàn Quốc siêu cay',
  authorName = 'Trần Bảo',
  authorUid = '#USR-78210'
}) => {
  const [copiedLink, setCopiedLink] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  if (!isOpen) return null

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(
      `https://bepxinh.vn/verify/legal-decision/${recipeCode.replace('#', '')}`
    )
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadPdf = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
      // Trigger virtual download
      const element = document.createElement('a')
      const file = new Blob(
        [
          `BIÊN BẢN PHÁP LÝ & QUYẾT ĐỊNH XỬ LÝ VI PHẠM BẾP XINH\n` +
          `Số: #REJ-2024-98540/QĐ-BPH\n` +
          `Mã công thức: ${recipeCode}\n` +
          `Tiêu đề: ${recipeTitle}\n` +
          `Tác giả: ${authorName} (${authorUid})\n` +
          `Ngày lập: 24/10/2024\n` +
          `Xác thực chữ ký số SHA-256: e4c99a818c72...4fe3\n` +
          `Trạng thái: Đã thi hành cưỡng chế và niêm phong hồ sơ.`
        ],
        { type: 'text/plain;charset=utf-8' }
      )
      element.href = URL.createObjectURL(file)
      element.download = `BienBan_PhapLy_${recipeCode.replace('#', '')}.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-100 rounded-3xl border border-slate-300 shadow-2xl w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Toolbar */}
        <div className="p-3.5 sm:p-4 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-400 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                  VĂN BẢN ĐIỆN TỬ CHỨNG THỰC
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-bold">
                  ● SHA-256 VALID
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-white">
                Biên bản Pháp lý &amp; Quyết định Xử lý Vi phạm ({recipeCode})
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedLink ? 'Đã sao chép link' : 'Sao chép link'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>In (A4)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-3.5 py-1.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Đang xuất...' : 'Tải xuống PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable PDF Viewer (Simulated A4 Paper Sheet) */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1 bg-slate-200/60">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-300 max-w-4xl mx-auto p-6 sm:p-10 md:p-12 text-slate-800 space-y-6 relative print:p-0 print:border-none print:shadow-none">
            
            {/* Header: Quốc hiệu & Tên cơ quan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b-2 border-slate-900/80">
              <div className="text-center sm:text-left space-y-0.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  HỘI ĐỒNG KIỂM DUYỆT BẾP XINH ENTERPRISE
                </div>
                <div className="text-xs font-black uppercase text-slate-900">
                  BAN PHÁP CHẾ &amp; AN TOÀN NỘI DUNG SỐ
                </div>
                <div className="text-[11px] font-mono text-slate-500 pt-1">
                  Số: <span className="font-bold text-slate-800">#REJ-2024-98540/QĐ-BPH</span>
                </div>
              </div>

              <div className="text-center sm:text-right space-y-0.5">
                <div className="text-xs font-black uppercase tracking-wider text-slate-900">
                  CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                </div>
                <div className="text-[11px] font-bold text-slate-700 underline decoration-slate-400 underline-offset-4">
                  Độc lập - Tự do - Hạnh phúc
                </div>
                <div className="text-[10px] text-slate-500 italic pt-1">
                  Hà Nội, ngày 24 tháng 10 năm 2024
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1.5 pt-2">
              <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-black uppercase tracking-wider">
                QUYẾT ĐỊNH CƯỠNG CHẾ CỦA HỘI ĐỒNG KIỂM DUYỆT
              </span>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 uppercase tracking-tight">
                QUYẾT ĐỊNH VỀ VIỆC TỪ CHỐI XUẤT BẢN CÔNG THỨC &amp; ÁP DỤNG CHẾ TÀI ĐỐI VỚI THÀNH VIÊN
              </h2>
              <p className="text-xs font-medium text-slate-600 italic">
                (Về việc: Xử lý vi phạm bản quyền hình ảnh, an toàn thực phẩm và quy chế quảng cáo đối với hồ sơ {recipeCode})
              </p>
            </div>

            {/* Căn cứ pháp lý */}
            <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="font-black text-slate-900 uppercase text-[11px]">CĂN CỨ THẨM QUYỀN VÀ QUY CHUẨN:</div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Căn cứ Luật Sở hữu trí tuệ số 50/2005/QH11 và Luật sửa đổi, bổ sung năm 2022;</li>
                <li>Căn cứ Luật An toàn thực phẩm số 55/2010/QH12 của Quốc hội nước CHXHCN Việt Nam;</li>
                <li>Căn cứ Điều 4, Khoản 3 - Bộ Quy chế Kiểm duyệt Nội dung Nền tảng Bếp Xinh Enterprise ban hành năm 2023;</li>
                <li>Căn cứ Biên bản bóc tách dữ liệu thị giác số <code>#AI-20241024-8902</code> thực hiện bởi hệ thống AI Vision Inspector lúc 14:12 ngày 24/10/2024.</li>
              </ul>
            </div>

            {/* Quyết định chi tiết */}
            <div className="space-y-4 text-xs">
              <div className="font-black text-slate-900 uppercase text-xs tracking-wider border-b border-slate-200 pb-1">
                BAN KIỂM DUYỆT NỘI DUNG QUYẾT ĐỊNH:
              </div>

              {/* Điều 1 */}
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  Điều 1. Đình chỉ xuất bản và gỡ bỏ hoàn toàn khỏi Danh mục Khám phá công thức:
                </div>
                <div className="pl-4 space-y-0.5 text-slate-600 text-[11px]">
                  <div>• Tên tác phẩm: <strong className="text-slate-900">{recipeTitle}</strong></div>
                  <div>• Mã số định danh: <strong className="font-mono text-slate-900">{recipeCode}</strong></div>
                  <div>• Tác giả đăng tải: <strong className="text-slate-900">{authorName}</strong> (UID: <span className="font-mono">{authorUid}</span>)</div>
                  <div>• Thời điểm gửi duyệt: 14:02 - 24/10/2024 | Thời điểm thẩm định: 14:15 - 24/10/2024</div>
                </div>
              </div>

              {/* Điều 2 */}
              <div className="space-y-1.5">
                <div className="font-bold text-slate-900">
                  Điều 2. Xác nhận 03 hành vi vi phạm chuẩn mực nghiêm trọng:
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1">
                  <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40">
                    <div className="font-bold text-rose-800 text-[11px]">1. Vi phạm bản quyền hình ảnh</div>
                    <div className="text-[10px] text-slate-600 mt-1 leading-snug">
                      Phát hiện watermark gốc Foody.vn bị cắt xén, trùng khớp đặc trưng thị giác 94.6% với bài đăng ngày 14/06/2021.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40">
                    <div className="font-bold text-rose-800 text-[11px]">2. Vi phạm chuẩn ATTP nhiệt tâm</div>
                    <div className="text-[10px] text-slate-600 mt-1 leading-snug">
                      Nướng sườn dày 3.5cm ở 140°C trong 8 phút, nhiệt tâm không đạt 71°C tối thiểu, nguy cơ khuẩn Salmonella.
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50/40">
                    <div className="font-bold text-rose-800 text-[11px]">3. Chèn quảng cáo thương mại ngoài</div>
                    <div className="text-[10px] text-slate-600 mt-1 leading-snug">
                      Chèn số điện thoại Zalo mua bán sỉ lẻ nguyên liệu trong mô tả sơ chế, vi phạm quy định không thương mại hóa.
                    </div>
                  </div>
                </div>
              </div>

              {/* Điều 3 */}
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  Điều 3. Áp dụng các chế tài kỷ luật có hiệu lực ngay lập tức:
                </div>
                <div className="pl-4 space-y-0.5 text-slate-600 text-[11px]">
                  <div>• <strong>Tạm ngưng quyền đăng tải công thức mới:</strong> Thời hạn 48 giờ kể từ khi thông báo có hiệu lực.</div>
                  <div>• <strong>Khấu trừ điểm uy tín:</strong> Trừ <span className="font-bold text-rose-600">-50 điểm</span> uy tín tác giả (Điểm còn lại: 15/100 - Báo động nguy cấp).</div>
                  <div>• <strong>Đưa vào Danh sách giám sát đặc biệt:</strong> 30 ngày giám sát nghiêm ngặt theo quy chế Blacklist Monitoring.</div>
                </div>
              </div>

              {/* Điều 4 */}
              <div className="space-y-1">
                <div className="font-bold text-slate-900">
                  Điều 4. Quyền khiếu nại và kháng nghị:
                </div>
                <p className="pl-4 text-slate-600 text-[11px] leading-relaxed">
                  Tác giả có quyền gửi đơn kháng nghị điện tử kèm bằng chứng chứng minh quyền sở hữu hợp pháp (file RAW ảnh gốc, video quá trình nấu, chứng từ mua sắm nguyên liệu) trong vòng <strong>72 giờ</strong> kể từ thời điểm quyết định này được phát hành. Quyết định của Hội đồng Phúc thẩm Bếp Xinh là phán quyết cuối cùng.
                </p>
              </div>
            </div>

            {/* Seal, Signature & QR Authentication */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
              {/* Left: QR Code & Hash */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0 shadow-2xs">
                  <QrCode className="w-14 h-14 text-slate-800" />
                </div>
                <div className="space-y-1 text-[10px] text-slate-600 min-w-0">
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>CHỨNG THỰC ĐIỆN TỬ BẾP XINH</span>
                  </div>
                  <div className="font-mono text-[9px] text-slate-500 truncate">
                    Hash: SHA-256 e4c99a818c724fe3
                  </div>
                  <div className="text-slate-400">
                    Quét mã QR để tra cứu tính pháp lý trên Cổng giám sát bepxinh.vn/verify
                  </div>
                </div>
              </div>

              {/* Right: Signature & Red Stamp */}
              <div className="text-center sm:text-right space-y-1 relative pr-4">
                <div className="text-[11px] font-bold uppercase text-slate-700">
                  TM. HỘI ĐỒNG KIỂM DUYỆT BẾP XINH
                </div>
                <div className="text-[11px] font-black uppercase text-slate-900">
                  TRƯỞNG BAN KIỂM DUYỆT CHẤT LƯỢNG NỘI DUNG
                </div>

                {/* Simulated Red Stamp and Digital Signature */}
                <div className="relative py-4 flex items-center justify-center sm:justify-end">
                  {/* Red circular stamp */}
                  <div className="w-28 h-28 rounded-full border-2 border-dashed border-rose-600/70 p-1 flex items-center justify-center text-center transform rotate-6 bg-rose-50/30">
                    <div className="w-full h-full rounded-full border border-rose-600 flex flex-col items-center justify-center p-1 text-rose-700 font-bold">
                      <span className="text-[7px] uppercase tracking-tighter">BẾP XINH ENTERPRISE</span>
                      <Award className="w-4 h-4 my-0.5 text-rose-600" />
                      <span className="text-[8px] font-black uppercase">ĐÃ DUYỆT KỶ LUẬT</span>
                      <span className="text-[6px] tracking-tight">24/10/2024 - 14:35</span>
                    </div>
                  </div>

                  {/* Digital Signature Overlap */}
                  <div className="absolute right-8 bottom-3 font-serif italic text-base font-bold text-slate-800 transform -rotate-6 pointer-events-none">
                    Bếp Trưởng Minh
                  </div>
                </div>

                <div className="text-xs font-black text-slate-900">
                  Trần Minh Quân (Bếp Trưởng Minh)
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Cert ID: #LEAD-MOD-LV4-9982 • Cấp bởi Bếp Xinh Root CA
                </div>
              </div>
            </div>

            {/* Bottom Disclaimer */}
            <div className="pt-3 border-t border-slate-100 text-[9px] text-slate-400 text-center flex flex-wrap items-center justify-between gap-2">
              <span>Hệ thống Kiểm soát An ninh Nội dung Bếp Xinh Enterprise v2.5 - Tiêu chuẩn ISO/IEC 27001</span>
              <span>Lưu kho chứng cứ bất biến: /data/evidence/2024/10/rej-98540.enc</span>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Văn bản được bảo vệ mã hóa AES-256 bất biến. Bản in có giá trị đối chất hành chính.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-all cursor-pointer"
            >
              Đóng cửa sổ
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In biên bản ngay</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
