import React, { useState } from 'react'
import { X, FileText, Sparkles } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'
import { ImageUploadDropzone } from '../common/ImageUploadDropzone'

interface AddArticleModalProps {
  isOpen: boolean
  onClose: () => void
  onArticleAdded?: (article: any) => void
}

export const AddArticleModal: React.FC<AddArticleModalProps> = ({
  isOpen,
  onClose,
  onArticleAdded,
}) => {
  const { showToast } = useProfile()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Mẹo vào bếp')
  const [authorName, setAuthorName] = useState('')
  const [authorRole, setAuthorRole] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [seoScore, setSeoScore] = useState<number>(0)
  const [excerpt, setExcerpt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    // auto-generate slug
    const generated = val
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9 ]/g, '')
      .trim()
      .replace(/\s+/g, '-')
    setSlug(generated)

    // calculate dynamic SEO score based on title length
    if (val.trim().length > 10) {
      setSeoScore(Math.min(95, 60 + Math.min(35, val.trim().length)))
    } else if (val.trim().length > 0) {
      setSeoScore(50)
    } else {
      setSeoScore(0)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      showToast('Vui lòng nhập tiêu đề bài viết cẩm nang!')
      return
    }

    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      const newArticle = {
        id: `art-${Date.now()}`,
        title: title.trim(),
        slug: slug.trim() || 'bai-viet-moi',
        category,
        author: authorName.trim() || 'Ban biên tập Bếp Xinh',
        authorRole: authorRole.trim() || 'Quản trị nội dung',
        image: coverImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        views: '0',
        seoScore: seoScore || 85,
        publishedDate: new Date().toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
        status: 'published',
      }

      if (onArticleAdded) {
        onArticleAdded(newArticle)
      }
      showToast(`Đã xuất bản bài viết "${title}" thành công!`)
      onClose()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#9c3808] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">Soạn Thảo Bài Viết &amp; Cẩm Nang Mới</h3>
              <p className="text-xs text-slate-400">Tối ưu chuẩn SEO Onpage và phân phối đa kênh Bếp Xinh</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ soạn thảo"
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tiêu đề bài viết (Title H1) <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="VD: 10 Mẹo bảo quản rau củ tươi giòn suốt 2 tuần..."
              value={title}
              onChange={handleTitleChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none font-bold text-slate-800"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Đường dẫn thân thiện (Slug URL)</label>
            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2 text-slate-500 font-mono text-[11px]">
              <span className="text-slate-400">bepxinh.vn/cam-nang/</span>
              <input
                type="text"
                placeholder="slug-tu-dong"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="bg-transparent flex-1 text-slate-800 font-bold outline-none pl-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Chuyên mục cẩm nang</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                aria-label="Chuyên mục cẩm nang"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 cursor-pointer"
              >
                <option value="Mẹo vào bếp">Mẹo vào bếp</option>
                <option value="Công thức &amp; Bí quyết">Công thức &amp; Bí quyết</option>
                <option value="Dinh dưỡng Eat Clean">Dinh dưỡng Eat Clean</option>
                <option value="Đánh giá thiết bị">Đánh giá thiết bị</option>
                <option value="Nguyên liệu chuẩn">Nguyên liệu chuẩn</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Điểm đánh giá SEO Onpage</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={seoScore}
                  onChange={(e) => setSeoScore(Number(e.target.value))}
                  placeholder="0"
                  className="w-24 px-3 py-2 rounded-xl border border-slate-200 font-mono font-black text-emerald-700 bg-emerald-50"
                />
                <span className="text-slate-500 font-medium">/ 100 điểm chuẩn Google</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tác giả biên soạn</label>
              <input
                type="text"
                placeholder="VD: Nguyễn Văn A..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#9c3808]"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Vai trò / Chức danh</label>
              <input
                type="text"
                placeholder="VD: Biên tập viên ẩm thực..."
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-700 focus:outline-none focus:border-[#9c3808]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô tả ngắn (Meta Description / Excerpt)</label>
            <textarea
              rows={2}
              placeholder="Tóm tắt nội dung hấp dẫn hiển thị trên Google và thẻ mạng xã hội..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:border-[#9c3808] outline-none text-slate-700 text-xs resize-none"
            />
          </div>

          <ImageUploadDropzone
            value={coverImage}
            onChange={(val) => setCoverImage(val)}
            label="Chọn ảnh bìa bài viết từ thiết bị"
            recommendedSize="Khuyến nghị 1200 × 630 px (16:9), Max 5MB"
            aspectRatio="video"
          />

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-[11px]">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Bài viết sẽ được tự động ping sitemap tới Google Search Console và gắn thẻ Schema Recipe Article.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Đang đăng...' : 'Xuất bản bài viết'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
