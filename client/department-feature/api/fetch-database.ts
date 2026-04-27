import { SubwayLine, SubwayStation } from '@/shared/types/supabase.schema'

export interface FetchDatabaseResponse {
  lines: SubwayLine[]
  stations: SubwayStation[]
}

export const fetchDatabaseData = async (method: 'GET' | 'POST' = 'GET'): Promise<FetchDatabaseResponse> => {
  const [linesRes, stationsRes] = await Promise.all([
    fetch(`/api/subway-lines?method=${method}`).then(res => res.json()),
    fetch(`/api/stations?method=${method}`).then(res => res.json())
  ])

  if (linesRes.error) throw new Error(linesRes.error)
  if (stationsRes.error) throw new Error(stationsRes.error)

  return {
    lines: linesRes.data as SubwayLine[],
    stations: stationsRes.data as SubwayStation[]
  }
}
