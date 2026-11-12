import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { BookOpen, LayoutDashboard, Leaf, LogOut, Users, History, Images, Menu } from 'lucide-react'
import { auth } from '../../config'
import { BepXinhLogo } from '../../components/icons/BepXinhLogo'
import { useAdminSession } from './hooks'
import { Login } from './Login'
import { Button, Notice } from './ui'
import { RecipesView } from './RecipesView'
import { CatalogView } from './CatalogView'
import { UsersView } from './UsersView'
import { Dashboard, AuditView } from './Overview'
import { errorMessage } from './domain'

const tabs = [
  { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'review', label: 'Duyệt công thức', icon: BookOpen },
  { id: 'cms', label: 'Banner trang chủ', icon: Images },
  { id: 'categories', label: 'Danh mục nguyên liệu', icon: Leaf },
  { id: 'users', label: 'Tài khoản', icon: Users },
  { id: 'audit', label: 'Lịch sử duyệt', icon: History },
] as const
type Tab = typeof tabs[number]['id']
export function AdminApp() {
  const session = useAdminSession()
  const [tab, setTab] = useState<Tab>(() => {
    const value = new URLSearchParams(window.location.search).get('view')
    return tabs.find(t => t.id === value)?.id ?? 'dashboard'
  })
  const [menu, setMenu] = useState(false), [error, setError] = useState('')
  if (session.loading) return <div className="admin-login" role="status">Đang kiểm tra phiên đăng nhập…</div>
  if (!session.profile) return <Login sessionError={session.error}/>
  const profile = session.profile, isAdmin = profile.role === 'admin'
  const visible = tabs.filter(t => isAdmin || ['dashboard', 'review', 'audit'].includes(t.id))
  const active = visible.some(t => t.id === tab) ? tab : 'dashboard'
  function navigate(next: Tab) {
    setTab(next); setMenu(false)
    const url = new URL(window.location.href); url.searchParams.set('view', next); window.history.replaceState(null, '', url)
  }
  return <div className="admin-layout">
    <aside className={`admin-sidebar ${menu ? 'open' : ''}`}><div className="admin-brand"><BepXinhLogo className="w-11 h-11"/><div><strong>Bếp Xinh</strong><small>Trang quản trị</small></div></div>
      <nav aria-label="Quản trị">{visible.map(t => <button key={t.id} aria-current={active === t.id ? 'page' : undefined} onClick={() => navigate(t.id)}><t.icon size={19}/>{t.label}</button>)}</nav>
      <div className="admin-sidebar-footer"><strong>{profile.name}</strong><small>{isAdmin ? 'Quản trị viên' : 'Kiểm duyệt viên'}</small><Button onClick={() => { void signOut(auth).catch(e => setError(errorMessage(e))) }}><LogOut size={17}/>Đăng xuất</Button></div>
    </aside>
    <div className="admin-main"><header className="admin-topbar"><Button className="menu-toggle" aria-label="Mở menu" onClick={() => setMenu(x => !x)}><Menu size={20}/></Button><span>{tabs.find(t => t.id === active)?.label}</span><small>Bếp Xinh · {isAdmin ? 'Admin' : 'Moderator'}</small></header>
      <main className="admin-page" key={`${profile.id}:${active}`}><Notice error={error}/>
        {active === 'dashboard' && <Dashboard isAdmin={isAdmin} onNavigate={navigate}/>}
        {active === 'review' && <RecipesView isAdmin={isAdmin}/>}
        {active === 'cms' && <RecipesView isAdmin={isAdmin} banners/>}
        {active === 'categories' && <CatalogView/>}
        {active === 'users' && <UsersView selfId={profile.id}/>}
        {active === 'audit' && <AuditView/>}
      </main>
    </div>
  </div>
}
