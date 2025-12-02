"use client"

import { useQuery } from "@tanstack/react-query"
import { stockApi } from "@/lib/api/stock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, Package, Bell, ArrowRight } from "lucide-react"
import Link from "next/link"

const alertTypeConfig = {
  STOCK_FAIBLE: {
    label: "Stock faible",
    variant: "secondary" as const,
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  RUPTURE_STOCK: {
    label: "Rupture",
    variant: "destructive" as const,
    className: "",
  },
  SURSTOCK: {
    label: "Surstock",
    variant: "outline" as const,
    className: "",
  },
}

export function RecentAlerts() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["unread-alerts"],
    queryFn: stockApi.getUnreadAlerts,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Alertes Stock
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/alertes">
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : !alerts?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucune alerte</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => {
                const config = alertTypeConfig[alert.type || "STOCK_FAIBLE"]
                return (
                  <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border bg-card">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm truncate">{alert.article?.designation}</p>
                        <Badge variant={config.variant} className={config.className}>
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Stock actuel: {alert.stockActuel} / Seuil: {alert.seuil}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
