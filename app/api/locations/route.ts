import { NextResponse } from 'next/server'
import { supabase } from '@/client/lib/supabase'
import { __LOCATION_TABLE } from '@/shared/index'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(__LOCATION_TABLE.name)
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API] Error fetching locations:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
