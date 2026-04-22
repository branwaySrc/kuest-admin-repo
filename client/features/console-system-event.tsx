'use client'

import { useConsoleSystemStore, SystemLog } from '@/client/department-feature/store/use-console-system-store'
import { ConsoleSyntax } from '@/client/department-ui/items/console-syntax'


/**
 * 로그 리스트를 받아 적절한 ConsoleSyntax 컴포넌트로 렌더링하는 공통 함수
 */
function RenderLogList({ logs }: { logs: SystemLog[] }) {
  return (
    <div className="flex flex-col justify-end space-y-1.5 leading-relaxed">
      {logs.map((log) => {
        switch (log.level) {
          case 'SUCCESS':
            return <ConsoleSyntax.Success key={log.id} timestamp={log.timestamp} message={log.message} />
          case 'WARNING':
            return <ConsoleSyntax.Warning key={log.id} timestamp={log.timestamp} message={log.message} />
          case 'FAILED':
            return <ConsoleSyntax.Failed key={log.id} timestamp={log.timestamp} message={log.message} />
          case 'INFO':
          default:
            return <ConsoleSyntax.Info key={log.id} timestamp={log.timestamp} message={log.message} />
        }
      })}
    </div>
  )
}

function AdminFeed() {
  const adminLogs = useConsoleSystemStore((state) => state.adminLogs)
  return <RenderLogList logs={adminLogs} />
}

function PublicFeed() {
  const publicLogs = useConsoleSystemStore((state) => state.publicLogs)
  return <RenderLogList logs={publicLogs} />
}

export const ConsoleSystemEvent = {
  Admin:AdminFeed,
  Public:PublicFeed,
}