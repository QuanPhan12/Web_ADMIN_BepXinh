import React, { useEffect, useState } from 'react'
import {
  CheckCircle2,
  ChefHat,
  LogOut,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { BepXinhLogo } from '../icons/BepXinhLogo'

interface SuccessDashboardModalProps {
  isOpen: boolean
  adminEmail: string
  onLogout: () => void
  onEnterDashboard?: () => void
}

export const SuccessDashboardModal: React.FC<SuccessDashboardModalProps> = ({
  isOpen,
  adminEmail,
  onLogout,
  onEnterDashboard,
}) => {
  const [countdown, setCountdown] = useState(2)

  useEffect(() => {
    if (!isOpen) {
      setCountdown(2)
      return
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onEnterDashboard?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, onEnterDashboard])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl max-w-xl w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/50 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3.5">
            <BepXinhLogo className="w-12 h-12 shadow-sm" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Cổng Điều Hành Bếp Xinh
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  ĐÃ XÁC THỰC
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Phiên làm việc bảo mật: <span className="font-semibold text-slate-800">{adminEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Đăng xuất"
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-100/80 mb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-0.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Mô đun AI Auto-Audit V3.2 sẵn sàng
            </div>
            <p className="text-[11px] text-amber-800/80">
              Hôm nay đã có 0 công thức được tự động thẩm định dinh dưỡng và an toàn.
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white shadow-xs text-[#9c3909]">
            Trực quan hoá
          </span>
        </div>

        {/* Dashboard Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
              Tươi sống
            </div>
            <div className="text-xl font-extrabold text-slate-900">0%</div>
            <div className="text-[10px] text-slate-400 font-medium">+0.0% tuần này</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
              <ChefHat className="w-3.5 h-3.5 text-amber-600" />
              Công thức
            </div>
            <div className="text-xl font-extrabold text-slate-900">0</div>
            <div className="text-[10px] text-slate-400 font-medium">Đã kiểm duyệt</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="text-xs text-slate-500 mb-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Audit Node
            </div>
            <div className="text-xl font-extrabold text-slate-900">0</div>
            <div className="text-[10px] text-slate-400 font-medium">Node hoạt động</div>
          </div>
        </div>

        {/* Action button */}
        <div className="space-y-3">
          <button
            onClick={() => {
              if (onEnterDashboard) {
                onEnterDashboard()
              } else {
                alert('Chuyển tiếp đến giao diện quản lý chi tiết Bếp Xinh Core Engine!')
              }
            }}
            className="w-full py-3.5 px-5 rounded-2xl bg-[#9c3909] hover:bg-[#832f07] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Vào Bảng Điều Khiển Quản Trị Trung Tâm</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-[11px] text-slate-400 font-medium">
            Tự động chuyển vào Bảng điều khiển quản trị sau {countdown > 0 ? `${countdown}s` : 'giây lát'}...
          </p>

          <button
            onClick={onLogout}
            className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Đăng xuất khỏi phiên quản trị
          </button>
        </div>
      </div>
    </div>
  )
}
