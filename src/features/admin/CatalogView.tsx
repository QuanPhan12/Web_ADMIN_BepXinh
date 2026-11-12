import { useEffect, useState } from 'react'
import { Plus, Pencil } from 'lucide-react'
import type { Catalog, Category, Ingredient, Unit } from './models'
import { saveCatalog, watchCatalog } from './repository'
import { useAction } from './hooks'
import { errorMessage, searchKey } from './domain'
import { Button, Field, LoadState, Modal, Notice, SearchField } from './ui'

type Kind = 'ingredients' | 'categories' | 'units'
const labels: Record<Kind, string> = { ingredients: 'Nguyên liệu', categories: 'Nhóm nguyên liệu', units: 'Đơn vị' }
type CatalogRow = Ingredient | Category | Unit
export function CatalogView() {
  const [catalog, setCatalog] = useState<Catalog | null>(null), [loading, setLoading] = useState(true), [error, setError] = useState(''), [retry, setRetry] = useState(0)
  const [kind, setKind] = useState<Kind>('ingredients'), [search, setSearch] = useState(''), [category, setCategory] = useState('')
  const [editor, setEditor] = useState<{ kind: Kind; row?: CatalogRow; base: Catalog } | null>(null)
  useEffect(() => {
    return watchCatalog(c => { setCatalog(c); setLoading(false) }, e => { setError(errorMessage(e)); setLoading(false) })
  }, [retry])
  const rows = catalog?.[kind].filter(x => searchKey(`${x.id} ${'name' in x ? x.name : x.label} ${'aliases' in x ? x.aliases.join(' ') : ''}`).includes(searchKey(search)) && (kind !== 'ingredients' || !category || ('categoryId' in x && x.categoryId === category))) ?? []
  return <><div className="admin-page-heading"><div><p className="admin-eyebrow">DANH MỤC DÙNG CHUNG</p><h1>Nguyên liệu & đơn vị</h1><p>Danh mục dùng cho tìm kiếm, tủ lạnh và biên soạn công thức.</p></div><Button className="primary" disabled={!catalog || loading || !!error} onClick={() => { if (catalog) setEditor({ kind, base: catalog }) }}><Plus size={17}/>Thêm {labels[kind].toLowerCase()}</Button></div>
    {catalog && <div className="admin-metrics">{(Object.keys(labels) as Kind[]).map(k => <article key={k}><p>{labels[k]}</p><strong>{catalog[k].length}</strong></article>)}</div>}
    <div className="admin-toolbar"><div className="admin-tabs">{(Object.keys(labels) as Kind[]).map(k => <Button key={k} className={kind === k ? 'selected' : ''} onClick={() => { setKind(k); setSearch('') }}>{labels[k]}</Button>)}</div><SearchField value={search} onChange={setSearch} placeholder="Tìm theo ID, tên, tên gọi khác…"/></div>
    {kind === 'ingredients' && <Field label="Lọc nhóm nguyên liệu"><select value={category} onChange={e => setCategory(e.target.value)}><option value="">Tất cả nhóm</option>{catalog?.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>}
    <LoadState loading={loading} error={error} empty={!rows.length} retry={() => { setLoading(true); setError(''); setRetry(x => x + 1) }}/>
    {!loading && !error && !catalog && <Notice error="Chưa có catalogs/ingredients. Cần khởi tạo danh mục chuẩn bằng công cụ phát hành của app trước."/>}
    <div className="admin-table-wrap"><table><thead><tr><th>ID</th><th>{kind === 'units' ? 'Nhãn' : 'Tên'}</th><th>{kind === 'ingredients' ? 'Nhóm / tên gọi khác' : kind === 'categories' ? 'Thứ tự' : 'Loại'}</th><th>{kind === 'ingredients' ? 'Đơn vị (mặc định)' : 'Thao tác'}</th>{kind === 'ingredients' && <th>Thao tác</th>}</tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><code>{row.id}</code></td><td><strong>{'name' in row ? row.name : row.label}</strong></td><td>{'categoryId' in row ? <>{catalog?.categories.find(c => c.id === row.categoryId)?.name}<small>{row.aliases.join(', ') || '—'}</small></> : 'sortOrder' in row ? row.sortOrder : row.type}</td>{'unitIds' in row && <td>{row.unitIds.join(', ')} <small>Mặc định: {row.defaultUnitId}</small></td>}<td><Button onClick={() => { if (catalog) setEditor({ kind, row, base: catalog }) }}><Pencil size={15}/>Sửa</Button></td></tr>)}</tbody></table></div>
    {catalog && <p className="admin-muted">Phiên bản: {catalog.version}. ID đã phát hành được giữ nguyên để bảo toàn tham chiếu từ công thức và tủ lạnh.</p>}
    {editor && <CatalogEditor {...editor} onClose={() => setEditor(null)}/>}
  </>
}
function CatalogEditor({ kind, row, base, onClose }: { kind: Kind; row?: CatalogRow; base: Catalog; onClose: () => void }) {
  const ingredient = row && 'unitIds' in row ? row : undefined
  const [id, setId] = useState(row?.id ?? ''), [name, setName] = useState(row ? ('name' in row ? row.name : row.label) : '')
  const [group, setGroup] = useState(ingredient?.categoryId ?? base.categories[0]?.id ?? '')
  const [aliases, setAliases] = useState(ingredient?.aliases.join(', ') ?? '')
  const [units, setUnits] = useState<string[]>(ingredient?.unitIds ?? [base.units[0]?.id].filter(Boolean))
  const [defaultUnit, setDefaultUnit] = useState(ingredient?.defaultUnitId ?? base.units[0]?.id ?? '')
  const [sortOrder, setSortOrder] = useState(row && 'sortOrder' in row ? row.sortOrder : Math.max(-1, ...base.categories.map(c => c.sortOrder)) + 1)
  const [unitType, setUnitType] = useState<Unit['type']>(row && 'type' in row ? row.type : 'mass')
  const action = useAction()
  async function save() {
    const value: CatalogRow = kind === 'ingredients'
      ? { id: id.trim(), name: name.trim().normalize('NFC'), categoryId: group, aliases: aliases.split(',').map(s => s.trim().normalize('NFC')).filter(Boolean), unitIds: units, defaultUnitId: defaultUnit }
      : kind === 'categories' ? { id: id.trim(), name: name.trim().normalize('NFC'), sortOrder }
      : { id: id.trim(), label: name.trim().normalize('NFC'), type: unitType }
    if (!row && base[kind].some(x => x.id === value.id)) throw new Error('ID đã tồn tại. Hãy chọn ID khác.')
    const next = { ...base, [kind]: row ? base[kind].map(x => x.id === row.id ? value : x) : [...base[kind], value] } as Catalog
    await saveCatalog(next, base)
  }
  return <Modal title={`${row ? 'Sửa' : 'Thêm'} ${labels[kind].toLowerCase()}`} onClose={onClose} busy={action.busy}>
    <form onSubmit={e => { e.preventDefault(); void action.run(save).then(saved => { if (saved) onClose() }) }}>
      <Field label="ID (chữ thường, số, gạch dưới)"><input required pattern="[a-z][a-z0-9_]*" maxLength={120} value={id} disabled={!!row || action.busy} onChange={e => setId(e.target.value)}/></Field>
      <Field label={kind === 'units' ? 'Nhãn hiển thị' : 'Tên hiển thị'}><input required maxLength={120} value={name} disabled={action.busy} onChange={e => setName(e.target.value)}/></Field>
      {kind === 'categories' && <Field label="Thứ tự hiển thị"><input type="number" min={0} step={1} required value={sortOrder} disabled={action.busy} onChange={e => setSortOrder(e.target.valueAsNumber)}/></Field>}
      {kind === 'units' && <Field label="Loại đơn vị"><select value={unitType} disabled={action.busy} onChange={e => setUnitType(e.target.value as Unit['type'])}><option value="mass">Khối lượng</option><option value="volume">Thể tích</option><option value="count">Số lượng</option><option value="kitchen">Dụng cụ bếp</option></select></Field>}
      {kind === 'ingredients' && <>
        <Field label="Nhóm nguyên liệu"><select required disabled={action.busy} value={group} onChange={e => setGroup(e.target.value)}>{base.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
        <Field label="Tên gọi khác (cách nhau bằng dấu phẩy)"><input value={aliases} disabled={action.busy} onChange={e => setAliases(e.target.value)}/></Field>
        <fieldset className="admin-unit-options"><legend>Đơn vị cho phép</legend>{base.units.map(u => <label className="admin-check" key={u.id}><input type="checkbox" checked={units.includes(u.id)} disabled={action.busy || !!ingredient?.unitIds.includes(u.id)} onChange={e => {
          const next = e.target.checked ? [...units, u.id] : units.filter(x => x !== u.id); setUnits(next); if (!next.includes(defaultUnit)) setDefaultUnit(next[0] ?? '')
        }}/>{u.label} <small>({u.id})</small></label>)}</fieldset>
        <Field label="Đơn vị mặc định"><select required disabled={action.busy} value={defaultUnit} onChange={e => setDefaultUnit(e.target.value)}>{units.map(id => <option key={id} value={id}>{base.units.find(u => u.id === id)?.label ?? id}</option>)}</select></Field>
      </>}
      <p className="admin-muted">Lưu sẽ phát hành phiên bản danh mục mới. Phiên bản đang sửa: {base.version}.</p><Notice error={action.error}/>
      <div className="admin-actions"><Button disabled={action.busy} onClick={onClose}>Hủy</Button><Button type="submit" className="primary" disabled={action.busy}>{action.busy ? 'Đang lưu…' : 'Lưu và phát hành'}</Button></div>
    </form>
  </Modal>
}
