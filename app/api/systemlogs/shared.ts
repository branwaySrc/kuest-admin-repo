export type AccountAccessStatus = 'ACCESS' | 'FAILED'

export const __schema = {
  admin: {
    schema: 'admin',
    usageLog: 'usage_logs_kst',
    accountLog: 'account_logs',
  },
  public: {
    schema: 'public',
    dbSizeView: 'admin_db_size',
    dummyTable: 'unexist_table_only_for_request_health_check',
  },
} as const

/** 6시간(밀리초) - 용량 로그 최소 갱신 간격 */
export const SIX_HOURS_MS = 6 * 60 * 60 * 1000

export type HealthStatus = 'online' | 'offline' | 'checking' | 'error'

export interface UsageData {
  current: number
  diff: number
  rate: number
  lastUpdated: string | null
  baselineDate?: string | null // 비교 기준이 된 날짜
}

/** /api/systemlogs 응답 구조 */
export interface HealthResponse {
  public: boolean
  admin: boolean
  status: HealthStatus
  code: number
  usage: UsageData
  timestamp: string
}
