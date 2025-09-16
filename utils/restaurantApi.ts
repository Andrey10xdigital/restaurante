// lib/restaurantApi.ts
import { supabase } from "@/./lib/supabaseClient"

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Restaurant {
  id: string
  name: string
  address?: string
  cuisine_type?: string
  status: "want_to_go" | "been_there"
  photo_url?: string
  created_at: string
  average_price?: string
  notes?: string
  tags?: Tag[]
}

// Adiciona um novo restaurante
export async function addRestaurant(restaurant: Omit<Restaurant, "id" | "created_at">) {
  const newRestaurant = {
    ...restaurant,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
  }

  const { data, error } = await supabase
    .from("restaurants")
    .insert([newRestaurant])
    .select("*") // retorna todos os campos após inserção

  if (error) {
    console.error("Erro ao adicionar restaurante:", error)
    throw error
  }

  return data[0]
}

// Busca todos os restaurantes
export async function getRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase
    .from("restaurants")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar restaurantes:", error)
    throw error
  }

  return data
}

// Atualiza restaurante (ex: status, notes, tags, photo_url, etc.)
export async function updateRestaurant(id: string, updates: Partial<Restaurant>) {
  const { data, error } = await supabase
    .from("restaurants")
    .update(updates)
    .eq("id", id)
    .select("*")

  if (error) {
    console.error("Erro ao atualizar restaurante:", error)
    throw error
  }

  return data[0]
}

// Exclui restaurante
export async function deleteRestaurant(id: string) {
  const { data, error } = await supabase.from("restaurants").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar restaurante:", error)
    throw error
  }

  return data
}
