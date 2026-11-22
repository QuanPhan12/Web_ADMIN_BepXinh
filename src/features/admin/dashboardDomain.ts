// Ngày báo cáo cố định UTC+7 để các quản trị viên thấy cùng mốc thống kê.
export type DashboardPeriod = 'day' | 'week' | 'month'
export function dashboardDays(now = new Date(), period: DashboardPeriod = 'week') {
  const offset = 7 * 60 * 60 * 1000
  const local = new Date(now.getTime() + offset)
  const midnight = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - offset
  const count = period === 'day' ? 24 : period === 'month' ? 30 : 7
  const interval = period === 'day' ? 3600000 : 86400000
  return Array.from({ length: count }, (_, i) => {
    const start = new Date(period === 'day' ? midnight + i * interval : midnight - (count - 1 - i) * interval)
    const date = new Date(start.getTime() + offset)
    const label = period === 'day' ? `${String(i).padStart(2, '0')}h` : `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    return { start, end: new Date(start.getTime() + interval), label }
  })
}
