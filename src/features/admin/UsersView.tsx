import { useMemo, useState } from 'react'
import type { Account, Role } from './models'
import { updateAccount, usersQuery } from './repository'
import { useAction, useLiveList } from './hooks'
import { searchKey, formatDate } from './domain'
import { Button, Field, LoadState, Modal, Notice, SearchField } from './ui'

const roles: Record<Role, string> = { user: 'Người dùng', moderator: 'Kiểm duyệt viên', admin: 'Quản trị viên' }
export function UsersView({ selfId }: { selfId: string }) {
  const [size, setSize] = useState(50), [search, setSearch] = useState(''), [selected, setSelected] = useState<Account | null>(null)
  const q = useMemo(() => usersQuery(size), [size]), list = useLiveList<Account>(q)
  const rows = list.rows.filter(u => searchKey(`${u.name} ${u.handle} ${u.id}`).includes(searchKey(search)))
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">CỘNG ĐỒNG</p><h1>Tài khoản</h1><p>Quản lý quyền và trạng thái truy cập của người dùng Bếp Xinh.</p></div></div>
    <div className="admin-toolbar"><SearchField value={search} onChange={setSearch}/><span className="admin-muted">Đã tải {list.rows.length} tài khoản</span></div>
    <LoadState {...list} empty={!rows.length}/><div className="admin-table-wrap"><table><thead><tr><th>Người dùng</th><th>Quyền</th><th>Trạng thái</th><th>Ngày tạo</th><th>Thao tác</th></tr></thead><tbody>{rows.map(u => <tr key={u.id}><td><strong>{u.name}</strong><small>{u.handle}</small></td><td>{roles[u.role ?? 'user']}</td><td><span className={`admin-badge ${u.status === 'locked' ? 'rejected' : 'approved'}`}>{u.status === 'locked' ? 'Đang khóa' : 'Hoạt động'}</span></td><td>{formatDate(u.createdAt)}</td><td><Button disabled={u.id === selfId} onClick={() => setSelected(u)}>{u.id === selfId ? 'Tài khoản của bạn' : 'Quản lý'}</Button></td></tr>)}</tbody></table></div>
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm 50 tài khoản</Button>}
    {selected && <AccountEditor key={selected.id} account={selected} onClose={() => setSelected(null)}/>}
  </>
}
function AccountEditor({ account, onClose }: { account: Account; onClose: () => void }) {
  const [role, setRole] = useState<Role>(account.role ?? 'user'), [status, setStatus] = useState<'active' | 'locked'>(account.status ?? 'active')
  const [reason, setReason] = useState(account.lockReason ?? ''), action = useAction()
  return <Modal title={`Quản lý ${account.name}`} onClose={onClose} busy={action.busy}>
    <p className="admin-muted admin-break">UID: {account.id}</p><p>{account.bio}</p>
    <form onSubmit={e => { e.preventDefault(); void action.run(() => updateAccount(account, role, status, reason)).then(saved => { if (saved) onClose() }) }}>
      <Field label="Quyền"><select value={role} disabled={action.busy} onChange={e => setRole(e.target.value as Role)}>{Object.entries(roles).map(([r, label]) => <option key={r} value={r}>{label}</option>)}</select></Field>
      <Field label="Trạng thái"><select value={status} disabled={action.busy} onChange={e => setStatus(e.target.value as 'active' | 'locked')}><option value="active">Hoạt động</option><option value="locked">Khóa tài khoản</option></select></Field>
      {status === 'locked' && <Field label="Lý do khóa"><textarea required maxLength={500} rows={3} value={reason} disabled={action.busy} onChange={e => setReason(e.target.value)}/></Field>}
      <Notice error={action.error}/><div className="admin-actions"><Button onClick={onClose} disabled={action.busy}>Hủy</Button><Button type="submit" className="primary" disabled={action.busy}>{action.busy ? 'Đang lưu…' : 'Xác nhận thay đổi'}</Button></div>
    </form>
  </Modal>
}
