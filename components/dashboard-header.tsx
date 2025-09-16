import { Button } from "@/components/ui/button"
import { ChefHat } from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary rounded-full p-2">
              <ChefHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Se beber não coma</h1>
              <p className="text-sm text-muted-foreground">Organize seus restaurantes favoritos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/roulette" className="gap-2">
                🎰 Roleta
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
