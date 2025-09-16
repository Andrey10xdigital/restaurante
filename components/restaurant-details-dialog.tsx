"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Utensils, Plus, Star, Edit, X } from "lucide-react"
import { AddDishDialog } from "@/components/add-dish-dialog"

interface Restaurant {
  id: string
  name: string
  address: string
  cuisine_type: string
  status: "want_to_go" | "been_there"
  photo_url?: string
  created_at: string
  tags?: Array<{
    id: string
    name: string
    color: string
  }>
}

interface Dish {
  id: string
  name: string
  rating?: number
  notes?: string
  photo_url?: string
  restaurant_id: string
}

interface RestaurantDetailsDialogProps {
  restaurant: Restaurant
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: () => void
}

const availableTags = [
  { name: "Favorito", color: "#ef4444" },
  { name: "Não voltaria", color: "#6b7280" },
  { name: "Lugar aconchegante", color: "#f59e0b" },
  { name: "Barato", color: "#10b981" },
  { name: "Caro", color: "#8b5cf6" },
  { name: "Atendimento bom", color: "#06b6d4" },
  { name: "Lugar bonito", color: "#ec4899" },
  { name: "Saboroso", color: "#84cc16" },
]

export function RestaurantDetailsDialog({ restaurant, open, onOpenChange, onUpdate }: RestaurantDetailsDialogProps) {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [isAddDishOpen, setIsAddDishOpen] = useState(false)
  const [isEditingTags, setIsEditingTags] = useState(false)
  const [selectedTags, setSelectedTags] = useState<Array<{ name: string; color: string }>>([])

  useEffect(() => {
    if (open && restaurant.status === "been_there") {
      fetchDishes()
    }
    if (open) {
      setSelectedTags(restaurant.tags?.map((tag) => ({ name: tag.name, color: tag.color })) || [])
    }
  }, [open, restaurant.id, restaurant.tags])

  const fetchDishes = () => {
    try {
      const storedDishes = /* replaced */ null // TODO: fetch from Supabase (dishes)
      const allDishes: Dish[] = storedDishes ? JSON.parse(storedDishes) : []
      const restaurantDishes = allDishes.filter((dish) => dish.restaurant_id === restaurant.id)
      setDishes(restaurantDishes)
    } catch (error) {
      console.error("Error fetching dishes:", error)
    }
  }

  const handleDishAdded = () => {
    fetchDishes()
  }

  const handleTagToggle = (tag: { name: string; color: string }) => {
    setSelectedTags((prev) => {
      const exists = prev.find((t) => t.name === tag.name)
      if (exists) {
        return prev.filter((t) => t.name !== tag.name)
      } else {
        return [...prev, tag]
      }
    })
  }

  const handleSaveTags = () => {
    try {
      const storedRestaurants = /* replaced */ null // TODO: use fetchRestaurants()
      const restaurants = storedRestaurants ? JSON.parse(storedRestaurants) : []

      const updatedRestaurants = restaurants.map((r: any) =>
        r.id === restaurant.id ? { ...r, tags: selectedTags.map((tag) => ({ ...tag, id: crypto.randomUUID() })) } : r,
      )

      // TODO: replace with addRestaurant() and update state)
      setIsEditingTags(false)
      onUpdate()
    } catch (error) {
      console.error("Error updating tags:", error)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{restaurant.name}</DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {restaurant.address}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {restaurant.photo_url && (
              <div className="aspect-video overflow-hidden rounded-lg">
                <img
                  src={restaurant.photo_url || "/placeholder.svg"}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1">
                  <Utensils className="h-3 w-3" />
                  {restaurant.cuisine_type}
                </Badge>
                <Badge variant={restaurant.status === "been_there" ? "default" : "outline"}>
                  {restaurant.status === "been_there" ? "Já Visitado" : "Quero Visitar"}
                </Badge>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Tags:</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingTags(!isEditingTags)}
                    className="h-6 px-2 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    {isEditingTags ? "Cancelar" : "Editar"}
                  </Button>
                </div>

                {isEditingTags ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {availableTags.map((tag) => {
                        const isSelected = selectedTags.find((t) => t.name === tag.name)
                        return (
                          <Badge
                            key={tag.name}
                            variant={isSelected ? "default" : "outline"}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            style={
                              isSelected
                                ? { backgroundColor: tag.color, borderColor: tag.color }
                                : { borderColor: tag.color, color: tag.color }
                            }
                            onClick={() => handleTagToggle(tag)}
                          >
                            {tag.name}
                            {isSelected && <X className="ml-1 h-3 w-3" />}
                          </Badge>
                        )
                      })}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveTags}>
                        Salvar Tags
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setIsEditingTags(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {restaurant.tags && restaurant.tags.length > 0 ? (
                      restaurant.tags.map((tag) => (
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
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Nenhuma tag adicionada</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {restaurant.status === "been_there" && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Pratos Experimentados</h3>
                    <Button size="sm" onClick={() => setIsAddDishOpen(true)} className="gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar Prato
                    </Button>
                  </div>

                  {dishes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Utensils className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Nenhum prato adicionado ainda</p>
                      <p className="text-sm">Adicione pratos que você experimentou neste restaurante</p>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {dishes.map((dish) => (
                        <div key={dish.id} className="border rounded-lg p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{dish.name}</h4>
                            {dish.rating && (
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < dish.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          {dish.notes && <p className="text-sm text-muted-foreground">{dish.notes}</p>}
                          {dish.photo_url && (
                            <div className="aspect-video max-w-xs overflow-hidden rounded">
                              <img
                                src={dish.photo_url || "/placeholder.svg"}
                                alt={dish.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddDishDialog
        restaurantId={restaurant.id}
        open={isAddDishOpen}
        onOpenChange={setIsAddDishOpen}
        onDishAdded={handleDishAdded}
      />
    </>
  )
}
