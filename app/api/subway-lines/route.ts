import { NextResponse } from 'next/server'
import { supabase } from '@/client/lib/supabase'
import { __SUBWAY_LINE_TABLE } from '@/shared/index'

export async function GET() {
  try {
    const { data, error } = await supabase
      .from(__SUBWAY_LINE_TABLE.name)
      .select('*')
      .order('id', { ascending: true })

    if (error) {
      console.error('[API] Error fetching subway lines:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
