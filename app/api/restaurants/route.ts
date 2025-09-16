/**
 * app/api/restaurants/route.ts
 * Simple CRUD route handler for restaurants.
 * GET -> list restaurants
 * POST -> add restaurant (expects JSON body)
 *
 * Make sure you created a 'restaurants' table in Supabase:
 *   id uuid primary key default gen_random_uuid(),
 *   name text,
 *   notes text,
 *   created_at timestamptz default now()
 *
 */

import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('restaurants')
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
    const { data, error } = await supabaseServer
      .from('restaurants')
      .insert([body])
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
