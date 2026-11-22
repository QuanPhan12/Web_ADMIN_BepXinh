export const suspensionPrefix = '[Đình chỉ lần đầu] '
export function restrictionReason(kind: string, reason: string) {
  const value = reason.trim()
  if (!value || value.length > 470) throw new Error('Nhập lý do từ 1 đến 470 ký tự.')
  return kind === 'suspend' ? `${suspensionPrefix}${value}` : value
}
