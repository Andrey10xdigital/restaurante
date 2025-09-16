"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, MapPin, Utensils, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getRestaurants } from "@/utils/restaurantApi"

interface Restaurant {
  id: string
  name: string
  address?: string
  cuisine_type?: string
  status: "want_to_go" | "been_there"
  photo_url?: string
  tags?: Array<{ id: string; name: string; color: string }>
}

export function RouletteWheel() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [filter, setFilter] = useState<"all" | "want_to_go" | "favorites">("all")
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [restaurants, filter])

  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants()
      setRestaurants(data)
    } catch (error) {
      console.error("Erro ao buscar restaurantes:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = restaurants
    if (filter === "want_to_go") filtered = restaurants.filter(r => r.status === "want_to_go")
    if (filter === "favorites") filtered = restaurants.filter(r => r.tags?.some(t => t.name === "Favorito"))
    setFilteredRestaurants(filtered)
  }

  const spinWheel = () => {
    if (filteredRestaurants.length === 0) return
    setIsSpinning(true)
    setSelectedRestaurant(null)

    const spins = 5 + Math.random() * 5
    const finalAngle = Math.random() * 360
    const totalRotation = rotation + spins * 360 + finalAngle
    setRotation(totalRotation)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length)
      setSelectedRestaurant(filteredRestaurants[randomIndex])
      setIsSpinning(false)
    }, 3000)
  }

  if (loading) return <Loader2 className="h-8 w-8 animate-spin mx-auto mt-12" />

  if (restaurants.length === 0)
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎰</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum restaurante cadastrado</h3>
      </div>
    )

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Filtro */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros da Roleta</CardTitle>
          <CardDescription>Escolha quais restaurantes incluir</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4 items-center">
          <Select value={filter} onValueChange={v => setFilter(v as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos ({restaurants.length})</SelectItem>
              <SelectItem value="want_to_go">Quero ir ({restaurants.filter(r => r.status === "want_to_go").length})</SelectItem>
              <SelectItem value="favorites">
                Favoritos ({restaurants.filter(r => r.tags?.some(t => t.name === "Favorito")).length})
              </SelectItem>
            </SelectContent>
          </Select>
          <div>{filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? "s" : ""}</div>
        </CardContent>
      </Card>

      {/* Roleta */}
      <div className="flex flex-col items-center">
        <div className="relative w-80 h-80">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
            <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
          </div>
          <div
            className="w-full h-full rounded-full border-8 border-primary shadow-2xl transition-transform duration-[3000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              background: `conic-gradient(${filteredRestaurants
                .map((_, i) => {
                  const colors = ["#15803d", "#84cc16", "#10b981", "#059669", "#4ade80", "#bbf7d0"]
                  const start = (i / filteredRestaurants.length) * 360
                  const end = ((i + 1) / filteredRestaurants.length) * 360
                  return `${colors[i % colors.length]} ${start}deg ${end}deg`
                })
                .join(", ")})`,
            }}
          ></div>
        </div>

        <Button onClick={spinWheel} disabled={isSpinning || filteredRestaurants.length === 0} className="mt-4 gap-2">
          {isSpinning ? "Girando..." : <><Shuffle className="h-5 w-5" /> Girar Roleta</>}
        </Button>
      </div>

      {/* Resultado */}
      {selectedRestaurant && (
        <Card className="mt-8 border-primary shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>🎉 Resultado!</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row items-center gap-6">
            {selectedRestaurant.photo_url ? (
              <img src={selectedRestaurant.photo_url} className="w-48 aspect-video rounded-lg object-cover" />
            ) : (
              <div className="w-48 aspect-video bg-muted flex items-center justify-center rounded-lg">
                <Utensils className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1 text-center md:text-left space-y-2">
              <h3 className="text-2xl font-bold">{selectedRestaurant.name}</h3>
              <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{selectedRestaurant.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
