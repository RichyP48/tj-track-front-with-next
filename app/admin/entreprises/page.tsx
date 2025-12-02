"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { entreprisesApi } from "@/lib/api"
import type { Entreprise } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { FormModal } from "@/components/shared/form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Building2, Globe, Mail } from "lucide-react"

export default function EntreprisesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedEntreprise, setSelectedEntreprise] = useState<Entreprise | null>(null)
  const [formData, setFormData] = useState<Partial<Entreprise>>({ adresse: {} })

  const { data: entreprises = [], isLoading } = useQuery({
    queryKey: ["entreprises"],
    queryFn: entreprisesApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: entreprisesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entreprises"] })
      toast({ title: "Entreprise créée avec succès" })
      setIsFormOpen(false)
      setFormData({ adresse: {} })
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: entreprisesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entreprises"] })
      toast({ title: "Entreprise supprimée avec succès" })
      setIsDeleteOpen(false)
      setSelectedEntreprise(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleEdit = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise)
    setFormData(entreprise)
    setIsFormOpen(true)
  }

  const handleDelete = (entreprise: Entreprise) => {
    setSelectedEntreprise(entreprise)
    setIsDeleteOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData as Entreprise)
  }

  const columns = [
    {
      key: "nom",
      header: "Nom",
      render: (item: Entreprise) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium">{item.nom}</span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (item: Entreprise) => (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          {item.email || "-"}
        </div>
      ),
    },
    { key: "telephone", header: "Téléphone" },
    { key: "codeFiscal", header: "Code fiscal" },
    {
      key: "siteWeb",
      header: "Site web",
      render: (item: Entreprise) =>
        item.siteWeb ? (
          <a
            href={item.siteWeb}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-primary hover:underline"
          >
            <Globe className="h-3 w-3" />
            Visiter
          </a>
        ) : (
          "-"
        ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Entreprises</h1>
          <p className="text-muted-foreground">Gérez les entreprises partenaires</p>
        </div>
        <Button
          onClick={() => {
            setSelectedEntreprise(null)
            setFormData({ adresse: {} })
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle entreprise
        </Button>
      </div>

      <DataTable
        data={entreprises}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une entreprise..."
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
        title={selectedEntreprise ? "Modifier l'entreprise" : "Nouvelle entreprise"}
        description="Remplissez les informations de l'entreprise"
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
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
              <Label htmlFor="codeFiscal">Code fiscal</Label>
              <Input
                id="codeFiscal"
                value={formData.codeFiscal || ""}
                onChange={(e) => setFormData({ ...formData, codeFiscal: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteWeb">Site web</Label>
              <Input
                id="siteWeb"
                type="url"
                placeholder="https://..."
                value={formData.siteWeb || ""}
                onChange={(e) => setFormData({ ...formData, siteWeb: e.target.value })}
              />
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
              <div className="grid grid-cols-3 gap-4">
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
                        adresse: { ...formData.adresse, codePostal: e.target.value },
                      })
                    }
                  />
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
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Enregistrement..." : selectedEntreprise ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer l'entreprise"
        description={`Êtes-vous sûr de vouloir supprimer l'entreprise "${selectedEntreprise?.nom}" ? Cette action est irréversible.`}
        onConfirm={() => selectedEntreprise?.id && deleteMutation.mutate(selectedEntreprise.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
