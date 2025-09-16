"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, MoreVertical, Star, Utensils, DollarSign } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { RestaurantDetailsDialog } from "@/components/restaurant-details-dialog"

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

interface RestaurantCardProps {
  restaurant: Restaurant
  onUpdate: () => void
}

const cuisineColors: Record<string, string> = {
  Brasileiro: "#10b981",
  Italiano: "#ef4444",
  Japonês: "#f59e0b",
  Chinês: "#dc2626",
  Mexicano: "#ea580c",
  Francês: "#7c3aed",
  Americano: "#2563eb",
  Árabe: "#059669",
  Indiano: "#c2410c",
  Tailandês: "#16a34a",
  Coreano: "#be123c",
  Peruano: "#0891b2",
  Argentino: "#7c2d12",
  Português: "#0d9488",
  Espanhol: "#b91c1c",
  Grego: "#1d4ed8",
  Vegetariano: "#65a30d",
  Vegano: "#166534",
  "Fast Food": "#dc2626",
  Pizzaria: "#dc2626",
  Churrascaria: "#7f1d1d",
  "Frutos do Mar": "#0891b2",
  Outro: "#6b7280",
}

export function RestaurantCard({ restaurant, onUpdate }: RestaurantCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const handleStatusChange = async () => {
    const newStatus = restaurant.status === "want_to_go" ? "been_there" : "want_to_go"
    try {
      await updateRestaurant(restaurant.id, { status: newStatus })
      onUpdate()
    } catch (error) {
      console.error("Erro ao atualizar status do restaurante:", error)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este restaurante?")) return

    try {
      await deleteRestaurant(restaurant.id)
      onUpdate()
    } catch (error) {
      console.error("Erro ao excluir restaurante:", error)
    }
  }

  const cuisineColor = cuisineColors[restaurant.cuisine_type] || "#6b7280"

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
        <div onClick={() => setIsDetailsOpen(true)}>
          {restaurant.photo_url ? (
            <div className="aspect-video overflow-hidden">
              <img
                src={restaurant.photo_url || "/placeholder.svg"}
                alt={restaurant.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center">
              <Utensils className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">{restaurant.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{restaurant.address}</span>
              </div>
              {restaurant.average_price && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <DollarSign className="h-3 w-3 flex-shrink-0" />
                  <span>{restaurant.average_price}</span>
                </div>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsDetailsOpen(true)}>Ver detalhes</DropdownMenuItem>
                <DropdownMenuItem onClick={handleStatusChange}>
                  {restaurant.status === "want_to_go" ? "Marcar como visitado" : "Marcar como desejo"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <Badge
            variant="outline"
            className="mb-3 bg-background/50"
            style={{
              borderColor: cuisineColor,
              color: cuisineColor,
              backgroundColor: `${cuisineColor}10`,
            }}
          >
            {restaurant.cuisine_type}
          </Badge>
          {restaurant.tags && restaurant.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {restaurant.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: tag.color,
                    color: tag.color,
                  }}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>

        {restaurant.status === "been_there" && (
          <CardFooter className="pt-0">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>Visitado</span>
            </div>
          </CardFooter>
        )}
      </Card>

      <RestaurantDetailsDialog
        restaurant={restaurant}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onUpdate={onUpdate}
      />
    </>
  )
}
