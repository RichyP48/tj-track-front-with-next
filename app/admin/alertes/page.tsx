"use client"

import { useQuery } from "@tanstack/react-query"

import { stockApi } from "@/lib/api/stock"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Package, PackageX, Check } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import Link from "next/link"

const alertTypeConfig = {
  STOCK_FAIBLE: {
    label: "Stock faible",
    icon: AlertTriangle,
    className: "bg-amber-100 text-amber-800",
  },
  RUPTURE_STOCK: {
    label: "Rupture de stock",
    icon: PackageX,
    className: "bg-red-100 text-red-800",
  },
  SURSTOCK: {
    label: "Surstock",
    icon: Package,
    className: "bg-blue-100 text-blue-800",
  },
}

export default function AlertesPage() {
  const { data: alerts, isLoading } = useQuery({
    queryKey: ["all-alerts"],
    queryFn: stockApi.getUnreadAlerts,
  })

  const { data: lowStockArticles } = useQuery({
    queryKey: ["low-stock"],
    queryFn: stockApi.getLowStockArticles,
  })

  const { data: outOfStockArticles } = useQuery({
    queryKey: ["out-of-stock"],
    queryFn: stockApi.getOutOfStockArticles,
  })

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Alertes Stock</h1>
          <p className="text-muted-foreground mt-1">Gérez les alertes de stock et les réapprovisionnements</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Alertes non lues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{alerts?.filter((a) => !a.lu).length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Stock faible</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{lowStockArticles?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ruptures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{outOfStockArticles?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="alerts">
          <TabsList>
            <TabsTrigger value="alerts">Alertes ({alerts?.length || 0})</TabsTrigger>
            <TabsTrigger value="low-stock">Stock faible ({lowStockArticles?.length || 0})</TabsTrigger>
            <TabsTrigger value="out-of-stock">Ruptures ({outOfStockArticles?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Article</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Stock actuel</TableHead>
                      <TableHead>Seuil</TableHead>
                      <TableHead>Message</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Chargement...
                        </TableCell>
                      </TableRow>
                    ) : !alerts?.length ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          <Check className="h-8 w-8 mx-auto text-green-500 mb-2" />
                          <p className="text-muted-foreground">Aucune alerte</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      alerts.map((alert) => {
                        const config = alertTypeConfig[alert.type || "STOCK_FAIBLE"]
                        const Icon = config.icon
                        return (
                          <TableRow key={alert.id}>
                            <TableCell>
                              <Link
                                href={`/admin/articles/${alert.article?.id}`}
                                className="font-medium hover:text-primary"
                              >
                                {alert.article?.designation}
                              </Link>
                            </TableCell>
                            <TableCell>
                              <Badge className={config.className}>
                                <Icon className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">{alert.stockActuel}</TableCell>
                            <TableCell className="text-muted-foreground">{alert.seuil}</TableCell>
                            <TableCell className="max-w-[200px] truncate">{alert.message}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {alert.createdAt && format(new Date(alert.createdAt), "dd/MM/yyyy HH:mm", { locale: fr })}
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="low-stock" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Stock actuel</TableHead>
                      <TableHead>Seuil</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lowStockArticles?.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-mono text-sm">{article.codeArticle}</TableCell>
                        <TableCell className="font-medium">{article.designation}</TableCell>
                        <TableCell className="text-muted-foreground">{article.categorie?.designation}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                            {article.quantiteStock}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{article.seuilAlerte}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/articles/${article.id}`}>Gérer</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="out-of-stock" className="mt-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Article</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {outOfStockArticles?.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-mono text-sm">{article.codeArticle}</TableCell>
                        <TableCell className="font-medium">{article.designation}</TableCell>
                        <TableCell className="text-muted-foreground">{article.categorie?.designation}</TableCell>
                        <TableCell>
                          <Badge variant="destructive">Rupture</Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/articles/${article.id}`}>Réapprovisionner</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
