"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { stockApi } from "@/lib/api/stock"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowDownCircle, ArrowUpCircle, Search } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const mouvementTypeConfig = {
  ENTREE: {
    label: "Entrée",
    icon: ArrowDownCircle,
    className: "bg-green-100 text-green-800",
  },
  SORTIE: {
    label: "Sortie",
    icon: ArrowUpCircle,
    className: "bg-red-100 text-red-800",
  },
  CORRECTION_POSITIVE: {
    label: "Correction +",
    icon: ArrowDownCircle,
    className: "bg-blue-100 text-blue-800",
  },
  CORRECTION_NEGATIVE: {
    label: "Correction -",
    icon: ArrowUpCircle,
    className: "bg-orange-100 text-orange-800",
  },
}

export default function MouvementsPage() {
  const [dateDebut, setDateDebut] = useState("")
  const [dateFin, setDateFin] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  const {
    data: mouvements,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["mouvements", dateDebut, dateFin],
    queryFn: () => {
      if (dateDebut && dateFin) {
        return stockApi.getMouvementsByPeriode(new Date(dateDebut).toISOString(), new Date(dateFin).toISOString())
      }
      return stockApi.getAllMouvements()
    },
  })

  const filteredMouvements = mouvements?.filter((mvt) => {
    if (typeFilter === "all") return true
    return mvt.typeMouvement === typeFilter
  })

  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Mouvements de Stock</h1>
          <p className="text-muted-foreground mt-1">Historique de tous les mouvements de stock</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label>Date début</Label>
                <Input type="date" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Date fin</Label>
                <Input type="date" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
              </div>
              <div className="flex-1 space-y-2">
                <Label>Type de mouvement</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tous les types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="ENTREE">Entrées</SelectItem>
                    <SelectItem value="SORTIE">Sorties</SelectItem>
                    <SelectItem value="CORRECTION_POSITIVE">Corrections +</SelectItem>
                    <SelectItem value="CORRECTION_NEGATIVE">Corrections -</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={() => refetch()}>
                  <Search className="h-4 w-4 mr-2" />
                  Filtrer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Article</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantité</TableHead>
                  <TableHead className="text-right">Prix unitaire</TableHead>
                  <TableHead>Motif</TableHead>
                  <TableHead>Utilisateur</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Chargement...
                    </TableCell>
                  </TableRow>
                ) : !filteredMouvements?.length ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun mouvement trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMouvements.map((mvt) => {
                    const config = mouvementTypeConfig[mvt.typeMouvement || "ENTREE"]
                    const Icon = config.icon
                    return (
                      <TableRow key={mvt.id}>
                        <TableCell className="whitespace-nowrap">
                          {mvt.dateMouvement && format(new Date(mvt.dateMouvement), "dd/MM/yyyy HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell className="font-medium">{mvt.articleDesignation}</TableCell>
                        <TableCell>
                          <Badge className={config.className}>
                            <Icon className="h-3 w-3 mr-1" />
                            {config.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {mvt.typeMouvement?.includes("SORTIE") || mvt.typeMouvement?.includes("NEGATIVE")
                            ? `-${mvt.quantite}`
                            : `+${mvt.quantite}`}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {mvt.prixUnitaire
                            ? new Intl.NumberFormat("fr-FR", {
                                style: "currency",
                                currency: "XOF",
                              }).format(mvt.prixUnitaire)
                            : "-"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{mvt.motif || "-"}</TableCell>
                        <TableCell className="text-muted-foreground">{mvt.createdBy || "-"}</TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
    </div>
  )
}
