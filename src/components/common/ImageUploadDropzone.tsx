import React, { useState, useRef } from 'react'
import { UploadCloud, Trash2, Check, Link as LinkIcon, RefreshCw, FolderOpen } from 'lucide-react'

export interface PresetImageOption {
  label: string
  url: string
}

export interface ImageUploadDropzoneProps {
  value: string
  onChange: (imageUrl: string) => void
  label?: string
  helperText?: string
  recommendedSize?: string
  aspectRatio?: 'banner' | 'video' | 'square'
  presetImages?: PresetImageOption[]
}

export const ImageUploadDropzone: React.FC<ImageUploadDropzoneProps> = ({
  value,
  onChange,
  label = 'Tải ảnh lên',
  helperText = 'Hỗ trợ định dạng PNG, JPG, WebP (Tối đa 5MB)',
  recommendedSize,
  aspectRatio = 'video',
  presetImages = [],
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [customUrl, setCustomUrl] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setErrorMessage(null)
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Vui lòng chọn định dạng file ảnh hợp lệ (PNG, JPG, WebP, GIF)')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Kích thước ảnh vượt quá 5MB. Vui lòng nén hoặc chọn ảnh nhỏ hơn.')
      return
    }

    setUploadFileName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      if (dataUrl) {
        onChange(dataUrl)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      onChange(customUrl.trim())
      setUploadFileName(null)
      setCustomUrl('')
      setShowUrlInput(false)
      setErrorMessage(null)
    }
  }

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'banner':
        return 'aspect-[3/1] min-h-[140px]'
      case 'square':
        return 'aspect-square max-h-[180px]'
      case 'video':
      default:
        return 'aspect-video min-h-[140px]'
    }
  }

  return (
    <div className="space-y-2">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block font-bold text-slate-800 text-xs">
          {label} {recommendedSize && <span className="font-normal text-slate-400">({recommendedSize})</span>}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[11px] font-bold text-[#9c3808] hover:text-[#832f07] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Chọn từ máy tính</span>
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Đóng URL' : 'Dán link URL'}</span>
          </button>
        </div>
      </div>

      {/* URL Input Box */}
      {showUrlInput && (
        <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in duration-150">
          <input
            type="url"
            placeholder="Dán đường dẫn ảnh: https://... (PNG, JPG, WebP)"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-[#9c3808]"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="px-3 py-1.5 rounded-lg bg-[#9c3808] text-white font-bold text-xs hover:bg-[#832f07] transition-colors cursor-pointer"
          >
            Áp dụng
          </button>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
          }
        }}
      />

      {/* Upload Zone / Live Image Preview */}
      {value ? (
        <div className={`relative rounded-2xl overflow-hidden border-2 border-orange-200 bg-slate-900 group shadow-xs ${getAspectClass()}`}>
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 opacity-90 transition-opacity" />
          
          {/* Top Badge */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-black shadow-xs backdrop-blur-xs">
            <Check className="w-3 h-3" />
            <span>{uploadFileName ? `Đã tải: ${uploadFileName}` : 'Ảnh đã sẵn sàng'}</span>
          </div>

          {/* Action buttons on image */}
          <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-slate-800 text-[11px] font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-[#9c3808]" />
              <span>Đổi ảnh khác</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onChange('')
                setUploadFileName(null)
              }}
              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Xóa ảnh này"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-5 sm:p-6 text-center flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            isDragging
              ? 'border-[#9c3808] bg-orange-50/80 scale-[0.99]'
              : 'border-slate-300 hover:border-orange-300 bg-slate-50/70 hover:bg-orange-50/20'
          }`}
        >
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#9c3808] flex items-center justify-center shadow-xs">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-800 text-xs">
              <span className="text-[#9c3808] underline decoration-orange-300">Tải ảnh từ máy tính</span> hoặc kéo thả file ảnh vào đây
            </p>
            <p className="text-[11px] text-slate-400">{helperText}</p>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              fileInputRef.current?.click()
            }}
            className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Chọn ảnh từ thiết bị</span>
          </button>
        </div>
      )}

      {errorMessage && (
        <p className="text-[11px] font-bold text-rose-600 animate-in fade-in duration-150">
          ⚠️ {errorMessage}
        </p>
      )}

      {/* Preset Library */}
      {presetImages.length > 0 && (
        <div className="pt-1.5 space-y-1.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            Hoặc chọn nhanh từ thư viện gợi ý:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presetImages.map((preset) => {
              const isSelected = value === preset.url
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    onChange(preset.url)
                    setUploadFileName(null)
                    setErrorMessage(null)
                  }}
                  className={`p-1.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer relative group overflow-hidden ${
                    isSelected
                      ? 'border-[#9c3808] bg-orange-50 text-[#9c3808] ring-2 ring-orange-200'
                      : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-14 object-cover rounded-lg mb-1"
                  />
                  <span className="block truncate text-[10px]">{preset.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
