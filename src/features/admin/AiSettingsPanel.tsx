import { useEffect, useState } from 'react'
import { Bot, RefreshCw } from 'lucide-react'
import { loadAiConfig, saveAiConfig, loadAiModels } from './aiRepository'
import type { AiConfig, AiModel } from './aiRepository'
import { useAction } from './hooks'
import { Button, Field, Notice } from './ui'

export function AiSettingsPanel() {
  const [config, setConfig] = useState<AiConfig | null>(null), [key, setKey] = useState(''), [loading, setLoading] = useState(true), [revision, setRevision] = useState(0)
  const [loadError, setLoadError] = useState(''), action = useAction()
  const [models, setModels] = useState<AiModel[]>([])
  useEffect(() => {
    let active = true
    loadAiConfig().then(value => { if (active) { setConfig(value); setLoadError('') } }).catch(() => { if (active) setLoadError('Chưa đọc được cấu hình AI từ Firestore. Kiểm tra kết nối và quyền quản trị.') }).finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [revision])
  return <section className="admin-panel"><div className="admin-page-heading"><div><h2><Bot size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }}/>Bếp Xinh AI</h2><p>Trợ lý nấu ăn và hướng dẫn ứng dụng.</p></div><Button aria-label="Tải lại cấu hình AI" disabled={loading || action.busy} onClick={() => { setLoading(true); setRevision(x => x + 1) }}><RefreshCw size={16}/></Button></div>
    {loading ? <p role="status">Đang tải cấu hình…</p> : loadError ? <Notice error={loadError}/> : config && <form onSubmit={e => { e.preventDefault(); const { hasKey: _, ...payload } = config; void action.run(async () => { const saved = await saveAiConfig({ ...payload, apiKey: key }); setConfig(saved); setKey('') }, config.enabled || key ? 'Đã kiểm tra và lưu cấu hình AI.' : 'Đã lưu cấu hình. Trợ lý AI đang tắt.') }}>
      <label className="admin-check"><input type="checkbox" checked={config.enabled} disabled={action.busy} onChange={e => setConfig({ ...config, enabled: e.target.checked })}/>Bật trò chuyện AI</label>
      <div className="admin-settings-grid"><Field label="Kiểu API"><select value={config.provider} disabled={action.busy} onChange={e => { setModels([]); setConfig({ ...config, provider: e.target.value as AiConfig['provider'], endpoint: e.target.value === 'gemini' ? 'https://generativelanguage.googleapis.com' : 'https://api.openai.com/v1', model: e.target.value === 'gemini' ? 'gemini-3.5-flash-lite' : '' }) }}><option value="gemini">Google Gemini</option><option value="openai-compatible">Tương thích OpenAI Chat Completions</option></select></Field>
      <Field label="Tên model">{config.provider === 'gemini' && models.length ? <select required value={config.model} disabled={action.busy} onChange={e => setConfig({ ...config, model: e.target.value })}><option value="">Chọn model từ API</option>{models.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}</select> : <input required value={config.model} maxLength={100} disabled={action.busy} onChange={e => setConfig({ ...config, model: e.target.value })}/>}</Field></div>
      {config.provider === 'gemini' && /^gemini-2\.5(?:-|$)/.test(config.model) && <p role="status" className="admin-muted">Gemini 2.5 có thể hiện trong danh sách nhưng không cho project mới tạo nội dung. Nếu gặp 404, chọn gemini-3.5-flash-lite hoặc một model mới trong danh sách. Cấu hình chỉ được lưu sau khi gọi thử thành công.</p>}
      {config.provider === 'gemini' && <p className="admin-muted"><Button type="button" disabled={action.busy || (!key && !config.hasKey)} onClick={() => void action.run(async () => { const result = await loadAiModels(key); if (!result.models.length) throw new Error('Key này chưa có model Gemini tạo nội dung văn bản. Kiểm tra quyền sử dụng trong Google AI Studio.'); setModels(result.models); if (!result.models.some(model => model.id === config.model)) setConfig({ ...config, model: '' }) }, 'Đã lấy danh sách model từ Google. Chọn model rồi kiểm tra và lưu.')}>Lấy model từ key</Button> Lấy danh sách hiện có từ Google, không tự đoán tên model. Việc lấy danh sách chưa lưu key hoặc bật AI.</p>}
      {config.provider === 'openai-compatible' && <Field label="API Base URL (HTTPS)"><input required type="url" placeholder="https://api.example.com/v1" value={config.endpoint} disabled={action.busy} onChange={e => setConfig({ ...config, endpoint: e.target.value })}/></Field>}
      <Field label={`API key · ${config.hasKey ? 'Đã lưu trên Firestore' : 'Chưa có key'}`}><input type="password" autoComplete="off" value={key} placeholder={config.hasKey ? 'Để trống để giữ key hiện tại' : 'Nhập API key tại đây'} disabled={action.busy} onChange={e => { setKey(e.target.value); setModels([]) }} maxLength={512}/></Field>
      <Field label="Giới hạn lượt hỏi mỗi tài khoản/ngày"><input required type="number" min={1} max={100} value={config.dailyLimit} disabled={action.busy} onChange={e => setConfig({ ...config, dailyLimit: Number(e.target.value) })}/></Field>
      <p className="admin-muted">Gemini dùng generateContent. API tương thích cần hỗ trợ /chat/completions và JSON object. Đổi nhà cung cấp hoặc Base URL phải nhập key mới. Lưu cấu hình đang bật sẽ gửi một yêu cầu kiểm tra kết nối.</p>
      <Notice error={action.error} success={action.success}/><Button type="submit" className="primary" disabled={action.busy}>{action.busy ? 'Đang xử lý…' : config.enabled || key ? 'Kiểm tra và lưu' : 'Lưu cấu hình'}</Button>
    </form>}
  </section>
}
