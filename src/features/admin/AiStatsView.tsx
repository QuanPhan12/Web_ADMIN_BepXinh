import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { loadAiStats } from './aiRepository'
import type { AiStats } from './aiRepository'
import { Button, Notice } from './ui'

const number = (value: number) => value.toLocaleString('vi-VN')
export function AiStatsView({ refreshRevision = 0 }: { refreshRevision?: number }) {
  const [data, setData] = useState<AiStats | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState(''), [revision, setRevision] = useState(0)
  useEffect(() => {
    let active = true
    loadAiStats().then(value => { if (active) { setData(value); setError('') } }).catch(e => { if (active) setError(e instanceof Error ? e.message : 'Chưa tải được thống kê AI.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [revision, refreshRevision])
  const max = Math.max(1, ...data?.daily.map(day => day.requests) ?? [])
  return <section aria-label="Thống kê chat AI">
    <div className="admin-page-heading"><div><h2>Thống kê chat AI</h2><p>7 ngày gần nhất, gồm hôm nay · UTC+7</p></div><Button disabled={loading} onClick={() => { setLoading(true); setRevision(x => x + 1) }}><RefreshCw size={16}/>Làm mới AI</Button></div>
    <Notice error={error}/>
    {loading && <p role="status">Đang tải thống kê AI…</p>}
    {data && <div aria-busy={loading}>
      <p className="admin-muted">Trợ lý {data.settings.enabled ? 'đang bật' : 'đang tắt'} · {data.settings.model} · Cập nhật {new Date(data.asOf).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' })}</p>
      {data.truncated && <Notice error="Dữ liệu yêu cầu vượt giới hạn 3.500 bản ghi. Các chỉ số yêu cầu/người dùng bên dưới chưa đầy đủ."/>}
      <div className="admin-metrics">{[
        ['Yêu cầu chat', number(data.totals.requests)], ['Người dùng sử dụng', number(data.totals.users)], ['Tỷ lệ hoàn tất', data.totals.completionRate === null ? '—' : `${data.totals.completionRate.toLocaleString('vi-VN')}%`], ['Yêu cầu lỗi', number(data.totals.failed)],
      ].map(([label, value]) => <article key={label}><p>{label}</p><strong>{value}</strong></article>)}</div>
      <section className="admin-panel dashboard-trend"><header><div><h2>Lượt hỏi theo ngày</h2><p>Yêu cầu riêng biệt theo lần thử gần nhất</p></div></header>
        <div className="dashboard-bars" role="img" aria-label={data.daily.map(day => `${day.date}: ${day.requests} yêu cầu`).join('; ')}>{data.daily.map(day => <div className="chart-column" key={day.date}><div className="chart-track"><span className="chart-value">{number(day.requests)}</span><div className="chart-bar today" style={{ height: `${day.requests / max * 100}%` }} title={`${day.date}: ${day.requests} yêu cầu`}/></div><span className="chart-day">{day.date.slice(8)}/{day.date.slice(5, 7)}</span></div>)}</div>
        {data.totals.requests === 0 && <p className="chart-note">Chưa có yêu cầu chat AI trong 7 ngày này.</p>}
      </section>
      <section className="admin-panel"><h2>Chi tiết theo ngày</h2><div className="admin-table-wrap"><table><caption className="sr-only">Thống kê chat AI trong 7 ngày</caption><thead><tr>{['Ngày', 'Người dùng', 'Yêu cầu', 'Hoàn tất', 'Lỗi', 'Đang xử lý', 'Gián đoạn', 'Lượt thử'].map(label => <th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{[...data.daily].reverse().map(day => <tr key={day.date}><th scope="row">{day.date.split('-').reverse().join('/')}</th>{[day.users, day.requests, day.completed, day.failed, day.processing, day.interrupted, day.attempts].map((value, i) => <td key={i}>{number(value)}</td>)}</tr>)}</tbody></table></div>
        <p className="admin-muted">Một yêu cầu gửi lại cùng mã chỉ tính một yêu cầu, theo trạng thái của lần thử gần nhất. Lượt thử tính cả lần gửi lại và lần lỗi đã nhận hạn mức; không tính trả lại kết quả đã lưu. Gián đoạn là yêu cầu hết thời gian xử lý mà chưa ghi nhận kết quả. Tỷ lệ hoàn tất không tính yêu cầu đang xử lý.</p>
        <p className="admin-muted">Chỉ tổng hợp số liệu; không hiển thị nội dung chat hoặc API key. Chưa thống kê token/chi phí vì chưa có dữ liệu usage từ nhà cung cấp.</p>
      </section>
    </div>}
  </section>
}
