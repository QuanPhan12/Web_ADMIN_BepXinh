export type AppView =
  | 'login'
  | 'dashboard'
  | 'profile'
  | 'review'
  | 'users'
  | 'orders'
  | 'categories'
  | 'cms'
  | 'reports'
  | 'settings'
  | 'partners'

export interface LoginFormState {
  email: string
  password: string
  otp: string[]
  rememberMe: boolean
  showPassword: boolean
}

export type AuthState = 'idle' | 'loading' | 'success' | 'error'

export interface SystemMetrics {
  coreUptime: string
  uptimePeak: string
  verifiedRecipes: string
  aiModuleVersion: string
  serverTime: string
}

export interface AuditLogItem {
  id: string
  timestamp: string
  ip: string
  action: string
  node: string
  status: 'SUCCESS' | 'INFO' | 'WARNING'
}

export interface PriorityRecipeItem {
  id: string
  title: string
  prepTime: string
  ingredientsCount: number
  hasCalories: boolean
  hasVideo?: boolean
  chefName: string
  chefRole: 'MASTER CHEF' | 'CREATOR PRO' | 'CREATOR MỚI'
  timeAgo: string
  aiScore: number
  aiStatus: 'Tuyệt đối' | 'Chuẩn chỉ' | 'Đề xuất lại' | 'Xuất sắc'
  aiNote: string
  image: string
}

export interface ApiPartnerStatus {
  name: string
  subname: string
  uptime: string
  skuCount: string
  completionRate: string
  status: 'online' | 'syncing' | 'warning'
}

export interface OperationalAlert {
  id: string
  type: 'warning' | 'success' | 'info'
  title: string
  description: string
  time?: string
  actionText?: string
  secondaryActionText?: string
}

export interface ActiveSession {
  id: string
  device: string
  isCurrent: boolean
  appVersion: string
  location: string
  ip: string
  protocol: string
  statusText: string
}

export interface AdminProfile {
  displayName: string
  reviewTitle: string
  alertEmail: string
  verifyPhone: string
  language: string
  delegationNotes: string
  avatarUrl: string
  roleTag: string
  department: string
  adminId: string
  joinedDate: string
  permissionLevel: string
}

export interface BroadcastNotification {
  id: string
  title: string
  category: 'urgent' | 'feature' | 'event' | 'policy'
  targetAudience: 'all' | 'chefs' | 'partners' | 'internal'
  branchScope: string
  channels: ('push' | 'banner' | 'email' | 'sms')[]
  content: string
  actionLabel?: string
  actionUrl?: string
  priority: 'high' | 'normal' | 'low'
  sendMode: 'now' | 'scheduled'
  scheduledTime?: string
  createdAt: string
  author: string
  read?: boolean
}
