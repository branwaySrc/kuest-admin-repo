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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { station_name_kr, station_name_en, station_lat, station_lng, line_ids } = body

    if (!station_name_kr) {
      return NextResponse.json({ error: 'station_name_kr is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from(__SUBWAY_STATION_TABLE.name)
      .insert([
        {
          station_name_kr,
          station_name_en: station_name_en || null,
          station_lat: (station_lat === '' || station_lat === null || station_lat === undefined) ? null : Number(station_lat),
          station_lng: (station_lng === '' || station_lng === null || station_lng === undefined) ? null : Number(station_lng),
          line_ids: line_ids || []
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('[API] Error creating station:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const { error } = await supabase
      .from(__SUBWAY_STATION_TABLE.name)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[API] Error deleting station:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, station_name_kr, station_name_en, station_lat, station_lng, line_ids } = body

    if (!id || !station_name_kr) {
      return NextResponse.json({ error: 'id and station_name_kr are required' }, { status: 400 })
    }

    const updatePayload: Record<string, string | number | string[] | null> = {
      station_name_kr,
    }

    if (station_name_en !== undefined) updatePayload.station_name_en = station_name_en || null
    if (station_lat !== undefined) updatePayload.station_lat = (station_lat === '' || station_lat === null) ? null : Number(station_lat)
    if (station_lng !== undefined) updatePayload.station_lng = (station_lng === '' || station_lng === null) ? null : Number(station_lng)
    if (line_ids !== undefined) updatePayload.line_ids = line_ids

    const { data, error } = await supabase
      .from(__SUBWAY_STATION_TABLE.name)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[API] Error updating station:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
