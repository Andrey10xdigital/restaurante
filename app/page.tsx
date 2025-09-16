import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChefHat, Utensils, Shuffle, Heart } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-teal-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-4">
              <ChefHat className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-4 text-balance">Se beber não coma</h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty max-w-2xl mx-auto">
            Descubra novos sabores, organize seus restaurantes favoritos e deixe a sorte decidir onde vocês vão jantar
            hoje!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/dashboard">Começar Agora</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/roulette">Roleta dos Restaurantes</Link>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 rounded-lg bg-card shadow-sm">
            <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Utensils className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Organize seus Restaurantes</h3>
            <p className="text-muted-foreground text-pretty">
              Mantenha uma lista dos lugares que já visitou e dos que ainda quer conhecer, com fotos e avaliações.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card shadow-sm">
            <div className="bg-secondary/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Shuffle className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Roleta da Decisão</h3>
            <p className="text-muted-foreground text-pretty">
              Não consegue decidir onde ir? Use nossa roleta interativa para escolher aleatoriamente entre seus
              favoritos.
            </p>
          </div>

          <div className="text-center p-6 rounded-lg bg-card shadow-sm">
            <div className="bg-accent/10 rounded-full p-3 w-fit mx-auto mb-4">
              <Heart className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Para Casais</h3>
            <p className="text-muted-foreground text-pretty">
              Compartilhe suas descobertas culinárias, avalie pratos juntos e criem memórias gastronômicas especiais.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-primary/5 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Pronto para descobrir novos sabores?</h2>
          <p className="text-muted-foreground mb-6 text-pretty">
            Organize seus restaurantes favoritos e use a roleta para decidir onde ir comer hoje!
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/dashboard">Começar Agora</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
