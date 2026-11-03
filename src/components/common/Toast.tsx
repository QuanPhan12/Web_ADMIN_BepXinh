import React from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { useProfile } from '../../context/ProfileContext'

export const Toast: React.FC = () => {
  const { toastMessage, clearToast } = useProfile()

  if (!toastMessage) return null

  return (
    <div className="fixed top-5 right-5 z-50 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900/95 text-white shadow-2xl border border-slate-700/80 backdrop-blur-md text-xs font-semibold">
        <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <span className="pr-2">{toastMessage}</span>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-white p-0.5 rounded-lg transition-colors ml-auto"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
