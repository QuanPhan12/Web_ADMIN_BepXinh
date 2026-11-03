import React, { useState } from 'react'
import {
  Users,
  UserPlus,
  Flame,
  ShieldCheck,
  TrendingUp,
  Download,
  Bell,
  Search,
  Bookmark,
  Sliders,
  CheckCircle2,
  ChevronRight,
  Smartphone,
  Globe,
  Home,
  X,
  Lock,
  Gift,
  Check,
  ChevronLeft,
  Trash2,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { CreateUserModal } from '../modals/CreateUserModal'
import { CreateNotificationModal } from '../modals/CreateNotificationModal'

export interface UserReaderItem {
  id: string
  code: string
  name: string
  avatar: string
  role?: 'VIP' | 'Creator' | 'Spam' | 'Tài khoản mới'
  email: string
  phone: string
  isPhoneVerified: boolean
  platform: 'iOS' | 'Android' | 'Web Portal'
  osVersion: string
  joinDate: string
  joinTimeAgo: string
  savedRecipes: number
  cookedRecipes: number
  isStrikethrough?: boolean
  status: 'active' | 'warning' | 'banned'
}


export const UserManagementView: React.FC = () => {
  const { showToast, isEmptyData } = useProfile()
  const [sampleLoaded, setSampleLoaded] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('sample') === 'true'
      }
    } catch {}
    return false
  })

  const [users, setUsers] = useState<UserReaderItem[]>([])

  const hasData = users.length > 0

  // Default checked rows 1 & 2 as seen in media_1793267194865.png
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(() =>
    isEmptyData && !sampleLoaded ? [] : ['u-1', 'u-2']
  )

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [platformFilter, setPlatformFilter] = useState('all')
  const [sortBy, setSortBy] = useState<'gmv_desc' | 'newest' | 'recipes'>('gmv_desc')
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false)
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false)
  const [activeChips, setActiveChips] = useState<string[]>([])

  // Filtered users
  const filteredUsers = users.filter((u) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.code.toLowerCase().includes(q)
      if (!match) return false
    }
    if (statusFilter === 'verified' && !u.isPhoneVerified) return false
    if (statusFilter === 'unverified' && u.isPhoneVerified) return false
    if (statusFilter === 'warning' && u.status !== 'warning') return false
    if (platformFilter !== 'all' && u.platform !== platformFilter) return false
    return true
  })

  const toggleSelectUser = (id: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedUserIds.length === filteredUsers.length) {
      setSelectedUserIds([])
    } else {
      setSelectedUserIds(filteredUsers.map((u) => u.id))
    }
  }

  const removeChip = (chip: string) => {
    setActiveChips((prev) => prev.filter((c) => c !== chip))
    showToast(`Đã gỡ bộ lọc "${chip}"`)
  }

  const handleExportCsv = () => {
    showToast('Đang kết xuất và tải xuống danh sách 50,000 độc giả (Excel/CSV)...')
    setTimeout(() => {
      showToast('Đã tải xuống file DanhSach_DocGia_BepXinh.csv thành công!')
    }, 800)
  }

  const handleUserCreated = (newUser: {
    name: string
    email: string
    phone: string
    role: 'VIP' | 'Creator' | 'Độc giả' | 'Tài khoản mới'
    platform: 'iOS' | 'Android' | 'Web Portal'
    avatar?: string
  }) => {
    const item: UserReaderItem = {
      id: `u-${Date.now()}`,
      code: `#BX-U${Math.floor(10000 + Math.random() * 90000)}`,
      name: newUser.name,
      avatar: newUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      role: newUser.role === 'Độc giả' ? undefined : newUser.role,
      email: newUser.email,
      phone: newUser.phone,
      isPhoneVerified: true,
      platform: newUser.platform,
      osVersion: `${newUser.platform} Latest`,
      joinDate: 'Vừa xong',
      joinTimeAgo: 'Tài khoản mới',
      savedRecipes: 0,
      cookedRecipes: 0,
      status: 'active',
    }
    setUsers((prev) => [item, ...prev])
  }

  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length

  return (
    <div className="p-3.5 sm:p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* 1. Header & Breadcrumb */}
      <div className="pb-3 border-b border-slate-200/90 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <Home className="w-3.5 h-3.5 text-slate-400" />
          <span>Bếp Xinh Admin</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700">Quản lý Người dùng &amp; Độc giả</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Quản lý Người dùng (Độc giả)
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Đang hoạt động: {isEmptyData && !sampleLoaded ? '0' : '248.5k'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Theo dõi dữ liệu tài khoản độc giả, hành vi lưu và nấu công thức, tổng giá trị chi tiêu đơn đi chợ liên kết siêu thị và kiểm soát trạng thái vận hành tài khoản.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {hasData && (
              <button
                type="button"
                onClick={() => {
                  setSampleLoaded(false)
                  setUsers([])
                  setSelectedUserIds([])
                  showToast('Đã xóa toàn bộ dữ liệu độc giả và đặt lại toàn bộ thông tin là 0!')
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa dữ liệu (0)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất Excel/CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-slate-500" />
              <span>Gửi thông báo loạt</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Thêm người dùng</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng người dùng */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỔNG NGƯỜI DÙNG</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {isEmptyData && !sampleLoaded ? '0' : '248,520'}
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" />
              {isEmptyData && !sampleLoaded ? '0.0%' : '+14.2%'} tháng trước
            </span>
            <svg className="w-16 h-5 text-emerald-500" fill="none" viewBox="0 0 60 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M1 15 L15 11 L30 14 L45 5 L59 7" />
            </svg>
          </div>
        </div>

        {/* Card 2: Mới đăng ký */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>MỚI ĐĂNG KÝ (THÁNG NÀY)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {isEmptyData && !sampleLoaded ? '0' : '18,450'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Đang tăng
            </span>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
            <span className="text-emerald-600 font-bold">↑ {isEmptyData && !sampleLoaded ? '0%' : '+22.5%'}</span>
            <span>~{isEmptyData && !sampleLoaded ? '0' : '615'} lượt/ngày</span>
          </div>
        </div>

        {/* Card 3: Tỷ lệ tương tác */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỶ LỆ TƯƠNG TÁC (DAU/MAU)</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {isEmptyData && !sampleLoaded ? '0.0%' : '68.4%'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
              Rất tích cực
            </span>
          </div>
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>DAU: <strong>{isEmptyData && !sampleLoaded ? '0' : '84.2k'}</strong></span>
              <span>MAU: <strong>{isEmptyData && !sampleLoaded ? '0' : '123.1k'}</strong></span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#9c3808] rounded-full"
                style={{ width: isEmptyData && !sampleLoaded ? '0%' : '68.4%' }}
              />
            </div>
          </div>
        </div>

        {/* Card 4: Tỷ lệ churn */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỶ LỆ CHURN (RỜI BỎ 30D)</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {isEmptyData && !sampleLoaded ? '0.0%' : '2.1%'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
              Tối ưu &lt; 3%
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span className="text-teal-700 font-bold">↘ {isEmptyData && !sampleLoaded ? '0%' : '-0.4%'} quý trước</span>
            <span className="font-semibold text-slate-600">Gắn kết cao</span>
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <div className="md:col-span-4 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo Tên, Email, SĐT, User ID (#BX-...)"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-[#9c3808] transition-all"
            />
          </div>

          {/* Filter 1: Trạng thái */}
          <div className="md:col-span-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="verified">Đã xác thực SĐT</option>
              <option value="unverified">Chưa xác thực SĐT</option>
              <option value="warning">Cảnh báo Spam</option>
            </select>
          </div>

          {/* Filter 2: Nền tảng */}
          <div className="md:col-span-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="all">Tất cả nền tảng</option>
              <option value="iOS">📱 iOS</option>
              <option value="Android">🤖 Android</option>
              <option value="Web Portal">💻 Web Portal</option>
            </select>
          </div>

          {/* Filter 3: Mức chi tiêu GMV */}
          <div className="md:col-span-2">
            <select
              defaultValue="gmv"
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="gmv">Mức chi tiêu GMV</option>
              <option value="high">&gt; 1 Triệu VNĐ</option>
              <option value="mid">500k - 1 Triệu VNĐ</option>
              <option value="low">&lt; 500k VNĐ</option>
            </select>
          </div>

          {/* Filter 4: Thời gian */}
          <div className="md:col-span-2">
            <select
              defaultValue="30d"
              className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="30d">📅 30 ngày qua</option>
              <option value="7d">📅 7 ngày qua</option>
              <option value="today">📅 Hôm nay</option>
              <option value="all">📅 Toàn thời gian</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Chips Row */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-slate-400 text-[11px] uppercase tracking-wider">Bộ lọc nhanh:</span>
              {activeChips.map((chip, idx) => (
                <span
                  key={chip}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    idx === 0
                      ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                      : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  }`}
                >
                  <span>{chip}</span>
                  <button
                    type="button"
                    onClick={() => removeChip(chip)}
                    className="hover:opacity-75 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                type="button"
                onClick={() => {
                  setActiveChips([])
                  showToast('Đã xóa tất cả bộ lọc nhanh.')
                }}
                className="text-orange-600 font-bold text-[11px] hover:underline cursor-pointer ml-1"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>

            <div className="flex items-center gap-4 text-slate-500 font-semibold text-xs ml-auto">
              <button
                type="button"
                onClick={() => showToast('Đã lưu cấu hình bộ lọc hiện tại vào mục yêu thích!')}
                className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                <span>Lưu bộ lọc</span>
              </button>
              <button
                type="button"
                onClick={() => showToast('Hiển thị đầy đủ 11/11 cột dữ liệu chuẩn.')}
                className="hover:text-slate-800 flex items-center gap-1 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                <span>Tùy chỉnh cột (11/11)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Batch Action Floating Toolbar (When items selected) */}
      {selectedUserIds.length > 0 && (
        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              Đã chọn {selectedUserIds.length} người dùng
            </span>
            <span className="text-slate-600">|</span>
            <button
              type="button"
              onClick={() => showToast(`Đã mở cổng tặng Voucher Đi chợ cho ${selectedUserIds.length} tài khoản!`)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Tặng mã Voucher Đi chợ</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNotificationModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>Gửi Push thông báo</span>
            </button>
            <button
              type="button"
              onClick={() => showToast(`Đã đưa ${selectedUserIds.length} tài khoản vào danh sách khóa tài khoản loạt!`)}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Khóa tài khoản loạt</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedUserIds([])}
            className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
          >
            Bỏ chọn tất cả
          </button>
        </div>
      )}

      {/* 5. Main Table: Danh sách độc giả */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Table Top Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-black text-slate-900">Danh sách độc giả</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hiển thị {filteredUsers.length === 0 ? 0 : `1 - ${filteredUsers.length}`} trên tổng số {filteredUsers.length} người dùng trong chế độ xem này
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sắp xếp theo:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="gmv_desc">Chi tiêu GMV cao nhất ↓</option>
              <option value="newest">Ngày tham gia mới nhất</option>
              <option value="recipes">Tương tác bếp nhiều nhất</option>
            </select>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-base font-black text-slate-800">Chưa có dữ liệu người dùng</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Hệ thống chưa ghi nhận tài khoản độc giả nào hoặc bộ lọc tìm kiếm hiện tại không có kết quả phù hợp.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddUserModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Thêm độc giả mới</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-slate-300 text-[#9c3808] focus:ring-orange-200 cursor-pointer accent-[#9c3808]"
                    />
                  </th>
                  <th className="py-3 px-4">NGƯỜI DÙNG / ID</th>
                  <th className="py-3 px-4">LIÊN HỆ (EMAIL &amp; SĐT)</th>
                  <th className="py-3 px-4">NGUỒN THIẾT BỊ</th>
                  <th className="py-3 px-4">NGÀY THAM GIA</th>
                  <th className="py-3 px-4 text-center">TƯƠNG TÁC BẾP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => {
                  const isChecked = selectedUserIds.includes(user.id)
                  return (
                    <tr
                      key={user.id}
                      onClick={() => toggleSelectUser(user.id)}
                      className={`hover:bg-orange-50/20 transition-colors cursor-pointer ${
                        isChecked ? 'bg-orange-50/30' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelectUser(user.id)}
                          className="w-4 h-4 rounded border-slate-300 text-[#9c3808] focus:ring-orange-200 cursor-pointer accent-[#9c3808]"
                        />
                      </td>

                      {/* User & ID */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 shadow-2xs">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                            <span
                              className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                                user.status === 'warning'
                                  ? 'bg-rose-500'
                                  : 'bg-emerald-500'
                              }`}
                            />
                          </div>

                          <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`font-black text-xs ${
                                  user.isStrikethrough
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-900'
                                }`}
                              >
                                {user.name}
                              </span>

                              {user.role === 'VIP' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                  VIP
                                </span>
                              )}
                              {user.role === 'Creator' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-blue-100 text-blue-800 border border-blue-200">
                                  Creator
                                </span>
                              )}
                              {user.role === 'Spam' && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-rose-100 text-rose-700 border border-rose-200">
                                  Spam
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] font-mono font-bold text-slate-400">
                              <span className={user.status === 'warning' ? 'text-rose-600' : ''}>
                                {user.code}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Contact: Email & Phone */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-medium text-slate-800">{user.email}</div>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          {user.isPhoneVerified ? (
                            <>
                              <span className="font-mono text-slate-500">{user.phone}</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" />
                                Đã xác thực
                              </span>
                            </>
                          ) : (
                            <span className="text-amber-700 font-bold text-[10px] flex items-center gap-1">
                              ⚠ Chưa xác thực SĐT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Device Platform */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                            user.platform === 'iOS'
                              ? 'bg-purple-50 text-purple-700 border border-purple-200'
                              : user.platform === 'Android'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {user.platform === 'iOS' ? (
                            <Smartphone className="w-3 h-3 text-purple-600" />
                          ) : user.platform === 'Android' ? (
                            <Smartphone className="w-3 h-3 text-blue-600" />
                          ) : (
                            <Globe className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{user.osVersion}</span>
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="font-bold text-slate-800">{user.joinDate}</div>
                        <div className="text-[10px] text-slate-400">
                          {user.joinTimeAgo === 'Tài khoản mới' ? (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              Tài khoản mới
                            </span>
                          ) : (
                            user.joinTimeAgo
                          )}
                        </div>
                      </td>

                      {/* Kitchen Interaction */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-3 font-mono font-bold text-slate-700">
                          <span className="flex items-center gap-1 text-slate-600" title="Công thức đã lưu">
                            <span>🔖</span>
                            <span>{user.savedRecipes}</span>
                          </span>
                          <span className="text-slate-300">·</span>
                          <span className="flex items-center gap-1 text-emerald-700" title="Lượt nấu ăn">
                            <span>🍳</span>
                            <span>{user.cookedRecipes}</span>
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Table Pagination Footer */}
        <div className="p-3.5 bg-slate-50/70 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500 font-medium">
            <span>
              Hiển thị <strong>{filteredUsers.length === 0 ? 0 : `1 - ${filteredUsers.length}`}</strong> trên tổng số{' '}
              <strong>{filteredUsers.length}</strong> độc giả
            </span>
            <div className="flex items-center gap-1.5">
              <span>Hiển thị mỗi trang:</span>
              <select
                defaultValue="20"
                className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 outline-none cursor-pointer"
              >
                <option value="20">20 dòng</option>
                <option value="50">50 dòng</option>
                <option value="100">100 dòng</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1 self-center sm:self-auto font-medium">
            <button
              type="button"
              disabled
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Trước</span>
            </button>
            <button
              type="button"
              disabled={filteredUsers.length === 0}
              className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center ${
                filteredUsers.length === 0
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-[#9c3808] text-white shadow-xs cursor-pointer'
              }`}
            >
              1
            </button>
            {filteredUsers.length > 20 && (
              <>
                <button
                  type="button"
                  onClick={() => showToast('Đang chuyển đến trang 2...')}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  2
                </button>
                <button
                  type="button"
                  onClick={() => showToast('Đang chuyển đến trang 3...')}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer transition-colors"
                >
                  3
                </button>
              </>
            )}
            <button
              type="button"
              disabled={filteredUsers.length <= 20}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      <CreateUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onUserCreated={handleUserCreated}
      />

      {/* Broadcast Notification Modal */}
      <CreateNotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
    </div>
  )
}
