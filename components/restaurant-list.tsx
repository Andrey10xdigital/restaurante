"use client"

import { useEffect, useState } from "react"
import { RestaurantCard } from "@/components/restaurant-card"
import { Loader2, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getRestaurants, Restaurant } from "@/utils/restaurantApi"

interface RestaurantListProps {
  status: "want_to_go" | "been_there"
}

export function RestaurantList({ status }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all")
  const [selectedTag, setSelectedTag] = useState<string>("all")

  const loadRestaurants = async () => {
    setLoading(true)
    try {
      const data = await getRestaurants()
      // filtra pelo status
      const filtered = data.filter((r) => r.status === status)
      setRestaurants(filtered)
      setFilteredRestaurants(filtered)
    } catch (err) {
      console.error("Erro ao buscar restaurantes:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRestaurants()
  }, [status])

  useEffect(() => {
    let filtered = restaurants

    if (searchTerm) {
      filtered = filtered.filter(
        (r) =>
          r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (r.address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      )
    }

    if (selectedCuisine !== "all") {
      filtered = filtered.filter((r) => r.cuisine_type === selectedCuisine)
    }

    if (selectedTag !== "all") {
      filtered = filtered.filter((r) => r.tags?.some((t) => t.name === selectedTag))
    }

    setFilteredRestaurants(filtered)
  }, [restaurants, searchTerm, selectedCuisine, selectedTag])

  const uniqueCuisines = [...new Set(restaurants.map((r) => r.cuisine_type))].sort()
  const uniqueTags = [...new Set(restaurants.flatMap((r) => r.tags?.map((t) => t.name) || []))].sort()

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      {restaurants.length > 0 && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filtros</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de culinária" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {uniqueCuisines.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {uniqueTags.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Lista de Restaurantes */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((r) => (
            <RestaurantCard key={r.id} restaurant={r} onUpdate={loadRestaurants} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">{restaurants.length === 0 ? "🍽️" : "🔍"}</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {restaurants.length === 0
              ? status === "want_to_go"
                ? "Nenhum restaurante na lista de desejos"
                : "Nenhum restaurante visitado"
              : "Nenhum restaurante encontrado"}
          </h3>
          <p className="text-muted-foreground">
            {restaurants.length === 0
              ? status === "want_to_go"
                ? "Adicione restaurantes que você gostaria de visitar"
                : "Marque restaurantes como visitados para vê-los aqui"
              : "Tente ajustar os filtros para encontrar o que procura"}
          </p>
        </div>
      )}
    </div>
  )
}
