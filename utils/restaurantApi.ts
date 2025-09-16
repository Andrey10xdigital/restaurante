/**
 * utils/restaurantApi.ts
 * Frontend fetch wrappers to replace localStorage reads/writes.
 */

export async function fetchRestaurants() {
  const res = await fetch('/api/restaurants')
  if (!res.ok) throw new Error('Failed to fetch restaurants')
  return res.json()
}

export async function addRestaurant(payload: { name: string; notes?: string }) {
  const res = await fetch('/api/restaurants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const err = await res.json().catch(()=>({error: 'unknown'}))
    throw new Error(err?.error || 'Failed to add restaurant')
  }
  return res.json()
}
