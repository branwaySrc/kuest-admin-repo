import { DatabaseSideBar } from '@/client/database-side-bar'
import { DatabaseItemTable } from '@/client/database-item-table'

export default function DatabasePage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Side Bar */}
      <DatabaseSideBar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto bg-muted/10 p-4">
        <div className="space-y-6">
          <DatabaseItemTable />
        </div>
      </main>
    </div>
  )
}

