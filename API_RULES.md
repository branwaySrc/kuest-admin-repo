# Kuest Admin API Documentation Standards

이 문서는 Kuest Admin 프로젝트 내에서 사용되는 API Route들을 정의하고 통합된 형식으로 문서화를 유지하기 위한 가이드라인입니다. **모든 AI 어시스턴트는 새로운 API를 생성하거나 수정할 때 이 규칙을 참조하여 문서를 함께 작성해야 합니다.**

## 1. 목적

추후 백엔드(Supabase/Next.js Route Handlers)를 모바일 앱 및 외부 시스템에 손쉽게 연동하기 위함입니다. 프론트엔드 개발 시 API 스펙에 대한 이해를 돕고 장애 상황을 대비하기 위해 스키마, 성공 응답, 오류 응답을 명확히 명세합니다.

## 2. 문서화 구조 (TypeScript Pattern)

관리자 페이지 내의 `/api-docs` 경로에서 Shadcn UI를 통해 동적으로 렌더링 됩니다. 새로운 API를 작성하거나 추가할 땐 마크다운 대신 타입스크립트 객체를 생성합니다.

### 2-1. 단일 파일 패턴 생성

경로: `@/app/(dashboard)/api-docs/(content)/api-[domain].ts`

```typescript
export const ApiDomainName = {
  id: "domainname",
  title: "Domain Title API",
  description: "API 그룹에 대한 상세 설명",
  endpoints: [
    {
      method: "GET | POST | PUT | DELETE",
      path: "/api/domain",
      description: "이 엔드포인트가 무엇을 달성하는지 기재합니다.",
      responses: [
        {
          status: 200,
          label: "SUCCESS",
          code: \`{\n  "property": "type"\n}\`
        },
        {
          status: 500,
          label: "ERROR",
          code: \`{\n  "status": "error"\n}\`
        }
      ]
    }
  ]
};
```

### 2-2. 인덱스 매핑 (UI 반영)

새롭게 생성한 `.ts` Payload를 `@/app/(dashboard)/api-docs/page.tsx` 내부 배열에 추가합니다.

```typescript
import { ApiDomainName } from './(content)/api-[domain]'

const apiDocuments = [ApiSystemLogs, ApiDomainName]
```

## 3. 작성 필수 규칙

- **JSON Formatting:** `code` 속성에 들어가는 JSON Mockup 문자열 내부에 줄바꿈, 들여쓰기를 정확히 작성하여 UI에 `<pre>` 태그로 출력될 때 아름답게 보여야 합니다.
- **REST Method Color Mapping:** `GET`, `POST`, `PUT`, `DELETE` 는 UI에서 자동으로 색상이 지정됩니다. 대문자로 기재해야 합니다.
- **Status Validation:** 성공 응답과 실패/예외 응답(40x, 50x) 모두를 responses 배열에 포함하는 것을 권장합니다.

_이 가이드는 AI 에이전트의 워크스페이스 컨텍스트용으로 작성되었습니다._
