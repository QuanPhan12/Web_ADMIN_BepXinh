import { useMemo, useState } from 'react'
import { Image as ImageIcon, Star } from 'lucide-react'
import type { Recipe, RecipeStatus } from './models'
import { recipeQuery, reviewRecipe, setBanner } from './repository'
import { useAction, useLiveList } from './hooks'
import { searchKey, statusLabels, formatDate } from './domain'
import { Button, Field, LoadState, Modal, Notice, SearchField, StatusBadge } from './ui'

export function RecipesView({ isAdmin, banners = false }: { isAdmin: boolean; banners?: boolean }) {
  const [status, setStatus] = useState<RecipeStatus>(banners ? 'approved' : 'pending')
  const [onlyBanners, setOnlyBanners] = useState(banners), [size, setSize] = useState(50)
  const [search, setSearch] = useState(''), [selected, setSelected] = useState<Recipe | null>(null)
  const q = useMemo(() => recipeQuery(status, size, onlyBanners), [status, size, onlyBanners])
  const list = useLiveList<Recipe>(q), action = useAction()
  const rows = list.rows.filter(r => searchKey(`${r.content?.title} ${r.author?.name} ${r.id}`).includes(searchKey(search)))
  return <>
    <div className="admin-page-heading"><div><p className="admin-eyebrow">NỘI DUNG BẾP XINH</p><h1>{banners ? 'Banner trang chủ' : 'Duyệt công thức'}</h1><p>{banners ? 'Chọn công thức đã duyệt để xuất hiện trong banner của app.' : 'Xem nội dung tác giả gửi và phản hồi kết quả kiểm duyệt.'}</p></div></div>
    <div className="admin-toolbar"><div className="admin-tabs">{!banners && (Object.keys(statusLabels) as RecipeStatus[]).map(s => <Button key={s} className={s === status ? 'selected' : ''} onClick={() => { setStatus(s); setSize(50); setOnlyBanners(false) }}>{statusLabels[s]}</Button>)}</div><SearchField value={search} onChange={setSearch}/></div>
    {banners && <label className="admin-check"><input type="checkbox" checked={onlyBanners} onChange={e => { setOnlyBanners(e.target.checked); setSize(50) }}/>Chỉ hiện bài đang làm banner</label>}
    <Notice error={action.error} success={action.success}/>
    <LoadState {...list} empty={!rows.length}/>
    <div className="admin-recipe-grid">{rows.map(r => <article className="admin-recipe-card" key={r.id}>
      <button className="admin-cover" onClick={() => setSelected(r)} aria-label={`Xem ${r.content?.title}`}>
        {r.content?.cover?.url ? <img src={r.content.cover.url} alt="" loading="lazy"/> : <ImageIcon/>}
        {r.isBanner && <span className="admin-cover-badge"><Star size={13}/>Banner</span>}
      </button>
      <div className="admin-recipe-body"><StatusBadge status={r.status}/><h2><button onClick={() => setSelected(r)}>{r.content?.title || r.id}</button></h2><p>{r.author?.name || r.authorId} · {formatDate(r.submittedAt)}</p><small>{r.content?.cookingMinutes ?? '—'} phút nấu · {r.content?.servings ?? '—'} khẩu phần</small>
        <div className="admin-actions"><Button onClick={() => setSelected(r)}>Xem chi tiết</Button>{isAdmin && r.status === 'approved' && <Button disabled={action.busy} className={r.isBanner ? 'selected' : ''} onClick={() => { void action.run(() => setBanner(r.id, !!r.isBanner, !r.isBanner), r.isBanner ? 'Đã gỡ banner.' : 'Đã chọn làm banner.') }}><Star size={15}/>{r.isBanner ? 'Gỡ banner' : 'Làm banner'}</Button>}</div>
      </div>
    </article>)}</div>
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm 50 bài</Button>}
    <p className="admin-muted">Đã tải {list.rows.length} bài. Tìm kiếm áp dụng trong danh sách đã tải.</p>
    {selected && <RecipeDetail recipe={list.rows.find(r => r.id === selected.id) ?? selected} onClose={() => setSelected(null)}/>}
  </>
}
function RecipeDetail({ recipe: r, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [reason, setReason] = useState(''), action = useAction(), c = r.content
  async function decide(decision: 'approve' | 'reject') {
    if (await action.run(() => reviewRecipe(r.id, decision, reason), 'Đã lưu kết quả kiểm duyệt.')) onClose()
  }
  return <Modal title={c?.title || r.id} onClose={onClose} busy={action.busy}>
    <div className="admin-detail-meta"><StatusBadge status={r.status}/><span>{r.author?.name} · {r.author?.handle}</span></div>
    {c?.cover?.url && <img className="admin-detail-cover" src={c.cover.url} alt={c.title}/>}
    <p className="admin-preserve">{c?.description}</p><p>{c?.preparationMinutes} phút chuẩn bị · {c?.cookingMinutes} phút nấu · {c?.servings} khẩu phần · {c?.difficulty}</p>
    <p className="admin-muted">Bữa ăn: {c?.meals?.join(', ')} · Danh mục: {c?.categories?.join(', ')}</p>
    <h3>Nguyên liệu</h3>{c?.ingredientGroups?.map(g => <section key={g.id}><h4>{g.name}</h4><ul>{c.ingredients.filter(i => i.groupId === g.id).map(i => <li key={i.id}>{i.name} — {i.toTaste ? 'Vừa đủ' : `${i.amount} ${i.unitId}`} {i.note && `(${i.note})`}</li>)}</ul></section>)}
    <h3>Cách làm</h3>{c?.steps?.map((s, n) => <section className="admin-step" key={s.id}><h4>{n + 1}. {s.title || 'Bước nấu'} {s.minutes ? `· ${s.minutes} phút` : ''}</h4><p className="admin-preserve">{s.instruction}</p>{s.tip && <p className="admin-muted">Mẹo: {s.tip}</p>}{s.photo?.url && <img src={s.photo.url} alt={`Bước ${n + 1}`} loading="lazy"/>}</section>)}
    {c?.storageNotes && <><h3>Bảo quản</h3><p className="admin-preserve">{c.storageNotes}</p></>}
    <details><summary>Thông tin bài gửi</summary><p className="admin-muted admin-break">ID: {r.id}<br/>Gửi: {formatDate(r.submittedAt)}<br/>Phiên bản nguyên liệu: {r.catalogVersion}<br/>Bản sửa của: {r.revisionOf || '—'}<br/>Người duyệt: {r.reviewedBy || '—'}<br/>Duyệt: {formatDate(r.reviewedAt)}</p></details>
    {r.reviewReason && <p className="admin-error">Lý do: {r.reviewReason}</p>}
    {r.status === 'pending' && <><Field label="Ghi chú kiểm duyệt / lý do từ chối (bắt buộc khi từ chối)"><textarea maxLength={500} rows={3} value={reason} disabled={action.busy} onChange={e => setReason(e.target.value)}/></Field><Notice error={action.error}/><div className="admin-actions"><Button className="danger" disabled={action.busy || !reason.trim()} onClick={() => { void decide('reject') }}>Từ chối bài</Button><Button className="primary" disabled={action.busy} onClick={() => { void decide('approve') }}>{action.busy ? 'Đang xử lý…' : 'Duyệt và xuất bản'}</Button></div></>}
  </Modal>
}
