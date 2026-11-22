import { useMemo, useState } from 'react'
import type { Recipe, RecipeStatus, UserReview, UserReviewReport, UserReviewStatus } from './models'
import { recipeQuery } from './repository'
import { findReviewRecipe, moderateUserReview, reviewReportsQuery, userReviewsQuery } from './userReviewRepository'
import { userReviewLabels } from './userReviewDomain'
import { useAction, useLiveList } from './hooks'
import { formatDate, searchKey } from './domain'
import { Button, Field, LoadState, Modal, Notice, SearchField } from './ui'

export function UserReviewsView() {
  const [size, setSize] = useState(50), [search, setSearch] = useState(''), [id, setId] = useState(''), [selected, setSelected] = useState<Recipe | null>(null)
  const [recipeStatus, setRecipeStatus] = useState<RecipeStatus>('approved')
  const q = useMemo(() => recipeQuery(recipeStatus, size), [recipeStatus, size]), list = useLiveList<Recipe>(q), action = useAction()
  const rows = list.rows.filter(r => searchKey(`${r.content?.title} ${r.id}`).includes(searchKey(search)))
  return <>
    <div className="admin-page-heading"><div><p className="admin-eyebrow">CỘNG ĐỒNG</p><h1>Duyệt đánh giá</h1><p>Chọn công thức để duyệt đánh giá và xử lý báo cáo. Chỉ đánh giá đã duyệt được công khai và tính điểm.</p></div></div>
    <div className="admin-toolbar"><SearchField value={search} onChange={setSearch} placeholder="Tìm tên món hoặc mã món…"/><Field label="Trạng thái món"><select value={recipeStatus} onChange={e => { setRecipeStatus(e.target.value as RecipeStatus); setSize(50) }}><option value="approved">Đã xuất bản</option><option value="hidden">Đã ẩn</option><option value="deleted">Đã xóa</option></select></Field></div>
    <details className="admin-panel"><summary>Mở bằng mã món hoặc liên kết (tùy chọn)</summary><p className="admin-muted">Mã món nằm dưới tên món trong bảng. Bạn cũng có thể bấm Xem đánh giá mà không cần nhập mã.</p><form onSubmit={e => { e.preventDefault(); void action.run(async () => setSelected(await findReviewRecipe(id.trim())), '') }}><Field label="Mã món hoặc liên kết chi tiết"><input value={id} onChange={e => setId(e.target.value)} disabled={action.busy}/></Field><button className="admin-button" disabled={action.busy || !id.trim()}>Mở đánh giá</button></form></details>
    <Notice error={action.error}/><LoadState {...list} empty={!rows.length}/>
    <div className="admin-table-wrap"><table><thead><tr><th>Tên món ăn</th><th>Người đăng món</th><th>Thao tác</th></tr></thead><tbody>{rows.map(r => <tr key={r.id}><td>{r.content?.title || r.id}<small className="admin-muted admin-break">Mã món: {r.id}</small></td><td>{r.author?.name || r.authorId}</td><td><Button onClick={() => setSelected(r)}>Xem đánh giá</Button></td></tr>)}</tbody></table></div>
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm công thức</Button>}
    <p className="admin-muted">Đã tải {list.rows.length} công thức. Tìm kiếm áp dụng trong danh sách đã tải; dùng ID để mở công thức khác.</p>
    {selected && <Modal title={`Đánh giá · ${selected.content?.title || selected.id}`} onClose={() => setSelected(null)}><ReviewList key={selected.id} recipeId={selected.id} canModerate={selected.status === 'approved'}/></Modal>}
  </>
}
function ReviewList({ recipeId, canModerate }: { recipeId: string; canModerate: boolean }) {
  const [status, setStatus] = useState<UserReviewStatus>('pending'), [size, setSize] = useState(50), [reports, setReports] = useState<string | null>(null)
  const q = useMemo(() => userReviewsQuery(recipeId, status, size), [recipeId, status, size]), list = useLiveList<UserReview>(q), action = useAction()
  return <>
    <div className="admin-tabs">{(Object.keys(userReviewLabels) as UserReviewStatus[]).map(s => <Button key={s} disabled={action.busy} className={s === status ? 'selected' : ''} onClick={() => { setStatus(s); setSize(50); setReports(null) }}>{userReviewLabels[s]}</Button>)}</div>
    {!canModerate && <p className="admin-muted">Món đã ẩn/xóa: chỉ xem lịch sử đánh giá; không duyệt lại nội dung.</p>}<Notice error={action.error} success={action.success}/><LoadState {...list} empty={!list.rows.length}/>
    {list.rows.map(r => <article className="admin-panel" key={r.id}><h3>{r.name} · {r.stars}/5 ★</h3><p className="admin-preserve">{r.body || '(Không có nhận xét)'}</p><p className="admin-muted admin-break">{formatDate(r.updatedAt)} · {r.uid}</p><div className="admin-actions">
      <Button disabled={action.busy} onClick={() => setReports(reports === r.id ? null : r.id)}>Xem báo cáo</Button>
      {canModerate && r.status !== 'approved' && <Button className="primary" disabled={action.busy} onClick={() => { void action.run(() => moderateUserReview(recipeId, r, 'approve'), 'Đã duyệt đánh giá và cập nhật điểm.') }}>Duyệt đánh giá</Button>}
      {canModerate && r.status !== 'hidden' && <Button className="danger" disabled={action.busy} onClick={() => { void action.run(() => moderateUserReview(recipeId, r, 'hide'), 'Đã ẩn đánh giá và cập nhật điểm.') }}>{r.status === 'pending' ? 'Từ chối / Ẩn' : 'Ẩn đánh giá'}</Button>}
    </div>{reports === r.id && <Reports key={r.id} recipeId={recipeId} uid={r.id}/>}</article>)}
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm đánh giá</Button>}
  </>
}
function Reports({ recipeId, uid }: { recipeId: string; uid: string }) {
  const [size, setSize] = useState(50), q = useMemo(() => reviewReportsQuery(recipeId, uid, size), [recipeId, uid, size]), list = useLiveList<UserReviewReport>(q)
  return <section><h4>Báo cáo vi phạm</h4><LoadState {...list} empty={!list.rows.length}/>{list.rows.map(r => <p className="admin-preserve" key={r.id}>{r.reason}<br/><small className="admin-muted">{formatDate(r.updatedAt)}</small></p>)}{!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm báo cáo</Button>}</section>
}
