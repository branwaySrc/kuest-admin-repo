import GlobalNavigation from "@/components/tiles/global-navigation";
import GlobalHeader from "@/components/tiles/global-header";
import GlobalFooter from "@/components/tiles/global-footer";
import GlobalTerminal from "@/components/tiles/global-terminal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar Navigation */}
      <GlobalNavigation />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-[64px]">
        {/* Top Header */}
        <GlobalHeader />

        {/* Content Body (Template handles the Auth Guard for these children) */}
        <main className="flex-1 pb-[32px]">
          <div className="mx-auto max-w-[1600px] p-8">
            {children}
          </div>
        </main>

        {/* Global PowerShell Terminal */}
        <GlobalTerminal />

        {/* Bottom Status Bar */}
        <GlobalFooter />
      </div>
    </div>
  );
}
