"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Shuffle } from "lucide-react"

// Components UI
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

// Components do app
import { RestaurantList } from "@/components/restaurant-list"
import { AddRestaurantDialog } from "@/components/add-restaurant-dialog"

export function RestaurantTabs() {
  const [activeTab, setActiveTab] = useState<"want-to-go" | "been-there">("want-to-go")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Meus Restaurantes</h2>
          <p className="text-muted-foreground">Organize e descubra novos lugares para comer</p>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Restaurante
          </Button>
          <Button asChild variant="secondary" className="gap-2">
            <Link href="/roulette">
              <Shuffle className="h-4 w-4" />
              Roleta
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="want-to-go">Quero Ir</TabsTrigger>
          <TabsTrigger value="been-there">Já Fui</TabsTrigger>
        </TabsList>

        <TabsContent value="want-to-go" className="mt-6">
          <RestaurantList status="want_to_go" />
        </TabsContent>
        <TabsContent value="been-there" className="mt-6">
          <RestaurantList status="been_there" />
        </TabsContent>
      </Tabs>

      {/* Dialog */}
      <AddRestaurantDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        defaultStatus={activeTab === "want-to-go" ? "want_to_go" : "been_there"}
      />
    </div>
  )
}
