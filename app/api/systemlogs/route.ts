import { NextResponse } from "next/server";
import { checkAdminSchemaHealth, checkPublicSchemaHealth } from "@/app/api/systemlogs/systemHealth";
import { smartUpsertUsage, getUsageStats } from "@/app/api/systemlogs/systemAdminLogs";


export async function GET() {
  const result = {
    public: false,
    admin: false,
    usage: { current: 0, diff: 0, rate: 0, lastUpdated: null as string | null },
    timestamp: new Date().toISOString()
  };

  try {
    try { await checkPublicSchemaHealth(); result.public = true; }
    catch (e) { console.warn("[health GET] 공용 스키마 오프라인:", e); }

    try { await checkAdminSchemaHealth(); result.admin = true; }
    catch (e) { console.warn("[health GET] 어드민 스키마 오프라인:", e); }

    if (result.admin) {
      try {
        await smartUpsertUsage();
        result.usage = await getUsageStats();
      } catch (e) {
        console.warn("[health GET] 용량 스마트 업서트 실패:", e);
        try { result.usage = await getUsageStats(); } catch {}
      }
    }

    const overallSuccess = result.public && result.admin;
    return NextResponse.json({
      ...result,
      status: overallSuccess ? "active" : "degraded",
      code: overallSuccess ? 200 : 207
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", error: errorMessage }, { status: 500 });
  }
}


export async function POST() {
  const result = {
    public: false,
    admin: false,
    usage: { current: 0, diff: 0, rate: 0, lastUpdated: null as string | null },
    timestamp: new Date().toISOString()
  };

  try {
    try { await checkPublicSchemaHealth(); result.public = true; }
    catch (e) { console.warn("[health POST] 공용 스키마 오프라인:", e); }

    try { await checkAdminSchemaHealth(); result.admin = true; }
    catch (e) { console.warn("[health POST] 어드민 스키마 오프라인:", e); }

    if (result.admin) {
      try {
        await smartUpsertUsage();
        result.usage = await getUsageStats();
      } catch (e) {
        console.warn("[health POST] 용량 업데이트 실패:", e);
        try { result.usage = await getUsageStats(); } catch {}
      }
    }

    const overallSuccess = result.public && result.admin;

    return NextResponse.json({
      ...result,
      status: overallSuccess ? "active" : "degraded",
      code: overallSuccess ? 200 : 207
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: "error", error: errorMessage }, { status: 500 });
  }
}
