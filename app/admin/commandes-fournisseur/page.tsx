"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { commandesFournisseurApi } from "@/lib/api"
import type { CommandeFournisseur, LigneCommandeFournisseur } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { Eye, Trash2, Package, Calendar, Truck } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

const statutColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  EN_ATTENTE: "secondary",
  CONFIRMEE: "default",
  EXPEDIEE: "outline",
  RECUE: "default",
  ANNULEE: "destructive",
}

const statutLabels: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRMEE: "Confirmée",
  EXPEDIEE: "Expédiée",
  RECUE: "Reçue",
  ANNULEE: "Annulée",
}

export default function CommandesFournisseurPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCommande, setSelectedCommande] = useState<CommandeFournisseur | null>(null)
  const [lignes, setLignes] = useState<LigneCommandeFournisseur[]>([])
  const [isLoadingLignes, setIsLoadingLignes] = useState(false)

  const { data: commandes = [], isLoading } = useQuery({
    queryKey: ["commandes-fournisseur"],
    queryFn: commandesFournisseurApi.getAll,
  })

  const deleteMutation = useMutation({
    mutationFn: commandesFournisseurApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commandes-fournisseur"] })
      toast({ title: "Commande supprimée avec succès" })
      setIsDeleteOpen(false)
      setSelectedCommande(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleViewDetail = async (commande: CommandeFournisseur) => {
    setSelectedCommande(commande)
    setIsDetailOpen(true)
    setIsLoadingLignes(true)
    try {
      const data = await commandesFournisseurApi.getLignes(commande.id!)
      setLignes(data)
    } catch {
      toast({ title: "Erreur lors du chargement des lignes", variant: "destructive" })
    } finally {
      setIsLoadingLignes(false)
    }
  }

  const handleDelete = (commande: CommandeFournisseur) => {
    setSelectedCommande(commande)
    setIsDeleteOpen(true)
  }

  const columns = [
    {
      key: "code",
      header: "Code",
      render: (item: CommandeFournisseur) => <span className="font-mono font-medium">{item.code}</span>,
    },
    {
      key: "fournisseur",
      header: "Fournisseur",
      render: (item: CommandeFournisseur) => (
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          {item.fournisseur?.nom}
        </div>
      ),
    },
    {
      key: "dateCommande",
      header: "Date commande",
      render: (item: CommandeFournisseur) =>
        item.dateCommande ? format(new Date(item.dateCommande), "dd MMM yyyy", { locale: fr }) : "-",
    },
    {
      key: "dateLivraisonPrevue",
      header: "Livraison prévue",
      render: (item: CommandeFournisseur) =>
        item.dateLivraisonPrevue ? format(new Date(item.dateLivraisonPrevue), "dd MMM yyyy", { locale: fr }) : "-",
    },
    {
      key: "statut",
      header: "Statut",
      render: (item: CommandeFournisseur) => (
        <Badge variant={statutColors[item.statut || "EN_ATTENTE"]}>{statutLabels[item.statut || "EN_ATTENTE"]}</Badge>
      ),
    },
    {
      key: "totalTtc",
      header: "Total TTC",
      render: (item: CommandeFournisseur) => (
        <span className="font-medium">{item.totalTtc?.toFixed(2) || "0.00"} €</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commandes Fournisseur</h1>
          <p className="text-muted-foreground">Gérez vos approvisionnements auprès des fournisseurs</p>
        </div>
      </div>

      <DataTable
        data={commandes}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une commande..."
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleViewDetail(item)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item)} disabled={item.statut === "RECUE"}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de la commande {selectedCommande?.code}</DialogTitle>
          </DialogHeader>
          {selectedCommande && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Fournisseur</p>
                  <p className="font-medium">{selectedCommande.fournisseur?.nom}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <Badge variant={statutColors[selectedCommande.statut || "EN_ATTENTE"]}>
                    {statutLabels[selectedCommande.statut || "EN_ATTENTE"]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date de commande
                  </p>
                  <p className="font-medium">
                    {selectedCommande.dateCommande
                      ? format(new Date(selectedCommande.dateCommande), "dd MMMM yyyy", { locale: fr })
                      : "-"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Livraison prévue</p>
                  <p className="font-medium">
                    {selectedCommande.dateLivraisonPrevue
                      ? format(new Date(selectedCommande.dateLivraisonPrevue), "dd MMMM yyyy", { locale: fr })
                      : "-"}
                  </p>
                </div>
                {selectedCommande.dateLivraisonReelle && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Livraison réelle</p>
                    <p className="font-medium">
                      {format(new Date(selectedCommande.dateLivraisonReelle), "dd MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Articles commandés
                </h4>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Article</TableHead>
                        <TableHead className="text-right">Qté commandée</TableHead>
                        <TableHead className="text-right">Qté reçue</TableHead>
                        <TableHead className="text-right">Prix unitaire</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoadingLignes ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            Chargement...
                          </TableCell>
                        </TableRow>
                      ) : lignes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Aucun article
                          </TableCell>
                        </TableRow>
                      ) : (
                        lignes.map((ligne) => (
                          <TableRow key={ligne.id}>
                            <TableCell>{ligne.article?.designation}</TableCell>
                            <TableCell className="text-right">{ligne.quantiteCommandee}</TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant={
                                  (ligne.quantiteRecue ?? 0) >= (ligne.quantiteCommandee ?? 0) ? "default" : "secondary"
                                }
                              >
                                {ligne.quantiteRecue ?? 0}
                              </Badge>
                            </TableCell>
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
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Total HT: {selectedCommande.totalHt?.toFixed(2)} €</p>
                  <p className="text-xl font-bold">Total TTC: {selectedCommande.totalTtc?.toFixed(2)} €</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer la commande"
        description={`Êtes-vous sûr de vouloir supprimer la commande "${selectedCommande?.code}" ? Cette action est irréversible.`}
        onConfirm={() => selectedCommande?.id && deleteMutation.mutate(selectedCommande.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
