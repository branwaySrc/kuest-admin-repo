const KST_OFFSET = 9 * 60 * 60 * 1000

export const formatDataSize = (bytes: number) => {
  if (!bytes || bytes === 0) return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/** UTC → KST 기준 상대 시간 */
export const formatRelativeTime = (isoString: string | null) => {
  if (!isoString) return '-'

  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)

  if (mins < 1) return '방금'
  if (mins < 60) return `${mins}분 전`
  if (hours < 24) return `${hours}시간 전`

  return `${Math.floor(hours / 24)}일 전`
}

/** UTC ISO → KST 날짜 문자열 (MM/DD) */
export const formatKSTDate = (isoString: string | null) => {
  if (!isoString) return null

  const kst = new Date(new Date(isoString).getTime() + KST_OFFSET)
  const year = kst.getFullYear().toString().slice(-2) // 2-digit
  const month = String(kst.getUTCMonth() + 1).padStart(2, '0')
  const day = String(kst.getUTCDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

export const formattedKSTDateTime = () =>
  new Date().toLocaleString('ko-KR', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
