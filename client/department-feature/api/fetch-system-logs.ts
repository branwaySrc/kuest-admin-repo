import { HealthResponse } from '@/shared/types/server-health.schema';

export const fetchSystemLogs = async (method: 'GET' | 'POST' = 'GET'): Promise<HealthResponse> => {
  const res = await fetch('/api/systemlogs', { method });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
};
