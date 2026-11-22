import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { auditQuery, getMetrics, resolveAuditNames } from './repository'
import type { DashboardPeriod } from './dashboardDomain'
import { useLiveList } from './hooks'
import type { ReviewEvent } from './models'
import { errorMessage, formatDate } from './domain'
import { Button, LoadState, Notice } from './ui'
import { DashboardCharts } from './DashboardCharts'
import { AiStatsView } from './AiStatsView'

export function Dashboard({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate: (tab: 'review' | 'user-reviews' | 'cms' | 'categories' | 'users') => void }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMetrics>> | null>(null)
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [at, setAt] = useState('')
  const [revision, setRevision] = useState(0)
  const [period, setPeriod] = useState<DashboardPeriod>('week')
  useEffect(() => {
    let active = true
    getMetrics(isAdmin, period).then(result => { if (active) { setData(result); setAt(new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Bangkok' })) } })
      .catch(e => { if (active) setError(errorMessage(e)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isAdmin, revision, period])
  return <><div className="admin-page-heading"><div><h1>Tổng quan</h1><p>Nội dung và cộng đồng Bếp Xinh.</p></div><div className="dashboard-refresh">{at && <small>Cập nhật {at}</small>}<Button disabled={loading} onClick={() => { setLoading(true); setError(''); setRevision(x => x + 1) }}><RefreshCw size={16}/>{loading ? 'Đang tải…' : 'Làm mới'}</Button></div></div>
    <Notice error={error}/><div className="admin-metrics">{[['Chờ duyệt', data?.pending], ['Đã xuất bản', data?.approved], ['Banner hiển thị', data?.banners], ...(isAdmin ? [['Tài khoản', data?.users]] : [])].map(([label, count]) => <article key={String(label)}><p>{label}</p><strong>{!data && loading ? '…' : count?.toLocaleString('vi-VN') ?? '—'}</strong></article>)}</div>
    <div className="admin-toolbar"><div className="admin-tabs" aria-label="Khoảng thống kê">{([['day', 'Hôm nay'], ['week', '7 ngày'], ['month', '30 ngày']] as const).map(([value, label]) => <Button key={value} aria-pressed={period === value} className={period === value ? 'selected' : ''} onClick={() => { if (value !== period) { setLoading(true); setError(''); setData(null); setPeriod(value) } }}>{label}</Button>)}</div><small className="admin-muted">Biểu đồ bài gửi theo UTC+7 · Trạng thái là tổng hiện tại</small></div>
    <DashboardCharts data={data} loading={loading}/>
    {isAdmin && <AiStatsView refreshRevision={revision}/>}
    <section className="admin-panel dashboard-work"><div><h2>Hàng đợi kiểm duyệt</h2><p>{data ? `${data.pending} công thức đang chờ xử lý.` : 'Xem nội dung cần kiểm duyệt.'}</p></div><div className="admin-quick-links"><Button className="primary" onClick={() => onNavigate('review')}>Duyệt công thức</Button><Button onClick={() => onNavigate('user-reviews')}>Duyệt đánh giá</Button></div></section>
  </>
}
export function AuditView() {
  const [size, setSize] = useState(50), q = useMemo(() => auditQuery(size), [size]), list = useLiveList<ReviewEvent>(q)
  const [names, setNames] = useState<Awaited<ReturnType<typeof resolveAuditNames>>>({}), [namesError, setNamesError] = useState('')
  useEffect(() => {
    if (list.loading || list.error) return
    let active = true
    resolveAuditNames(list.rows).then(result => { if (active) { setNames(result); setNamesError('') } }).catch(e => { if (active) setNamesError(errorMessage(e)) })
    return () => { active = false }
  }, [list.rows, list.loading, list.error])
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">KIỂM DUYỆT</p><h1>Lịch sử duyệt bài</h1><p>Kết quả và người xử lý được ghi cùng thời điểm cập nhật bài.</p></div></div>
    <Notice error={namesError}/><LoadState {...list} empty={!list.rows.length}/><div className="admin-table-wrap"><table><thead><tr><th>Tên món ăn</th><th>Kết quả</th><th>Người đăng món</th><th>Người duyệt</th><th>Lý do</th><th>Thời gian</th></tr></thead><tbody>{list.rows.map(e => <tr key={e.id}><td className="admin-break">{names[e.id]?.title ?? 'Đang tải tên món…'}<small>Mã món: {e.submissionId}</small></td><td><span className={`admin-badge ${e.decision === 'approve' ? 'approved' : 'rejected'}`}>{e.decision === 'approve' ? 'Duyệt' : 'Từ chối'}</span></td><td>{names[e.id]?.author ?? '…'}</td><td>{names[e.id]?.reviewer ?? '…'}</td><td>{e.reason || '—'}</td><td>{formatDate(e.createdAt)}</td></tr>)}</tbody></table></div>
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm lịch sử</Button>}
  </>
}
