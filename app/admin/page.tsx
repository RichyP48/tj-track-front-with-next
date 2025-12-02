"use client"

import { useQuery } from "@tanstack/react-query"

import { StatsCard } from "@/components/admin/stats-card"
import { RecentAlerts } from "@/components/admin/recent-alerts"
import { RecentMouvements } from "@/components/admin/recent-mouvements"
import { LowStockTable } from "@/components/admin/low-stock-table"
import { stockApi } from "@/lib/api/stock"
import { ecommerceApi } from "@/lib/api/admin"
import { Package, ShoppingCart, AlertTriangle, DollarSign } from "lucide-react"

export default function AdminDashboardPage() {
  const { data: stockStats } = useQuery({
    queryKey: ["stock-stats"],
    queryFn: stockApi.getStockStats,
  })

  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: stockApi.getDashboardStats,
  })

  const { data: ecommerceStats } = useQuery({
    queryKey: ["ecommerce-stats"],
    queryFn: ecommerceApi.getStats,
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre activité</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Articles"
            value={stockStats?.totalArticles || 0}
            description="articles en catalogue"
            icon={Package}
          />
          <StatsCard
            title="Stock Faible"
            value={dashboardStats?.lowStockCount || 0}
            description="articles à réapprovisionner"
            icon={AlertTriangle}
            className={dashboardStats?.lowStockCount > 0 ? "border-amber-500" : ""}
          />
          <StatsCard
            title="Ventes du mois"
            value={formatCurrency(ecommerceStats?.monthlyRevenue || 0)}
            description="ce mois"
            icon={DollarSign}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Commandes"
            value={ecommerceStats?.totalOrders || 0}
            description="en attente"
            icon={ShoppingCart}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RecentAlerts />
          <RecentMouvements />
        </div>

        <LowStockTable />
    </div>
  )
}
