'use client'

import { ContentSideBar } from '@/client/content-side-bar'
import { ContentItemTable } from '@/client/content-item-table'
import ContentItemEditor from '@/client/content-item-editor'
import { useContentEditorStore } from '@/client/department-feature/store/use-content-editor-store'

export default function ContentsPage() {
  const { isOpen, mode, selectedId } = useContentEditorStore()

  return (
    <div className="flex h-full w-full overflow-hidden">
      {/* Side Bar */}
      <ContentSideBar />

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden bg-muted/10">
        <div className="flex-1 overflow-auto p-4 space-y-6">
          <ContentItemTable />
        </div>
        {isOpen && mode === 'create' && <ContentItemEditor.Create />}
        {isOpen && mode === 'edit' && selectedId && <ContentItemEditor.Edit id={selectedId} />}
      </main>
    </div>
  )
}