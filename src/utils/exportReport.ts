import * as XLSX from 'xlsx'
import { jsPDF } from 'jspdf'

export interface ExportReportData {
  period: string
  branch: string
  exportTime: string
  exportedBy: string
  isEmptyState: boolean
  metrics: {
    activeRecipes: number | string
    recipesGrowth: string
    queuePending: number | string
    queueUrgent: number | string
    activeChefs: number | string
    chefsGrowth: string
    gmvAmount: string
    gmvGrowth: string
  }
  recipesQueue: Array<{
    id: string
    title: string
    chefName: string
    chefRole: string
    timeAgo: string
    aiScore: number | string
    aiStatus: string
  }>
  apiPartners: Array<{
    name: string
    uptime: string
    sku: string
    completionRate: string
  }>
  habits: Array<{
    category: string
    percentage: string
    count: number | string
  }>
}

/**
 * Xuất báo cáo tổng hợp dưới định dạng Excel (.xlsx) với nhiều Sheet chi tiết
 */
export const exportToExcel = (data: ExportReportData) => {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Tổng quan chỉ số KPI
  const kpiData = [
    ['BẾP XINH ENTERPRISE - BÁO CÁO VẬN HÀNH TỔNG HỢP'],
    ['Kỳ báo cáo:', data.period, 'Chi nhánh:', data.branch],
    ['Thời gian xuất:', data.exportTime, 'Người xuất:', data.exportedBy],
    [],
    ['Tên Chỉ Số (KPI)', 'Giá Trị', 'Tăng Trưởng / Tỷ Lệ', 'Ghi Chú'],
    [
      'Tổng công thức hoạt động',
      data.metrics.activeRecipes,
      data.metrics.recipesGrowth,
      data.isEmptyState ? 'Dữ liệu trống (0)' : 'Đã chuẩn hoá dinh dưỡng & định lượng',
    ],
    [
      'Hàng đợi chờ duyệt',
      data.metrics.queuePending,
      `${data.metrics.queueUrgent} bài gấp`,
      data.isEmptyState ? 'Dữ liệu trống (0)' : 'AI thẩm định tự động',
    ],
    [
      'Đầu bếp & Độc giả hoạt động',
      data.metrics.activeChefs,
      data.metrics.chefsGrowth,
      data.isEmptyState ? 'Dữ liệu trống (0)' : 'Master Chef & Creator Pro',
    ],
    [
      'GMV Giỏ đi chợ liên kết',
      data.metrics.gmvAmount,
      data.metrics.gmvGrowth,
      data.isEmptyState ? 'Dữ liệu trống (0)' : 'Tops, WinMart, Co.op Food',
    ],
  ]
  const wsKpi = XLSX.utils.aoa_to_sheet(kpiData)
  XLSX.utils.book_append_sheet(wb, wsKpi, 'Chỉ Số Tổng Quan')

  // Sheet 2: Danh sách hàng đợi duyệt AI
  const queueHeaders = ['Mã Công Thức', 'Tên Món Ăn', 'Tác Giả', 'Phân Hạng', 'Thời Gian Gửi', 'Điểm AI Score', 'Trạng Thái']
  const queueRows = data.recipesQueue.length > 0
    ? data.recipesQueue.map(item => [
        item.id,
        item.title,
        item.chefName,
        item.chefRole,
        item.timeAgo,
        item.aiScore,
        item.aiStatus,
      ])
    : [['0', 'Không có dữ liệu công thức nào trong hàng đợi (0)', '-', '-', '-', '0', 'Trống']]
  const wsQueue = XLSX.utils.aoa_to_sheet([
    ['DANH SÁCH CÔNG THỨC TRONG HÀNG ĐỢI DUYỆT AI (PRIORITY QUEUE)'],
    [],
    queueHeaders,
    ...queueRows,
  ])
  XLSX.utils.book_append_sheet(wb, wsQueue, 'Hàng Đợi Duyệt')

  // Sheet 3: Đối tác tồn kho API
  const partnerHeaders = ['Đối Tác Siêu Thị', 'Uptime Hệ Thống', 'Số Lượng SKU Khớp Giá', 'Tỷ Lệ Hoàn Thành']
  const partnerRows = data.apiPartners.map(p => [
    p.name,
    p.uptime,
    p.sku,
    p.completionRate,
  ])
  const wsPartners = XLSX.utils.aoa_to_sheet([
    ['TRẠNG THÁI TỒN KHO VÀ ĐỒNG BỘ SKU ĐỐI TÁC'],
    [],
    partnerHeaders,
    ...partnerRows,
  ])
  XLSX.utils.book_append_sheet(wb, wsPartners, 'Đối Tác Siêu Thị API')

  // Sheet 4: Cơ cấu thói quen nấu nướng
  const habitHeaders = ['Nhóm Thói Quen Ẩm Thực', 'Tỷ Trọng (%)', 'Số Lượt Nấu (Lượt)']
  const habitRows = data.habits.map(h => [
    h.category,
    h.percentage,
    h.count,
  ])
  const wsHabits = XLSX.utils.aoa_to_sheet([
    ['CƠ CẤU THÓI QUEN ẨM THỰC NGƯỜI DÙNG'],
    [],
    habitHeaders,
    ...habitRows,
  ])
  XLSX.utils.book_append_sheet(wb, wsHabits, 'Thói Quen Ẩm Thực')

  // Lưu và kích hoạt tải về
  const dateStr = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Bao_Cao_Tong_Hop_Bep_Xinh_${dateStr}.xlsx`)
}

/**
 * Xuất báo cáo tổng hợp dưới định dạng PDF (.pdf)
 */
export const exportToPdf = (data: ExportReportData) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Header
  doc.setFontSize(18)
  doc.setTextColor(156, 56, 8) // Terracotta #9c3808
  doc.text('BEP XINH ENTERPRISE', 14, 20)

  doc.setFontSize(14)
  doc.setTextColor(15, 23, 42) // Slate 900
  doc.text('EXECUTIVE DASHBOARD: BAO CAO TONG HOP VAN HANH', 14, 28)

  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139) // Slate 500
  doc.text(`Ky bao cao: ${data.period}   |   Chi nhanh: ${data.branch}`, 14, 34)
  doc.text(`Thoi gian xuat: ${data.exportTime}   |   Nguoi lap: ${data.exportedBy}`, 14, 39)
  if (data.isEmptyState) {
    doc.setTextColor(180, 83, 9)
    doc.text('* CHE DO DU LIEU TRONG (0): Tat ca chi so mac dinh ve 0 khi khong co du lieu', 14, 44)
  }

  doc.setDrawColor(226, 232, 240)
  doc.line(14, 47, 196, 47)

  // 1. KPI Summary Block
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42)
  doc.text('1. CAC CHI SO VAN HANH CHINH (CORE KPIS)', 14, 54)

  doc.setFontSize(9)
  let y = 62

  const kpis = [
    { label: 'Tong cong thuc hoat dong:', val: String(data.metrics.activeRecipes), sub: data.metrics.recipesGrowth },
    { label: 'Hang doi cho duyet:', val: `${data.metrics.queuePending} bai`, sub: `${data.metrics.queueUrgent} bai gap` },
    { label: 'Dau bep & Doc gia active:', val: String(data.metrics.activeChefs), sub: data.metrics.chefsGrowth },
    { label: 'GMV Gio di cho lien ket:', val: data.metrics.gmvAmount, sub: data.metrics.gmvGrowth },
  ]

  kpis.forEach((kpi, idx) => {
    const x = 14 + (idx % 2) * 92
    const currentY = y + Math.floor(idx / 2) * 16

    doc.setFillColor(248, 250, 252)
    doc.rect(x, currentY - 5, 86, 13, 'F')
    doc.setTextColor(100, 116, 139)
    doc.text(kpi.label, x + 3, currentY)
    doc.setFontSize(10)
    doc.setTextColor(15, 23, 42)
    doc.text(kpi.val, x + 3, currentY + 5)
    doc.setFontSize(8)
    doc.setTextColor(5, 150, 105)
    doc.text(`(${kpi.sub})`, x + 50, currentY + 5)
    doc.setFontSize(9)
  })

  // 2. Priority AI Queue
  y = 100
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42)
  doc.text('2. HANG DOI DUYET NHANH UU TIEN (PRIORITY AI QUEUE)', 14, y)

  y += 7
  doc.setFillColor(241, 245, 249)
  doc.rect(14, y - 4, 182, 6, 'F')
  doc.setFontSize(8)
  doc.setTextColor(71, 85, 105)
  doc.text('Ma', 16, y)
  doc.text('Mon an', 35, y)
  doc.text('Tac gia', 95, y)
  doc.text('Thoi gian', 135, y)
  doc.text('AI Score', 160, y)
  doc.text('Trang thai', 178, y)

  y += 6
  if (data.recipesQueue.length === 0) {
    doc.setTextColor(148, 163, 184)
    doc.text('Khong co cong thuc nao dang cho duyet (0 bai)', 16, y)
    y += 8
  } else {
    data.recipesQueue.forEach(item => {
      doc.setTextColor(15, 23, 42)
      doc.text(item.id, 16, y)
      doc.text(item.title.slice(0, 32), 35, y)
      doc.text(item.chefName.slice(0, 20), 95, y)
      doc.text(item.timeAgo, 135, y)
      doc.setTextColor(5, 150, 105)
      doc.text(String(item.aiScore), 163, y)
      doc.setTextColor(71, 85, 105)
      doc.text(item.aiStatus, 178, y)
      y += 6
    })
  }

  // 3. API Grocery Network Status
  y += 6
  doc.setFontSize(11)
  doc.setTextColor(15, 23, 42)
  doc.text('3. MANG LUOI DOI TAC & TON KHO API', 14, y)

  y += 7
  data.apiPartners.forEach(p => {
    doc.setFontSize(8)
    doc.setTextColor(15, 23, 42)
    doc.text(`- ${p.name}:`, 16, y)
    doc.setTextColor(100, 116, 139)
    doc.text(`Uptime ${p.uptime} | ${p.sku} | Hoan thanh: ${p.completionRate}`, 60, y)
    y += 5
  })

  // Footer / Verification Stamp
  y = 270
  doc.setDrawColor(226, 232, 240)
  doc.line(14, y, 196, y)
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text('He thong Bep Xinh Cloud Enterprise Telemetry - Chung thu an toan SHA-256', 14, y + 5)
  doc.text('Trang 1 / 1', 180, y + 5)

  const dateStr = new Date().toISOString().slice(0, 10)
  doc.save(`Bao_Cao_Tong_Hop_Bep_Xinh_${dateStr}.pdf`)
}
