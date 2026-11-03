import React, { useState } from 'react'
import { X, ShieldCheck, FileText, CheckCircle2, AlertOctagon, Scale, Award } from 'lucide-react'

interface PolicyRuleModalProps {
  isOpen: boolean
  onClose: () => void
}

export const PolicyRuleModal: React.FC<PolicyRuleModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'copyright' | 'safety' | 'ai' | 'appeal'>('copyright')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-50 via-white to-amber-50/40 border-b border-orange-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#9c3808] text-white flex items-center justify-center shadow-xs shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Tiêu chuẩn Cộng đồng &amp; Bản quyền Ẩm thực 2025
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                  v2.5 Verified
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Khung pháp lý, chuẩn mực đạo đức nội dung và cơ chế xử lý tranh chấp của Bếp Xinh Enterprise
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

        {/* Tab navigation */}
        <div className="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('copyright')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'copyright'
                ? 'bg-white text-[#9c3808] shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>1. Bản quyền hình ảnh &amp; Video</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('safety')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'safety'
                ? 'bg-white text-[#9c3808] shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>2. Vệ sinh ATTP &amp; Ngôn từ</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-white text-[#9c3808] shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3. Cơ chế AI Guard quét tự động</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('appeal')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'appeal'
                ? 'bg-white text-[#9c3808] shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>4. Quy trình kháng nghị 3 cấp</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed max-h-[60vh]">
          {activeTab === 'copyright' && (
            <div className="space-y-3.5">
              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200">
                <h4 className="font-black text-emerald-900 flex items-center gap-1.5 text-xs mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Quy định ảnh công thức hợp lệ
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-emerald-800 text-[11px]">
                  <li>Ảnh món ăn phải do chính tác giả thực hiện chụp hoặc quay video trực tiếp tại gian bếp.</li>
                  <li>Cho phép sử dụng ảnh có watermark bản quyền cá nhân của tác giả (không che khuất món chính).</li>
                  <li>Nếu sử dụng công thức kế thừa từ đầu bếp nổi tiếng, bắt buộc trích dẫn nguồn gốc tác giả ở đầu bài viết.</li>
                </ul>
              </div>

              <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200">
                <h4 className="font-black text-rose-900 flex items-center gap-1.5 text-xs mb-1">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  Hành vi nghiêm cấm &amp; chế tài
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-rose-800 text-[11px]">
                  <li>Tuyệt đối cấm tải ảnh từ Google Images, Pinterest, food blog khác để mạo danh tác phẩm của mình.</li>
                  <li>Tác giả vi phạm lần 1: Gỡ công thức và cảnh cáo 7 ngày.</li>
                  <li>Tác giả vi phạm từ lần 2 trở đi: Khóa tài khoản Creator vĩnh viễn và thu hồi toàn bộ doanh thu affiliate.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Chuẩn mực An toàn Thực phẩm &amp; Giao tiếp Văn minh</h4>
              <p className="text-slate-600">
                Bếp Xinh hướng tới một không gian ẩm thực gia đình chuẩn mực, tích cực và gắn kết. Toàn bộ nội dung bình luận, đánh giá và chia sẻ đều phải tuân thủ nghiêm ngặt:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-800 block mb-1">🌿 Dinh dưỡng &amp; ATTP</span>
                  <p className="text-[11px] text-slate-500">
                    Nghiêm cấm chia sẻ công thức sử dụng động vật hoang dã nguy cấp hoặc kết hợp thực phẩm sinh độc tố chết người.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-black text-slate-800 block mb-1">💬 Ngôn từ bình luận</span>
                  <p className="text-[11px] text-slate-500">
                    Cấm các ngôn từ xúc phạm vùng miền, phân biệt giới tính, công kích cá nhân hay chửi bới trong phần trao đổi.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Cơ chế Tự động Quét Vi phạm AI Guard v2.6</h4>
              <p className="text-slate-600">
                Hệ thống AI Guard của Bếp Xinh chạy nền 24/7 với 3 lớp mô hình thị giác và xử lý ngôn ngữ tự nhiên:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Lớp 1: Reverse Image Search &amp; Phishing</span>
                    <span className="text-[11px] text-slate-500">Đối chiếu với kho 100M+ hình ảnh món ăn quốc tế</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    Độ chính xác 98.4%
                  </span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="font-bold text-slate-800 block">Lớp 2: Toxic NLP Sentiment Analysis</span>
                    <span className="text-[11px] text-slate-500">Tự động gắn cờ bình luận có sắc thái tiêu cực hoặc quấy rối</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                    Latency &lt; 80ms
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appeal' && (
            <div className="space-y-3">
              <h4 className="font-black text-slate-900 text-sm">Quy trình Kháng nghị &amp; Bảo vệ Tác quyền 3 Cấp</h4>
              <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-xs">
                <li>
                  <strong>Cấp 1 - Tiếp nhận tự động:</strong> Tác giả nhận thông báo gỡ bài có 48 giờ để gửi đơn kháng nghị kèm ảnh gốc chụp có EXIF metadata.
                </li>
                <li>
                  <strong>Cấp 2 - Thẩm định viên độc lập:</strong> Trưởng ban Thẩm định ẩm thực xem xét hồ sơ và đưa ra phán quyết trong tối đa 12 giờ làm việc.
                </li>
                <li>
                  <strong>Cấp 3 - Hội đồng Trọng tài Bếp Xinh:</strong> Trường hợp tranh chấp phức tạp giữa hai Master Chef sẽ được chuyển cho bộ phận Pháp chế kết luận cuối cùng.
                </li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium text-[11px]">
            Ban hành bởi: Ban Kiểm duyệt &amp; Pháp chế Bếp Xinh Enterprise
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors cursor-pointer"
          >
            Đã hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
