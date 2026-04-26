import { HealthResponse } from '@/app/api/systemlogs/shared';

export const fetchSystemLogs = async (method: 'GET' | 'POST' = 'GET'): Promise<HealthResponse> => {
  const res = await fetch('/api/systemlogs', { method });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
};