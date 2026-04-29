'use client'

import { DatabaseSideBar } from '@/client/database-side-bar'
import { DatabaseItemTable } from '@/client/database-item-table'
import DatabaseItemEditor from '@/client/database-item-editor'
import { useDatabaseEditorStore } from '@/client/department-feature/store/use-database-editor-store'

export default function DatabasePage() {
  const { isOpen, mode, selectedId } = useDatabaseEditorStore()

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Side Bar */}
      <DatabaseSideBar />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden bg-muted/10">
        <div className="flex-1 overflow-auto p-4 space-y-6">
          <DatabaseItemTable />
        </div>
        {isOpen && mode === 'create' && <DatabaseItemEditor.Create />}
        {isOpen && mode === 'edit' && selectedId && <DatabaseItemEditor.Edit id={selectedId} />}
      </main>
    </div>
  )
}

