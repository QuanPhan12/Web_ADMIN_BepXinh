import React, { createContext, useContext, useState, useEffect } from 'react'
import type { AdminProfile, BroadcastNotification } from '../types'

export const DEFAULT_ADMIN_PROFILE: AdminProfile = {
  displayName: 'Admin Bếp Xinh',
  reviewTitle: 'Trưởng ban Thẩm định',
  alertEmail: 'minh.nguyen@bepxinh.vn',
  verifyPhone: '0966411761',
  language: 'Tiếng Việt (Mặc định)',
  delegationNotes:
    'Ủy quyền xử lý báo cáo vi phạm nội dung tức thì cho Phó Ban (chef.an@bepxinh.vn) trong các khung giờ bảo trì 02:00 - 04:00 sáng.',
  avatarUrl: '/images/admin_avatar.png',
  roleTag: 'Super Admin (Toàn quyền hệ thống)',
  department: 'Ban Kiểm duyệt Ẩm thực & Giám sát Nội dung AI',
  adminId: 'BX-ADM-0042',
  joinedDate: 'Tháng 03/2023',
  permissionLevel: 'Root (EMA-204)',
}

interface ProfileContextType {
  profile: AdminProfile
  updateProfile: (updated: Partial<AdminProfile>) => void
  uploadAvatar: (file: File) => Promise<string>
  resetAvatarToDefault: () => void
  resetToDefault: () => void
  toastMessage: string | null
  showToast: (msg: string) => void
  clearToast: () => void
  isEmptyData: boolean
  // Notifications
  notifications: BroadcastNotification[]
  addNotification: (notification: Omit<BroadcastNotification, 'id' | 'createdAt' | 'author' | 'read'>) => BroadcastNotification
  deleteNotification: (id: string) => void
  markAllNotificationsRead: () => void
  isCreateNotificationOpen: boolean
  setIsCreateNotificationOpen: (open: boolean) => void
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined)

const STORAGE_KEY = 'bepxinh_admin_profile_data'

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isEmptyData = true
  const [notifications, setNotifications] = useState<BroadcastNotification[]>([])
  const [isCreateNotificationOpen, setIsCreateNotificationOpen] = useState(() => {
    try {
      return typeof window !== 'undefined' && window.location.search.includes('modal=notification')
    } catch {
      return false
    }
  })

  const addNotification = (
    data: Omit<BroadcastNotification, 'id' | 'createdAt' | 'author' | 'read'>
  ): BroadcastNotification => {
    const newNotice: BroadcastNotification = {
      ...data,
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', Vừa xong',
      author: profile.displayName || 'Admin Bếp Xinh',
      read: false,
    }
    setNotifications((prev) => [newNotice, ...prev])
    showToast(`Đã phát thông báo "${data.title}" thành công!`)
    return newNotice
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    showToast('Đã xoá thông báo.')
  }

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    showToast('Đã đánh dấu tất cả thông báo là đã đọc.')
  }

  const [profile, setProfile] = useState<AdminProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return { ...DEFAULT_ADMIN_PROFILE, ...JSON.parse(saved) }
      }
    } catch {
      // In case localStorage is disabled or throws
    }
    return DEFAULT_ADMIN_PROFILE
  })

  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToastMessage(msg)
  }

  const clearToast = () => {
    setToastMessage(null)
  }

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Save to localStorage whenever profile changes
  const updateProfile = (updated: Partial<AdminProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (err) {
        console.warn('Failed to save to localStorage:', err)
      }
      return next
    })
    showToast('Đã lưu thành công thông tin hồ sơ!')
  }

  // Upload avatar from device via File API
  const uploadAvatar = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validation: Type
      if (!file.type.startsWith('image/')) {
        const error = 'Vui lòng chọn tệp định dạng hình ảnh hợp lệ (PNG, JPG, WEBP, GIF, SVG).'
        showToast(error)
        reject(new Error(error))
        return
      }

      // Validation: Size (max 8MB)
      if (file.size > 8 * 1024 * 1024) {
        const error = 'Kích thước ảnh không được vượt quá 8MB.'
        showToast(error)
        reject(new Error(error))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const base64Url = e.target?.result as string
        setProfile((prev) => {
          const next = { ...prev, avatarUrl: base64Url }
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
          } catch (err) {
            console.warn('Failed to save to localStorage:', err)
          }
          return next
        })
        showToast('Ảnh đại diện đã được cập nhật từ thiết bị thành công!')
        resolve(base64Url)
      }
      reader.onerror = () => {
        const error = 'Không thể đọc tệp ảnh từ thiết bị.'
        showToast(error)
        reject(new Error(error))
      }
      reader.readAsDataURL(file)
    })
  }

  const resetAvatarToDefault = () => {
    setProfile((prev) => {
      const next = { ...prev, avatarUrl: DEFAULT_ADMIN_PROFILE.avatarUrl }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (err) {
        console.warn('Failed to save to localStorage:', err)
      }
      return next
    })
    showToast('Đã khôi phục ảnh đại diện mặc định!')
  }

  const resetToDefault = () => {
    setProfile(DEFAULT_ADMIN_PROFILE)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ADMIN_PROFILE))
    } catch {
      // Ignore
    }
    showToast('Đã khôi phục toàn bộ thông tin ban đầu!')
  }

  return (
    <ProfileContext.Provider
      value={{
        profile,
        updateProfile,
        uploadAvatar,
        resetAvatarToDefault,
        resetToDefault,
        toastMessage,
        showToast,
        clearToast,
        isEmptyData,
        notifications,
        addNotification,
        deleteNotification,
        markAllNotificationsRead,
        isCreateNotificationOpen,
        setIsCreateNotificationOpen,
      }}
    >
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfile = () => {
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider')
  }
  return context
}
