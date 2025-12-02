"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { clientsApi } from "@/lib/api"
import type { Client } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { FormModal } from "@/components/shared/form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, Phone, Mail, User } from "lucide-react"

export default function ClientsPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [formData, setFormData] = useState<Partial<Client>>({ adresse: {} })

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: clientsApi.getAll,
  })

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast({ title: "Client créé avec succès" })
      setIsFormOpen(false)
      setFormData({ adresse: {} })
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] })
      toast({ title: "Client supprimé avec succès" })
      setIsDeleteOpen(false)
      setSelectedClient(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setFormData(client)
    setIsFormOpen(true)
  }

  const handleDelete = (client: Client) => {
    setSelectedClient(client)
    setIsDeleteOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData as Client)
  }

  const columns = [
    {
      key: "nom",
      header: "Nom complet",
      render: (item: Client) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span>
            {item.prenom} {item.nom}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (item: Client) => (
        <div className="flex items-center gap-1">
          <Mail className="h-3 w-3 text-muted-foreground" />
          {item.email || "-"}
        </div>
      ),
    },
    {
      key: "telephone",
      header: "Téléphone",
      render: (item: Client) => (
        <div className="flex items-center gap-1">
          <Phone className="h-3 w-3 text-muted-foreground" />
          {item.telephone || "-"}
        </div>
      ),
    },
    {
      key: "ville",
      header: "Ville",
      render: (item: Client) => item.adresse?.ville || "-",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground">Gérez votre base de clients</p>
        </div>
        <Button
          onClick={() => {
            setSelectedClient(null)
            setFormData({ adresse: {} })
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau client
        </Button>
      </div>

      <DataTable
        data={clients}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un client..."
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
        title={selectedClient ? "Modifier le client" : "Nouveau client"}
        description="Remplissez les informations du client"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom || ""}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom || ""}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                required
              />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="dateNaissance">Date de naissance</Label>
            <Input
              id="dateNaissance"
              type="date"
              value={formData.dateNaissance || ""}
              onChange={(e) => setFormData({ ...formData, dateNaissance: e.target.value })}
            />
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
                        adresse: { ...formData.adresse, codePostal: e.target.value },
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
              {createMutation.isPending ? "Enregistrement..." : selectedClient ? "Modifier" : "Créer"}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer le client"
        description={`Êtes-vous sûr de vouloir supprimer le client "${selectedClient?.prenom} ${selectedClient?.nom}" ? Cette action est irréversible.`}
        onConfirm={() => selectedClient?.id && deleteMutation.mutate(selectedClient.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
