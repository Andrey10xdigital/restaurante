/**
 * utils/dishApi.ts
 * Frontend fetch wrappers for dishes.
 */

export async function fetchDishes() {
  const res = await fetch('/api/dishes')
  if (!res.ok) throw new Error('Failed to fetch dishes')
  return res.json()
}

export async function addDish(payload: { restaurant_id?: string; name: string; rating?: number; notes?: string; photo_url?: string }) {
  const res = await fetch('/api/dishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error: 'unknown'}))
    throw new Error(err?.error || 'Failed to add dish')
  }
  return res.json()
}
