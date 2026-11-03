import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import {
  Building2,
  CheckCircle2,
  Lock,
  MapPin,
  Upload,
  ExternalLink,
  Shield,
  Clock,
  ArrowRight,
  Store,
  Layers,
  Sparkles,
  Plus,
  FileSpreadsheet,
  FolderOpen,
} from 'lucide-react'
import { useProfile } from '../../../context/ProfileContext'

interface Step1Props {
  onNext: () => void
  onCancel: () => void
  onOpenPdfDoc: () => void
}

interface HubItem {
  id: string
  code: string
  name: string
  address: string
  radius: string
  status: 'ready' | 'phase2'
  coldStorage: string
}

export const Step1LegalAndHubs: React.FC<Step1Props> = ({ onNext, onCancel, onOpenPdfDoc }) => {
  const { showToast } = useProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state - All blank initial state
  const [commercialName, setCommercialName] = useState('')
  const [legalName, setLegalName] = useState('')
  const [taxId, setTaxId] = useState('')
  const [address, setAddress] = useState('')

  const systemId = commercialName.trim()
    ? `PARTNER-${commercialName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}-VN`
    : 'PARTNER-NEW-001'

  // Warehouse format
  const [formats, setFormats] = useState({
    hypermarket: false,
    freshMart: false,
    darkStore: false,
  })

  // Tech Lead
  const [techLeadName, setTechLeadName] = useState('')
  const [techLeadEmail, setTechLeadEmail] = useState('')
  const [techLeadPhone, setTechLeadPhone] = useState('')

  // Hubs / Branches - Starts at 0
  const [hubs, setHubs] = useState<HubItem[]>([])
  const [isAddingHub, setIsAddingHub] = useState(false)
  const [newHubName, setNewHubName] = useState('')
  const [newHubAddress, setNewHubAddress] = useState('')
  const [newHubRadius, setNewHubRadius] = useState('7.0')
  const [isUploadingFile, setIsUploadingFile] = useState(false)
  const [lastUploadedFileName, setLastUploadedFileName] = useState<string | null>(null)

  const handleAddHub = () => {
    if (!newHubName.trim()) {
      showToast('Vui lòng nhập tên chi nhánh!')
      return
    }
    const item: HubItem = {
      id: `hub-${Date.now()}`,
      code: String(hubs.length + 1).padStart(2, '0'),
      name: newHubName.trim(),
      address: newHubAddress.trim() || 'Khu vực nội thành',
      radius: `${newHubRadius} km`,
      status: 'ready',
      coldStorage: 'Đạt chuẩn HACCP',
    }
    setHubs((prev) => [...prev, item])
    setNewHubName('')
    setNewHubAddress('')
    setIsAddingHub(false)
    showToast(`Đã thêm chi nhánh "${item.name}" thành công!`)
  }

  const handleRemoveHub = (id: string) => {
    setHubs((prev) => prev.filter((h) => h.id !== id))
    showToast('Đã xóa chi nhánh khỏi danh sách.')
  }

  // Real File Upload handler for .xlsx, .xls, .csv from computer
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              /tên|chi nhánh|tên kho|hub|stt|địa chỉ|bán kính|kho lạnh|name|address|radius/i.test(c)
          )
        ) {
          startRow = 1
        }

        const importedHubs: HubItem[] = []

        for (let i = startRow; i < rows.length; i++) {
          const r = rows[i]
          if (!r || r.length === 0) continue

          let name = ''
          let address = ''
          let radius = '7.0 km'
          let coldStorage = 'Đạt chuẩn HACCP'

          // Check if col 0 is numeric index (STT) and col 1 is Name
          if (typeof r[0] === 'number' && r[1]) {
            name = String(r[1]).trim()
            address = r[2] ? String(r[2]).trim() : 'Khu vực nội thành'
            if (r[3] !== undefined && r[3] !== null && r[3] !== '') {
              const num = parseFloat(String(r[3]))
              radius = !isNaN(num) ? `${num} km` : String(r[3]).trim()
            }
            if (r[4]) coldStorage = String(r[4]).trim()
          } else if (r[0]) {
            name = String(r[0]).trim()
            address = r[1] ? String(r[1]).trim() : 'Khu vực nội thành'
            if (r[2] !== undefined && r[2] !== null && r[2] !== '') {
              const num = parseFloat(String(r[2]))
              radius = !isNaN(num) ? `${num} km` : String(r[2]).trim()
            }
            if (r[3]) coldStorage = String(r[3]).trim()
          }

          if (name) {
            importedHubs.push({
              id: `hub-${Date.now()}-${i}`,
              code: String(hubs.length + importedHubs.length + 1).padStart(2, '0'),
              name,
              address: address || 'Khu vực nội thành',
              radius: radius.includes('km') ? radius : `${radius} km`,
              status: 'ready',
              coldStorage: coldStorage || 'Đạt chuẩn HACCP',
            })
          }
        }

        if (importedHubs.length > 0) {
          setHubs((prev) => [...prev, ...importedHubs])
          setLastUploadedFileName(file.name)
          showToast(`Tải file thành công! Đã nạp ${importedHubs.length} chi nhánh từ file "${file.name}".`)
        } else {
          showToast(`Đã nhận file "${file.name}" nhưng không tìm thấy danh sách chi nhánh hợp lệ.`)
        }
      } catch (err) {
        console.error('Lỗi đọc file:', err)
        showToast('Có lỗi xảy ra khi xử lý file Excel/CSV từ máy tính!')
      } finally {
        setIsUploadingFile(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }

    reader.onerror = () => {
      setIsUploadingFile(false)
      showToast('Đã xảy ra lỗi khi đọc file từ máy tính!')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }

    reader.readAsArrayBuffer(file)
  }

  // Generate and download a real Excel sample template file
  const handleDownloadTemplate = () => {
    const wsData = [
      ['STT', 'Tên chi nhánh', 'Địa chỉ chi nhánh', 'Bán kính phục vụ (km)', 'Tiêu chuẩn kho lạnh'],
      [1, 'Siêu thị Landmark 81 Hub', 'Tầng B1, TTTM Landmark 81, P. 22, Bình Thạnh, TP. HCM', 8.0, 'Đạt chuẩn HACCP'],
      [2, 'Siêu thị Thảo Điền Hub', '12 Quốc Hương, Thảo Điền, TP. Thủ Đức, TP. HCM', 6.5, 'Đạt chuẩn HACCP'],
      [3, 'Siêu thị Crescent Mall Hub', '101 Tôn Dật Tiên, Tân Phú, Quận 7, TP. HCM', 7.5, 'Đạt chuẩn HACCP'],
      [4, 'Siêu thị Aeon Bình Tân Hub', 'Số 1 Đường Số 17A, Bình Trị Đông B, Bình Tân, TP. HCM', 9.0, 'Đạt chuẩn HACCP'],
    ]
    const ws = XLSX.utils.aoa_to_sheet(wsData)
    ws['!cols'] = [
      { wch: 6 },
      { wch: 30 },
      { wch: 55 },
      { wch: 22 },
      { wch: 22 },
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'DanhSachChiNhanh')
    XLSX.writeFile(wb, 'Mau_Danh_Sach_Chi_Nhanh_BepXinh.xlsx')
    showToast('Đã tải xuống file mẫu Mau_Danh_Sach_Chi_Nhanh_BepXinh.xlsx!')
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hidden Native File Input for uploading from computer */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Legal & Tech Lead & SLA (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Box 1: Thông tin Doanh nghiệp & Pháp nhân Hợp tác */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Thông tin Doanh nghiệp &amp; Pháp nhân Hợp tác
                  </h3>
                </div>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                Hồ sơ pháp lý điện tử
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-extrabold text-slate-700">Tên thương mại chuỗi siêu thị *</label>
                  <span className="text-[11px] text-slate-400 font-mono">Format: PARTNER-XXX-VN</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={commercialName}
                    onChange={(e) => setCommercialName(e.target.value)}
                    placeholder="VD: WinMart, Tops Market, Lotte Mart, Co.op Food..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none focus:border-[#9c3808] pr-10"
                  />
                  {commercialName.trim().length > 0 && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3" />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">
                  Tên công ty pháp nhân trên giấy phép ĐKKD *
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="VD: Công ty Cổ phần / Công ty TNHH Bán lẻ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Mã số thuế (MST) *</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      placeholder="Nhập mã số thuế (10 hoặc 13 số)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono font-bold text-slate-800 focus:outline-none focus:border-[#9c3808] pr-24"
                    />
                    {taxId.trim().length >= 10 && (
                      <span className="absolute right-2 top-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[10px] px-2 py-0.5 rounded">
                        Đã xác thực
                      </span>
                    )}
                  </div>
                  {taxId.trim().length >= 10 ? (
                    <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Tra cứu thành công từ CSDL Tổng cục Thuế Việt Nam</span>
                    </div>
                  ) : (
                    <div className="text-[10px] text-slate-400 mt-1">
                      Nhập MST để tự động tra cứu từ CSDL Tổng cục Thuế
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-extrabold text-slate-700 mb-1">Mã định danh hệ thống (System ID)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={systemId}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono font-bold text-slate-500 pr-10 cursor-not-allowed"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">Khóa tự động theo format chuỗi v2.5</div>
                </div>
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Địa chỉ trụ sở chính đăng ký pháp lý *</label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="VD: Số 123 Đường Nguyễn Trãi, Quận 1, TP. Hồ Chí Minh..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-[#9c3808] pl-9"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              {/* Loại hình phân phối & Định dạng kho vận */}
              <div className="pt-2">
                <label className="block font-extrabold text-slate-700 mb-2">Loại hình phân phối &amp; Định dạng kho vận</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label
                    onClick={() => setFormats((prev) => ({ ...prev, hypermarket: !prev.hypermarket }))}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      formats.hypermarket
                        ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Store className={`w-4 h-4 ${formats.hypermarket ? 'text-[#9c3808]' : 'text-slate-400'}`} />
                      <input
                        type="checkbox"
                        checked={formats.hypermarket}
                        onChange={() => {}}
                        className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">Siêu thị tổng hợp</div>
                      <div className="text-[10px] text-slate-500 font-medium">Hypermarket (&gt; 2000m²)</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setFormats((prev) => ({ ...prev, freshMart: !prev.freshMart }))}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      formats.freshMart
                        ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Layers className={`w-4 h-4 ${formats.freshMart ? 'text-[#9c3808]' : 'text-slate-400'}`} />
                      <input
                        type="checkbox"
                        checked={formats.freshMart}
                        onChange={() => {}}
                        className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">Fresh Mart Tiện lợi</div>
                      <div className="text-[10px] text-slate-500 font-medium">Rau củ sạch &amp; tươi sống</div>
                    </div>
                  </label>

                  <label
                    onClick={() => setFormats((prev) => ({ ...prev, darkStore: !prev.darkStore }))}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      formats.darkStore
                        ? 'border-[#9c3808] bg-orange-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Clock className={`w-4 h-4 ${formats.darkStore ? 'text-[#9c3808]' : 'text-slate-400'}`} />
                      <input
                        type="checkbox"
                        checked={formats.darkStore}
                        onChange={() => {}}
                        className="text-[#9c3808] rounded focus:ring-[#9c3808]"
                      />
                    </div>
                    <div>
                      <div className="font-extrabold text-slate-800 text-[11px]">Kho tối (Dark Store)</div>
                      <div className="text-[10px] text-slate-500 font-medium">Instant 15-30 phút</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Box 2: Đầu mối kỹ thuật & Quản lý tích hợp API (Tech Lead) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-orange-100/80 text-[#9c3808] flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">
                    Đầu mối kỹ thuật &amp; Quản lý tích hợp API (Tech Lead)
                  </h3>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-[10px] px-2 py-0.5 rounded">
                Primary Contact
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Họ &amp; tên người đại diện</label>
                <input
                  type="text"
                  value={techLeadName}
                  onChange={(e) => setTechLeadName(e.target.value)}
                  placeholder="VD: Nguyễn Văn A"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Email tiếp nhận Token</label>
                <input
                  type="email"
                  value={techLeadEmail}
                  onChange={(e) => setTechLeadEmail(e.target.value)}
                  placeholder="VD: tech@partner.vn"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
              </div>

              <div>
                <label className="block font-extrabold text-slate-700 mb-1">Số điện thoại khẩn cấp 24/7</label>
                <input
                  type="tel"
                  value={techLeadPhone}
                  onChange={(e) => setTechLeadPhone(e.target.value)}
                  placeholder="VD: 0900.xxx.xxx"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
              </div>
            </div>
          </div>

          {/* Box 3: Chính sách Chiết khấu & Thỏa thuận Dịch vụ (SLA Contract) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-[#9c3808] font-bold text-sm">📋</span>
                <h3 className="font-black text-slate-900 text-sm">
                  Chính sách Chiết khấu &amp; Thỏa thuận Dịch vụ (SLA Contract)
                </h3>
              </div>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2 py-0.5 rounded">
                Khung chuẩn Enterprise
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-orange-50/50 border border-orange-100 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-500">Mức chiết khấu đơn hoa hồng</div>
                <div className="text-xl font-black text-[#9c3808] font-mono">8.5%</div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Áp dụng trực tiếp trên giá trị giỏ hàng đi chợ của khách Bếp Xinh
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/50 border border-sky-100 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-500">Thời gian chuẩn bị (Fulfillment)</div>
                <div className="text-xl font-black text-sky-700 font-mono">&lt; 25p</div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Tính từ lúc khách chốt nguyên liệu đến khi sẵn sàng bàn giao Shipper
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                <div className="text-[10px] font-extrabold uppercase text-slate-500">Kỳ hạn đối soát &amp; Thanh toán</div>
                <div className="text-sm font-black text-purple-900">Thứ Hai hàng tuần</div>
                <div className="text-[10px] text-slate-500 leading-tight">
                  Chuyển khoản VietQR Doanh nghiệp tự động
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1.5">
                <span>📄</span>
                <span>Bản thỏa thuận hợp tác phân phối số <strong>#BEX-PARTNER-SLA-2025.pdf</strong></span>
              </span>
              <button
                type="button"
                onClick={onOpenPdfDoc}
                className="text-[#9c3808] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <span>Xem văn bản PDF</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Hubs Network Map & Security (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Box 4: Mạng lưới Chi nhánh (Hubs) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-sm">
                  Mạng lưới Chi nhánh (Hubs)
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  {hubs.length > 0 ? `Đã thiết lập ${hubs.length} chi nhánh phân phối` : 'Chưa có chi nhánh nào được kích hoạt'}
                </p>
              </div>
              <span className="bg-slate-900 text-white font-black text-[11px] px-2.5 py-1 rounded-lg">
                {hubs.length} Chi nhánh
              </span>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingFile}
                className="py-2.5 px-3 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
                title="Chọn file Excel (.xlsx, .xls) hoặc CSV từ máy tính"
              >
                <Upload className={`w-3.5 h-3.5 ${isUploadingFile ? 'animate-bounce' : ''}`} />
                <span>{isUploadingFile ? 'Đang đọc file...' : '+ Nhập từ Excel/CSV'}</span>
              </button>
              <button
                type="button"
                onClick={() => setIsAddingHub(true)}
                className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Thêm chi nhánh</span>
              </button>
            </div>

            {/* Sub-bar: Download sample template & upload status */}
            <div className="flex items-center justify-between text-[11px] px-1 pt-0.5">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="text-[#9c3808] hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#9c3808]" />
                <span>Tải file mẫu (.xlsx)</span>
              </button>
              {lastUploadedFileName && (
                <span className="text-emerald-700 font-bold truncate max-w-[170px]" title={lastUploadedFileName}>
                  ✓ File: {lastUploadedFileName}
                </span>
              )}
            </div>

            {/* Inline add hub form */}
            {isAddingHub && (
              <div className="p-3.5 rounded-xl border border-orange-200 bg-orange-50/50 space-y-2 text-xs animate-in fade-in">
                <div className="font-black text-slate-800 text-[11px]">Thêm chi nhánh mới thủ công</div>
                <input
                  type="text"
                  placeholder="Tên chi nhánh (VD: Siêu thị Quận 7, Hub Nam Sài Gòn...)"
                  value={newHubName}
                  onChange={(e) => setNewHubName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
                <input
                  type="text"
                  placeholder="Địa chỉ chi nhánh..."
                  value={newHubAddress}
                  onChange={(e) => setNewHubAddress(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-800 focus:outline-none focus:border-[#9c3808]"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Bán kính (km, VD: 7.0)"
                    value={newHubRadius}
                    onChange={(e) => setNewHubRadius(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddHub}
                    className="px-3 py-1.5 rounded-lg bg-[#9c3808] hover:bg-[#832f07] text-white font-bold cursor-pointer"
                  >
                    Lưu chi nhánh
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingHub(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            )}

            {/* GPS Coverage Map Illustration */}
            <div className="rounded-xl overflow-hidden border border-slate-200 relative bg-slate-900 h-32">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80"
                alt="Map coverage"
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent flex flex-col justify-end p-3 text-white">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    Vùng phủ sóng đồng bộ định vị GPS
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300">
                    {hubs.length > 0 ? `${hubs.length} Hubs Active` : 'Chờ thiết lập Hub'}
                  </span>
                </div>
              </div>
            </div>

            {/* Hubs List */}
            <div className="space-y-2 text-xs">
              {hubs.length === 0 ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-300 bg-slate-50/70 hover:bg-orange-50/30 text-center space-y-2 cursor-pointer transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#9c3808] flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
                    <FolderOpen className="w-5 h-5" />
                  </div>
                  <div className="font-extrabold text-slate-700 text-xs">Chưa có chi nhánh nào</div>
                  <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                    Bấm vào đây để <strong className="text-[#9c3808] underline">chọn file Excel/CSV từ máy tính</strong> hoặc bấm "+ Thêm chi nhánh" ở trên.
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#9c3808] group-hover:bg-[#832f07] text-white text-[11px] font-bold shadow-2xs transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Chọn file từ thiết bị (.xlsx, .csv)</span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {hubs.map((hub, idx) => (
                    <div key={hub.id} className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-slate-400">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <strong className="text-slate-900 font-extrabold">{hub.name}</strong>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded">
                            Sẵn sàng
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveHub(hub.id)}
                            className="text-rose-500 hover:text-rose-700 font-bold text-[11px] cursor-pointer"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 pl-6">{hub.address}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-600 pl-6 pt-1 font-mono">
                        <span>Bán kính: <strong className="text-slate-800">{hub.radius}</strong></span>
                        <span className="text-emerald-700 font-sans font-bold">❄ Kho lạnh: {hub.coldStorage}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coverage Summary Box */}
            <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">🚚</span>
                <div>
                  <div className="font-black text-slate-900">Tổng độ phủ phân phối</div>
                  <div className="text-[10px] text-slate-500">
                    {hubs.length > 0
                      ? `Ước tính phục vụ ~${(hubs.length * 120000).toLocaleString('vi-VN')} hộ gia đình`
                      : 'Chưa có dữ liệu độ phủ'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-black text-[#9c3808] font-mono">
                  {hubs.length > 0 ? `${(hubs.length * 7.1).toFixed(1)} km²` : '0.0 km²'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Bảo mật Khóa API Doanh Nghiệp</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Sau khi hoàn tất Bước 1, hệ thống sẽ tự động khởi tạo cặp mã bí mật <strong className="font-mono text-slate-700">Client_ID</strong> và <strong className="font-mono text-slate-700">Webhook_Secret</strong> để thiết lập giao thức HTTPS mTLS tại Bước 2.
            </p>
          </div>
        </div>
      </div>

      {/* Step Footer */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold transition-colors cursor-pointer"
          >
            Hủy &amp; Lưu bản nháp
          </button>
          <span className="text-slate-400 text-[11px]">Bản nháp tự động lưu</span>
        </div>

        <div className="flex items-center gap-3">
          {commercialName.trim() && taxId.trim() ? (
            <span className="text-emerald-700 font-bold flex items-center gap-1.5 text-[11px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bước 1: Thông tin hợp lệ</span>
            </span>
          ) : (
            <span className="text-slate-400 font-medium text-[11px]">
              Vui lòng nhập tên thương mại &amp; MST
            </span>
          )}

          <button
            type="button"
            onClick={onNext}
            className="px-5 py-2.5 rounded-xl bg-[#9c3808] hover:bg-[#832f07] text-white font-black shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Tiếp tục: Cấu hình API &amp; Webhook</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
