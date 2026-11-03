import React from 'react'
import { ShieldCheck, Lock, Award } from 'lucide-react'
import { BepXinhLogo } from './icons/BepXinhLogo'
import { GaugeIcon, OpenBookIcon, AiBrainGearIcon } from './icons/CustomIcons'

export const LeftPanel: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full max-w-[440px] py-1">
      <div className="space-y-5">
        {/* Real-time system badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e8f0fe] border border-blue-100/60 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
          </span>
          <span className="text-[11px] font-extrabold text-[#0f172a] uppercase tracking-wider">
            HỆ THỐNG VẬN HÀNH THỜI GIAN THỰC
          </span>
        </div>

        {/* Engine title & branding */}
        <div className="flex items-center gap-3">
          <BepXinhLogo className="w-12 h-12 shadow-xs" />
          <div>
            <h1 className="text-[25px] font-extrabold tracking-tight text-[#0f172a] leading-none">
              Bếp Xinh Core Engine
            </h1>
            <p className="text-[12.5px] font-medium text-[#64748b] mt-1">
              Cloud Enterprise Network Architecture
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-[#334155] text-[13.5px] leading-relaxed">
          Nền tảng kiểm duyệt nội dung ẩm thực, kiểm định vi chất dinh dưỡng và
          chỉ số tươi sống của chuỗi cung ứng thực phẩm tươi sạch với sự hỗ trợ
          của mô hình trí tuệ nhân tạo.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Card 1: Core Uptime */}
          <div className="bg-white rounded-[22px] p-4 border border-slate-100/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <GaugeIcon className="w-6 h-6 text-[#059669]" />
              <span className="bg-[#d1fae5] text-[#065f46] text-xs font-bold px-2.5 py-0.5 rounded-full">
                99.98%
              </span>
            </div>
            <div className="text-[32px] font-black text-[#0f172a] tracking-tight leading-tight">
              99.9%
            </div>
            <div className="text-xs font-medium text-[#64748b] mt-0.5">
              Uptime Hệ thống Core
            </div>
          </div>

          {/* Card 2: Verified Recipes */}
          <div className="bg-white rounded-[22px] p-4 border border-slate-100/90 shadow-xs hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <OpenBookIcon className="w-6 h-6 text-[#9a3412]" />
              <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-0.5 rounded-full">
                0 Active
              </span>
            </div>
            <div className="text-[32px] font-black text-[#0f172a] tracking-tight leading-tight">
              0
            </div>
            <div className="text-xs font-medium text-[#64748b] mt-0.5">
              Công thức kiểm duyệt
            </div>
          </div>
        </div>

        {/* AI Module Card */}
        <div className="bg-white rounded-full p-2.5 px-4 border border-slate-100/90 shadow-xs flex items-center justify-between hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#e8edfa] flex items-center justify-center shrink-0">
              <AiBrainGearIcon className="w-5 h-5 text-[#9a3412]" />
            </div>
            <div>
              <div className="text-[14px] font-bold text-[#0f172a]">
                Mô đun AI Auto-Audit
              </div>
              <div className="text-[12px] text-[#64748b]">
                Kiểm soát rủi ro an toàn vệ sinh món ăn
              </div>
            </div>
          </div>
          <span className="bg-[#dbeafe] text-[#1e3a8a] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
            V3.2 Active
          </span>
        </div>

        {/* Culinary Showcase Card */}
        <div className="rounded-[24px] overflow-hidden shadow-xs border border-slate-200/40">
          <img
            src="/images/kitchen-full.png"
            alt="Không gian sáng tạo: Cân bằng ẩm thực truyền thống & chuẩn hóa kỹ thuật số"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>

      {/* Compliance & Security Certifications */}
      <div className="flex items-center justify-between text-slate-700 text-xs font-semibold pt-5 border-t border-slate-200/60 mt-5">
        <div className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <ShieldCheck className="w-4 h-4 text-[#059669]" />
          <span>ISO/IEC 27001</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <Lock className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>SSL/TLS 256-Bit</span>
        </div>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-1.5 hover:text-slate-900 transition-colors">
          <Award className="w-4 h-4 text-[#d97706]" />
          <span>FIPS 140-2 Level 3</span>
        </div>
      </div>
    </div>
  )
}
