import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, authReady } from '../../config'
import { BepXinhLogo } from '../../components/icons/BepXinhLogo'
import { Button, Field, Notice } from './ui'
import { useAction } from './hooks'

export function Login({ sessionError }: { sessionError: string }) {
  const [email, setEmail] = useState(''), [password, setPassword] = useState('')
  const action = useAction()
  return <main className="admin-login"><form onSubmit={e => { e.preventDefault(); void action.run(async () => { await authReady; await signInWithEmailAndPassword(auth, email.trim(), password) }, 'Đang kiểm tra quyền quản trị…') }}>
    <BepXinhLogo className="w-14 h-14"/>
    <p className="admin-eyebrow">BẾP XINH · QUẢN TRỊ</p><h1>Chào mừng trở lại</h1><p>Đăng nhập bằng tài khoản quản trị Bếp Xinh.</p>
    <Field label="Email"><input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={action.busy}/></Field>
    <Field label="Mật khẩu"><input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={action.busy}/></Field>
    <Notice error={action.error || sessionError}/><Button type="submit" className="primary" disabled={action.busy}>{action.busy ? 'Đang đăng nhập…' : 'Đăng nhập'}</Button>
  </form></main>
}
