export const ApiSystemLogs = {
  id: 'systemlogs',
  title: 'System Logs / Health API',
  description:
    '서버의 현재 DB 스키마 연결 상태 및 용량 갱신 관리를 위한 헬스 체크 엔드포인트 모음입니다.',
  endpoints: [
    {
      method: 'GET',
      path: '/api/systemlogs',
      description:
        '현재 애플리케이션의 공용 스키마 및 어드민 스키마 헬스 체크 상태를 반환하며, 6시간 기반의 용량 통계를 제공합니다. DB 쓰기 및 커밋은 발생하지 않습니다.',
      responses: [
        {
          status: 200,
          label: 'SUCCESS',
          code: `{
  "public": true,
  "admin": true,
  "status": "active" | "degraded",
  "code": 200 | 207,
  "usage": {
    "current": number,
    "diff": number,
    "rate": number,
    "lastUpdated": string | null,
    "baselineDate"?: string | null
  },
  "timestamp": string
}`,
        },
        {
          status: 500,
          label: 'ERROR',
          code: `{
  "status": "error",
  "error": "Error Message Detailing Specific Failure Context"
}`,
        },
      ],
    },
    {
      method: 'POST',
      path: '/api/systemlogs',
      description:
        '어드민 콘솔 터미널 및 시스템 버튼에서 수동(동기화) SYNC를 호출할 때 작동합니다. Usage Update(스마트 업서트)를 강제로 체크하고 동일한 모델을 리턴합니다.',
      responses: [
        {
          status: 200,
          label: 'SUCCESS',
          code: `{
  "public": true,
  "admin": true,
  "status": "active" | "degraded",
  "code": 200 | 207,
  "usage": {
    "current": number,
    "diff": number,
    "rate": number,
    "lastUpdated": string | null
  },
  "timestamp": string
}`,
        },
      ],
    },
  ],
}
