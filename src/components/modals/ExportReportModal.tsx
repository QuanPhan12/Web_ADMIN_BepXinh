import React, { useState } from 'react'
import {
  FileSpreadsheet,
  FileText,
  Printer,
  X,
  Calendar,
  Building2,
  AlertCircle,
  Download,
} from 'lucide-react'
import { exportToExcel, exportToPdf } from '../../utils/exportReport'
import type { ExportReportData } from '../../utils/exportReport'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  reportData: ExportReportData
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
}) => {
  const [isExportingExcel, setIsExportingExcel] = useState(false)
  const [isExportingPdf, setIsExportingPdf] = useState(false)

  if (!isOpen) return null

  const handleExportExcel = () => {
    setIsExportingExcel(true)
    setTimeout(() => {
      exportToExcel(reportData)
      setIsExportingExcel(false)
    }, 400)
  }

  const handleExportPdf = () => {
    setIsExportingPdf(true)
    setTimeout(() => {
      exportToPdf(reportData)
      setIsExportingPdf(false)
    }, 500)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#9c3808]">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Xuất Báo Cáo Tổng Hợp Vận Hành
            </h3>
            <p className="text-xs text-slate-500">
              Executive Operations Report Export
            </p>
          </div>
        </div>

        {/* Current Context Meta */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Kỳ báo cáo:
            </span>
            <strong className="font-bold text-slate-900">{reportData.period}</strong>
          </div>

          <div className="flex items-center justify-between text-slate-700">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              Chi nhánh:
            </span>
            <strong className="font-bold text-slate-900">{reportData.branch}</strong>
          </div>

          {reportData.isEmptyState && (
            <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>Đang ở chế độ dữ liệu trống (0). Báo cáo xuất ra sẽ hiển thị tất cả giá trị là 0.</span>
            </div>
          )}
        </div>

        {/* Export Options Cards */}
        <div className="space-y-3 mb-6">
          {/* Option 1: Excel */}
          <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 hover:bg-emerald-50/70 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Bảng tính Microsoft Excel (.xlsx)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bao gồm 4 Sheet: Chỉ số KPI, Hàng đợi AI Queue, Đối tác Siêu thị, Thói quen ẩm thực.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportExcel}
              disabled={isExportingExcel}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              {isExportingExcel ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang xuất...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải Excel</span>
                </>
              )}
            </button>
          </div>

          {/* Option 2: PDF */}
          <div className="p-4 rounded-2xl border border-rose-200/80 bg-rose-50/30 hover:bg-rose-50/70 transition-all flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Tài liệu Báo cáo PDF (.pdf)
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Bản in định dạng Executive chuẩn, bảng biểu rõ ràng và có đóng dấu xác thực số.
                </p>
              </div>
            </div>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 disabled:opacity-50 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
            >
              {isExportingPdf ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Đang xuất...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Mở chế độ in ấn trình duyệt (Print Preview)</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
