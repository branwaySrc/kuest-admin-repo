export type AccountAccessStatus = 'ACCESS' | 'FAILED'
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
