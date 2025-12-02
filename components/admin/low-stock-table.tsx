"use client"

import { useQuery } from "@tanstack/react-query"
import { stockApi } from "@/lib/api/stock"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, ArrowRight, Package } from "lucide-react"
import Link from "next/link"

export function LowStockTable() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["low-stock-articles"],
    queryFn: stockApi.getLowStockArticles,
  })

  const getStockPercentage = (current: number, threshold: number) => {
    if (threshold === 0) return 100
    return Math.min((current / threshold) * 100, 100)
  }

  const getStockStatus = (current: number, threshold: number) => {
    const percentage = getStockPercentage(current, threshold)
    if (current === 0) return { label: "Rupture", variant: "destructive" as const }
    if (percentage < 50) return { label: "Critique", variant: "destructive" as const }
    return { label: "Faible", variant: "secondary" as const }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Articles en stock faible
        </CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/articles?filter=low-stock">
            Voir tout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        ) : !articles?.length ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Tous les stocks sont OK</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Article</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Seuil</TableHead>
                <TableHead>État</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.slice(0, 5).map((article) => {
                const status = getStockStatus(article.quantiteStock || 0, article.seuilAlerte || 10)
                const percentage = getStockPercentage(article.quantiteStock || 0, article.seuilAlerte || 10)
                return (
                  <TableRow key={article.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{article.designation}</p>
                        <p className="text-xs text-muted-foreground">{article.codeArticle}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-y-1">
                        <span className="font-medium">{article.quantiteStock}</span>
                        <Progress value={percentage} className="h-1.5 w-16 mx-auto" />
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-muted-foreground">{article.seuilAlerte}</TableCell>
                    <TableCell>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
