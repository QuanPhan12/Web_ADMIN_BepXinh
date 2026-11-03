import React, { useState } from 'react'
import {
  Download,
  RefreshCw,
  Plus,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertTriangle,
  Search,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  X,
  FileText,
  Sparkles,
  ShoppingBag,
  Trash2,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ManualOrderModal } from '../modals/ManualOrderModal'

interface OrderSKU {
  id: string
  name: string
  sku: string
  price: number
  cost: number
  status: 'matched' | 'mismatch'
  mismatchDiff?: number
}

interface OrderReconciliationItem {
  id: string
  code: string
  orderTime: string
  reconciliationTime: string
  supermarket: string
  supermarketCode: string
  customerName: string
  customerPhone: string
  customerAvatar: string
  avatarBg: string
  recipeTitle: string
  recipeImage: string
  skuCount: number
  totalCustomerPaid: number
  supermarketCost: number
  platformCommission: number
  deliveryFee: number
  paymentMethod: string
  statusTab: 'all' | 'processing' | 'shipping' | 'delivered' | 'mismatch' | 'completed' | 'refunded'
  isMismatch: boolean
  mismatchAmount?: number
  mismatchReason?: string
  skus: OrderSKU[]
}


export const OrderReconciliationView: React.FC = () => {
  const { showToast } = useProfile()
  const [orders, setOrders] = useState<OrderReconciliationItem[]>([])
  const [activeOrderId, setActiveOrderId] = useState<string>('')
  const [selectedTab, setSelectedTab] = useState<string>('all')
  const [searchCode, setSearchCode] = useState('')
  const [selectedPartner, setSelectedPartner] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('oct2024')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all')
  const [aiResolution, setAiResolution] = useState<'accept_deduct' | 'request_bill'>('accept_deduct')
  const [selectedOrderCheckboxes, setSelectedOrderCheckboxes] = useState<string[]>([])
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=manual_order')
    } catch {
      return false
    }
  })
  const [isCopiedCode, setIsCopiedCode] = useState(false)
  const [isAutoReconciling, setIsAutoReconciling] = useState(false)

  const hasData = orders.length > 0
  const activeOrder = orders.find((o) => o.id === activeOrderId) || orders[0] || null

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code)
    setIsCopiedCode(true)
    showToast(`Đã sao chép mã đơn ${code}!`)
    setTimeout(() => setIsCopiedCode(false), 2000)
  }

  const handleRunAutoReconcile = () => {
    setIsAutoReconciling(true)
    showToast('Đang kích hoạt Engine đối soát tự động với 1,441 đơn hàng...')
    setTimeout(() => {
      setIsAutoReconciling(false)
      showToast('Đã đối soát xong 1,441 đơn: Khớp chuẩn 98.6% (1,420 đơn), 3 đơn sai lệch giá đã gắn cờ!')
    }, 1200)
  }

  const handleConfirmOffset = () => {
    if (!activeOrder) return
    showToast(`Đã xác nhận đối soát & cấn trừ công nợ WinMart cho đơn ${activeOrder.code} thành công!`)
    setOrders((prev) =>
      prev.map((o) =>
        o.id === activeOrder.id
          ? { ...o, isMismatch: false, statusTab: 'completed' }
          : o
      )
    )
  }

  const handleManualOrderCreated = (order: any) => {
    const newItem: OrderReconciliationItem = {
      id: `ord-${Date.now()}`,
      code: order.code,
      orderTime: 'Vừa xong',
      reconciliationTime: 'Đang chờ',
      supermarket: order.supermarket,
      supermarketCode: '#WM-MANUAL',
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerAvatar: order.customerName.slice(0, 2).toUpperCase(),
      avatarBg: 'from-amber-600 to-orange-700',
      recipeTitle: order.recipeName,
      recipeImage: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=150&auto=format&fit=crop&q=80',
      skuCount: order.skuCount,
      totalCustomerPaid: order.totalAmount,
      supermarketCost: Math.round(order.totalAmount * 0.85),
      platformCommission: Math.round(order.totalAmount * 0.085),
      deliveryFee: 15000,
      paymentMethod: 'Đơn bù thủ công (Admin Offset)',
      statusTab: 'mismatch',
      isMismatch: true,
      mismatchAmount: -order.totalAmount,
      mismatchReason: 'Đơn bù trừ phát sinh thủ công bởi Quản trị viên.',
      skus: [],
    }
    setOrders([newItem, ...orders])
    setActiveOrderId(newItem.id)
  }

  const filteredOrders = orders.filter((o) => {
    if (selectedTab !== 'all' && selectedTab !== 'mismatch' && o.statusTab !== selectedTab) {
      return false
    }
    if (selectedTab === 'mismatch' && !o.isMismatch) {
      return false
    }
    return true
  })

  return (
    <div className="p-3.5 sm:p-4 md:p-6 space-y-4 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      {/* 1. Header & Breadcrumb */}
      <div className="pb-3 border-b border-slate-200/90 space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>BẾP XINH ADMIN</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700">QUẢN LÝ ĐƠN HÀNG &amp; ĐỐI SOÁT</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Quản lý Đơn hàng &amp; Đối soát Doanh thu
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Engine v2.4 Active (Tự động đối soát)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Giám sát luồng đơn đi chợ theo công thức, hoa hồng nền tảng 8.5% và đối soát tự động theo thời gian thực với chuỗi siêu thị đối tác (WinMart, Tops Market, Co.op Food, BHX).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {hasData && (
              <button
                type="button"
                onClick={() => {
                  setOrders([])
                  setActiveOrderId('')
                  setSelectedOrderCheckboxes([])
                  showToast('Đã xóa toàn bộ đơn hàng đối soát và đặt lại toàn bộ thông tin là 0!')
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa dữ liệu (0)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => showToast('Đang kết xuất báo cáo đối soát doanh thu (CSV/Excel)...')}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Xuất báo cáo (CSV/Excel)</span>
            </button>
            <button
              type="button"
              onClick={handleRunAutoReconcile}
              disabled={isAutoReconciling}
              className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isAutoReconciling ? 'animate-spin' : ''}`} />
              <span>{isAutoReconciling ? 'Đang chạy...' : 'Chạy đối soát tự động hàng loạt'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsManualOrderModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Tạo đơn bù thủ công</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng GMV */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỔNG GMV ĐƠN ĐI CHỢ</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasData ? '845,200,000' : '0'}
            </span>
            <span className="text-sm font-bold text-slate-500">đ</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" />
              {hasData ? '+18.4%' : '0.0%'} MoM
            </span>
            <svg className="w-16 h-5 text-emerald-500" fill="none" viewBox="0 0 60 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={hasData ? "M1 16 L12 13 L28 15 L42 6 L59 8" : "M1 10 L59 10"} />
            </svg>
          </div>
        </div>

        {/* Card 2: Hoa hồng Bếp Xinh */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>HOA HỒNG BẾP XINH (8.5%)</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasData ? '71,842,000' : '0'}
            </span>
            <span className="text-sm font-bold text-slate-500">đ</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              <TrendingUp className="w-3.5 h-3.5" />
              {hasData ? '+16.2%' : '0.0%'} hoàn tất đối soát
            </span>
            <svg className="w-16 h-5 text-emerald-500" fill="none" viewBox="0 0 60 20" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={hasData ? "M1 18 L15 14 L30 11 L45 8 L59 5" : "M1 10 L59 10"} />
            </svg>
          </div>
        </div>

        {/* Card 3: Tỷ lệ đối soát khớp */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỶ LỆ ĐỐI SOÁT KHỚP</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasData ? '98.6%' : '0.0%'}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {hasData ? '1,420 / 1,441' : '0 / 0'} đơn hoàn tất
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Chờ đối soát: <strong>{hasData ? 18 : 0} đơn</strong></span>
            <span className={hasData ? "text-emerald-600 font-bold flex items-center gap-1" : "text-slate-400 font-semibold"}>
              {hasData ? '● Khớp chuẩn' : '● Chưa có dữ liệu'}
            </span>
          </div>
        </div>

        {/* Card 4: Đơn cần xử lý sai lệch */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>ĐƠN CẦN XỬ LÝ SAI LỆCH</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${hasData ? 'text-rose-600' : 'text-slate-800'}`}>
              {hasData ? '03' : '0'}
            </span>
            {hasData ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                CẦN DUYỆT GẤP
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-500 border border-slate-200">
                0 SAI LỆCH
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Chênh lệch giá &amp; thiếu hàng{hasData ? '' : ': 0'}</span>
            <span className={hasData ? "text-rose-600 font-bold hover:underline cursor-pointer" : "text-slate-400 font-bold cursor-default"}>
              Xử lý ngay →
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter Status Tabs Bar */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs font-bold overflow-x-auto">
        <button
          type="button"
          onClick={() => setSelectedTab('all')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedTab === 'all'
              ? 'bg-white text-slate-900 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tất cả đơn ({hasData ? '1,441' : 0})
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('processing')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedTab === 'processing'
              ? 'bg-white text-slate-900 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đang xử lý ({hasData ? 42 : 0})
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('shipping')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedTab === 'shipping'
              ? 'bg-white text-slate-900 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đang giao ({hasData ? 28 : 0})
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('delivered')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedTab === 'delivered'
              ? 'bg-white text-slate-900 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đã giao ({hasData ? '1,345' : 0})
        </button>
        {hasData ? (
          <button
            type="button"
            onClick={() => setSelectedTab('mismatch')}
            className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedTab === 'mismatch'
                ? 'bg-rose-600 text-white shadow-xs font-black'
                : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
            }`}
          >
            <span>⚠ Sai lệch đối soát</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              selectedTab === 'mismatch' ? 'bg-white text-rose-700' : 'bg-rose-200 text-rose-800'
            }`}>
              3
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setSelectedTab('mismatch')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              selectedTab === 'mismatch'
                ? 'bg-white text-slate-900 shadow-2xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sai lệch đối soát (0)
          </button>
        )}
        <button
          type="button"
          onClick={() => setSelectedTab('completed')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedTab === 'completed'
              ? 'bg-white text-slate-900 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đã hoàn tất ({hasData ? '1,390' : 0})
        </button>
        <button
          type="button"
          onClick={() => setSelectedTab('refunded')}
          className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
            selectedTab === 'refunded'
              ? 'bg-white text-slate-900 shadow-2xs font-black'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Đơn hoàn tiền ({hasData ? 8 : 0})
        </button>
      </div>

      {/* 4. Filter Inputs Row */}
      <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
          {/* Search order code */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              placeholder="#BX-ORD-2024-..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-mono text-slate-800 text-xs outline-none focus:bg-white focus:border-[#9c3808]"
            />
          </div>

          {/* Supermarket partner dropdown */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedPartner}
              onChange={(e) => setSelectedPartner(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-slate-200 font-bold text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="all">🏪 Đối tác: WinMart, Co.op Food, Tops, BHX</option>
              <option value="winmart">WinMart</option>
              <option value="tops">Tops Market</option>
              <option value="coop">Co.op Food</option>
              <option value="bhx">Bách Hóa Xanh</option>
            </select>
          </div>

          {/* Date range */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedDateRange}
              onChange={(e) => setSelectedDateRange(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-white rounded-xl border border-slate-200 font-medium text-slate-700 outline-none focus:border-[#9c3808] cursor-pointer"
            >
              <option value="oct2024">📅 01/10/2024 - 31/10/2024</option>
              <option value="today">📅 Hôm nay</option>
              <option value="7d">📅 7 ngày qua</option>
            </select>
          </div>

          {/* Status filter */}
          <div className="w-full sm:w-auto">
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 font-bold outline-none cursor-pointer"
            >
              <option value="mismatch">● Trạng thái: Sai lệch giá (-12,000 đ)</option>
              <option value="all">Tất cả trạng thái</option>
              <option value="matched">● Khớp chuẩn</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              setSearchCode('')
              setSelectedPartner('all')
              setSelectedStatusFilter('all')
              showToast('Đã xóa tất cả bộ lọc đối soát.')
            }}
            className="text-orange-600 font-bold hover:underline cursor-pointer text-xs"
          >
            Xóa bộ lọc
          </button>
          <button
            type="button"
            onClick={() => showToast('Đã lưu cấu hình bộ lọc đối soát!')}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold transition-all flex items-center gap-1 cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
            <span>Lưu bộ lọc</span>
          </button>
        </div>
      </div>

      {/* 5. Two-Column Layout */}
      {filteredOrders.length === 0 ? (
        <div className="p-12 bg-white rounded-3xl border border-slate-200/90 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-800">Chưa có đơn hàng hoặc biên bản đối soát</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Khi hệ thống ghi nhận đơn đi chợ qua siêu thị đối tác hoặc phát hiện lệch giá, thông tin sẽ hiển thị tại đây.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsManualOrderModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 mx-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tạo đơn bù thủ công</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: Orders List Table */}
          <div className="lg:col-span-7 space-y-3">
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-3.5 w-10 text-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-slate-300 accent-[#9c3808] cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-3.5">MÃ ĐƠN &amp; GIỜ</th>
                      <th className="py-3 px-3.5">KHÁCH HÀNG</th>
                      <th className="py-3 px-3.5">CÔNG THỨC &amp; MÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((ord) => {
                      const isSelected = ord.id === activeOrderId
                      const isChecked = selectedOrderCheckboxes.includes(ord.id)

                      return (
                        <tr
                          key={ord.id}
                          onClick={() => setActiveOrderId(ord.id)}
                          className={`transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-orange-50/40 ring-1 ring-orange-300 font-medium'
                              : 'hover:bg-slate-50/70'
                          }`}
                        >
                          {/* Checkbox */}
                          <td
                            className="py-3.5 px-3.5 text-center"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrderCheckboxes((prev) =>
                                prev.includes(ord.id)
                                  ? prev.filter((id) => id !== ord.id)
                                  : [...prev, ord.id]
                              )
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 rounded border-slate-300 accent-[#9c3808] cursor-pointer"
                            />
                          </td>

                          {/* Code & Time */}
                          <td className="py-3.5 px-3.5 space-y-1">
                            <div className="flex items-center gap-1.5 font-mono text-xs font-black text-slate-900">
                              <span>{ord.code}</span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCopyCode(ord.code)
                                }}
                                className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                title="Sao chép mã đơn"
                              >
                                {isCopiedCode && isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              {ord.orderTime}
                            </div>
                            {ord.isMismatch && (
                              <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                                ⚠ Lệch ({ord.mismatchAmount?.toLocaleString()} đ)
                              </span>
                            )}
                          </td>

                          {/* Customer */}
                          <td className="py-3.5 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-9 h-9 rounded-full bg-gradient-to-br ${ord.avatarBg} text-white font-bold flex items-center justify-center text-xs shadow-2xs shrink-0`}
                              >
                                {ord.customerAvatar}
                              </div>
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-bold text-slate-900 truncate">
                                  {ord.customerName}
                                </div>
                                <div className="text-[11px] text-slate-500 font-mono">
                                  {ord.customerPhone}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Recipe & Dish */}
                          <td className="py-3.5 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={ord.recipeImage}
                                alt={ord.recipeTitle}
                                className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                              />
                              <div className="space-y-0.5 min-w-0">
                                <div className="font-bold text-slate-800 text-[11px] line-clamp-1">
                                  {ord.recipeTitle}
                                </div>
                                <div className="text-[10px] text-slate-500 font-medium">
                                  {ord.skuCount} SKU nguyên liệu
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Table pagination */}
              <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span>
                    Hiển thị <strong>{filteredOrders.length > 0 ? 1 : 0} - {filteredOrders.length}</strong> trên{' '}
                    <strong>{hasData ? '1,441' : 0}</strong> đơn hàng
                  </span>
                  <span>|</span>
                  <span>Dòng/trang:</span>
                  <select
                    defaultValue="10"
                    className="px-2 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-800 outline-none cursor-pointer"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white text-slate-400 flex items-center justify-center cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    className="w-7 h-7 rounded-lg bg-[#9c3808] text-white font-bold flex items-center justify-center shadow-xs"
                  >
                    1
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Chuyển đến trang 2...')}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Chuyển đến trang 3...')}
                    className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                  >
                    3
                  </button>
                  <span className="px-0.5 text-slate-400">...</span>
                  <button
                    type="button"
                    onClick={() => showToast('Chuyển đến trang 145...')}
                    className="px-1.5 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer"
                  >
                    145
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Chuyển đến trang tiếp theo...')}
                    className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Reconciliation Detail Drawer */}
          <div className="lg:col-span-5 space-y-4">
            {activeOrder ? (
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg p-5 space-y-4">
                {/* Drawer Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900">Chi tiết Đối soát Đơn</h3>
                      {activeOrder.isMismatch && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          Lệch ({activeOrder.mismatchAmount?.toLocaleString()} đ)
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-bold text-slate-500 mt-0.5">
                      {activeOrder.code}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => showToast('Đóng ngăn chi tiết.')}
                    className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Partner & Customer Metadata */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Siêu thị đối tác:</span>
                    <strong className="text-slate-900 font-bold">
                      {activeOrder.supermarket} ({activeOrder.supermarketCode})
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Khách hàng:</span>
                    <strong className="text-slate-900 font-bold">
                      {activeOrder.customerName} - {activeOrder.customerPhone}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Phương thức:</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      {activeOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Thời gian đặt &amp; chốt:</span>
                    <span className="font-mono text-slate-700 font-semibold">
                      {activeOrder.reconciliationTime}
                    </span>
                  </div>
                </div>

                {/* Cash Flow Breakdown */}
                <div className="space-y-2">
                  <div className="text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    HẠCH TOÁN DÒNG TIỀN ĐƠN HÀNG
                  </div>
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Tổng khách thanh toán:</span>
                      <strong className="text-sm font-black font-mono text-slate-900">
                        {activeOrder.totalCustomerPaid.toLocaleString()} đ
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">Giá gốc siêu thị (Cost):</span>
                      <span className="font-mono font-bold text-slate-700">
                        {activeOrder.supermarketCost.toLocaleString()} đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-700 font-bold">
                      <span>Phí hoa hồng nền tảng (8.5%):</span>
                      <span className="font-mono">
                        +{activeOrder.platformCommission.toLocaleString()} đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-100">
                      <span>Phí dịch vụ giao hàng (AhaMove):</span>
                      <span className="font-mono">
                        {activeOrder.deliveryFee.toLocaleString()} đ
                      </span>
                    </div>
                  </div>
                </div>

                {/* SKU Items Reconciliation */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-black uppercase text-slate-700 tracking-wider">
                    <span>BÓC TÁCH TỪNG SKU &amp; ĐỐI SOÁT GIÁ</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {activeOrder.skus.length} SKU thực tế
                    </span>
                  </div>

                  <div className="space-y-2">
                    {activeOrder.skus.map((sku) => (
                      <div
                        key={sku.id}
                        className={`p-3 rounded-xl border text-xs space-y-1 ${
                          sku.status === 'mismatch'
                            ? 'bg-rose-50/50 border-rose-200'
                            : 'bg-slate-50/70 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-900">{sku.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">SKU: {sku.sku}</div>
                          </div>
                          {sku.status === 'matched' ? (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5 shrink-0">
                              <Check className="w-2.5 h-2.5" />
                              Đã khớp
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-0.5 shrink-0">
                              ⚠ Lệch ({sku.mismatchDiff?.toLocaleString()} đ)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-0.5">
                          <span>
                            Giá bán: <strong className="font-mono">{sku.price.toLocaleString()} đ</strong>
                          </span>
                          <span>
                            Gốc: <strong className="font-mono text-slate-700">{sku.cost.toLocaleString()} đ</strong>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Audit Recommendation Box */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center gap-1.5 font-black text-amber-950 uppercase text-[11px]">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Khuyến nghị từ AI Audit</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    {activeOrder.mismatchReason || 'Các thông số đơn hàng trùng khớp hoàn toàn với dữ liệu POS siêu thị.'}
                  </p>

                  <div className="space-y-1.5 pt-1">
                    <label className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center gap-2 cursor-pointer hover:bg-amber-50/40 transition-colors">
                      <input
                        type="radio"
                        name="ai_resolution"
                        checked={aiResolution === 'accept_deduct'}
                        onChange={() => setAiResolution('accept_deduct')}
                        className="accent-[#9c3808]"
                      />
                      <span className="font-bold text-slate-800 text-[11px]">
                        Chấp nhận lệch &amp; Khấu trừ công nợ WinMart
                      </span>
                    </label>

                    <label className="p-2.5 rounded-xl bg-white border border-amber-200 flex items-center gap-2 cursor-pointer hover:bg-amber-50/40 transition-colors">
                      <input
                        type="radio"
                        name="ai_resolution"
                        checked={aiResolution === 'request_bill'}
                        onChange={() => setAiResolution('request_bill')}
                        className="accent-[#9c3808]"
                      />
                      <span className="font-bold text-slate-800 text-[11px]">
                        Yêu cầu thu ngân gửi lại ảnh chụp bill giấy
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmOffset}
                      className="px-4 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Xác nhận đối soát &amp; Cấn trừ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => showToast('Đang kết xuất Biên bản đối soát tài chính dạng PDF...')}
                      className="px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>Xuất PDF biên bản</span>
                    </button>
                  </div>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => showToast('Đã gửi thông báo yêu cầu thu ngân siêu thị chụp lại hóa đơn VAT!')}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline transition-colors cursor-pointer"
                    >
                      🧾 Yêu cầu thu ngân chụp lại hóa đơn VAT
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-400">
                Chọn một đơn hàng bên trái để xem biên bản đối soát chi tiết.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manual Order Replenishment Modal */}
      <ManualOrderModal
        isOpen={isManualOrderModalOpen}
        onClose={() => setIsManualOrderModalOpen(false)}
        onOrderCreated={handleManualOrderCreated}
      />
    </div>
  )
}
