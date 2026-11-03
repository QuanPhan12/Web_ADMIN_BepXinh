import React, { useState } from 'react'
import {
  ShieldCheck,
  Hourglass,
  Utensils,
  ShoppingCart,
  TrendingUp,
  Clock,
  Download,
  Flame,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  MoreVertical,
  RefreshCw,
} from 'lucide-react'
import type { PriorityRecipeItem } from '../../types'
import { ExportReportModal } from '../modals/ExportReportModal'
import type { ExportReportData } from '../../utils/exportReport'
import { useProfile } from '../../context/ProfileContext'

export const ExecutiveDashboard: React.FC = () => {
  const { profile, showToast, isEmptyData } = useProfile()

  // Period & Tab Filters
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | '7days' | 'month' | 'custom'>('7days')
  const [chartTab, setChartTab] = useState<'7days' | '30days' | 'hourly'>('7days')
  const [selectedBranch, setSelectedBranch] = useState('Toàn quốc (0 Chi Nhánh)')

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncText, setLastSyncText] = useState('Đồng bộ 1 phút trước')

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)

  // Native recipes dataset - starts completely empty (0 recipes)
  const [recipes, setRecipes] = useState<PriorityRecipeItem[]>([])

  // Trigger data synchronization
  const handleSyncData = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      const now = new Date()
      const timeString = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      setLastSyncText(`Vừa đồng bộ lúc ${timeString}`)
      showToast(`Đồng bộ dữ liệu thành công với ${selectedBranch}!`)
    }, 700)
  }

  // Handle branch switch
  const handleBranchChange = (branchName: string) => {
    setSelectedBranch(branchName)
    showToast(`Đã chuyển sang chi nhánh: ${branchName}`)
    handleSyncData()
  }

  const handleApprove = (id: string) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
    showToast(`Đã duyệt thành công công thức mã ${id}!`)
  }

  // Native 0 Metrics (Dữ liệu gốc là 0)
  const activeRecipesCount = 0
  const activeRecipesGrowth = '+0.0% MoM'

  const queueCount = recipes.length
  const queueUrgentCount = 0
  const queueAiRate = '0%'
  const queueGrowthText = 'Tồn đọng 0%'
  const queueNewCount = '+0 bài mới'

  const chefsCount = 0
  const chefsStatusText = 'Chưa có dữ liệu'
  const chefsPromoText = 'Chưa có đầu bếp tham gia'
  const chefsGrowth = '+0.0%'
  const chefsSatisfaction = '0/5'

  const gmvAmount = '0'
  const gmvSuccessRate = '0%'
  const gmvGrowth = '+0.0% tuần này'
  const gmvPartners = '0 đối tác'

  // Chart metrics
  const recipeViews = '0'
  const fridgeSyncs = '0'
  const basketOrders = '0'
  const peakViews = '0'
  const peakFridges = '0'
  const peakBaskets = '0'
  const peakInteractions = '0'

  // Habit metrics
  const totalCooksCount = '0'
  const habitComViet = { pct: '0%', count: '0' }
  const habitNauNhanh = { pct: '0%', count: '0' }
  const habitEatClean = { pct: '0%', count: '0' }
  const habitBanhNgot = { pct: '0%', count: '0' }

  // Current display recipes in queue
  const displayRecipes = recipes

  // Prepare Export Data
  const exportData: ExportReportData = {
    period:
      selectedPeriod === 'today'
        ? 'Hôm nay'
        : selectedPeriod === '7days'
        ? '7 ngày qua'
        : selectedPeriod === 'month'
        ? 'Tháng này'
        : 'Tùy chỉnh kỳ',
    branch: selectedBranch,
    exportTime: new Date().toLocaleString('vi-VN'),
    exportedBy: `${profile.displayName} (${profile.alertEmail})`,
    isEmptyState: isEmptyData,
    metrics: {
      activeRecipes: activeRecipesCount,
      recipesGrowth: activeRecipesGrowth,
      queuePending: queueCount,
      queueUrgent: queueUrgentCount,
      activeChefs: chefsCount,
      chefsGrowth: chefsGrowth,
      gmvAmount: `${gmvAmount} VNĐ`,
      gmvGrowth: gmvGrowth,
    },
    recipesQueue: displayRecipes.map((r) => ({
      id: r.id,
      title: r.title,
      chefName: r.chefName,
      chefRole: r.chefRole,
      timeAgo: r.timeAgo,
      aiScore: r.aiScore,
      aiStatus: r.aiStatus,
    })),
    apiPartners: [
      {
        name: 'WinMart+ (Toàn quốc)',
        uptime: '0%',
        sku: '0 SKU khớp giá',
        completionRate: '0%',
      },
      {
        name: 'Co.op Food & Co.op Mart',
        uptime: '0%',
        sku: '0 SKU khớp giá',
        completionRate: '0%',
      },
      {
        name: 'Bách Hóa Xanh Online',
        uptime: '0%',
        sku: '0 SKU khớp giá',
        completionRate: '0%',
      },
    ],
    habits: [
      { category: 'Cơm Việt truyền thống', percentage: habitComViet.pct, count: habitComViet.count },
      { category: 'Nấu nhanh dưới 15 phút', percentage: habitNauNhanh.pct, count: habitNauNhanh.count },
      { category: 'Eat Clean & Healthy', percentage: habitEatClean.pct, count: habitEatClean.count },
      { category: 'Bánh ngọt & Tráng miệng', percentage: habitBanhNgot.pct, count: habitBanhNgot.count },
    ],
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1">
            <span>Bếp Xinh Admin</span>
            <span>&gt;</span>
            <span className="text-[#9c3808] font-bold">Tổng quan &amp; Chỉ số Vận hành</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Real-time Indicator & Sync Button */}
            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              title="Bấm để đồng bộ dữ liệu ngay lập tức"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{isSyncing ? 'ĐANG ĐỒNG BỘ DỮ LIỆU...' : 'ĐỒNG BỘ THỜI GIAN THỰC'}</span>
            </button>

            {/* Sync Timestamp */}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {lastSyncText}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-2">
            Executive Dashboard: Tổng quan &amp; Chỉ số Vận hành
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-3xl mt-1">
            Theo dõi nhịp sống ẩm thực, giám sát tiến trình kiểm duyệt bài đăng bằng AI và điều phối chuỗi cung ứng giỏ đi chợ liên kết.
          </p>
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start md:self-auto">
          {/* Branch selector */}
          <select
            value={selectedBranch}
            onChange={(e) => handleBranchChange(e.target.value)}
            className="px-3.5 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-2xs outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="Toàn quốc (0 Chi Nhánh)">Toàn quốc (0 Chi Nhánh)</option>
            <option value="Miền Bắc - Hà Nội (0 Chi Nhánh)">Miền Bắc - Hà Nội (0 Chi Nhánh)</option>
            <option value="Miền Nam - TP.HCM (0 Chi Nhánh)">Miền Nam - TP.HCM (0 Chi Nhánh)</option>
            <option value="Miền Trung - Đà Nẵng (0 Chi Nhánh)">Miền Trung - Đà Nẵng (0 Chi Nhánh)</option>
          </select>

          {/* Period selector */}
          <div className="bg-slate-100 p-1 rounded-full flex items-center text-xs font-semibold text-slate-600">
            <button
              onClick={() => setSelectedPeriod('today')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPeriod === 'today' ? 'bg-[#9c3808] text-white shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setSelectedPeriod('7days')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPeriod === '7days' ? 'bg-[#9c3808] text-white shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setSelectedPeriod('month')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPeriod === 'month' ? 'bg-[#9c3808] text-white shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Tháng này
            </button>
            <button
              onClick={() => setSelectedPeriod('custom')}
              className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                selectedPeriod === 'custom' ? 'bg-[#9c3808] text-white shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Tùy chỉnh kỳ
            </button>
          </div>

          {/* Export Report Trigger Button */}
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất Báo Cáo Tổng Hợp</span>
          </button>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Recipes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <span>TỔNG CÔNG THỨC HOẠT ĐỘNG</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">{activeRecipesCount}</div>
          <div className="text-xs text-slate-400 mt-1">
            {isEmptyData ? 'Chưa có công thức nào được kích hoạt' : 'Đã chuẩn hoá dinh dưỡng & định lượng'}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className={`${isEmptyData ? 'text-slate-400' : 'text-emerald-600'} font-bold flex items-center gap-1`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {activeRecipesGrowth}
            </span>
            {/* Sparkline curve */}
            <svg className={`w-16 h-5 ${isEmptyData ? 'text-slate-300' : 'text-emerald-500'}`} viewBox="0 0 60 20" fill="none">
              {isEmptyData ? (
                <line x1="0" y1="18" x2="60" y2="18" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
              ) : (
                <path d="M0 15 Q15 18 25 10 T45 8 T60 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </div>
        </div>

        {/* Card 2: Queue Pending */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <span>HÀNG ĐỢI CHỜ DUYỆT</span>
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{queueCount}</span>
            <span className="text-xs font-semibold text-slate-500">bài</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={`px-2 py-0.5 rounded-full ${isEmptyData ? 'bg-slate-100 text-slate-500' : 'bg-rose-50 text-rose-700'} text-[10px] font-bold`}>
              {queueUrgentCount} bài cần duyệt gấp
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-semibold">
              AI duyệt {queueAiRate}
            </span>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className="text-slate-600 font-medium">{queueGrowthText}</span>
            <span className="text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-full text-[10px]">
              {queueNewCount}
            </span>
          </div>
        </div>

        {/* Card 3: Chefs & Creators */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <span>ĐẦU BẾP &amp; ĐỘC GIẢ</span>
            <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{chefsCount}</span>
            <span className={`text-xs font-semibold ${isEmptyData ? 'text-slate-400' : 'text-emerald-600'}`}>{chefsStatusText}</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">{chefsPromoText}</div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className={`${isEmptyData ? 'text-slate-400' : 'text-emerald-600'} font-bold flex items-center gap-1`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {chefsGrowth}
            </span>
            <span className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
              Chỉ số hài lòng <span className="font-bold text-amber-600">{chefsSatisfaction}</span>
            </span>
          </div>
        </div>

        {/* Card 4: GMV Grocery Basket */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">
            <span>GMV GIỎ ĐI CHỢ LIÊN KẾT</span>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{gmvAmount}</span>
            <span className="text-xs font-bold text-slate-500">VNĐ</span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Tỷ lệ giỏ thành công: <strong className="text-slate-700">{gmvSuccessRate}</strong>
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-xs">
            <span className={`${isEmptyData ? 'text-slate-400' : 'text-emerald-600'} font-bold flex items-center gap-1`}>
              <TrendingUp className="w-3.5 h-3.5" />
              {gmvGrowth}
            </span>
            <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
              {gmvPartners}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Area Chart: Real-time Cooking Traffic */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Lưu lượng tương tác &amp; Hành vi vào bếp thời gian thực
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEmptyData
                  ? 'Chưa ghi nhận phiên nấu ăn hoặc tương tác giỏ hàng trong kỳ này (0)'
                  : 'Đo lường nhịp nấu ăn thực tế, đồng bộ tủ lạnh cá nhân và click mua nguyên liệu'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-slate-100 p-0.5 rounded-xl flex text-xs font-semibold text-slate-600">
                <button
                  onClick={() => setChartTab('7days')}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${chartTab === '7days' ? 'bg-white text-slate-900 shadow-2xs font-bold' : ''}`}
                >
                  7 ngày
                </button>
                <button
                  onClick={() => setChartTab('30days')}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${chartTab === '30days' ? 'bg-white text-slate-900 shadow-2xs font-bold' : ''}`}
                >
                  30 ngày
                </button>
                <button
                  onClick={() => setChartTab('hourly')}
                  className={`px-3 py-1 rounded-lg cursor-pointer ${chartTab === 'hourly' ? 'bg-white text-slate-900 shadow-2xs font-bold' : ''}`}
                >
                  Theo giờ trong ngày
                </button>
              </div>
            </div>
          </div>

          {/* Legends */}
          <div className="flex items-center gap-5 text-xs text-slate-600 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
              Lượt xem công thức: <strong className="text-slate-900 font-bold ml-1">{recipeViews}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Đồng bộ tủ lạnh: <strong className="text-slate-900 font-bold ml-1">{fridgeSyncs}</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Đơn giỏ đi chợ: <strong className="text-slate-900 font-bold ml-1">{basketOrders}</strong>
            </span>
          </div>

          {/* Interactive Spline Chart Graphic */}
          <div className="relative pt-6 pb-2">
            <svg className="w-full h-56 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradientViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="gradientFridge" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Horizontal Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="#f1f5f9" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="#f1f5f9" strokeDasharray="4 4" />

              {isEmptyData ? (
                // Flatline at 0
                <line x1="20" y1="185" x2="680" y2="185" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
              ) : (
                <>
                  {/* Area 1: Recipe Views */}
                  <path
                    d="M 20 120 Q 120 100, 220 110 T 420 90 T 550 80 T 670 45 L 670 190 L 20 190 Z"
                    fill="url(#gradientViews)"
                  />
                  <path
                    d="M 20 120 Q 120 100, 220 110 T 420 90 T 550 80 T 670 45"
                    fill="none"
                    stroke="#c2410c"
                    strokeWidth="2.5"
                  />

                  {/* Area 2: Fridge Sync */}
                  <path
                    d="M 20 150 Q 120 135, 220 140 T 420 120 T 550 110 T 670 95 L 670 190 L 20 190 Z"
                    fill="url(#gradientFridge)"
                  />
                  <path
                    d="M 20 150 Q 120 135, 220 140 T 420 120 T 550 110 T 670 95"
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                  />

                  {/* Area 3: Grocery Basket Orders */}
                  <path
                    d="M 20 170 Q 120 165, 220 168 T 420 155 T 550 145 T 670 130"
                    fill="none"
                    stroke="#d97706"
                    strokeWidth="2.5"
                  />

                  {/* Peak indicator highlight at Sunday (x=670) */}
                  <line x1="670" y1="20" x2="670" y2="190" stroke="#f97316" strokeWidth="1.5" strokeDasharray="3 3" />
                  <circle cx="670" cy="45" r="4.5" fill="#c2410c" stroke="#fff" strokeWidth="2" />
                  <circle cx="670" cy="95" r="4.5" fill="#059669" stroke="#fff" strokeWidth="2" />
                  <circle cx="670" cy="130" r="4.5" fill="#d97706" stroke="#fff" strokeWidth="2" />
                </>
              )}
            </svg>

            {/* Floating Peak Tooltip */}
            <div className="absolute top-2 right-12 bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl text-xs space-y-1 backdrop-blur-xs border border-slate-700 pointer-events-none">
              <div className="font-bold text-amber-400 flex items-center justify-between gap-4">
                <span>{isEmptyData ? 'CHƯA CÓ TƯƠNG TÁC (0)' : 'CHỦ NHẬT (Đỉnh ngày)'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono">
                  {isEmptyData ? 'Peak: 0' : `Peak: ${peakInteractions} Tương tác`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                <span>Lượt xem:</span>
                <strong className="text-white ml-auto">{peakViews}</strong>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Đồng bộ tủ:</span>
                <strong className="text-white ml-auto">{peakFridges}</strong>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Giỏ đi chợ:</span>
                <strong className="text-white ml-auto">{peakBaskets}</strong>
              </div>
            </div>

            {/* X-Axis Day Labels */}
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 pt-3 border-t border-slate-100">
              <span>Thứ Hai (19/10)</span>
              <span>Thứ Ba</span>
              <span>Thứ Tư</span>
              <span>Thứ Năm</span>
              <span>Thứ Sáu</span>
              <span>Thứ Bảy</span>
              <span className={isEmptyData ? 'text-slate-400 font-semibold' : 'text-[#9c3808] font-bold'}>
                {isEmptyData ? 'Chủ Nhật' : 'Chủ Nhật (Peak hôm nay!)'}
              </span>
            </div>
          </div>

          {/* Golden Highlight Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/60 via-slate-50 to-amber-50/40 border border-slate-200/80 flex items-center justify-between text-xs text-slate-700">
            <div className="flex items-center gap-2.5">
              <span className={`p-1.5 rounded-xl ${isEmptyData ? 'bg-slate-200 text-slate-500' : 'bg-amber-500 text-white'} shadow-xs`}>
                <Flame className="w-4 h-4" />
              </span>
              <span>
                <strong>Khung giờ vàng nấu nướng (17:30 - 19:45):</strong>{' '}
                {isEmptyData
                  ? 'Chưa ghi nhận phiên active đồng thời trong khung giờ cao điểm (0).'
                  : 'Ghi nhận 52,880 phiên active đồng thời trên app di động và web.'}
              </span>
            </div>
            <button
              onClick={() => showToast(isEmptyData ? 'Chưa ghi nhận dữ liệu giờ cao điểm.' : 'Báo cáo khung giờ cao điểm đã được đồng bộ.')}
              className="text-[#9c3808] font-bold hover:underline flex items-center gap-1 shrink-0 ml-2 cursor-pointer"
            >
              <span>Báo cáo giờ cao điểm</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Donut Chart: Culinary Habit Structure */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Cơ cấu Thói quen Ẩm thực
              </h3>
              <button className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEmptyData
                ? 'Chưa ghi nhận lượt nấu món ăn trong kỳ này (0)'
                : 'Tỷ trọng công thức được chọn nấu nhiều nhất'}
            </p>
          </div>

          {/* Donut Graphic */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-48 h-48 -rotate-90" viewBox="0 0 100 100">
              {isEmptyData ? (
                // Empty circle
                <circle cx="50" cy="50" r="38" stroke="#e2e8f0" strokeWidth="12" fill="none" />
              ) : (
                <>
                  <circle cx="50" cy="50" r="38" stroke="#f1f5f9" strokeWidth="12" fill="none" />
                  {/* Segment 1: Cơm Việt (38%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#c2410c"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="90.7 238.7"
                    strokeDashoffset="0"
                  />
                  {/* Segment 2: Nấu nhanh (26%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#059669"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="62.1 238.7"
                    strokeDashoffset="-90.7"
                  />
                  {/* Segment 3: Eat Clean (20%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#2563eb"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="47.7 238.7"
                    strokeDashoffset="-152.8"
                  />
                  {/* Segment 4: Bánh ngọt (16%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#8b5cf6"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="38.2 238.7"
                    strokeDashoffset="-200.5"
                  />
                </>
              )}
            </svg>

            {/* Donut Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 leading-none">{totalCooksCount}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">Lượt nấu tuần này</span>
            </div>
          </div>

          {/* Habit Categories List */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-[#c2410c]'}`}></span>
                <span className="font-medium text-slate-700">Cơm Việt truyền thống</span>
              </span>
              <span className="font-bold text-slate-900">
                {habitComViet.pct} <span className="text-slate-400 font-normal">({habitComViet.count})</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-[#059669]'}`}></span>
                <span className="font-medium text-slate-700">Nấu nhanh dưới 15 phút</span>
              </span>
              <span className="font-bold text-slate-900">
                {habitNauNhanh.pct} <span className="text-slate-400 font-normal">({habitNauNhanh.count})</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-[#2563eb]'}`}></span>
                <span className="font-medium text-slate-700">Eat Clean &amp; Healthy</span>
              </span>
              <span className="font-bold text-slate-900">
                {habitEatClean.pct} <span className="text-slate-400 font-normal">({habitEatClean.count})</span>
              </span>
            </div>

            <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50">
              <span className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-[#8b5cf6]'}`}></span>
                <span className="font-medium text-slate-700">Bánh ngọt &amp; Tráng miệng</span>
              </span>
              <span className="font-bold text-slate-900">
                {habitBanhNgot.pct} <span className="text-slate-400 font-normal">({habitBanhNgot.count})</span>
              </span>
            </div>
          </div>

          {/* Trending Box */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>
                Trending: <strong>{isEmptyData ? 'Chưa có' : '#NồiChiênKhôngDầu'}</strong>
              </span>
              <span className="text-emerald-600 font-bold">{isEmptyData ? '(+0%)' : '(+42%)'}</span>
            </span>
            <button
              onClick={() => showToast('Mở chi tiết xu hướng ẩm thực.')}
              className="text-[#9c3808] font-bold hover:underline cursor-pointer"
            >
              Chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* Row 3: Priority AI Queue & Right Status / Alert Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority AI Queue Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Hàng đợi Duyệt Nhanh Ưu Tiên (Priority AI Queue)
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isEmptyData
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {isEmptyData ? '0 cần duyệt!' : '18 cần duyệt!'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                AI tự động kiểm định độ sắc nét hình ảnh, tỷ lệ định lượng gia vị &amp; phát hiện bản quyền
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => showToast('Đang lọc công thức theo AI Score...')}
                className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                Lọc AI Score
              </button>
              <button
                type="button"
                disabled={displayRecipes.length === 0}
                onClick={() => {
                  setRecipes([])
                  showToast('Đã duyệt toàn bộ công thức trong hàng đợi!')
                }}
                className="px-3.5 py-1.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] disabled:opacity-50 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
              >
                Duyệt hàng loạt ({displayRecipes.length})
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-1">Món ăn &amp; Định lượng</th>
                  <th className="pb-3">Tác giả / Phân hạng</th>
                  <th className="pb-3">Gửi lên</th>
                  <th className="pb-3 text-right pr-2">AI Quality Score</th>
                  <th className="pb-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayRecipes.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                          <FileCheck2 className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-slate-800 text-sm">
                          Không có dữ liệu công thức nào trong hàng đợi (0 bài)
                        </span>
                        <span className="text-xs text-slate-400 max-w-sm">
                          {isEmptyData
                            ? 'Hiện tại chưa phát sinh bài đăng công thức nào cần thẩm định.'
                            : 'Tất cả bài đăng trong hàng đợi đã được kiểm duyệt xong.'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayRecipes.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Food Name & Image */}
                      <td className="py-3 pl-1">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-2xs">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-xs hover:text-[#9c3808] cursor-pointer">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span>⏱️ {item.prepTime}</span>
                              <span>•</span>
                              <span>{item.ingredientsCount} nguyên liệu</span>
                              {item.hasCalories && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-600 font-medium">Đã tính calo</span>
                                </>
                              )}
                              {item.hasVideo && (
                                <>
                                  <span>•</span>
                                  <span className="text-purple-600 font-medium">Video HD</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Author & Badge */}
                      <td className="py-3">
                        <div className="font-semibold text-slate-800">{item.chefName}</div>
                        <span
                          className={`inline-block text-[9px] font-extrabold px-1.5 py-0.2 rounded mt-0.5 uppercase ${
                            item.chefRole === 'MASTER CHEF'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.chefRole === 'CREATOR PRO'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.chefRole}
                        </span>
                      </td>

                      {/* Time sent */}
                      <td className="py-3 text-slate-500 whitespace-nowrap">
                        {item.timeAgo}
                      </td>

                      {/* AI Score Pill */}
                      <td className="py-3 text-right pr-2">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-slate-100 bg-slate-50">
                          <span
                            className={`font-black text-sm ${
                              item.aiScore >= 95
                                ? 'text-emerald-600'
                                : item.aiScore >= 90
                                ? 'text-blue-600'
                                : 'text-amber-600'
                            }`}
                          >
                            {item.aiScore}
                          </span>
                          <div className="text-left leading-tight">
                            <div className="text-[10px] font-bold text-slate-800">{item.aiStatus}</div>
                            <div className="text-[9px] text-slate-400">{item.aiNote}</div>
                          </div>
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => showToast(`Báo cáo chi tiết AI Vision: ${item.title}`)}
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            <FileCheck2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
            <span>Hiển thị {displayRecipes.length} trong tổng số {isEmptyData ? 0 : 148} bài chờ duyệt theo AI Score</span>
            <button
              onClick={() => showToast('Mở toàn bộ màn hình Kiểm duyệt.')}
              className="text-[#9c3808] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Mở toàn bộ màn hình Kiểm duyệt</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side Column: Partner SKU Inventory & Operational Alerts */}
        <div className="space-y-6">
          {/* Card 1: API Partner Grocery Sync */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Mạng Lưới Đối Tác &amp; Tồn Kho API
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Giám sát đồng bộ SKU giỏ đi chợ liên kết
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${isEmptyData ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                {isEmptyData ? '0 ĐỐI TÁC HOẠT ĐỘNG' : 'API LIVE'}
              </span>
            </div>

            {/* Partner 1: WinMart */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                  WinMart+ (Toàn quốc)
                </span>
                <span className={`${isEmptyData ? 'text-slate-500' : 'text-emerald-600'} text-[11px] font-bold`}>
                  {isEmptyData ? '0% Uptime' : '99.9% Uptime'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{isEmptyData ? '0 SKU khớp giá' : '42,000 SKU khớp giá'}</span>
                <span className={`font-semibold ${isEmptyData ? 'text-slate-500' : 'text-slate-700'}`}>Hoàn thành {isEmptyData ? '0%' : '96.2%'}</span>
              </div>
            </div>

            {/* Partner 2: Co.op Food */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-emerald-500'}`} />
                  Co.op Food &amp; Co.op Mart
                </span>
                <span className={`${isEmptyData ? 'text-slate-500' : 'text-emerald-600'} text-[11px] font-bold`}>
                  {isEmptyData ? '0% Uptime' : '98.5% Uptime'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{isEmptyData ? '0 SKU khớp giá' : '35,400 SKU khớp giá'}</span>
                <span className={`font-semibold ${isEmptyData ? 'text-slate-500' : 'text-slate-700'}`}>Hoàn thành {isEmptyData ? '0%' : '91.3%'}</span>
              </div>
            </div>

            {/* Partner 3: Bách Hóa Xanh */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isEmptyData ? 'bg-slate-300' : 'bg-amber-500 animate-pulse'}`} />
                  Bách Hóa Xanh Online
                </span>
                <span className={`${isEmptyData ? 'text-slate-500' : 'text-amber-600'} text-[11px] font-bold`}>
                  {isEmptyData ? '0% Uptime' : 'Đang đồng bộ SKU'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{isEmptyData ? '0 SKU khớp giá' : 'Đồng bộ 2,100 mặt hàng mới'}</span>
                <span className={`font-semibold ${isEmptyData ? 'text-slate-500' : 'text-amber-600'}`}>Hoàn thành {isEmptyData ? '0%' : '72.5%'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Tích hợp Webhook API v3.2</span>
              <button
                onClick={() => showToast('Mở trung tâm quản lý Webhook API')}
                className="text-[#9c3808] font-bold hover:underline cursor-pointer"
              >
                Quản lý kết nối API
              </button>
            </div>
          </div>

          {/* Card 2: Operational Alerts */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className={`w-4 h-4 ${isEmptyData ? 'text-slate-400' : 'text-rose-500'}`} />
                <h3 className="text-base font-bold text-slate-900">
                  Nhật Ký Cảnh Báo Vận Hành
                </h3>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${isEmptyData ? 'bg-slate-100 text-slate-600 border-slate-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {isEmptyData ? '0 cảnh báo' : '3 cảnh báo'}
              </span>
            </div>

            {isEmptyData ? (
              <div className="py-7 px-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-center space-y-2">
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-800 text-xs">0 cảnh báo vận hành</div>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Không ghi nhận sự cố bản quyền hoặc gián đoạn API nào trong kỳ này.
                </p>
              </div>
            ) : (
              <>
                {/* Alert 1: Copyright */}
                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-1 text-xs">
                  <div className="font-bold text-rose-900 flex items-center justify-between">
                    <span>12 công thức phát hiện trùng ảnh bản quyền mạng</span>
                  </div>
                  <p className="text-[11px] text-rose-700 leading-relaxed">
                    AI quét thấy khớp hình ảnh với 3 tạp chí ẩm thực nước ngoài chưa ghi nguồn.
                  </p>
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-bold">
                    <button onClick={() => showToast('Mở danh sách 12 bài trùng lặp ảnh')} className="text-rose-800 hover:underline cursor-pointer">Kiểm tra ngay</button>
                    <span>•</span>
                    <button onClick={() => showToast('Đã gửi phản hồi đến các Creator')} className="text-rose-700 hover:underline cursor-pointer">Gửi phản hồi Creator</button>
                  </div>
                </div>

                {/* Alert 2: Tops Market sync */}
                <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1 text-xs">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Đồng bộ tồn kho Tops Market thành công</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Cập nhật 14,200 mã rau củ quả tươi, giá bán theo trọng lượng thực tế.
                  </p>
                  <div className="text-[10px] text-emerald-700 font-mono">
                    Thời gian: 08:40:14
                  </div>
                </div>

                {/* Alert 3: 5 Creators */}
                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-xs">
                  <div className="font-bold text-amber-900">
                    5 Creator đạt mốc 10,000 Follower
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Hệ thống tự động kích hoạt quyền mở giỏ tiếp thị liên kết (Affiliate Grocery).
                  </p>
                  <div className="text-[10px] text-amber-700 font-semibold">
                    Đã tự động gửi thông báo
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Nhật ký kiểm toán hệ thống</span>
              <button
                onClick={() => showToast('Mở System Audit Log toàn diện')}
                className="text-[#9c3808] font-bold hover:underline cursor-pointer"
              >
                Xem System Audit Log
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Export Report Dialog Modal */}
      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        reportData={exportData}
      />
    </div>
  )
}
