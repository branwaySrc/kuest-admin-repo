import { supabase, supabaseAdmin } from '@/client/lib/supabase'
import { __SERVER_HEALTH_CHECK_TABLE } from '@/shared'

/**
 * [systemHealth.ts]
 * Only for checking connectivity to Public and Admin schemas.
 */

/** 공용 스키마 연결 확인 (일반 권한) */
export async function checkPublicSchemaHealth() {
  const { error } = await supabase
    .from(__SERVER_HEALTH_CHECK_TABLE.public.dummyTable)
    .select('*', { head: true, count: 'exact' })

  if (error && error.message.includes('fetch')) {
    console.error('[systemHealth > checkPublicHealth] 공용 스키마 연결 실패:', error)
    throw new Error('공용 스키마 연결에 실패했습니다.')
  }
  return true
}

/** 어드민 스키마 연결 확인 (서비스 롤 권한) */
export async function checkAdminSchemaHealth() {
  const { error } = await supabaseAdmin
    .schema(__SERVER_HEALTH_CHECK_TABLE.admin.schema)
    .from(__SERVER_HEALTH_CHECK_TABLE.admin.usageLog)
    .select('*', { head: true, count: 'exact' })

  if (error && error.message.includes('fetch')) {
    console.error('[systemHealth > checkAdminHealth] 어드민 스키마 연결 실패:', error)
    throw new Error('어드민 스키마 연결에 실패했습니다.')
  }
  return true
}
