import { useEffect, useRef } from 'react'
import type { ReactNode, ButtonHTMLAttributes } from 'react'
import { X, Search } from 'lucide-react'
import type { RecipeStatus } from './models'
import { statusLabels } from './domain'

export function Button({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={`admin-button ${className}`} {...props}>{children}</button>
}
export function Notice({ error, success }: { error?: string; success?: string }) {
  return <>{error && <p role="alert" className="admin-error">{error}</p>}{success && <p role="status" className="admin-success">{success}</p>}</>
}
export function SearchField({ value, onChange, placeholder = 'Tìm trong danh sách đã tải…' }: { value: string; onChange: (s: string) => void; placeholder?: string }) {
  return <label className="admin-search"><Search size={18}/><input aria-label={placeholder} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}/></label>
}
export function StatusBadge({ status }: { status: RecipeStatus }) { return <span className={`admin-badge ${status}`}>{statusLabels[status] ?? status}</span> }
export function LoadState({ loading, error, empty, retry }: { loading: boolean; error: string; empty: boolean; retry: () => void }) {
  if (loading) return <p role="status" className="admin-empty">Đang tải dữ liệu Firebase…</p>
  if (error) return <div className="admin-empty"><Notice error={error}/><Button onClick={retry}>Thử lại</Button></div>
  return empty ? <p className="admin-empty">Chưa có dữ liệu phù hợp.</p> : null
}
export function Modal({ title, children, onClose, busy = false }: { title: string; children: ReactNode; onClose: () => void; busy?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => { const el = dialog.current; el?.showModal(); return () => el?.close() }, [])
  return <dialog ref={dialog} className="admin-modal" aria-label={title} onCancel={e => { e.preventDefault(); if (!busy) onClose() }}>
    <header><h2>{title}</h2><Button disabled={busy} aria-label="Đóng" onClick={onClose}><X size={18}/></Button></header>
    {children}
  </dialog>
}
export function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="admin-field"><span>{label}</span>{children}</label> }
