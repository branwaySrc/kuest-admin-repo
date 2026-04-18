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
      <div className="flex flex-1 flex-col pl-[240px]">
        {/* Top Header */}
        <GlobalHeader />

        {/* Content Body (Template handles the Auth Guard for these children) */}
        <main className="flex-1 ">
          <div className="mx-auto max-w-full h-full px-4">
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
