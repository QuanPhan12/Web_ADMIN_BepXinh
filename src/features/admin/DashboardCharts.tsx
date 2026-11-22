import type { getMetrics } from './repository'

type Metrics = Awaited<ReturnType<typeof getMetrics>>
export function DashboardCharts({ data, loading }: { data: Metrics | null; loading: boolean }) {
  const statuses = data ? [
    { label: 'Đã xuất bản', count: data.approved, color: 'var(--chart-green)' },
    { label: 'Chờ duyệt', count: data.pending, color: 'var(--bx-accent)' },
    { label: 'Từ chối', count: data.rejected, color: 'var(--chart-red)' },
    { label: 'Đã ẩn', count: data.hidden, color: 'var(--chart-blue)' },
    { label: 'Đã xóa', count: data.deleted, color: 'var(--chart-gray)' },
  ] : []
  const total = statuses.reduce((sum, s) => sum + s.count, 0)
  let cursor = 0
  const gradient = statuses.map(s => { const start = cursor; cursor += total ? s.count / total * 100 : 0; return `${s.color} ${start}% ${cursor}%` }).join(',')
  const max = Math.max(1, ...(data?.daily.map(d => d.count) ?? []))
  const unavailable = <p className="admin-empty" role="status">{loading ? 'Đang tải biểu đồ…' : 'Chưa tải được số liệu.'}</p>
  return <div className="dashboard-charts" aria-busy={loading}>
    <section className="admin-panel dashboard-trend"><header><div><h2>Bài gửi mới</h2><p>{data?.period === 'day' ? 'Hôm nay theo giờ' : data?.period === 'month' ? '30 ngày gần nhất' : '7 ngày gần nhất'} · UTC+7</p></div><span className="chart-total">{data ? data.daily.reduce((sum, d) => sum + d.count, 0).toLocaleString('vi-VN') : '—'} <small>bài</small></span></header>
      {!data ? unavailable : <><div className={`dashboard-bars ${data.daily.length > 7 ? 'dense' : ''}`} role="img" aria-label={`Bài gửi: ${data.daily.map(d => `${d.label}: ${d.count}`).join('; ')}`}>{data.daily.map((d, i) => <div className="chart-column" key={d.label}><div className="chart-track"><span className="chart-value">{d.count > 0 || data.daily.length <= 7 ? d.count : ''}</span><div className={`chart-bar ${i === data.daily.length - 1 ? 'today' : ''}`} style={{ height: `${d.count / max * 100}%` }} title={`${d.label}: ${d.count} bài`}/></div><span className="chart-day">{data.daily.length <= 7 || i % 5 === 0 || i === data.daily.length - 1 ? d.label : ''}</span></div>)}</div>{!data.daily.some(d => d.count > 0) && <p className="chart-note">Chưa có bài gửi trong khoảng này.</p>}</>}
    </section>
    <section className="admin-panel dashboard-distribution"><header><div><h2>Trạng thái công thức</h2><p>Toàn bộ bài gửi</p></div></header>
      {!data ? unavailable : <div className="distribution-content"><div className="dashboard-donut" role="img" aria-label={`Tổng ${total} công thức. ${statuses.map(s => `${s.label}: ${s.count}`).join('; ')}`} style={{ background: total ? `conic-gradient(${gradient})` : 'var(--bx-line)' }}><div><strong>{total.toLocaleString('vi-VN')}</strong><span>công thức</span></div></div><ul className="chart-legend">{statuses.map(s => <li key={s.label}><span className="chart-dot" style={{ background: s.color }}/><span>{s.label}</span><strong>{s.count.toLocaleString('vi-VN')}</strong></li>)}</ul></div>}
    </section>
  </div>
}
