/**
 * app/api/dishes/route.ts
 * GET -> list dishes
 * POST -> add dish (expects JSON body)
 *
 * Make sure you created a 'dishes' table in Supabase:
 *   id uuid primary key default gen_random_uuid(),
 *   restaurant_id uuid references restaurants(id),
 *   name text,
 *   rating int,
 *   notes text,
 *   photo_url text,
 *   created_at timestamptz default now()
 */

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('dishes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const payload = {
      restaurant_id: body.restaurant_id ?? null,
      name: body.name ?? null,
      rating: body.rating ?? null,
      notes: body.notes ?? null,
      photo_url: body.photo_url ?? null,
    }
    const { data, error } = await supabaseServer
      .from('dishes')
      .insert([payload])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? String(e) }, { status: 400 })
  }
}
