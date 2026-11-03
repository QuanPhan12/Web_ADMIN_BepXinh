import React from 'react'
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

interface CertificateDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CertificateDetailsModal: React.FC<CertificateDetailsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { showToast } = useProfile()
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base tracking-tight">
                  Mutual TLS (mTLS) &amp; HSM Cryptographic Authority
                </h3>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                  ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Chứng thư số X.509 v3 bảo vệ đường truyền phân tán giữa Bếp Xinh và 5 cổng siêu thị
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {/* Certificate Main Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 font-mono">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-slate-500 font-sans font-bold">Mã định danh chứng chỉ:</span>
              <span className="font-black text-[#9c3808]">CERT-BEPXINH-ROOT-CA-2026</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block font-sans">Common Name (CN):</span>
                <span className="font-bold text-slate-800">*.gateway.bepxinh.vn</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Tổ chức cấp phát:</span>
                <span className="font-bold text-slate-800">DigiCert Global Root CA G2</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Thuật toán ký:</span>
                <span className="font-bold text-slate-800">SHA-256 with RSA (4096-bit)</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Chuẩn bảo mật phần cứng:</span>
                <span className="font-bold text-emerald-700">HSM FIPS 140-2 Level 3</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Ngày kích hoạt:</span>
                <span className="font-bold text-slate-700">20/11/2023 - 00:00:00 GMT+7</span>
              </div>
              <div>
                <span className="text-slate-400 block font-sans">Thời hạn hết hạn:</span>
                <span className="font-bold text-slate-700">20/11/2026 - 23:59:59 GMT+7</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <span className="text-slate-400 block font-sans text-[10px]">SHA-256 Fingerprint:</span>
              <p className="text-[10px] text-slate-600 break-all select-all bg-white p-2 rounded-lg border border-slate-200">
                8F:2A:4D:99:C1:47:0E:5B:33:12:77:E9:5A:F4:01:BD:38:9C:20:FE:44:A8:19:D3:5F:82:11:09:A6:B4:72:EE
              </p>
            </div>
          </div>

          {/* 5 Supermarket Ingress Trust List */}
          <div className="space-y-2">
            <span className="font-extrabold text-slate-800 text-[12px] block">
              Danh sách 5 Cổng Gateway Siêu thị Đã Ủy Thác (Mutual TLS Pinned)
            </span>
            <div className="space-y-1.5">
              {[
                { name: 'WinMart+ SAP Gateway', host: 'api.winmart.masangroup.com', tls: 'TLS 1.3 / mTLS OK' },
                { name: 'Co.op Food GraphQL Edge', host: 'graphql.coopfood.vn', tls: 'TLS 1.3 / mTLS OK' },
                { name: 'Tops Market Retail Ingress', host: 'api.topsmarket.vn', tls: 'TLS 1.3 / Pending Handshake' },
                { name: 'Bách Hóa Xanh Stream Hub', host: 'open-api.bachhoaxanh.com', tls: 'TLS 1.3 / mTLS OK' },
                { name: 'AEON Mart Cloud MQTT Broker', host: 'gateway.aeon.com.vn', tls: 'TLS 1.3 / mTLS OK' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between font-mono text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold text-slate-800 font-sans mr-2">{item.name}</span>
                      <span className="text-slate-400">{item.host}</span>
                    </div>
                  </div>
                  <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[10px] font-bold">
                    {item.tls}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => showToast('Tải tệp chứng chỉ CA cert.crt...')}
            className="text-[#9c3808] hover:underline font-bold"
          >
            Tải tệp CA Root Certificate (.pem)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
