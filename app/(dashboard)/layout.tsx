import GlobalNavigation from '@/client/global-navigation'
import GlobalHeader from '@/client/global-header'
import GlobalServerStatus from '@/client/global-server-status'
import GlobalAppViewer from '@/client/global-app-viewer'
import GlobalSystemConsole from '@/client/global-system-console'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <GlobalNavigation />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-[240px]">
        {/* Top Header */}
        <GlobalHeader />

        {/* Content Body (Template handles the Auth Guard for these children) */}
        <main className="flex-1 min-h-0 flex flex-col w-full">
          <div className="h-full max-w-full w-full">{children}</div>
        </main>

        {/* Global PowerShell Terminal */}
        <GlobalSystemConsole />

        {/* Bottom Status Bar */}
        <GlobalServerStatus />
    
        {/* App Viwer */}
        <GlobalAppViewer />
      </div>
    </div>
  )
}
