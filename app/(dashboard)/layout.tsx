import GlobalNavigation from '@/components/tiles/global-navigation'
import GlobalHeader from '@/components/tiles/global-header'
import ServerStatusBar from '@/client/server-status-bar'
import AppViwer from '@/components/tiles/app-viwer'
import SystemConsole from '@/client/system-console'


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-foreground flex min-h-screen">
      {/* Sidebar Navigation */}
      <GlobalNavigation />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-[240px]">
        {/* Top Header */}
        <GlobalHeader />

        {/* Content Body (Template handles the Auth Guard for these children) */}
        <main className="flex-1">
          <div className="mx-auto h-full max-w-full px-4">{children}</div>
        </main>

        {/* Global PowerShell Terminal */}
        <SystemConsole />

        {/* Bottom Status Bar */}
        <ServerStatusBar />
    
        {/* App Viwer */}
        <AppViwer />
      </div>
    </div>
  )
}
