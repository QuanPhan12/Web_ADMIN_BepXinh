import React, { useState } from 'react'
import {
  Plus,
  Eye,
  FileText,
  Clock,
  TrendingUp,
  Search,
  Filter,
  Download,
  Calendar,
  Edit2,
  Trash2,
  RotateCcw,
  Rocket,
  LayoutGrid,
  List,
} from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { AddBannerModal } from './AddBannerModal'
import { AddArticleModal } from './AddArticleModal'

interface BannerItem {
  id: string
  title: string
  slot: string
  startDate: string
  endDate: string
  status: 'running' | 'draft' | 'hidden'
  ctr: string
  clicks: string
  image: string
  isExpired?: boolean
}

interface ArticleItem {
  id: string
  title: string
  slug: string
  author: string
  authorRole: string
  category: string
  categoryColor: string
  views: string
  seoScore: number
  publishedDate: string
  status: 'published' | 'draft'
  image: string
}



export const CmsManagementView: React.FC = () => {
  const { showToast } = useProfile()
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [bannerTab, setBannerTab] = useState<'all' | 'running' | 'draft' | 'hidden'>('all')
  const [bannerLayout, setBannerLayout] = useState<'grid' | 'list'>('grid')
  
  // Articles filters
  const [articleSearch, setArticleSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticleStatus, setSelectedArticleStatus] = useState('all')
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([])

  // Modals
  const [isAddBannerOpen, setIsAddBannerOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'banner'
      }
    } catch {}
    return false
  })
  const [isAddArticleOpen, setIsAddArticleOpen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return new URLSearchParams(window.location.search).get('modal') === 'article'
      }
    } catch {}
    return false
  })

  const hasBanners = banners.length > 0
  const hasArticles = articles.length > 0

  // Filtered banners
  const filteredBanners = banners.filter((b) => {
    if (bannerTab === 'all') return true
    return b.status === bannerTab
  })

  // Filtered articles
  const filteredArticles = articles.filter((a) => {
    if (selectedCategory !== 'all' && a.category !== selectedCategory) return false
    if (selectedArticleStatus !== 'all' && a.status !== selectedArticleStatus) return false
    if (articleSearch.trim()) {
      const q = articleSearch.toLowerCase().trim()
      const matchTitle = a.title.toLowerCase().includes(q)
      const matchSlug = a.slug.toLowerCase().includes(q)
      const matchAuthor = a.author.toLowerCase().includes(q)
      if (!matchTitle && !matchSlug && !matchAuthor) return false
    }
    return true
  })

  const handleToggleHideBanner = (id: string) => {
    setBanners((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const newStatus = b.status === 'running' ? 'hidden' : 'running'
          showToast(newStatus === 'hidden' ? `Đã ẩn banner "${b.title}"!` : `Đã kích hoạt lại banner "${b.title}"!`)
          return { ...b, status: newStatus }
        }
        return b
      })
    )
  }

  const handleDeleteBanner = (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id))
    showToast('Đã xóa banner khỏi danh sách chiến dịch!')
  }

  const handlePublishDraft = (id: string) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'running', slot: 'Vị trí: Slot #4', clicks: '0 clicks' } : b
      )
    )
    showToast('Đã phát hành banner lên trang chủ thành công!')
  }

  const toggleSelectAllArticles = () => {
    if (selectedArticleIds.length === filteredArticles.length) {
      setSelectedArticleIds([])
    } else {
      setSelectedArticleIds(filteredArticles.map((a) => a.id))
    }
  }

  const toggleSelectOneArticle = (id: string) => {
    if (selectedArticleIds.includes(id)) {
      setSelectedArticleIds(selectedArticleIds.filter((item) => item !== id))
    } else {
      setSelectedArticleIds([...selectedArticleIds, id])
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-w-0">
      {/* Modals */}
      <AddBannerModal
        isOpen={isAddBannerOpen}
        onClose={() => setIsAddBannerOpen(false)}
        onBannerAdded={(newBanner) => {
          setBanners([newBanner, ...banners])
        }}
      />
      <AddArticleModal
        isOpen={isAddArticleOpen}
        onClose={() => setIsAddArticleOpen(false)}
        onArticleAdded={(newArticle) => {
          setArticles([newArticle, ...articles])
        }}
      />

      {/* 1. Header & Actions */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Bếp Xinh Admin</span>
          <span>&rsaquo;</span>
          <span className="text-[#9c3808]">Quản lý Nội dung (CMS)</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Quản lý Nội dung (CMS)
            </h1>
            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-extrabold uppercase tracking-wide shadow-2xs">
              HỆ THỐNG BANNER &amp; CẨM NANG ẨM THỰC
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {(hasBanners || hasArticles) && (
              <button
                type="button"
                onClick={() => {
                  setBanners([])
                  setArticles([])
                  showToast('Đã xóa toàn bộ nội dung CMS và đặt lại toàn bộ thông tin là 0!')
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Xóa dữ liệu (0)</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsAddArticleOpen(true)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>+ Tạo bài viết mới</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddBannerOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Thêm Banner mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Banner hoạt động */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>BANNER HOẠT ĐỘNG</span>
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#9c3808] flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasBanners ? '04' : '0'}
            </span>
            <span className="text-xs font-normal text-slate-400">
              {hasBanners ? '/ 6 vị trí slot' : '/ 0 vị trí slot'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              {hasBanners ? '↗ 6.8% CTR' : '0.0% CTR'}
            </span>
            <span className="text-slate-500 text-[11px] font-medium">
              {hasBanners ? '77.4k clicks' : '0 clicks'}
            </span>
          </div>
        </div>

        {/* Card 2: Bài viết blog / SEO */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>BÀI VIẾT BLOG / SEO</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasArticles ? '184' : '0'}
            </span>
            <span className="text-xs font-normal text-slate-400">bài xuất bản</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              {hasArticles ? '↗ +12 bài mới' : '0 bài mới'}
            </span>
            <span className="text-slate-500 text-[11px] font-medium">tháng này</span>
          </div>
        </div>

        {/* Card 3: Tổng lượt xem (views) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>TỔNG LƯỢT XEM (VIEWS)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasArticles ? '540,200' : '0'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              {hasArticles ? '↗ +14.2%' : '0.0%'}
            </span>
            <span className="text-slate-500 text-[11px] font-medium">vs 30 ngày trước</span>
          </div>
        </div>

        {/* Card 4: Thời gian đọc trung bình */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>THỜI GIAN ĐỌC TB</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
              {hasArticles ? '3m 45s' : '0m 00s'}
            </span>
            <span className="text-xs font-normal text-slate-400">/ phiên</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
              {hasArticles ? '62% hoàn thành' : '0% hoàn thành'}
            </span>
            <span className="text-slate-500 text-[11px] font-medium">Bounce: {hasArticles ? '24%' : '0%'}</span>
          </div>
        </div>
      </div>

      {/* 3. Section 1: Banner Chiến dịch & Khuyến mãi Trang chủ */}
      <div className="space-y-4">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-[#9c3808] rounded-full" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Banner Chiến dịch &amp; Khuyến mãi Trang chủ
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
              Desktop 1440x480 &amp; App Hero
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Tabs */}
            <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs font-bold">
              <button
                type="button"
                onClick={() => setBannerTab('all')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  bannerTab === 'all'
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({banners.length})
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('running')}
                className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  bannerTab === 'running'
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Đang chạy {banners.filter((b) => b.status === 'running').length}</span>
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('draft')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  bannerTab === 'draft'
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bản nháp {banners.filter((b) => b.status === 'draft').length}
              </button>
              <button
                type="button"
                onClick={() => setBannerTab('hidden')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  bannerTab === 'hidden'
                    ? 'bg-white text-slate-900 shadow-2xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã ẩn {banners.filter((b) => b.status === 'hidden').length}
              </button>
            </div>

            {/* Layout Toggle */}
            <div className="p-1 bg-slate-100 rounded-xl flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => setBannerLayout('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  bannerLayout === 'grid' ? 'bg-white text-[#9c3808] shadow-2xs' : 'text-slate-400'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setBannerLayout('list')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  bannerLayout === 'list' ? 'bg-white text-[#9c3808] shadow-2xs' : 'text-slate-400'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBanners.map((banner) => (
            <div
              key={banner.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              {/* Image & Badges */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {banner.status === 'running' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white flex items-center gap-1 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Đang chạy
                    </span>
                  )}
                  {banner.status === 'draft' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-white shadow-xs">
                      Bản nháp
                    </span>
                  )}
                  {banner.status === 'hidden' && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-600 text-white shadow-xs">
                      Đã ẩn
                    </span>
                  )}

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/50 backdrop-blur-xs text-white">
                    {banner.slot}
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                  <h3 className="font-black text-sm tracking-tight line-clamp-1">{banner.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] text-white/80 mt-0.5 font-medium">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {banner.isExpired ? 'Hết hạn ' : ''}
                      {banner.startDate} - {banner.endDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics Bar */}
              <div className="p-3 border-b border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px] font-medium">
                    {banner.isExpired ? 'Hiệu suất CTR cũ:' : 'Hiệu suất CTR:'}
                  </span>
                  <span className="font-mono font-black text-emerald-600 text-xs">
                    {banner.ctr}
                  </span>
                </div>
                <span className="font-mono text-slate-500 text-[11px] font-semibold">
                  {banner.clicks}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="p-2.5 bg-slate-50/70 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => showToast(`Mở trình chỉnh sửa banner "${banner.title}"...`)}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3 text-slate-500" />
                    <span>Sửa</span>
                  </button>

                  {banner.status === 'running' && (
                    <button
                      type="button"
                      onClick={() => handleToggleHideBanner(banner.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-slate-500" />
                      <span>Ẩn</span>
                    </button>
                  )}

                  {banner.status === 'draft' && (
                    <button
                      type="button"
                      onClick={() => handlePublishDraft(banner.id)}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                    >
                      <Rocket className="w-3 h-3" />
                      <span>Đăng</span>
                    </button>
                  )}

                  {banner.status === 'hidden' && (
                    <button
                      type="button"
                      onClick={() => handleToggleHideBanner(banner.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>Kích hoạt lại</span>
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="w-7 h-7 rounded-lg text-rose-500 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {/* If no banners exist */}
          {filteredBanners.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center space-y-3 min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-slate-800 text-sm">Chưa có banner nào</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  {bannerTab === 'all'
                    ? 'Hệ thống chưa có banner quảng cáo trang chủ.'
                    : `Không có banner nào ở trạng thái "${bannerTab}".`}
                </p>
              </div>
            </div>
          )}

          {/* Dotted Card: Add Banner Promo */}
          <div
            onClick={() => setIsAddBannerOpen(true)}
            className="rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-300 bg-slate-50/50 hover:bg-orange-50/20 transition-all p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer min-h-[220px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#9c3808] text-white flex items-center justify-center shadow-xs">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-black text-slate-900 text-sm">Thêm Banner Quảng Cáo Mới</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Hỗ trợ tải lên ảnh PNG/WebP hoặc Video ngắn 16:9
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-orange-100/70 text-[#9c3808] border border-orange-200">
              Khuyến nghị: 1440 × 480 px (Max 2MB)
            </span>
          </div>
        </div>
      </div>

      {/* 4. Section 2: Quản lý Bài viết & Cẩm nang Ẩm thực */}
      <div className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-1 h-5 bg-emerald-600 rounded-full" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Quản lý Bài viết &amp; Cẩm nang Ẩm thực
              </h2>
              <p className="text-xs text-slate-500">
                Tối ưu hóa công cụ tìm kiếm (SEO Onpage) &amp; điều phối nội dung độc giả
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddArticleOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Soạn thảo bài viết mới</span>
          </button>
        </div>

        {/* Filters Bar */}
        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-0">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={articleSearch}
                onChange={(e) => setArticleSearch(e.target.value)}
                placeholder="Tìm kiếm theo tiêu đề, slug URL hoặc từ khóa SEO..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 text-xs outline-none focus:bg-white focus:border-[#9c3808]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Tất cả chuyên mục</option>
              <option value="Mẹo vào bếp">Mẹo vào bếp</option>
              <option value="Công thức & Bí quyết">Công thức & Bí quyết</option>
              <option value="Dinh dưỡng Eat Clean">Dinh dưỡng Eat Clean</option>
              <option value="Đánh giá thiết bị">Đánh giá thiết bị</option>
              <option value="Nguyên liệu chuẩn">Nguyên liệu chuẩn</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedArticleStatus}
              onChange={(e) => setSelectedArticleStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
            </select>

            <button
              type="button"
              onClick={() => showToast('Mở bộ lọc nâng cao thuộc tính SEO...')}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Bộ lọc</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => showToast('Đang kết xuất danh sách bài viết cẩm nang (CSV/Excel)...')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            {filteredArticles.length === 0 ? (
              <div className="py-16 px-6 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-xs">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-md mx-auto">
                  <h3 className="text-base font-black text-slate-800">
                    Chưa có bài viết hoặc cẩm nang ẩm thực nào
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Hệ thống CMS hiện đang trống (0 bài viết). Hãy soạn thảo bài viết chuẩn SEO đầu tiên để chia sẻ cẩm nang nấu ăn &amp; mẹo nhà bếp cho độc giả Bếp Xinh.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddArticleOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Soạn thảo bài viết mới</span>
                  </button>
                </div>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedArticleIds.length === filteredArticles.length && filteredArticles.length > 0}
                        onChange={toggleSelectAllArticles}
                        className="w-4 h-4 rounded border-slate-300 text-[#9c3808] focus:ring-orange-200 cursor-pointer accent-[#9c3808]"
                      />
                    </th>
                    <th className="py-3 px-4">BÀI VIẾT &amp; TIÊU ĐỀ SEO</th>
                    <th className="py-3 px-4">TÁC GIẢ &amp; VAI TRÒ</th>
                    <th className="py-3 px-4">CHUYÊN MỤC</th>
                    <th className="py-3 px-4 text-right">LƯỢT XEM</th>
                    <th className="py-3 px-4 text-center">ĐIỂM SEO</th>
                    <th className="py-3 px-4">NGÀY XUẤT BẢN</th>
                    <th className="py-3 px-4">TRẠNG THÁI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredArticles.map((article) => {
                    const isChecked = selectedArticleIds.includes(article.id)

                    return (
                      <tr
                        key={article.id}
                        onClick={() => toggleSelectOneArticle(article.id)}
                        className={`hover:bg-slate-50/60 transition-colors cursor-pointer ${
                          isChecked ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3.5 px-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectOneArticle(article.id)}
                            className="w-4 h-4 rounded border-slate-300 text-[#9c3808] focus:ring-orange-200 cursor-pointer accent-[#9c3808]"
                          />
                        </td>

                        {/* Col 1: Bài viết & Tiêu đề SEO */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={article.image}
                              alt={article.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                            />
                            <div className="space-y-0.5">
                              <h4 className="font-black text-slate-900 text-sm line-clamp-1">
                                {article.title}
                              </h4>
                              <div className="font-mono text-[11px] text-slate-400 line-clamp-1">
                                slug: {article.slug}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Col 2: Tác giả & Vai trò */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="space-y-0.5">
                            <span className="font-bold text-slate-800 block text-xs">{article.author}</span>
                            <span className="text-[11px] text-slate-400 block">{article.authorRole}</span>
                          </div>
                        </td>

                        {/* Col 3: Chuyên mục */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border whitespace-nowrap ${article.categoryColor}`}>
                            {article.category}
                          </span>
                        </td>

                        {/* Col 4: Lượt xem */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-800">
                          {article.views}
                        </td>

                        {/* Col 5: Điểm SEO */}
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] font-black ${
                            article.seoScore >= 90
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {article.seoScore} / 100
                          </span>
                        </td>

                        {/* Col 6: Ngày xuất bản */}
                        <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                          {article.publishedDate}
                        </td>

                        {/* Col 7: Trạng thái */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-max">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Đã xuất bản</span>
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Pagination */}
          <div className="p-3 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <span>
                Hiển thị <strong>{hasArticles ? `1 - ${filteredArticles.length}` : '0'}</strong> trong tổng số <strong>{hasArticles ? '184' : '0'}</strong> bài viết
              </span>
              <span>|</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 font-bold text-slate-700">
                10 bài / trang
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-400 font-medium cursor-not-allowed text-xs"
              >
                &lsaquo; Trước
              </button>
              <button
                type="button"
                className="w-7 h-7 rounded-lg bg-[#9c3808] text-white font-bold flex items-center justify-center shadow-xs"
              >
                1
              </button>
              <button
                type="button"
                disabled={!hasArticles}
                onClick={() => showToast('Chuyển trang 2...')}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
              >
                2
              </button>
              <button
                type="button"
                disabled={!hasArticles}
                onClick={() => showToast('Chuyển trang 3...')}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
              >
                3
              </button>
              <span className="px-1 text-slate-400">...</span>
              <button
                type="button"
                disabled={!hasArticles}
                onClick={() => showToast('Chuyển trang 19...')}
                className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center cursor-pointer disabled:opacity-40"
              >
                {hasArticles ? 19 : 1}
              </button>
              <button
                type="button"
                disabled={!hasArticles}
                onClick={() => showToast('Chuyển trang tiếp theo...')}
                className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium cursor-pointer text-xs disabled:opacity-40"
              >
                Tiếp &rsaquo;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
