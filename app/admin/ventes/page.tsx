"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ventesApi } from "@/lib/api"
import type { Ventes } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Eye, Trash2, Receipt, User, Calendar } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function VentesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedVente, setSelectedVente] = useState<Ventes | null>(null)

  const { data: ventes = [], isLoading } = useQuery({
    queryKey: ["ventes"],
    queryFn: ventesApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: ventesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventes"] })
      toast({ title: "Vente supprimée avec succès" })
      setIsDeleteOpen(false)
      setSelectedVente(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleViewDetail = (vente: Ventes) => {
    setSelectedVente(vente)
    setIsDetailOpen(true)
  }

  const handleDelete = (vente: Ventes) => {
    setSelectedVente(vente)
    setIsDeleteOpen(true)
  }

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (item: Ventes) => (
        <div className="flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          <span className="font-mono font-medium">{item.code}</span>
        </div>
      ),
    },
    {
      key: "client",
      header: "Client",
      render: (item: Ventes) => (
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          {item.client?.prenom} {item.client?.nom}
        </div>
      ),
    },
    {
      key: "dateVente",
      header: "Date",
      render: (item: Ventes) => (
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          {item.dateVente ? format(new Date(item.dateVente), "dd MMM yyyy HH:mm", { locale: fr }) : "-"}
        </div>
      ),
    },
    {
      key: "lignes",
      header: "Articles",
      render: (item: Ventes) => <Badge variant="outline">{item.ligneVentes?.length || 0} articles</Badge>,
    },
    {
      key: "totalHt",
      header: "Total HT",
      render: (item: Ventes) => `${item.totalHt?.toFixed(2) || "0.00"} €`,
    },
    {
      key: "totalTtc",
      header: "Total TTC",
      render: (item: Ventes) => <span className="font-bold text-primary">{item.totalTtc?.toFixed(2) || "0.00"} €</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ventes</h1>
          <p className="text-muted-foreground">Consultez l'historique des ventes réalisées</p>
        </div>
      </div>

      <DataTable
        data={ventes}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une vente..."
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleViewDetail(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Vente {selectedVente?.code}
            </DialogTitle>
          </DialogHeader>
          {selectedVente && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Client</p>
                  <p className="font-medium">
                    {selectedVente.client?.prenom} {selectedVente.client?.nom}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date de vente</p>
                  <p className="font-medium">
                    {selectedVente.dateVente
                      ? format(new Date(selectedVente.dateVente), "dd MMMM yyyy à HH:mm", { locale: fr })
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Commande associée</p>
                  <p className="font-medium">{selectedVente.commandeClient?.code || "-"}</p>
                </div>
              </div>

              {selectedVente.commentaire && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Commentaire</p>
                  <p>{selectedVente.commentaire}</p>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-3">Détail des articles</h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead className="text-right">Quantité</TableHead>
                        <TableHead className="text-right">Prix unitaire</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedVente.ligneVentes?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                            Aucun article
                          </TableCell>
                        </TableRow>
                      ) : (
                        selectedVente.ligneVentes?.map((ligne) => (
                          <TableRow key={ligne.id}>
                            <TableCell>{ligne.article?.designation}</TableCell>
                            <TableCell className="text-right">{ligne.quantite}</TableCell>
                            <TableCell className="text-right">{ligne.prixUnitaire?.toFixed(2)} €</TableCell>
                            <TableCell className="text-right font-medium">{ligne.prixTotal?.toFixed(2)} €</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="flex justify-end border-t pt-4">
                <div className="text-right space-y-1 min-w-[200px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total HT:</span>
                    <span>{selectedVente.totalHt?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA:</span>
                    <span>{selectedVente.totalTva?.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total TTC:</span>
                    <span className="text-primary">{selectedVente.totalTtc?.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer la vente"
        description={`Êtes-vous sûr de vouloir supprimer la vente "${selectedVente?.code}" ? Cette action est irréversible.`}
        onConfirm={() => selectedVente?.id && deleteMutation.mutate(selectedVente.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
