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

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, location_name, location_lat, location_lng, category, tags, related_station, related_line, nearest_exit, location_address_kr, location_address_en, location_opening_hours, location_rating, location_thumbnail_url, location_memo, location_instagram, location_phone, location_images, location_content, is_archived, is_home_hero, is_sponsored, is_vegan, weight } = body

    if (!location_name) {
      return NextResponse.json({ error: 'location_name is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from(__LOCATION_TABLE.name)
      .insert([
        {
          title: title || '',
          location_name,
          location_lat: (location_lat === '' || location_lat === null || location_lat === undefined) ? null : Number(location_lat),
          location_lng: (location_lng === '' || location_lng === null || location_lng === undefined) ? null : Number(location_lng),
          category: category || [],
          tags: tags || [],
          related_station: related_station || [],
          related_line: related_line || [],
          nearest_exit: nearest_exit || [],
          location_address_kr: location_address_kr || null,
          location_address_en: location_address_en || null,
          location_opening_hours: location_opening_hours || null,
          location_rating: location_rating || 0,
          location_thumbnail_url: location_thumbnail_url || null,
          location_memo: location_memo || null,
          location_instagram: location_instagram || null,
          location_phone: location_phone || null,
          location_images: location_images || [],
          location_content: location_content || { ko: '', en: '' },
          is_archived: is_archived || false,
          is_home_hero: is_home_hero || false,
          is_sponsored: is_sponsored || false,
          is_vegan: is_vegan || false,
          weight: weight || 0
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('[API] Error creating location:', error)
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
      .from(__LOCATION_TABLE.name)
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[API] Error deleting location:', error)
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
    const { id, title, location_name, location_lat, location_lng, category, tags, related_station, related_line, nearest_exit, location_address_kr, location_address_en, location_opening_hours, location_rating, location_thumbnail_url, location_memo, location_instagram, location_phone, location_images, location_content, is_archived, is_home_hero, is_sponsored, is_vegan, weight } = body

    if (!id || !location_name) {
      return NextResponse.json({ error: 'id and location_name are required' }, { status: 400 })
    }

    const updatePayload: Record<string, unknown> = {
      location_name,
    }

    if (title !== undefined) updatePayload.title = title
    if (location_lat !== undefined) updatePayload.location_lat = (location_lat === '' || location_lat === null) ? null : Number(location_lat)
    if (location_lng !== undefined) updatePayload.location_lng = (location_lng === '' || location_lng === null) ? null : Number(location_lng)
    if (category !== undefined) updatePayload.category = category
    if (tags !== undefined) updatePayload.tags = tags
    if (related_station !== undefined) updatePayload.related_station = related_station
    if (related_line !== undefined) updatePayload.related_line = related_line
    if (nearest_exit !== undefined) updatePayload.nearest_exit = nearest_exit
    if (location_address_kr !== undefined) updatePayload.location_address_kr = location_address_kr
    if (location_address_en !== undefined) updatePayload.location_address_en = location_address_en
    if (location_opening_hours !== undefined) updatePayload.location_opening_hours = location_opening_hours
    if (location_rating !== undefined) updatePayload.location_rating = location_rating
    if (location_thumbnail_url !== undefined) updatePayload.location_thumbnail_url = location_thumbnail_url
    if (location_memo !== undefined) updatePayload.location_memo = location_memo
    if (location_instagram !== undefined) updatePayload.location_instagram = location_instagram
    if (location_phone !== undefined) updatePayload.location_phone = location_phone
    if (location_images !== undefined) updatePayload.location_images = location_images
    if (location_content !== undefined) updatePayload.location_content = location_content
    if (is_archived !== undefined) updatePayload.is_archived = is_archived
    if (is_home_hero !== undefined) updatePayload.is_home_hero = is_home_hero
    if (is_sponsored !== undefined) updatePayload.is_sponsored = is_sponsored
    if (is_vegan !== undefined) updatePayload.is_vegan = is_vegan
    if (weight !== undefined) updatePayload.weight = weight

    const { data, error } = await supabase
      .from(__LOCATION_TABLE.name)
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('[API] Error updating location:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    console.error('[API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
