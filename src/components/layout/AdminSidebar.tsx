import React from 'react'
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  UtensilsCrossed,
  ShoppingBag,
  FileText,
  Bell,
  Store,
  AlertTriangle,
  Settings,
  User,
  Server,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import type { AppView } from '../../types'
import { BepXinhLogo } from '../icons/BepXinhLogo'
import { useProfile } from '../../context/ProfileContext'

interface AdminSidebarProps {
  currentView: AppView
  onNavigate: (view: AppView) => void
  onLogout: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentView,
  onNavigate,
  onLogout,
}) => {
  const { isEmptyData, notifications, setIsCreateNotificationOpen } = useProfile()
  return (
    <aside className="sticky top-0 h-screen w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between shrink-0 select-none z-30">
      <div className="p-4 space-y-4 overflow-y-auto flex-1">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 pb-2">
          <BepXinhLogo className="w-10 h-10 shadow-xs" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-slate-900 text-sm tracking-tight">
                Bếp Xinh
              </span>
              <span className="bg-amber-100/80 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.2 rounded-xs uppercase">
                ENTERPRISE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Executive Operations v2.4.8
            </p>
          </div>
        </div>

        {/* System Health Badge */}
        <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Hệ thống ổn định</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
            99.98%
          </span>
        </div>

        {/* Navigation Section 1: Điều hành ẩm thực */}
        <div className="space-y-1">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
            ĐIỀU HÀNH ẨM THỰC
          </div>

          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              currentView === 'dashboard'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4" />
              <span>Tổng quan &amp; Chỉ số</span>
            </div>
            {currentView === 'dashboard' && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('review')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
              currentView === 'review'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckSquare className={`w-4 h-4 ${currentView === 'review' ? 'text-white' : 'text-slate-400'}`} />
              <span>Kiểm duyệt công thức</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                currentView === 'review' ? 'bg-white/20 text-white' : 'bg-red-500 text-white'
              }`}>
                {isEmptyData ? 0 : 48}
              </span>
              {currentView === 'review' && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('users')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'users'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${currentView === 'users' ? 'text-white' : 'text-slate-400'}`} />
              <span>Đầu bếp &amp; Độc giả</span>
            </div>
            {currentView === 'users' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            ) : (
              !isEmptyData && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  +12 mới
                </span>
              )
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('categories')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'categories'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UtensilsCrossed className={`w-4 h-4 ${currentView === 'categories' ? 'text-white' : 'text-slate-400'}`} />
              <span>Danh mục &amp; Nguyên liệu</span>
            </div>
            {currentView === 'categories' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('orders')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'orders'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className={`w-4 h-4 ${currentView === 'orders' ? 'text-white' : 'text-slate-400'}`} />
              <span>Đơn hàng &amp; Đối soát</span>
            </div>
            {currentView === 'orders' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            ) : (
              !isEmptyData && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('reports')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'reports'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className={`w-4 h-4 ${currentView === 'reports' ? 'text-white' : 'text-slate-400'}`} />
              <span>Báo cáo &amp; Khiếu nại</span>
            </div>
            {currentView === 'reports' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            ) : (
              !isEmptyData && (
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  3
                </span>
              )
            )}
          </button>
        </div>

        {/* Navigation Section 2: Quản trị Hệ Thống */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1">
            HỆ THỐNG
          </div>

          <button
            type="button"
            onClick={() => onNavigate('cms')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'cms'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 ${currentView === 'cms' ? 'text-white' : 'text-slate-400'}`} />
              <span>Quản trị CMS</span>
            </div>
            {currentView === 'cms' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCreateNotificationOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-all text-left cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-slate-400" />
              <span>Trung Tâm Thông Báo</span>
            </div>
            {notifications.length > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('partners')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'partners'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Store className={`w-4 h-4 ${currentView === 'partners' ? 'text-white' : 'text-slate-400'}`} />
              <span>Đối tác Siêu thị API</span>
            </div>
            {currentView === 'partners' ? (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            ) : (
              !isEmptyData && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  1 lỗi P1
                </span>
              )
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
              currentView === 'settings'
                ? 'bg-[#9c3808] text-white shadow-xs font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Settings className={`w-4 h-4 ${currentView === 'settings' ? 'text-white' : 'text-slate-400'}`} />
              <span>Cài đặt hệ thống</span>
            </div>
            {currentView === 'settings' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onNavigate('profile')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
              currentView === 'profile'
                ? 'bg-[#9c3808] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span>Hồ sơ cá nhân admin</span>
            </div>
            {currentView === 'profile' && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
          </button>
        </div>
      </div>

      {/* Bottom Node status card & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3 shrink-0 bg-white">
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-slate-500" />
              Cluster SG-01
            </span>
            <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.2 rounded">
              26ms Latency
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Sync API
            </span>
            <span className="font-semibold text-slate-700">100% OK</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
            <span className="hover:text-slate-700 cursor-pointer">Hỗ trợ kỹ thuật 24/7</span>
            <span className="hover:text-slate-700 cursor-pointer">Tài liệu API</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-xs font-bold text-slate-600 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  )
}
