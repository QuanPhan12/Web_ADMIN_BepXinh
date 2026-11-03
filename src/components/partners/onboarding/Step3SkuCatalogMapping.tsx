import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  Download,
  Sliders,
  TrendingDown,
  Layers,
  Upload,
  RefreshCw,
  Building2,
  FileSpreadsheet,
  FolderOpen,
} from 'lucide-react'
import { useProfile } from '../../../context/ProfileContext'

interface SkuItem {
  id: string
  ingredientName: string
  ingredientCode: string
  ingredientGrade: string
  partnerSkuName: string
  partnerSkuCode: string
  conversionRatio: string
  conversionNote: string
  price: string
  isMatched: boolean
}

interface Step3Props {
  onNext: () => void
  onBack: () => void
}

export const Step3SkuCatalogMapping: React.FC<Step3Props> = ({ onNext, onBack }) => {
  const { showToast } = useProfile()
  const skuFileInputRef = useRef<HTMLInputElement>(null)

  // Tabs
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'matched'>('pending')
  const [searchTerm, setSearchTerm] = useState('')

  // Sku items - clean zero-data state
  const [skuItems, setSkuItems] = useState<SkuItem[]>([])
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [uploadedSkuFileName, setUploadedSkuFileName] = useState<string | null>(null)

  // Rule Toggles
  const [rules, setRules] = useState({
    equivalentSku: true,
    gramCombo: true,
    goldenHourSale: false,
  })

  // Simulated AI scan
  const [isScanningAi, setIsScanningAi] = useState(false)

  const handleRunAi = () => {
    if (skuItems.length === 0) {
      showToast('Chưa có danh mục SKU để quét AI. Vui lòng tải file catalogue trước!')
      return
    }
    setIsScanningAi(true)
    setTimeout(() => {
      setIsScanningAi(false)
      showToast('Đã quét lại danh mục! Tỷ lệ khớp AI nâng lên 96.2%.')
    }, 1200)
  }

  // Handle uploading real catalogue file from computer
  const handleSkuFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingFile(true)
    const reader = new FileReader()

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const rows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 })

        if (!rows || rows.length === 0) {
          showToast(`File "${file.name}" trống hoặc không có dữ liệu!`)
          setIsUploadingFile(false)
          return
        }

        // Determine if first row is header
        let startRow = 0
        const headerRow = rows[0]
        if (
          headerRow &&
          headerRow.some(
            (c: any) =>
              typeof c === 'string' &&
              /tên|nguyên liệu|mã|sku|quy đổi|giá|bếp xinh|đối tác|name|code|price/i.test(c)
          )
        ) {
          startRow = 1
        }

        const importedSkus: SkuItem[] = []

        for (let i = startRow; i < rows.length; i++) {
          const r = rows[i]
          if (!r || r.length === 0) continue

          const ingName = r[0] ? String(r[0]).trim() : ''
          const partnerName = r[1] ? String(r[1]).trim() : ingName
          const ratio = r[2] ? String(r[2]).trim() : '1 gói = 500g'
          const priceRaw = r[3] !== undefined && r[3] !== null ? r[3] : '50,000'
          const priceStr = typeof priceRaw === 'number'
            ? `${priceRaw.toLocaleString('vi-VN')} đ/gói`
            : String(priceRaw).includes('đ')
            ? String(priceRaw)
            : `${priceRaw} đ/gói`

          if (ingName || partnerName) {
            importedSkus.push({
              id: `sku-${Date.now()}-${i}`,
              ingredientName: ingName || partnerName,
              ingredientCode: `BX-ING-${String(importedSkus.length + 1).padStart(3, '0')}`,
              ingredientGrade: 'Hạng A chuẩn VietGAP',
              partnerSkuName: partnerName || ingName,
              partnerSkuCode: `SKU: PRT-${String(importedSkus.length + 1001)}`,
              conversionRatio: ratio,
              conversionNote: 'Tỷ lệ 1:1 (Chuẩn)',
              price: priceStr,
              isMatched: true,
            })
          }
        }

        if (importedSkus.length > 0) {
          setSkuItems((prev) => [...prev, ...importedSkus])
          setUploadedSkuFileName(file.name)
          setActiveTab('all')
          showToast(`Tải file thành công! Đã nạp ${importedSkus.length} SKU từ file "${file.name}".`)
        } else {
          showToast(`Không tìm thấy hàng SKU nào hợp lệ trong file "${file.name}".`)
        }
      } catch (err) {
        console.error('Lỗi đọc file SKU:', err)
        showToast('Có lỗi xảy ra khi xử lý file Excel/CSV từ máy tính!')
      } finally {
        setIsUploadingFile(false)
        if (skuFileInputRef.current) skuFileInputRef.current.value = ''
      }
    }

    reader.onerror = () => {
      setIsUploadingFile(false)
      showToast('Đã xảy ra lỗi khi đọc file từ máy tính!')
      if (skuFileInputRef.current) skuFileInputRef.current.value = ''
    }

    reader.readAsArrayBuffer(file)
  }

  // Generate and download a real SKU template file
  const handleDownloadSkuTemplate = () => {
    const wsData = [
      ['Tên nguyên liệu Bếp Xinh', 'Tên sản phẩm / SKU Đối tác', 'Quy cách & Quy đổi', 'Giá niêm yết (VNĐ)'],
      ['Thịt ba chỉ heo rút sườn', 'Thịt heo ba rọi rút sườn 500g', '1 gói = 500g', 95000],
      ['Tiêu xanh tươi Phú Quốc chùm', 'Tiêu hạt xanh đóng khay 100g', '1 khay = 100g', 24000],
      ['Mật ong hoa nhãn nguyên chất', 'Mật ong rừng hoa nhãn 350ml', '1 chai = 350ml', 85000],
      ['Củ sen tươi Thái Lát', 'Sen củ tươi đóng gói chân không 300g', '1 gói = 300g', 32000],
      ['Cá hồi Na Uy phi lê tươi', 'Cá hồi Na Uy phi lê khay 300g', '1 khay = 300g', 185000],
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [
      { wch: 32 },
      { wch: 40 },
      { wch: 22 },
      { wch: 20 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'CatalogueSKU')
    XLSX.writeFile(wb, 'Mau_Catalogue_SKU_BepXinh.xlsx')
    showToast('Đã tải xuống file mẫu Mau_Catalogue_SKU_BepXinh.xlsx!')
  }

  const matchedCount = skuItems.filter((i) => i.isMatched).length
  const pendingCount = skuItems.filter((i) => !i.isMatched).length

  const filteredItems = skuItems.filter((item) => {
    if (activeTab === 'pending') return !item.isMatched
    if (activeTab === 'matched') return item.isMatched
    return true
  }).filter((item) => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    return (
      item.ingredientName.toLowerCase().includes(term) ||
      item.partnerSkuName.toLowerCase().includes(term) ||
      item.ingredientCode.toLowerCase().includes(term) ||
      item.partnerSkuCode.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hidden file input for uploading from computer */}
      <input
        ref={skuFileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleSkuFileUpload}
        className="hidden"
      />

      {/* 4 KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              TỔNG SKU ĐỐI TÁC NẠP
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {skuItems.length.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="pt-1 text-[11px] text-slate-500 font-medium">
            {skuItems.length > 0 ? `+100% từ catalogue đối tác (${skuItems.length} SKU)` : 'Chưa tải lên dữ liệu danh mục'}
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              TỰ ĐỘNG KHỚP BỞI AI
            </span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded font-mono">
              {skuItems.length > 0 ? `${((matchedCount / skuItems.length) * 100).toFixed(1)}%` : '0.0%'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {matchedCount.toLocaleString('vi-VN')}
            </span>
          </div>
          <div className="pt-1 text-[11px] text-slate-500 font-medium flex items-center gap-1">
            {matchedCount > 0 ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600 font-bold">Chuẩn xác tuyệt đối (&gt;95% match)</span>
              </>
            ) : (
              <span>Chưa có SKU được khớp</span>
            )}
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              CẦN ĐỐI SOÁT THỦ CÔNG
            </span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${
              pendingCount > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
            }`}>
              {pendingCount > 0 ? 'Cảnh báo' : 'Bình thường'}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-black tracking-tight font-mono ${
              pendingCount > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}>
              {pendingCount}
            </span>
          </div>
          <div className={`pt-1 text-[11px] font-medium ${
            pendingCount > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'
          }`}>
            {pendingCount > 0 ? `! Cần duyệt dung tích/giá (${pendingCount} SKU)` : 'Không có sai lệch cần duyệt'}
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
              BIẾN ĐỘNG GIÁ THỊ TRƯỜNG
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
              {skuItems.length > 0 ? '-2.4%' : '0.0%'}
            </span>
          </div>
          <div className="pt-1 text-[11px] text-slate-500 font-medium">
            {skuItems.length > 0 ? 'Ưu thế giá: Rẻ hơn 2.4%' : 'Chưa ghi nhận biến động giá'}
          </div>
        </div>
      </div>

      {/* Main Grid: SKU Mapping Table (8 cols) + Rules (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Table & AI Lens Banner */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            {/* Filter Tabs & Search Bar & Upload Actions */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'pending'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Cần duyệt ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-white text-slate-800 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Tất cả ({skuItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('matched')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    activeTab === 'matched'
                      ? 'bg-white text-emerald-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Đã khớp ({matchedCount})
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-52">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, mã SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#9c3808]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => skuFileInputRef.current?.click()}
                  disabled={isUploadingFile}
                  className="px-3 py-1.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-bold text-xs flex items-center gap-1 shadow-2xs transition-all cursor-pointer disabled:opacity-50 shrink-0"
                  title="Tải file Excel / CSV catalogue SKU từ máy tính"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingFile ? 'Đang đọc...' : 'Tải file lên'}</span>
                </button>
              </div>
            </div>

            {/* Sub-bar for Upload Info */}
            <div className="px-4 py-2 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={handleDownloadSkuTemplate}
                className="text-[#9c3808] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#9c3808]" />
                <span>Tải file mẫu Catalogue SKU (.xlsx)</span>
              </button>
              {uploadedSkuFileName && (
                <span className="text-emerald-700 font-bold truncate max-w-[200px]" title={uploadedSkuFileName}>
                  ✓ File: {uploadedSkuFileName} ({skuItems.length} SKU)
                </span>
              )}
            </div>

            {/* Table or Empty State */}
            {skuItems.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#9c3808] flex items-center justify-center mx-auto">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">Chưa có dữ liệu danh mục SKU nào từ đối tác</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Nạp danh mục sản phẩm từ file Excel/CSV từ máy tính hoặc kích hoạt đồng bộ API để bắt đầu ánh xạ và chuẩn hóa nguyên liệu.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => skuFileInputRef.current?.click()}
                    disabled={isUploadingFile}
                    className="px-4 py-2 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Chọn file từ máy tính (.xlsx, .csv)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => showToast('Đang kết nối API đối tác để tải danh mục sản phẩm...')}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Đồng bộ SKU từ API</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px] tracking-wider">
                      <th className="py-3 px-4">NGUYÊN LIỆU BẾP XINH</th>
                      <th className="py-3 px-4">SKU ĐỐI TÁC SIÊU THỊ</th>
                      <th className="py-3 px-4">QUY ĐỔI ĐƠN VỊ</th>
                      <th className="py-3 px-4 text-right">GIÁ NIÊM YẾT &amp; ĐỒNG BỘ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div>
                            <div className="font-extrabold text-slate-900">{item.ingredientName}</div>
                            <div className="text-[10px] font-mono text-slate-400">
                              <span className="text-[#9c3808] font-bold">{item.ingredientCode}</span> • {item.ingredientGrade}
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-800">{item.partnerSkuName}</div>
                          <div className="text-[10px] font-mono text-slate-400">{item.partnerSkuCode}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          <div className="font-bold text-slate-700">{item.conversionRatio}</div>
                          <div className={`text-[10px] font-sans font-bold ${
                            item.isMatched ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {item.conversionNote}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          <div className="font-black text-slate-900">{item.price}</div>
                          {item.isMatched ? (
                            <span className="inline-block px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                              ✔ Đã khớp
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => showToast('Mở hộp thoại điều chỉnh quy đổi dung tích...')}
                              className="inline-block px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-bold hover:bg-rose-200 transition-colors cursor-pointer"
                            >
                              ⚠ Cần xác nhận
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Hiển thị {filteredItems.length} trong tổng số {skuItems.length} SKU</span>
              <div className="flex items-center gap-1 font-mono">
                <button type="button" disabled className="px-2 py-1 rounded border border-slate-200 text-slate-300 cursor-not-allowed">&lt;</button>
                <button type="button" className="px-2 py-1 rounded bg-[#9c3808] text-white font-bold">1</button>
                <button type="button" disabled className="px-2 py-1 rounded border border-slate-200 text-slate-300 cursor-not-allowed">&gt;</button>
              </div>
            </div>
          </div>

          {/* AI Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-emerald-500 bg-white flex items-center justify-center font-mono font-black text-emerald-700 text-xs shadow-xs">
                AI
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-sm">
                  Mô hình AI Bếp Xinh Lens Engine v4
                </h4>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Tự động chuẩn hóa ngữ nghĩa và quy cách đóng gói dựa trên từ điển nguyên liệu Bếp Xinh.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRunAi}
              disabled={isScanningAi}
              className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-all shrink-0 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isScanningAi ? 'animate-spin' : ''}`} />
              <span>{isScanningAi ? 'Đang phân tích...' : 'Chạy lại quét AI'}</span>
            </button>
          </div>
        </div>

        {/* Right: Sync Rules & Partner Profile */}
        <div className="lg:col-span-4 space-y-4 text-xs">
          {/* Card: Quy tắc Đồng bộ & Bảng giá */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#9c3808]" />
                <h3 className="font-black text-slate-900 text-sm">Quy tắc Đồng bộ &amp; Bảng giá</h3>
              </div>
              <span className="bg-slate-100 text-slate-600 font-bold text-[10px] px-2 py-0.5 rounded">
                Tự động áp dụng
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-700">Tần suất đồng bộ tồn kho</span>
                  <span className="text-[#9c3808] font-black font-mono">15 Phút/Lần</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal">
                  Tự động cập nhật số lượng tồn khả dụng tại siêu thị đối tác gần nhất tới khách đặt hàng công thức.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-900">Cảnh báo biến động giá quầy</span>
                  <span className="text-rose-600 font-black font-mono">&gt; 15.0%</span>
                </div>
                <p className="text-[10px] text-rose-800 leading-normal">
                  Tạm ngưng phân phối nguyên liệu nếu chênh lệch giá vượt ngưỡng cho phép, kích hoạt thông báo Admin.
                </p>
                <div className="text-[10px] font-bold text-emerald-700 pt-0.5">
                  Khóa định tuyến đơn tự động: ĐÃ KÍCH HOẠT
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">Tự động SKU thay thế tương đương</div>
                    <div className="text-[10px] text-slate-500">Khi đối tác hết hàng cùng nhãn hàng</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.equivalentSku}
                    onChange={() => setRules((prev) => ({ ...prev, equivalentSku: !prev.equivalentSku }))}
                    className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">Tự động quy đổi gam (Gram) sang combo</div>
                    <div className="text-[10px] text-slate-500">Khớp đơn vị theo công thức nấu ăn</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.gramCombo}
                    onChange={() => setRules((prev) => ({ ...prev, gramCombo: !prev.gramCombo }))}
                    className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
                  <div>
                    <div className="font-bold text-slate-800 text-[11px]">Đồng bộ giá khuyến mại giờ vàng</div>
                    <div className="text-[10px] text-slate-500">Áp dụng flash-sale trực tiếp từ POS đối tác</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.goldenHourSale}
                    onChange={() => setRules((prev) => ({ ...prev, goldenHourSale: !prev.goldenHourSale }))}
                    className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                  />
                </label>
              </div>

              <button
                type="button"
                onClick={() => showToast('Mở bảng cấu hình ma trận công thức quy đổi nâng cao...')}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
              >
                Cấu hình công thức quy đổi nâng cao
              </button>
            </div>
          </div>

          {/* Card: Partner Profile */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 text-xs">Hồ sơ Kết nối Đối tác</h4>
                <div className="font-mono text-[10px] text-slate-400">Trạng thái: Đang cấu hình</div>
              </div>
            </div>

            <div className="space-y-1 font-mono text-[10px] pt-1 border-t border-slate-200/60 text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Tiêu chuẩn đồng bộ:</span>
                <span className="font-bold">GS1 / GTIN Chuẩn hóa</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Bảo chứng tồn kho:</span>
                <span className="font-bold text-emerald-700">Khả dụng 99.4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step Footer */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại: Bước 2</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => showToast('Đang kết xuất tệp đối soát SKU đối tác (.xlsx)...')}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Xuất file đối soát Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Tiếp tục: Sandbox &amp; Kích hoạt</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
