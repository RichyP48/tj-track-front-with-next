"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fournisseursApi } from "@/lib/api"
import type { Fournisseur } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { FormModal } from "@/components/shared/form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Phone, Mail } from "lucide-react"

export default function FournisseursPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedFournisseur, setSelectedFournisseur] = useState<Fournisseur | null>(null)
  const [formData, setFormData] = useState<Partial<Fournisseur>>({
    statut: "ACTIF",
    adresse: {},
  })

  const { data: fournisseurs = [], isLoading } = useQuery({
    queryKey: ["fournisseurs"],
    queryFn: fournisseursApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: fournisseursApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fournisseurs"] })
      toast({ title: "Fournisseur créé avec succès" })
      setIsFormOpen(false)
      setFormData({ statut: "ACTIF", adresse: {} })
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Fournisseur }) => fournisseursApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fournisseurs"] })
      toast({ title: "Fournisseur modifié avec succès" })
      setIsFormOpen(false)
      setSelectedFournisseur(null)
      setFormData({ statut: "ACTIF", adresse: {} })
    },
    onError: () => {
      toast({ title: "Erreur lors de la modification", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: fournisseursApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fournisseurs"] })
      toast({ title: "Fournisseur supprimé avec succès" })
      setIsDeleteOpen(false)
      setSelectedFournisseur(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleEdit = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur)
    setFormData(fournisseur)
    setIsFormOpen(true)
  }

  const handleDelete = (fournisseur: Fournisseur) => {
    setSelectedFournisseur(fournisseur)
    setIsDeleteOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFournisseur?.id) {
      updateMutation.mutate({
        id: selectedFournisseur.id,
        data: formData as Fournisseur,
      })
    } else {
      createMutation.mutate(formData as Fournisseur)
    }
  }

  const columns = [
    { key: "nom", header: "Nom" },
    {
      key: "email",
      header: "Email",
      render: (item: Fournisseur) => (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          {item.email || "-"}
        </div>
      ),
    },
    {
      key: "telephone",
      header: "Téléphone",
      render: (item: Fournisseur) => (
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          {item.telephone || "-"}
        </div>
      ),
    },
    { key: "contact", header: "Contact" },
    {
      key: "statut",
      header: "Statut",
      render: (item: Fournisseur) => (
        <Badge variant={item.statut === "ACTIF" ? "default" : "secondary"}>{item.statut}</Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
          <p className="text-muted-foreground">Gérez vos partenaires fournisseurs</p>
        </div>
        <Button
          onClick={() => {
            setSelectedFournisseur(null)
            setFormData({ statut: "ACTIF", adresse: {} })
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau fournisseur
        </Button>
      </div>

      <DataTable
        data={fournisseurs}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un fournisseur..."
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <FormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={selectedFournisseur ? "Modifier le fournisseur" : "Nouveau fournisseur"}
        description="Remplissez les informations du fournisseur"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom *</Label>
            <Input
              id="nom"
              value={formData.nom || ""}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input
                id="telephone"
                value={formData.telephone || ""}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Personne de contact</Label>
              <Input
                id="contact"
                value={formData.contact || ""}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="statut">Statut</Label>
              <Select
                value={formData.statut || "ACTIF"}
                onValueChange={(v) => setFormData({ ...formData, statut: v as "ACTIF" | "INACTIF" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIF">Actif</SelectItem>
                  <SelectItem value="INACTIF">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-3">Adresse</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adresse1">Adresse</Label>
                <Input
                  id="adresse1"
                  value={formData.adresse?.adresse1 || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      adresse: { ...formData.adresse, adresse1: e.target.value },
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ville">Ville</Label>
                  <Input
                    id="ville"
                    value={formData.adresse?.ville || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adresse: { ...formData.adresse, ville: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codePostal">Code postal</Label>
                  <Input
                    id="codePostal"
                    value={formData.adresse?.codePostal || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adresse: {
                          ...formData.adresse,
                          codePostal: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pays">Pays</Label>
                <Input
                  id="pays"
                  value={formData.adresse?.pays || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      adresse: { ...formData.adresse, pays: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? "Enregistrement..."
                : selectedFournisseur
                  ? "Modifier"
                  : "Créer"}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer le fournisseur"
        description={`Êtes-vous sûr de vouloir supprimer le fournisseur "${selectedFournisseur?.nom}" ? Cette action est irréversible.`}
        onConfirm={() => selectedFournisseur?.id && deleteMutation.mutate(selectedFournisseur.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
