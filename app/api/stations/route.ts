import { NextResponse } from 'next/server'
import { supabase } from '@/client/lib/supabase'
import { __SUBWAY_STATION_TABLE } from '@/shared/index'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(__SUBWAY_STATION_TABLE.name)
      .select('*')
      .order('station_name_kr', { ascending: true })

    if (error) {
      console.error('[API] Error fetching stations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
