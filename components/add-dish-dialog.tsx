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
import { Textarea } from "@/components/ui/textarea"
import { PhotoUpload } from "@/components/photo-upload"
import { Star, Loader2 } from "lucide-react"
import { addDish } from '@/utils/dishApi'

interface AddDishDialogProps {
  restaurantId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onDishAdded: () => void
}

export function AddDishDialog({ restaurantId, open, onOpenChange, onDishAdded }: AddDishDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    rating: 0,
    notes: "",
  })
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const dishId = crypto.randomUUID()

      // Upload photo if selected
      let photoUrl = null
      if (selectedPhoto) {
        photoUrl = await uploadPhoto(selectedPhoto)
      }

      const newDish = {
        id: dishId,
        restaurant_id: restaurantId,
        name: formData.name,
        rating: formData.rating || null,
        notes: formData.notes || null,
        photo_url: photoUrl,
        created_at: new Date().toISOString(),
      }

      // Send to server (Supabase)
      const created = await addDish({
        restaurant_id: newDish.restaurant_id,
        name: newDish.name,
        rating: newDish.rating,
        notes: newDish.notes,
        photo_url: newDish.photo_url
      })
      try { onDishAdded?.(created) } catch(e) { onDishAdded && onDishAdded() }

      setFormData({
        name: "",
        rating: 0,
        notes: "",
      })
      setSelectedPhoto(null)

      onDishAdded()
      onOpenChange(false)
    } catch (error) {
      console.error("Error adding dish:", error)
      alert("Erro ao adicionar prato. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Prato</DialogTitle>
          <DialogDescription>Adicione um prato que você experimentou neste restaurante.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="dish-name">Nome do Prato</Label>
              <Input
                id="dish-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Salmão grelhado"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Avaliação (opcional)</Label>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                    className="p-1"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        i < formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"
                      }`}
                    />
                  </button>
                ))}
                {formData.rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: 0 })}
                    className="ml-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Como estava o prato? Alguma observação especial?"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label>Foto do Prato (opcional)</Label>
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
              Adicionar Prato
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
