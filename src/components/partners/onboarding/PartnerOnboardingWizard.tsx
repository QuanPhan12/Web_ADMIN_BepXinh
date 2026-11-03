import React, { useState } from 'react'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import { useProfile } from '../../../context/ProfileContext'
import { Step1LegalAndHubs } from './Step1LegalAndHubs'
import { Step2ApiAndWebhook } from './Step2ApiAndWebhook'
import { Step3SkuCatalogMapping } from './Step3SkuCatalogMapping'
import { Step4SandboxAndGoLive } from './Step4SandboxAndGoLive'
import { TechnicalAcceptanceDocModal } from './TechnicalAcceptanceDocModal'

interface PartnerOnboardingWizardProps {
  onCancel: () => void
  onCompleteGoLive: (newPartner: any) => void
}

export const PartnerOnboardingWizard: React.FC<PartnerOnboardingWizardProps> = ({
  onCancel,
  onCompleteGoLive,
}) => {
  const { showToast } = useProfile()

  // Current Step state (1 to 4)
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      const s = parseInt(p.get('step') || '1', 10)
      if (s >= 1 && s <= 4) return s
    } catch {}
    return 1
  })

  // PDF Document modal state
  const [isPdfOpen, setIsPdfOpen] = useState<boolean>(() => {
    try {
      const p = new URLSearchParams(window.location.search)
      return p.get('doc') === 'acceptance'
    } catch {}
    return false
  })

  const handleFinishGoLive = () => {
    onCompleteGoLive({
      id: `partner-${Date.now()}`,
      name: 'Chuỗi Siêu thị Mới (Go-Live)',
      shortName: 'PRT',
      code: '#PRT-VN-2025',
      protocol: 'RESTful Webhook Stream Hub',
      endpoint: 'https://api-gateway.partner.com.vn/v2/bepxinh-sync',
      latency: '48ms',
      skuCount: '0',
      skuSuccessRate: '100.0% thành công',
      lastSync: 'Vừa kích hoạt Go-Live',
      uptime: '100.0%',
      status: 'active',
      badge: '● ACTIVE (LIVE)',
      badgeColor: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
      logoColor: 'bg-[#9c3808] text-white border-orange-700',
    })
    showToast('🚀 Chúc mừng! Chuỗi Siêu thị đối tác đã chính thức kích hoạt Go-Live trên hệ thống Bếp Xinh!')
  }

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Legal PDF Modal */}
      <TechnicalAcceptanceDocModal
        isOpen={isPdfOpen}
        onClose={() => setIsPdfOpen(false)}
        onGoToStep4={() => setCurrentStep(4)}
      />

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <button
              type="button"
              onClick={onCancel}
              className="hover:text-slate-600 cursor-pointer"
            >
              Bếp Xinh Admin
            </button>
            <span>›</span>
            <button
              type="button"
              onClick={onCancel}
              className="hover:text-slate-600 cursor-pointer"
            >
              Đối tác Siêu thị API
            </button>
            <span>›</span>
            <span className="font-semibold text-slate-700">Thêm đối tác mới</span>
          </div>

          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Thêm đối tác siêu thị mới (Onboarding Wizard)
            </h1>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded uppercase font-mono">
              ONBOARDING WIZARD
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {currentStep === 1 && 'Đăng ký thông tin doanh nghiệp, phạm vi kho bãi và thiết lập đầu mối kết nối đa kênh theo chuẩn API v2.5'}
            {currentStep === 2 && 'Thiết lập phương thức giao tiếp REST/GraphQL, mTLS bảo mật và endpoint nhận sự kiện tồn kho'}
            {currentStep === 3 && 'Khớp nối danh mục nguyên liệu công thức Bếp Xinh với hệ thống SKU mã hàng đối tác liên kết'}
            {currentStep === 4 && 'Chạy kịch bản kiểm thử tự động, xác thực dòng tiền đơn thử nghiệm và kích hoạt phân phối chính thức.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right font-mono text-xs">
            <span className="text-slate-400">Mã tham chiếu: </span>
            <strong className="text-slate-700">OMB-2025-0489</strong>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay về danh sách</span>
          </button>
        </div>
      </div>

      {/* Stepper Progress Bar (4 Steps) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Step 1 */}
        <div
          onClick={() => setCurrentStep(1)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 1
              ? 'border-[#9c3808] bg-[#9c3808] text-white shadow-xs'
              : currentStep > 1
              ? 'border-emerald-200 bg-emerald-50/60 text-slate-800'
              : 'border-slate-200 bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              currentStep === 1
                ? 'bg-white text-[#9c3808]'
                : currentStep > 1
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {currentStep > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
          </div>
          <div className="min-w-0">
            <div className={`text-[10px] font-black uppercase tracking-wider ${currentStep === 1 ? 'text-white/80' : 'text-slate-400'}`}>
              {currentStep > 1 ? 'ĐÃ HOÀN THÀNH' : currentStep === 1 ? 'BƯỚC 1 (HIỆN TẠI)' : 'BƯỚC 1'}
            </div>
            <div className="font-extrabold text-xs truncate">Pháp nhân &amp; Chi nhánh</div>
          </div>
        </div>

        {/* Step 2 */}
        <div
          onClick={() => setCurrentStep(2)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 2
              ? 'border-[#9c3808] bg-[#9c3808] text-white shadow-xs'
              : currentStep > 2
              ? 'border-emerald-200 bg-emerald-50/60 text-slate-800'
              : 'border-slate-200 bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              currentStep === 2
                ? 'bg-white text-[#9c3808]'
                : currentStep > 2
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {currentStep > 2 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
          </div>
          <div className="min-w-0">
            <div className={`text-[10px] font-black uppercase tracking-wider ${currentStep === 2 ? 'text-white/80' : 'text-slate-400'}`}>
              {currentStep > 2 ? 'ĐÃ HOÀN THÀNH' : currentStep === 2 ? 'BƯỚC 2 (HIỆN TẠI)' : 'BƯỚC 2'}
            </div>
            <div className="font-extrabold text-xs truncate">Cấu hình API &amp; Webhook</div>
          </div>
        </div>

        {/* Step 3 */}
        <div
          onClick={() => setCurrentStep(3)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 3
              ? 'border-[#9c3808] bg-[#9c3808] text-white shadow-xs'
              : currentStep > 3
              ? 'border-emerald-200 bg-emerald-50/60 text-slate-800'
              : 'border-slate-200 bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              currentStep === 3
                ? 'bg-white text-[#9c3808]'
                : currentStep > 3
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-400'
            }`}
          >
            {currentStep > 3 ? <CheckCircle2 className="w-4 h-4" /> : '3'}
          </div>
          <div className="min-w-0">
            <div className={`text-[10px] font-black uppercase tracking-wider ${currentStep === 3 ? 'text-white/80' : 'text-slate-400'}`}>
              {currentStep > 3 ? 'ĐÃ HOÀN THÀNH' : currentStep === 3 ? 'BƯỚC 3 (HIỆN TẠI)' : 'BƯỚC 3'}
            </div>
            <div className="font-extrabold text-xs truncate">Ánh xạ SKU &amp; Bảng giá</div>
          </div>
        </div>

        {/* Step 4 */}
        <div
          onClick={() => setCurrentStep(4)}
          className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
            currentStep === 4
              ? 'border-[#9c3808] bg-[#9c3808] text-white shadow-xs'
              : 'border-slate-200 bg-white text-slate-400'
          }`}
        >
          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
              currentStep === 4 ? 'bg-white text-[#9c3808]' : 'bg-slate-100 text-slate-400'
            }`}
          >
            4
          </div>
          <div className="min-w-0">
            <div className={`text-[10px] font-black uppercase tracking-wider ${currentStep === 4 ? 'text-white/80' : 'text-slate-400'}`}>
              {currentStep === 4 ? 'BƯỚC 4 (HIỆN TẠI)' : 'BƯỚC 4'}
            </div>
            <div className="font-extrabold text-xs truncate">Sandbox &amp; Kích hoạt</div>
          </div>
        </div>
      </div>

      {/* Render Step View */}
      {currentStep === 1 && (
        <Step1LegalAndHubs
          onNext={() => setCurrentStep(2)}
          onCancel={onCancel}
          onOpenPdfDoc={() => setIsPdfOpen(true)}
        />
      )}

      {currentStep === 2 && (
        <Step2ApiAndWebhook
          onNext={() => setCurrentStep(3)}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3SkuCatalogMapping
          onNext={() => setCurrentStep(4)}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4SandboxAndGoLive
          onBack={() => setCurrentStep(3)}
          onGoLive={handleFinishGoLive}
          onOpenPdfDoc={() => setIsPdfOpen(true)}
        />
      )}
    </div>
  )
}
