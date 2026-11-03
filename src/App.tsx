import React, { useState } from 'react'
import type { AppView } from './types'
import { LeftPanel } from './components/LeftPanel'
import { RightPanel } from './components/RightPanel'
import { AdminSidebar } from './components/layout/AdminSidebar'
import { AdminTopNav } from './components/layout/AdminTopNav'
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard'
import { AdminProfileView } from './components/profile/AdminProfileView'
import { RecipeReviewQueueView } from './components/review/RecipeReviewQueueView'
import { UserManagementView } from './components/users/UserManagementView'
import { OrderReconciliationView } from './components/orders/OrderReconciliationView'
import { MasterCatalogView } from './components/catalog/MasterCatalogView'
import { CmsManagementView } from './components/cms/CmsManagementView'
import { ReportsManagementView } from './components/reports/ReportsManagementView'
import { SystemSettingsView } from './components/settings/SystemSettingsView'
import { SupermarketPartnersView } from './components/partners/SupermarketPartnersView'
import { ProfileProvider, useProfile } from './context/ProfileContext'
import { Toast } from './components/common/Toast'

export const AppContent: React.FC = () => {
  const { showToast } = useProfile()
  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const v = params.get('view')
        if (
          v === 'profile' ||
          v === 'login' ||
          v === 'dashboard' ||
          v === 'review' ||
          v === 'users' ||
          v === 'orders' ||
          v === 'categories' ||
          v === 'cms' ||
          v === 'reports' ||
          v === 'settings' ||
          v === 'partners'
        ) {
          return v as AppView
        }
      }
    } catch {
      // ignore
    }
    return 'dashboard'
  })
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen w-full bg-[#f6f8fa] text-slate-800 font-sans selection:bg-orange-500 selection:text-white">
      {/* Toast Notification Container */}
      <Toast />

      {/* View 1: Login Portal */}
      {currentView === 'login' && (
        <div className="relative min-h-screen w-full bg-[#f6f8fa] flex items-center justify-center p-3 sm:p-5 lg:p-6 overflow-x-hidden">
          {/* Background Soft Glows */}
          <div
            className="pointer-events-none absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[130px] opacity-70"
            style={{
              background: 'radial-gradient(circle, rgba(255, 237, 224, 0.85) 0%, rgba(254, 243, 235, 0.4) 60%, transparent 80%)',
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-32 -right-32 w-[650px] h-[650px] rounded-full blur-[140px] opacity-60"
            style={{
              background: 'radial-gradient(circle, rgba(209, 250, 229, 0.8) 0%, rgba(220, 252, 231, 0.4) 60%, transparent 80%)',
            }}
          />

          <main className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <LeftPanel />
            </div>
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start">
              <RightPanel
                onLoginSuccess={() => {
                  setCurrentView('dashboard')
                  showToast('Đăng nhập thành công với tài khoản Admin@bepxinh.vn!')
                }}
              />
            </div>
          </main>
        </div>
      )}

      {/* View 2 & 3: Admin Layout with Sidebar & TopNav */}
      {currentView !== 'login' && (
        <div className="flex min-h-screen bg-[#f8fafc]">
          {isSidebarOpen && (
            <AdminSidebar
              currentView={currentView}
              onNavigate={(view) => setCurrentView(view)}
              onLogout={() => setCurrentView('login')}
            />
          )}

          <div className="flex-1 flex flex-col min-w-0">
            <AdminTopNav
              onNavigate={(view) => setCurrentView(view)}
              onLogout={() => setCurrentView('login')}
              onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <main className="flex-1 overflow-y-auto">
              {currentView === 'dashboard' && <ExecutiveDashboard />}
              {currentView === 'profile' && <AdminProfileView />}
              {currentView === 'review' && <RecipeReviewQueueView />}
              {currentView === 'users' && <UserManagementView />}
              {currentView === 'orders' && <OrderReconciliationView />}
              {currentView === 'categories' && <MasterCatalogView />}
              {currentView === 'cms' && <CmsManagementView />}
              {currentView === 'reports' && (
                <ReportsManagementView onNavigate={(view) => setCurrentView(view)} />
              )}
              {currentView === 'settings' && <SystemSettingsView />}
              {currentView === 'partners' && (
                <SupermarketPartnersView onNavigate={(view) => setCurrentView(view)} />
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  )
}

export const App: React.FC = () => {
  return (
    <ProfileProvider>
      <AppContent />
    </ProfileProvider>
  )
}

export default App
