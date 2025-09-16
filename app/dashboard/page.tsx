import { RestaurantTabs } from "@/components/restaurant-tabs"
import { DashboardHeader } from "@/components/dashboard-header"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-8">
        <RestaurantTabs />
      </main>
    </div>
  )
}
