"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PhotoUpload } from "@/components/photo-upload"
import { Loader2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { addRestaurant } from "@/utils/restaurantApi"

interface AddRestaurantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultStatus: "want_to_go" | "been_there"
}

const cuisineTypes = [
  "Brasileiro","Italiano","Japonês","Chinês","Mexicano","Francês","Americano",
  "Árabe","Indiano","Tailandês","Coreano","Peruano","Argentino","Português",
  "Espanhol","Grego","Vegetariano","Vegano","Fast Food","Pizzaria","Churrascaria",
  "Frutos do Mar","Outro",
]

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

export function AddRestaurantDialog({ open, onOpenChange, defaultStatus }: AddRestaurantDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    cuisine_type: "",
    status: defaultStatus,
    notes: "",
    average_price: "",
  })
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [selectedTags, setSelectedTags] = useState<Array<{ name: string; color: string }>>([])
  const [isLoading, setIsLoading] = useState(false)

  const uploadPhoto = async (file: File): Promise<string | null> => {
    try {
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          resolve(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      })
    } catch (error) {
      console.error("Error uploading photo:", error)
      return null
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const restaurantId = crypto.randomUUID()

      // Upload photo if selected
      let photoUrl: string | null = null
      if (selectedPhoto) {
        photoUrl = await uploadPhoto(selectedPhoto)
      }

      const newRestaurant = {
        id: restaurantId,
        name: formData.name,
        address: formData.address,
        cuisine_type: formData.cuisine_type,
        status: formData.status,
        photo_url: photoUrl,
        tags: selectedTags.map((tag) => ({ ...tag, id: crypto.randomUUID() })),
        average_price: formData.average_price,
        notes: formData.notes,
        created_at: new Date().toISOString(),
      }

      // Envia todos os campos para o Supabase
      await addRestaurant(newRestaurant)

      // Reset do formulário
      setFormData({
        name: "",
        address: "",
        cuisine_type: "",
        status: defaultStatus,
        notes: "",
        average_price: "",
      })
      setSelectedPhoto(null)
      setSelectedTags([])

      onOpenChange(false)
      window.location.reload() // Refresh simples para atualizar a lista
    } catch (error) {
      console.error("Error adding restaurant:", error)
      alert("Erro ao adicionar restaurante. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Restaurante</DialogTitle>
          <DialogDescription>Adicione um novo restaurante à sua lista.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Restaurante</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Restaurante do João"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Ex: Rua das Flores, 123"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cuisine_type">Tipo de Culinária</Label>
              <Select
                value={formData.cuisine_type}
                onValueChange={(value) => setFormData({ ...formData, cuisine_type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {cuisineTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="average_price">Valor Médio por Pessoa (opcional)</Label>
              <Input
                id="average_price"
                value={formData.average_price}
                onChange={(e) => setFormData({ ...formData, average_price: e.target.value })}
                placeholder="Ex: R$ 50,00"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "want_to_go" | "been_there") => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="want_to_go">Quero Ir</SelectItem>
                  <SelectItem value="been_there">Já Fui</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Tags (opcional)</Label>
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
            </div>
            <div className="grid gap-2">
              <Label>Foto do Restaurante (opcional)</Label>
              <PhotoUpload
                onPhotoSelect={setSelectedPhoto}
                onPhotoRemove={() => setSelectedPhoto(null)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
