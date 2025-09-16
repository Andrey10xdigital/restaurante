"use client"

import { useEffect, useState } from "react"
import { RestaurantCard } from "@/components/restaurant-card"
import { Loader2, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Restaurant {
  id: string
  name: string
  address: string
  cuisine_type: string
  status: "want_to_go" | "been_there"
  photo_url?: string
  created_at: string
  average_price?: string
  tags?: Array<{
    id: string
    name: string
    color: string
  }>
}

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

  useEffect(() => {
    fetchRestaurants()
  }, [status])

  useEffect(() => {
    let filtered = restaurants

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          restaurant.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by cuisine type
    if (selectedCuisine !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.cuisine_type === selectedCuisine)
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter((restaurant) => restaurant.tags?.some((tag) => tag.name === selectedTag))
    }

    setFilteredRestaurants(filtered)
  }, [restaurants, searchTerm, selectedCuisine, selectedTag])

  const fetchRestaurants = () => {
    try {
      const storedRestaurants = /* replaced */ null // TODO: use fetchRestaurants()
      const allRestaurants: Restaurant[] = storedRestaurants ? JSON.parse(storedRestaurants) : []

      const filteredRestaurants = allRestaurants.filter((restaurant) => restaurant.status === status)
      setRestaurants(filteredRestaurants)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestaurantUpdate = () => {
    fetchRestaurants()
  }

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
                {uniqueCuisines.map((cuisine) => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as tags</SelectItem>
                {uniqueTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || selectedCuisine !== "all" || selectedTag !== "all") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Filtros ativos:</span>
              {searchTerm && (
                <Badge variant="secondary" className="gap-1">
                  Busca: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCuisine !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCuisine}
                  <button
                    onClick={() => setSelectedCuisine("all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedTag !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedTag}
                  <button
                    onClick={() => setSelectedTag("all")}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}

      {restaurants.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Mostrando {filteredRestaurants.length} de {restaurants.length} restaurantes
        </div>
      )}

      {filteredRestaurants.length === 0 && restaurants.length > 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum restaurante encontrado</h3>
          <p className="text-muted-foreground">Tente ajustar os filtros para encontrar o que procura</p>
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🍽️</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {status === "want_to_go" ? "Nenhum restaurante na lista de desejos" : "Nenhum restaurante visitado"}
          </h3>
          <p className="text-muted-foreground">
            {status === "want_to_go"
              ? "Adicione restaurantes que você gostaria de visitar"
              : "Marque restaurantes como visitados para vê-los aqui"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} onUpdate={handleRestaurantUpdate} />
          ))}
        </div>
      )}
    </div>
  )
}
