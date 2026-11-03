import React, { useState } from 'react'
import {
  Search,
  MapPin,
  Plus,
  Bell,
  ChevronDown,
  User,
  ShieldCheck,
  LogOut,
  Menu,
  CheckCheck,
  Trash2,
} from 'lucide-react'
import type { AppView } from '../../types'
import { useProfile } from '../../context/ProfileContext'
import { CreateNotificationModal } from '../modals/CreateNotificationModal'

interface AdminTopNavProps {
  onNavigate: (view: AppView) => void
  onLogout: () => void
  onToggleSidebar?: () => void
}

export const AdminTopNav: React.FC<AdminTopNavProps> = ({
  onNavigate,
  onLogout,
  onToggleSidebar,
}) => {
  const {
    profile,
    notifications,
    isCreateNotificationOpen,
    setIsCreateNotificationOpen,
    deleteNotification,
    markAllNotificationsRead,
  } = useProfile()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isBranchMenuOpen, setIsBranchMenuOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('menu=branch')
    } catch {
      return false
    }
  })
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState('Toàn quốc (0 Chi Nhánh)')
  const [searchQuery, setSearchQuery] = useState('')

  const branches = [
    'Toàn quốc (0 Chi Nhánh)',
    'Miền Bắc - Hà Nội (0 Chi Nhánh)',
    'Miền Nam - TP.HCM (0 Chi Nhánh)',
    'Miền Trung - Đà Nẵng (0 Chi Nhánh)',
  ]

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Sidebar Toggle + Global Search */}
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            title="Đóng / Mở thanh menu điều hướng"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-64 md:w-80 lg:w-96 rounded-full bg-[#f8fafc] border border-slate-200/90 px-3.5 py-1.5 flex items-center gap-2 focus-within:border-orange-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-orange-100 transition-all">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm món ăn, công thức nấu, đầu bếp..."
            className="w-full text-xs font-medium text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Branch Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsBranchMenuOpen(!isBranchMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#9c3808]" />
            <span className="hidden sm:inline max-w-[170px] truncate">{selectedBranch}</span>
            <span className="sm:hidden">Chi nhánh</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isBranchMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Chọn phạm vi dữ liệu
              </div>
              {branches.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setSelectedBranch(b)
                    setIsBranchMenuOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                    selectedBranch === b
                      ? 'bg-orange-50 text-[#9c3808] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Create Broadcast / Announcement */}
        <button
          type="button"
          onClick={() => setIsCreateNotificationOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Tạo thông báo mới</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotificationsMenuOpen(!isNotificationsMenuOpen)}
            title="Trung tâm thông báo toàn hệ thống"
            className="relative p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {isNotificationsMenuOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xs text-slate-900">Trung Tâm Thông Báo</span>
                  <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {notifications.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      title="Đánh dấu tất cả là đã đọc"
                      className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã đọc</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationsMenuOpen(false)
                      setIsCreateNotificationOpen(true)
                    }}
                    className="text-[11px] text-[#9c3808] font-bold hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Tạo mới</span>
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 space-y-2">
                  <Bell className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="font-medium text-slate-600">Chưa có thông báo nào mới</p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsNotificationsMenuOpen(false)
                      setIsCreateNotificationOpen(true)
                    }}
                    className="px-3 py-1 rounded-full bg-orange-50 text-[#9c3808] font-bold text-xs hover:bg-orange-100 transition-colors cursor-pointer"
                  >
                    + Tạo thông báo phát sóng đầu tiên
                  </button>
                </div>
              ) : (
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 space-y-1">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-2 hover:bg-slate-50 rounded-xl transition-colors space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span
                          className={`font-black uppercase text-[9px] px-1.5 py-0.2 rounded ${
                            n.category === 'urgent'
                              ? 'bg-rose-100 text-rose-700'
                              : n.category === 'event'
                              ? 'bg-emerald-100 text-emerald-800'
                              : n.category === 'policy'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {n.category === 'urgent'
                            ? 'Khẩn'
                            : n.category === 'event'
                            ? 'Sự kiện'
                            : n.category === 'policy'
                            ? 'Quy định'
                            : 'Tính năng'}
                        </span>
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>{n.createdAt}</span>
                          <button
                            type="button"
                            onClick={() => deleteNotification(n.id)}
                            title="Xóa thông báo này"
                            className="hover:text-rose-600 cursor-pointer p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 line-clamp-1">{n.title}</h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2">{n.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 border border-slate-200/60 transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border border-orange-200 shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-left hidden md:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-extrabold text-slate-900 leading-none">
                  {profile.displayName}
                </span>
                <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1 py-0.2 rounded uppercase">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                {profile.alertEmail}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <div className="text-xs font-bold text-slate-900">{profile.displayName}</div>
                <div className="text-[10px] text-slate-500">{profile.permissionLevel}</div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onNavigate('profile')
                  setIsProfileMenuOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Hồ sơ &amp; Thiết lập bảo mật</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onNavigate('dashboard')
                  setIsProfileMenuOpen(false)
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors text-left cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Bảng điều hành Tổng quan</span>
              </button>

              <div className="border-t border-slate-100 my-1"></div>

              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400" />
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Broadcast Create Notification Modal */}
      <CreateNotificationModal
        isOpen={isCreateNotificationOpen}
        onClose={() => setIsCreateNotificationOpen(false)}
      />
    </header>
  )
}
