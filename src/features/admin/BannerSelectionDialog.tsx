import { useState } from 'react'
import type { Recipe } from './models'
import { setBanner } from './repository'
import { useAction } from './hooks'
import { Button, Modal, Notice } from './ui'

const criteria = [
  'Tên mô tả rõ món ăn, không phải tên thử hoặc ký tự tùy ý.',
  'Ảnh rõ món đã hoàn thành, không phải ảnh dụng cụ hay ảnh không liên quan.',
  'Món vẫn nhận diện tốt khi ảnh được cắt như bản xem trước trên Home.',
]

export function BannerSelectionDialog({ recipe, onClose }: { recipe: Recipe; onClose: () => void }) {
  const [checked, setChecked] = useState<boolean[]>([false, false, false])
  const [loaded, setLoaded] = useState(false), [imageError, setImageError] = useState(false)
  const action = useAction()
  return <Modal title="Xem xét món nổi bật" onClose={onClose} busy={action.busy}>
    <h3>{recipe.content.title}</h3>
    <div style={{ maxWidth: 240, aspectRatio: '1', overflow: 'hidden', borderRadius: 12 }}>
      <img src={recipe.content.cover.url} alt={recipe.content.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onLoad={() => { setLoaded(true); setImageError(false) }} onError={() => { setLoaded(false); setImageError(true) }}/>
    </div>
    <p className="admin-muted">Ảnh thu nhỏ tỷ lệ 1:1 trên Home. Tên và ảnh lấy từ công thức đã duyệt.</p>
    {criteria.map((label, i) => <label className="admin-check" key={label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 14 }}>
      <input type="checkbox" checked={checked[i]} disabled={action.busy} onChange={e => setChecked(values => values.map((v, n) => n === i ? e.target.checked : v))}/><span>{label}</span>
    </label>)}
    <Notice error={imageError ? 'Không tải được ảnh. Hãy chọn công thức có ảnh xem được trước khi đưa lên Home.' : action.error}/>
    <p className="admin-muted">Nếu nội dung chưa phù hợp, chọn món khác hoặc gỡ banner hiện có. Hệ thống không tự đánh giá nội dung ảnh.</p>
    <div className="admin-actions"><Button disabled={action.busy} onClick={onClose}>Hủy</Button><Button className="primary" disabled={action.busy || !loaded || !checked.every(Boolean)} onClick={() => { void action.run(() => setBanner(recipe.id, false, true)).then(ok => { if (ok) onClose() }) }}>Chọn làm banner</Button></div>
  </Modal>
}
