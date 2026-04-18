import { stationLineUniqueCodeBook } from '@/constants/stationLineUniqueCodeBook';
import { Database } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Lines" value={Object.keys(stationLineUniqueCodeBook).length.toString()} />
        <StatCard title="Active Stations" value="240" />
        <StatCard title="Server Load" value="12%" />
      </div>

      {/* Recent Activity Card */}
      <div className="rounded-2xl border border-border bg-card/20 p-8 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">Recent Activity</h2>
          <Button variant="outline" size="sm" className="text-xs">View all</Button>
        </div>
        
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
            <Database size={24} className="text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground text-sm max-w-xs">
            최근 활동 내역이 없습니다. 시스템이 정상적으로 운영되고 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 p-6 transition-all hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 group">
      <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 group-hover:text-primary transition-colors">{title}</div>
      <div className="mt-2 text-4xl font-extrabold text-foreground tracking-tight">{value}</div>
      <div className="mt-4 flex items-center gap-1 text-[10px] font-medium text-emerald-500">
        <span>+2.4%</span>
        <span className="text-muted-foreground/50">since last hour</span>
      </div>
    </div>
  );
}
