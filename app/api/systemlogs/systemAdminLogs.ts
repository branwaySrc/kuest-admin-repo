'use server'

import { supabaseAdmin } from '@/client/lib/supabase'
import { __SERVER_HEALTH_CHECK_TABLE, __SIX_HOURS_MS } from '@/shared'
import { AccountAccessStatus } from '@/shared/types/server-health.schema'

/**
 * [systemLogs.ts]
 * DB Usage and Event logging logic.
 */

/** 현재 시간을 시(hour) 단위로 절사한 버킷을 생성합니다. */
function getHourBucket(): string {
  const now = new Date()
  now.setMinutes(0, 0, 0)
  return now.toISOString()
}

// ─────────────────────────────────────────────
// 1. DB 용량 추이 (Usage Logs)
// ─────────────────────────────────────────────

/** 현재 DB 물리 용량을 Supabase View에서 조회합니다. */
async function fetchCurrentDbSize(): Promise<number> {
  const { data, error } = await supabaseAdmin.from(__SERVER_HEALTH_CHECK_TABLE.public.dbSizeView).select('*').single()

  if (error) {
    console.error('[systemLogs > fetchCurrentDbSize] DB 용량 조회 실패:', error)
    throw error
  }
  return data?.size ?? 0
}

/** 가장 최근의 usage_log row를 가져옵니다. */
async function getLatestUsageLog() {
  const { data, error } = await supabaseAdmin
    .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
    .from(__SERVER_HEALTH_CHECK_TABLE.admin.usageLog)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  // PGRST116: 데이터 없음 - 정상 케이스
  if (error && error.code !== 'PGRST116') {
    console.error('[systemLogs > getLatestUsageLog] 최신 로그 조회 실패:', error)
  }
  return data ?? null
}

/**
 * 6시간 기반 스마트 Upsert 로직
 */
export async function smartUpsertUsage(): Promise<number> {
  const [dbSize, latestLog] = await Promise.all([fetchCurrentDbSize(), getLatestUsageLog()])

  const now = new Date()
  const currentHourBucket = getHourBucket()

  if (latestLog) {
    const elapsed = now.getTime() - new Date(latestLog.created_at).getTime()
    const isExpired = elapsed >= __SIX_HOURS_MS

    if (isExpired) {
      console.log(`[systemLogs > smartUpsertUsage] 6시간 경과 → UPSERT`)
      const { error } = await supabaseAdmin
        .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
        .from(__SERVER_HEALTH_CHECK_TABLE.admin.usageLog)
        .upsert(
          { hour_bucket: currentHourBucket, db_size: dbSize, updated_at: now.toISOString(), checked_at: now.toISOString() },
          { onConflict: 'hour_bucket' },
        )
      if (error) throw error
    } else {
      console.log(`[systemLogs > smartUpsertUsage] 6시간 미만 → UPDATE`)
      const { error } = await supabaseAdmin
        .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
        .from(__SERVER_HEALTH_CHECK_TABLE.admin.usageLog)
        .update({ db_size: dbSize, updated_at: now.toISOString(), checked_at: now.toISOString() })
        .eq('id', latestLog.id)
      if (error) throw error
    }
  } else {
    console.log('[systemLogs > smartUpsertUsage] 로그 없음 → 최초 UPSERT')
    const { error } = await supabaseAdmin
      .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
      .from(__SERVER_HEALTH_CHECK_TABLE.admin.usageLog)
      .upsert({ hour_bucket: currentHourBucket, db_size: dbSize, checked_at: now.toISOString() }, { onConflict: 'hour_bucket' })
    if (error) throw error
  }

  return dbSize
}

/**
 * 최신 2개 항목 비교 → 증감 추이 반환
 */
export async function getUsageStats() {
  const { data, error } = await supabaseAdmin
    .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
    .from(__SERVER_HEALTH_CHECK_TABLE.admin.usageLog)
    .select('id, db_size, created_at, updated_at')
    .order('created_at', { ascending: false })
    .limit(2)

  if (error) throw error

  const current = data?.[0]
  const prev = data?.[1]

  const diff = current && prev ? current.db_size - prev.db_size : 0
  const rate = current && prev && prev.db_size > 0 ? (diff / prev.db_size) * 100 : 0

  return {
    current: current?.db_size ?? 0,
    diff,
    rate,
    lastUpdated: current?.updated_at ?? current?.created_at ?? null,
  }
}

// ─────────────────────────────────────────────
// 2. 계정 접속 기록 (Account Logs)
// ─────────────────────────────────────────────

export async function insertAccountLog(statusString: AccountAccessStatus) {
  try {
    const isSuccess = statusString === 'ACCESS'
    const nowIso = new Date().toISOString()

    const dbPayload = {
      request_time: nowIso,
      status: isSuccess ? 'Success' : 'Failed',
      approved_at: isSuccess ? nowIso : null,
    }

    const { error } = await supabaseAdmin
      .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
      .from(__SERVER_HEALTH_CHECK_TABLE.admin.accountLog)
      .insert([dbPayload])

    if (error) {
      console.warn('[systemAdminLogs > insertAccountLog] 접속 로그 기록 실패:', error.message)
    }
  } catch (err) {
    console.warn('[systemAdminLogs > insertAccountLog] 접속 로그 기록 중 예외발생:', err)
  }
}
