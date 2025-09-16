"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shuffle, MapPin, Utensils, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Restaurant {
  id: string
  name: string
  address: string
  cuisine_type: string
  status: "want_to_go" | "been_there"
  photo_url?: string
  tags?: Array<{
    id: string
    name: string
    color: string
  }>
}

export function RouletteWheel() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [filter, setFilter] = useState<"all" | "want_to_go" | "favorites">("all")
  const [loading, setLoading] = useState(true)
  const [rotation, setRotation] = useState(0)

  useEffect(() => {
    fetchRestaurants()
  }, [])

  useEffect(() => {
    applyFilter()
  }, [restaurants, filter])

  const fetchRestaurants = () => {
    try {
      const storedRestaurants = /* replaced */ null // TODO: use fetchRestaurants()
      const allRestaurants: Restaurant[] = storedRestaurants ? JSON.parse(storedRestaurants) : []
      setRestaurants(allRestaurants)
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilter = () => {
    let filtered = restaurants

    switch (filter) {
      case "want_to_go":
        filtered = restaurants.filter((r) => r.status === "want_to_go")
        break
      case "favorites":
        filtered = restaurants.filter((r) => r.tags?.some((tag) => tag.name === "Favorito"))
        break
      default:
        filtered = restaurants
    }

    setFilteredRestaurants(filtered)
  }

  const spinWheel = () => {
    if (filteredRestaurants.length === 0) return

    setIsSpinning(true)
    setSelectedRestaurant(null)

    // Generate random rotation (multiple full spins + random angle)
    const spins = 5 + Math.random() * 5 // 5-10 full spins
    const finalAngle = Math.random() * 360
    const totalRotation = rotation + spins * 360 + finalAngle

    setRotation(totalRotation)

    // Select random restaurant after animation
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filteredRestaurants.length)
      setSelectedRestaurant(filteredRestaurants[randomIndex])
      setIsSpinning(false)
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎰</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Nenhum restaurante cadastrado</h3>
        <p className="text-muted-foreground mb-4">Você precisa adicionar alguns restaurantes antes de usar a roleta.</p>
        <Button asChild>
          <a href="/dashboard">Adicionar Restaurantes</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros da Roleta</CardTitle>
          <CardDescription>Escolha quais restaurantes incluir na roleta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <Select value={filter} onValueChange={(value: "all" | "want_to_go" | "favorites") => setFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os restaurantes ({restaurants.length})</SelectItem>
                  <SelectItem value="want_to_go">
                    Quero ir ({restaurants.filter((r) => r.status === "want_to_go").length})
                  </SelectItem>
                  <SelectItem value="favorites">
                    Favoritos ({restaurants.filter((r) => r.tags?.some((tag) => tag.name === "Favorito")).length})
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredRestaurants.length} restaurante{filteredRestaurants.length !== 1 ? "s" : ""} na roleta
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roulette Wheel */}
      <div className="flex flex-col items-center space-y-8">
        <div className="relative">
          {/* Wheel Container */}
          <div className="relative w-80 h-80 mx-auto">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-primary"></div>
            </div>

            {/* Wheel */}
            <div
              className={`w-full h-full rounded-full border-8 border-primary shadow-2xl transition-transform duration-3000 ease-out ${
                isSpinning ? "animate-pulse" : ""
              }`}
              style={{
                transform: `rotate(${rotation}deg)`,
                background: `conic-gradient(${filteredRestaurants
                  .map((_, index) => {
                    const colors = ["#15803d", "#84cc16", "#10b981", "#059669", "#4ade80", "#bbf7d0"]
                    const startAngle = (index / filteredRestaurants.length) * 360
                    const endAngle = ((index + 1) / filteredRestaurants.length) * 360
                    const color = colors[index % colors.length]
                    return `${color} ${startAngle}deg ${endAngle}deg`
                  })
                  .join(", ")})`,
              }}
            >
              {/* Restaurant Names on Wheel */}
              {filteredRestaurants.map((restaurant, index) => {
                const angle = (index / filteredRestaurants.length) * 360 + 360 / filteredRestaurants.length / 2
                const radius = 120
                const x = Math.cos((angle - 90) * (Math.PI / 180)) * radius
                const y = Math.sin((angle - 90) * (Math.PI / 180)) * radius

                return (
                  <div
                    key={restaurant.id}
                    className="absolute text-white font-semibold text-sm text-center pointer-events-none"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                      maxWidth: "80px",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    }}
                  >
                    {restaurant.name.length > 12 ? `${restaurant.name.substring(0, 12)}...` : restaurant.name}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Spin Button */}
        <Button
          onClick={spinWheel}
          disabled={isSpinning || filteredRestaurants.length === 0}
          size="lg"
          className="text-lg px-8 py-6 gap-3"
        >
          {isSpinning ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Girando...
            </>
          ) : (
            <>
              <Shuffle className="h-5 w-5" />
              Girar Roleta
            </>
          )}
        </Button>
      </div>

      {/* Result */}
      {selectedRestaurant && (
        <Card className="border-primary shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">🎉 Resultado da Roleta!</CardTitle>
            <CardDescription>A sorte escolheu seu próximo destino gastronômico</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center">
              {selectedRestaurant.photo_url ? (
                <div className="w-full md:w-48 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={selectedRestaurant.photo_url || "/placeholder.svg"}
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full md:w-48 aspect-video bg-muted flex items-center justify-center rounded-lg">
                  <Utensils className="h-12 w-12 text-muted-foreground" />
                </div>
              )}

              <div className="flex-1 text-center md:text-left space-y-3">
                <h3 className="text-2xl font-bold text-foreground">{selectedRestaurant.name}</h3>
                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{selectedRestaurant.address}</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <Badge variant="secondary">{selectedRestaurant.cuisine_type}</Badge>
                  <Badge variant={selectedRestaurant.status === "been_there" ? "default" : "outline"}>
                    {selectedRestaurant.status === "been_there" ? "Já Visitado" : "Quero Visitar"}
                  </Badge>
                  {selectedRestaurant.tags?.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{
                        borderColor: tag.color,
                        color: tag.color,
                      }}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2">
                  <Button onClick={spinWheel} variant="outline" className="gap-2 bg-transparent">
                    <Shuffle className="h-4 w-4" />
                    Girar Novamente
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
