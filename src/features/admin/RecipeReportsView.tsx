import { useMemo, useState } from 'react'
import { formatDate, searchKey } from './domain'
import { useAction, useLiveList } from './hooks'
import type { Recipe } from './models'
import { RecipeDetail } from './RecipesView'
import { getReportedRecipe, recipeReportsQuery, reportCategories, reportStatusLabels, resolveRecipeReport } from './recipeReports'
import type { RecipeReport, ReportStatus } from './recipeReports'
import { Button, Field, LoadState, Modal, Notice, SearchField } from './ui'

export function RecipeReportsView({ isAdmin }: { isAdmin: boolean }) {
  const [status, setStatus] = useState<ReportStatus>('open'), [size, setSize] = useState(50), [search, setSearch] = useState('')
  const [selected, setSelected] = useState<RecipeReport | null>(null), [recipe, setRecipe] = useState<Recipe | null>(null)
  const q = useMemo(() => recipeReportsQuery(status, size), [status, size]), list = useLiveList<RecipeReport>(q), action = useAction()
  const rows = list.rows.filter(r => searchKey(`${r.recipeTitle} ${r.recipeId} ${r.reason}`).includes(searchKey(search)))
  return <>
    <div className="admin-page-heading"><div><p className="admin-eyebrow">AN TOÀN CỘNG ĐỒNG</p><h1>Báo cáo món</h1><p>Xem phản ánh từ người dùng, kiểm tra công thức và quyết định xử lý.</p></div></div>
    <div className="admin-toolbar"><div className="admin-tabs">{(Object.keys(reportStatusLabels) as ReportStatus[]).map(s => <Button key={s} className={s === status ? 'selected' : ''} onClick={() => { setStatus(s); setSize(50) }}>{reportStatusLabels[s]}</Button>)}</div><SearchField value={search} onChange={setSearch}/></div>
    <Notice error={action.error}/><LoadState {...list} empty={!rows.length}/>
    {rows.map(r => <article key={r.id} className="admin-panel"><h2>{r.recipeTitle || r.recipeId}</h2><strong>{reportCategories[r.category] || r.category}</strong><p className="admin-preserve">{r.reason}</p><p className="admin-muted admin-break">{formatDate(r.createdAt)} · Người báo cáo: {r.reporterId} · Mã món: {r.recipeId}</p>
      {r.status !== 'open' && <p className="admin-preserve">Kết quả: {r.resolutionReason}<br/><small>{r.resolution === 'unavailable' ? 'Món đã được ẩn/xóa trước khi xử lý.' : reportStatusLabels[r.status]} · {formatDate(r.resolvedAt)} · {r.resolvedBy}</small></p>}
      <div className="admin-actions"><Button disabled={action.busy} onClick={() => { void action.run(async () => setRecipe(await getReportedRecipe(r.recipeId)), '') }}>Xem công thức</Button>{isAdmin && r.status === 'open' && <Button onClick={() => setSelected(r)}>Xử lý báo cáo</Button>}</div>
    </article>)}
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm báo cáo</Button>}
    <p className="admin-muted">Đã tải {list.rows.length} báo cáo. Tìm kiếm áp dụng trong danh sách đã tải.</p>
    {selected && <ResolveReport report={selected} onClose={() => setSelected(null)}/>}
    {recipe && <RecipeDetail recipe={recipe} onClose={() => setRecipe(null)}/>}
  </>
}
function ResolveReport({ report, onClose }: { report: RecipeReport; onClose: () => void }) {
  const [reason, setReason] = useState(''), action = useAction()
  async function decide(hide: boolean) { if (await action.run(() => resolveRecipeReport(report, hide, reason))) onClose() }
  return <Modal title="Xử lý báo cáo món" onClose={onClose} busy={action.busy}><h3>{report.recipeTitle}</h3><p className="admin-preserve">{report.reason}</p><p>Ẩn bài sẽ gỡ món khỏi danh sách công khai và banner; tác giả sẽ thấy lý do. Nếu món đã bị ẩn/xóa, báo cáo được ghi nhận đã xử lý.</p><Field label="Kết quả xem xét / lý do ẩn"><textarea rows={3} maxLength={500} value={reason} disabled={action.busy} onChange={e => setReason(e.target.value)}/></Field><Notice error={action.error}/><div className="admin-actions"><Button disabled={action.busy || !reason.trim()} onClick={() => { void decide(false) }}>Không vi phạm</Button><Button className="danger" disabled={action.busy || !reason.trim()} onClick={() => { void decide(true) }}>Ẩn bài và xử lý</Button></div></Modal>
}
