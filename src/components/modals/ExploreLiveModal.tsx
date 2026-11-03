import React from 'react'
import {
  X,
  Sparkles,
  Heart,
  Bookmark,
  ShoppingCart,
  ShieldCheck,
  Star,
} from 'lucide-react'

interface ExploreLiveModalProps {
  isOpen: boolean
  onClose: () => void
  recipeTitle?: string
  chefName?: string
  heroImage?: string
}

export const ExploreLiveModal: React.FC<ExploreLiveModalProps> = ({
  isOpen,
  onClose,
  recipeTitle = 'Thịt ba chỉ nướng mật ong sốt tiêu xanh',
  chefName = 'Hoàng Lan Chef',
  heroImage = '/images/clean_approved_hero.png',
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider">
                Trang Khám Phá • Ứng Dụng Bếp Xinh
              </h3>
              <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Đang hiển thị trực tiếp (Live Feed)</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Smartphone Screen Simulation */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4 bg-slate-50">
          {/* App Header Search */}
          <div className="bg-white p-2.5 rounded-2xl shadow-2xs border border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 flex-1 pl-1">
              <span>🔍</span>
              <span className="truncate text-slate-600 font-medium">Tìm món ngon hôm nay...</span>
            </div>
            <div className="px-2 py-1 rounded-xl bg-orange-50 text-[#9c3808] text-[10px] font-bold">
              Bếp Xinh App
            </div>
          </div>

          {/* Featured Discovery Banner (The Approved Recipe) */}
          <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900 text-white">
            <div className="relative h-56 w-full">
              <img
                src={heroImage}
                alt={recipeTitle}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

              {/* Top Banner Tag */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-[#009b62] text-white text-[10px] font-black uppercase tracking-wider shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-200" />
                  MÓN MỚI KHÁM PHÁ (LIVE)
                </span>
              </div>

              {/* Top Right Save / Share */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:text-rose-400"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                </button>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white"
                >
                  <Bookmark className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Bottom Details Overlay */}
              <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300">
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-400/40">
                    ẨM THỰC 3 MIỀN
                  </span>
                  <span>• 4 khẩu phần</span>
                  <span>• 45 phút</span>
                </div>

                <h4 className="text-base font-black leading-snug drop-shadow-md">
                  {recipeTitle}
                </h4>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-400 text-amber-950 font-bold flex items-center justify-center text-[10px]">
                      HL
                    </div>
                    <span className="text-slate-200 text-xs font-semibold">{chefName}</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  </div>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>5.0 (1,420 lượt xem)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action in Card */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-2">
              <div className="text-[11px] text-slate-300">
                <span className="text-emerald-400 font-bold">● Đang phân phối ưu tiên</span> đến 124,000+ độc giả
              </div>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-[#009b62] hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Mua đủ 4 nguyên liệu</span>
              </button>
            </div>
          </div>

          {/* Live Notification Strip */}
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-emerald-900 font-medium">
                Vị trí: <strong>Banner Trang Nhất mục Khám Phá</strong>
              </span>
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Hạng #1 Xu hướng
            </span>
          </div>

          {/* Feed Preview Below */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
              <span>CÔNG THỨC KHÁM PHÁ CÙNG CHỦ ĐỀ</span>
              <span className="text-xs text-[#9c3808] cursor-pointer">Xem tất cả</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="h-20 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src="/images/thumb_bo_ne.png"
                    alt="Bò né sốt tiêu"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                    }}
                  />
                </div>
                <div className="font-bold text-slate-800 line-clamp-1">Bò né sốt tiêu đen</div>
                <div className="text-[10px] text-slate-400">Bếp Trưởng Mai Anh</div>
              </div>

              <div className="bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                <div className="h-20 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src="/images/thumb_goi_cuon.png"
                    alt="Gỏi cuốn tôm thịt"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/images/recipe_hero_dish.png'
                    }}
                  />
                </div>
                <div className="font-bold text-slate-800 line-clamp-1">Gỏi cuốn tôm thịt</div>
                <div className="text-[10px] text-slate-400">Lê Xuân Healthy</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Đã đồng bộ tự động từ Admin Console</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng xem trước
          </button>
        </div>
      </div>
    </div>
  )
}
