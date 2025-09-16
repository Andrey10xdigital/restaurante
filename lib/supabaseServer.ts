/**
 * lib/supabaseServer.ts
 * Server-side Supabase client for Next.js route handlers.
 * Requires two environment variables:
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * WARNING: service role key must only be used on the server.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.log({ supabaseUrl, supabaseServiceRoleKey })
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY env vars')
}

export const supabaseServer = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
})
