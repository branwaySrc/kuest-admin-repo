
import { Database } from 'lucide-react'
import { Button } from '@/client/department-ui/ui/button'

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 duration-700">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-4">
        <StatCard
          title="Total Lines"
          value={"20"}
        />
        <StatCard title="Active Stations" value="240" />
        <StatCard title="Server Load" value="12%" />
        <StatCard title="Server Load" value="12%" />
        <StatCard title="Server Load" value="12%" />
        <StatCard title="Server Load" value="12%" />
        <StatCard title="Server Load" value="12%" />
        <StatCard title="Server Load" value="12%" />
      </div>

      {/* Recent Activity Card */}
      <div className="border-border bg-card/20 rounded-2xl border p-8 shadow-sm backdrop-blur-md">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-foreground text-xl font-semibold">Recent Activity</h2>
          <Button variant="outline" size="sm" className="text-xs">
            View all
          </Button>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted mb-4 rounded-full p-4">
            <Database size={24} className="text-muted-foreground/60" />
          </div>
          <p className="text-muted-foreground max-w-xs text-sm">
            최근 활동 내역이 없습니다. 시스템이 정상적으로 운영되고 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border-border bg-card/40 hover:bg-card/60 hover:shadow-primary/5 group rounded-lg border p-6 transition-all hover:shadow-lg">
      <div className="text-muted-foreground/70 group-hover:text-primary text-xs font-bold tracking-wider uppercase transition-colors">
        {title}
      </div>
      <div className="text-foreground mt-2 text-4xl font-extrabold tracking-tight">{value}</div>
      <div className="mt-4 flex items-center gap-1 text-[10px] font-medium text-emerald-500">
        <span>+2.4%</span>
        <span className="text-muted-foreground/50">since last hour</span>
      </div>
    </div>
  )
}
