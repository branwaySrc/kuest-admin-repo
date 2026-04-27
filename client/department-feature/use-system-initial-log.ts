import { useEffect } from "react"
import { useConsoleSystemStore } from "@/client/department-feature/store/use-console-system-store"
import { fetchSystemLogs } from "@/client/department-feature/api/fetch-system-logs"

export function useSystemInitialLogs() {
  const { clearLogs, addPublicLog, addAdminLog } = useConsoleSystemStore()

  useEffect(() => {
    let mounted = true
    clearLogs()
    addPublicLog('INFO', 'Initializing listener...')
    addAdminLog('INFO', 'Authenticating session...')

    const checkSystemHealth = async () => {
      try {
        const data = await fetchSystemLogs();

        if (!mounted) return

        // 1. Public Gateway 체크 (Early Return 스타일 적용)
        if (!data.public) {
          addPublicLog('FAILED', 'Connection timeout on Public Gateway.')
        } else {
          addPublicLog('SUCCESS', 'Supabase Health Check: SUCCESS. Public Gateway is Online.')
        }

        // 2. Admin DB 체크 (동일 적용)
        if (!data.admin) {
          addAdminLog('FAILED', 'Admin DB connection failed or degraded.')
        } else {
          addAdminLog('SUCCESS', 'Supabase Health Check: SUCCESS. Workspace Clean & Connected.')
        }

      } catch (err: unknown) {
        if (!mounted) return // 여기서도 ! 활용하여 조기 리턴

        const errorMessage = err instanceof Error ? err.message : 'Network error occurred.'
        addPublicLog('FAILED', errorMessage)
        addAdminLog('FAILED', errorMessage)
      }
    }

    const timerId = setTimeout(checkSystemHealth, 1200)

    return () => {
      mounted = false
      clearTimeout(timerId)
    }
  }, [clearLogs, addPublicLog, addAdminLog])
}