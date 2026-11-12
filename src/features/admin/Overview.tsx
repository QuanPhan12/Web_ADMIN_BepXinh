import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { auditQuery, getMetrics } from './repository'
import { useLiveList } from './hooks'
import type { ReviewEvent } from './models'
import { errorMessage, formatDate } from './domain'
import { Button, LoadState, Notice } from './ui'

export function Dashboard({ isAdmin, onNavigate }: { isAdmin: boolean; onNavigate: (tab: 'review' | 'cms' | 'categories' | 'users') => void }) {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMetrics>> | null>(null)
  const [loading, setLoading] = useState(true), [error, setError] = useState(''), [at, setAt] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    getMetrics(isAdmin).then(result => { if (active) { setData(result); setAt(new Date().toLocaleTimeString('vi-VN', { timeZone: 'Asia/Bangkok' })) } })
      .catch(e => { if (active) setError(errorMessage(e)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [isAdmin, revision])
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">BẾP XINH</p><h1>Tổng quan quản trị</h1><p>Theo dõi nội dung và cộng đồng từ dữ liệu Firebase.</p></div><Button disabled={loading} onClick={() => { setLoading(true); setError(''); setRevision(x => x + 1) }}><RefreshCw size={16}/>{loading ? 'Đang tải…' : 'Cập nhật số liệu'}</Button></div>
    <Notice error={error}/><div className="admin-metrics">{[['Chờ duyệt', data?.pending], ['Đã xuất bản', data?.approved], ['Đã từ chối', data?.rejected], ['Đang làm banner', data?.banners], ...(isAdmin ? [['Tài khoản', data?.users]] : [])].map(([label, count]) => <article key={String(label)}><p>{label}</p><strong>{loading ? '…' : count ?? '—'}</strong></article>)}</div>
    {at && <p className="admin-muted">Số liệu cập nhật lúc {at} · Các danh sách nội dung được cập nhật trực tiếp.</p>}
    <section className="admin-panel"><h2>Công việc quản trị</h2><div className="admin-quick-links"><Button onClick={() => onNavigate('review')}>Xem bài chờ duyệt</Button>{isAdmin && <><Button onClick={() => onNavigate('cms')}>Chọn banner Home</Button><Button onClick={() => onNavigate('categories')}>Quản lý nguyên liệu</Button><Button onClick={() => onNavigate('users')}>Quản lý tài khoản</Button></>}</div></section>
  </>
}
export function AuditView() {
  const [size, setSize] = useState(50), q = useMemo(() => auditQuery(size), [size]), list = useLiveList<ReviewEvent>(q)
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">KIỂM DUYỆT</p><h1>Lịch sử duyệt bài</h1><p>Kết quả và người xử lý được ghi cùng thời điểm cập nhật bài.</p></div></div>
    <LoadState {...list} empty={!list.rows.length}/><div className="admin-table-wrap"><table><thead><tr><th>Bài gửi</th><th>Kết quả</th><th>Người duyệt</th><th>Lý do</th><th>Thời gian</th></tr></thead><tbody>{list.rows.map(e => <tr key={e.id}><td className="admin-break">{e.submissionId}</td><td><span className={`admin-badge ${e.decision === 'approve' ? 'approved' : 'rejected'}`}>{e.decision === 'approve' ? 'Duyệt' : 'Từ chối'}</span></td><td className="admin-break">{e.reviewer}</td><td>{e.reason || '—'}</td><td>{formatDate(e.createdAt)}</td></tr>)}</tbody></table></div>
    {!list.loading && !list.error && list.rows.length >= size && <Button onClick={() => setSize(x => x + 50)}>Tải thêm lịch sử</Button>}
  </>
}
