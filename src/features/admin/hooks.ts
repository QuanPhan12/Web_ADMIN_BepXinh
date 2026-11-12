import { useEffect, useMemo, useRef, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import type { Query, DocumentData } from 'firebase/firestore'
import { auth, db } from '../../config'
import type { Account } from './models'
import { errorMessage } from './domain'
import { watchList } from './repository'

export function useAdminSession() {
  const [state, setState] = useState<{ loading: boolean; profile: Account | null; error: string }>({ loading: true, profile: null, error: '' })
  useEffect(() => {
    let stopProfile = () => {}, generation = 0
    const stopAuth = onAuthStateChanged(auth, user => {
      stopProfile(); const current = ++generation
      setState(previous => ({ loading: !!user, profile: null, error: user ? '' : previous.error }))
      if (!user) return
      stopProfile = onSnapshot(doc(db, 'users', user.uid), snap => {
        if (current !== generation) return
        const p = snap.exists() ? snap.data() as Account : null
        if (!p || p.id !== user.uid || !['admin', 'moderator'].includes(p.role ?? '') || (p.status ?? 'active') !== 'active') {
          setState({ loading: false, profile: null, error: 'Tài khoản cần có role admin/moderator và status active để vào trang quản trị.' })
          void signOut(auth)
        } else setState({ loading: false, profile: p, error: '' })
      }, e => { if (current === generation) setState({ loading: false, profile: null, error: errorMessage(e) }) })
    })
    return () => { generation++; stopAuth(); stopProfile() }
  }, [])
  return state
}
export function useLiveList<T>(q: Query<DocumentData>) {
  const [state, setState] = useState<{ source: Query<DocumentData> | null; rows: T[]; loading: boolean; error: string }>({ source: null, rows: [], loading: true, error: '' })
  const [retry, setRetry] = useState(0)
  useEffect(() => {
    return watchList<T>(q, rows => setState({ source: q, rows, loading: false, error: '' }), e => setState({ source: q, rows: [], loading: false, error: errorMessage(e) }))
  }, [q, retry])
  return { ...(state.source === q ? state : { rows: [] as T[], loading: true, error: '' }), retry: () => { setState({ source: null, rows: [], loading: true, error: '' }); setRetry(x => x + 1) } }
}
export function useAction() {
  const lock = useRef(false), mounted = useRef(true)
  const [busy, setBusy] = useState(false), [error, setError] = useState(''), [success, setSuccess] = useState('')
  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  const run = useMemo(() => async (action: () => Promise<void>, message = 'Đã lưu thay đổi.') => {
    if (lock.current) return false
    lock.current = true; setBusy(true); setError(''); setSuccess('')
    try { await action(); if (mounted.current) setSuccess(message); return true }
    catch (e) { if (mounted.current) setError(errorMessage(e)); return false }
    finally { lock.current = false; if (mounted.current) setBusy(false) }
  }, [])
  return { busy, error, success, run }
}
