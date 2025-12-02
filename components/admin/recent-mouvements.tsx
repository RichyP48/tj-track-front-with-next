"use client"

import { useQuery } from "@tanstack/react-query"
import { stockApi } from "@/lib/api/stock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowDownCircle, ArrowUpCircle, ArrowRight, History } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const mouvementTypeConfig = {
  ENTREE: {
    label: "Entrée",
    icon: ArrowDownCircle,
    className: "text-green-600",
    badgeClass: "bg-green-100 text-green-800",
  },
  SORTIE: {
    label: "Sortie",
    icon: ArrowUpCircle,
    className: "text-red-600",
    badgeClass: "bg-red-100 text-red-800",
  },
  CORRECTION_POSITIVE: {
    label: "Correction +",
    icon: ArrowDownCircle,
    className: "text-blue-600",
    badgeClass: "bg-blue-100 text-blue-800",
  },
  CORRECTION_NEGATIVE: {
    label: "Correction -",
    icon: ArrowUpCircle,
    className: "text-orange-600",
    badgeClass: "bg-orange-100 text-orange-800",
  },
}

export function RecentMouvements() {
  const { data: mouvements, isLoading } = useQuery({
    queryKey: ["recent-mouvements"],
    queryFn: stockApi.getAllMouvements,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Mouvements récents
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/mouvements">
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
        ) : !mouvements?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Aucun mouvement</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {mouvements.slice(0, 10).map((mvt) => {
                const config = mouvementTypeConfig[mvt.typeMouvement || "ENTREE"]
                const Icon = config.icon
                return (
                  <div key={mvt.id} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
                    <div className={`h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-4 w-4 ${config.className}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm truncate">{mvt.articleDesignation}</p>
                        <Badge variant="outline" className={config.badgeClass}>
                          {config.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>Qté: {mvt.quantite}</span>
                        <span>•</span>
                        <span>
                          {mvt.dateMouvement && format(new Date(mvt.dateMouvement), "dd MMM à HH:mm", { locale: fr })}
                        </span>
                      </div>
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
