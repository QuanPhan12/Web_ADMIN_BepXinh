import { useState } from 'react'
import { auth } from '../../config'
import type { Account } from './models'
import { changeAdminPassword, saveAdminProfile } from './repository'
import { Button, Field, Notice } from './ui'
import { useAction } from './hooks'
import { AiSettingsPanel } from './AiSettingsPanel'

export function AdminSettingsView({ profile }: { profile: Account }) {
  const [name, setName] = useState(profile.name), [bio, setBio] = useState(profile.bio ?? '')
  const [current, setCurrent] = useState(''), [password, setPassword] = useState(''), [confirm, setConfirm] = useState('')
  const action = useAction(), security = useAction()
  async function changePassword() {
    await changeAdminPassword(profile.id, current, password, confirm)
    setCurrent(''); setPassword(''); setConfirm('')
  }
  return <><div className="admin-page-heading"><div><h1>Cài đặt quản trị viên</h1><p>Hồ sơ và bảo mật tài khoản đang đăng nhập.</p></div></div>
    <div className="admin-settings-grid"><section className="admin-panel"><h2>Hồ sơ</h2><p className="admin-muted">{profile.role === 'admin' ? 'Quản trị viên' : 'Kiểm duyệt viên'} · {auth.currentUser?.email}</p>
      <form onSubmit={e => { e.preventDefault(); void action.run(() => saveAdminProfile(profile.id, name, bio)) }}>
        <Field label="Tên hiển thị"><input value={name} onChange={e => setName(e.target.value)} required maxLength={60} disabled={action.busy}/></Field>
        <Field label="Giới thiệu"><textarea value={bio} onChange={e => setBio(e.target.value)} maxLength={200} rows={3} disabled={action.busy}/></Field>
        <Notice error={action.error} success={action.success}/><Button type="submit" className="primary" disabled={action.busy}>Lưu hồ sơ</Button>
      </form></section>
      <section className="admin-panel"><h2>Đổi mật khẩu</h2>{auth.currentUser?.providerData.some(p => p.providerId === 'password') ? <form onSubmit={e => { e.preventDefault(); void security.run(changePassword, 'Đã đổi mật khẩu.') }}>
        <Field label="Mật khẩu hiện tại"><input type="password" autoComplete="current-password" value={current} onChange={e => setCurrent(e.target.value)} required disabled={security.busy}/></Field>
        <Field label="Mật khẩu mới"><input type="password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} minLength={6} maxLength={128} required disabled={security.busy}/></Field>
        <Field label="Nhập lại mật khẩu mới"><input type="password" autoComplete="new-password" value={confirm} onChange={e => setConfirm(e.target.value)} required disabled={security.busy}/></Field>
        <Notice error={security.error} success={security.success}/><Button type="submit" disabled={security.busy}>Đổi mật khẩu</Button>
      </form> : <p className="admin-muted">Quản lý mật khẩu tại nhà cung cấp đăng nhập của bạn.</p>}</section>
    </div>{profile.role === 'admin' && <AiSettingsPanel/>}<section className="admin-panel"><h2>Liên hệ hỗ trợ</h2><p className="admin-muted">Yêu cầu xem xét vi phạm hoặc mở khóa tài khoản:</p><a href="mailto:shuichiakaik5@gmail.com">shuichiakaik5@gmail.com</a></section>
  </>
}
