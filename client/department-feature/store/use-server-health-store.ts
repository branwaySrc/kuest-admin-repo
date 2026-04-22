'use client'

import { create } from 'zustand'
import { HealthStatus, UsageData, HealthResponse } from '@/app/api/systemlogs/shared'
import { useConsoleSystemStore } from '@/client/department-feature/store/use-console-system-store'
import { formattedKSTDateTime } from '@/client/lib/formaters'

interface ServerHealthStore {
  lastChecked: string
  status: HealthStatus
  adminActive: boolean
  publicActive: boolean
  usage: UsageData
  fetchStatus: () => Promise<void>
  handleSync: () => Promise<void>
  applyResponse: (data: HealthResponse) => void
}

export const useServerHealthStore = create<ServerHealthStore>((set, get) => ({
  lastChecked: '-',
  status: 'offline' as HealthStatus,
  adminActive: false,
  publicActive: false,
  usage: {
    current: 0,
    diff: 0,
    rate: 0,
    lastUpdated: null,
    baselineDate: null,
  },

  applyResponse: (data: HealthResponse) => {
    set({
      adminActive: data.admin,
      publicActive: data.public,
      usage: data.usage ?? { current: 0, diff: 0, rate: 0, lastUpdated: null },
      status: data.admin && data.public ? 'online' : 'offline',
    })
  },

  fetchStatus: async () => {
    // 2. 가드 클로즈: 이미 로딩 중이면 즉시 중단
    if (get().status === 'checking') return
    set({ status: 'checking' })

    try {
      const res = await fetch('/api/systemlogs')
      const data = await res.json()

      if (!res.ok) {
        set({ status: 'error' })
        return
      }

      get().applyResponse(data)
      set({status:"online"})

    } catch (err) {
      console.error('[ServerHealth] Fetch failed:', err)
      set({ status: 'error' })

    } finally {
      set({ lastChecked: formattedKSTDateTime() })
      console.log('[ServerHealth] Fetch updated')
    }
  },

  handleSync: async () => {
    const { addAdminLog } = useConsoleSystemStore.getState()
    if (get().status === 'checking') return
    set({ status: 'checking' })
    addAdminLog('INFO', 'Action[INSERT]: Requesting Supabase update...')

    try {
      const res = await fetch('/api/systemlogs', { method: 'POST' })

      if (!res.ok) {
        set({ status: 'error' })
        addAdminLog('FAILED', 'Action[INSERT]: API responded with FAILED status.')
        return
      }

      const data = await res.json()
      get().applyResponse(data)

      // 3. 비즈니스 로직 분기 (성공 내 디테일)
      const logStatus = data.admin ? 'SUCCESS' : 'WARNING'
      const logMessage = data.admin
        ? 'Action[INSERT]: SYS_UPDATE_SUCCESS. Usage logs synchronized.'
        : 'Action[INSERT]: Sync completed, but ADMIN DB is degraded.'

      addAdminLog(logStatus, logMessage)
      set({ status: 'online' })

    } catch (err) {
      console.error('[ServerHealthStore] SYNC 실패:', err)
      set({ status: 'error' })
      const errorMessage = err instanceof Error ? err.message : 'Network failure.'
      addAdminLog('FAILED', `Action[INSERT]: Exception - ${errorMessage}`)

    } finally {
      set({ lastChecked: formattedKSTDateTime() })
    }
  },
}))
