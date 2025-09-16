"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhotoUploadProps {
  onPhotoSelect: (file: File) => void
  currentPhoto?: string
  onPhotoRemove?: () => void
  className?: string
  disabled?: boolean
}

export function PhotoUpload({ onPhotoSelect, currentPhoto, onPhotoRemove, className, disabled }: PhotoUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentPhoto || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const files = e.target.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      alert("A imagem deve ter no máximo 5MB.")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    onPhotoSelect(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    onPhotoRemove?.()
  }

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        <div className="relative">
          <div className="aspect-video w-full overflow-hidden rounded-lg border">
            <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center transition-colors",
            dragActive && "border-primary bg-primary/5",
            !disabled && "hover:border-primary/50 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="bg-muted rounded-full p-4">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Adicionar foto</p>
              <p className="text-xs text-muted-foreground mt-1">Clique para selecionar ou arraste uma imagem aqui</p>
              <p className="text-xs text-muted-foreground">PNG, JPG até 5MB</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-2 bg-transparent" disabled={disabled}>
              <Upload className="h-4 w-4" />
              Selecionar Arquivo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
