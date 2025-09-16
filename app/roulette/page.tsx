import { RouletteWheel } from "@/components/roulette-wheel"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RoulettePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/dashboard" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Link>
          </Button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground mb-2">Roleta dos Restaurantes</h1>
            <p className="text-muted-foreground text-lg">Deixe a sorte decidir onde vocês vão comer hoje!</p>
          </div>
        </div>

        <RouletteWheel />
      </div>
    </div>
  )
}
