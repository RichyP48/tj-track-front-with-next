"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { stockApi } from "@/lib/api"
import type { ArticleDto } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { FormModal } from "@/components/shared/form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2 } from "lucide-react"

export default function ArticlesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState<ArticleDto | null>(null)
  const [formData, setFormData] = useState<Partial<ArticleDto>>({})

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["articles"],
    queryFn: stockApi.getAllArticles,
  })

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: stockApi.getAllCategories,
  })

  const createMutation = useMutation({
    mutationFn: stockApi.createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      toast({ title: "Article créé avec succès" })
      setIsFormOpen(false)
      setFormData({})
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ArticleDto }) => stockApi.updateArticle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      toast({ title: "Article modifié avec succès" })
      setIsFormOpen(false)
      setSelectedArticle(null)
      setFormData({})
    },
    onError: () => {
      toast({ title: "Erreur lors de la modification", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: stockApi.deleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] })
      toast({ title: "Article supprimé avec succès" })
      setIsDeleteOpen(false)
      setSelectedArticle(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleEdit = (article: ArticleDto) => {
    setSelectedArticle(article)
    setFormData(article)
    setIsFormOpen(true)
  }

  const handleDelete = (article: ArticleDto) => {
    setSelectedArticle(article)
    setIsDeleteOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const articleData = {
      ...formData,
      stockReserve: formData.stockReserve ?? 0
    } as ArticleDto
    
    if (selectedArticle?.id) {
      updateMutation.mutate({
        id: selectedArticle.id,
        data: articleData,
      })
    } else {
      createMutation.mutate(articleData)
    }
  }

  const columns = [
    { key: "codeArticle", header: "Code" },
    { key: "designation", header: "Désignation" },
    {
      key: "categorieDesignation",
      header: "Catégorie",
      render: (item: ArticleDto) => <Badge variant="outline">{item.categorieDesignation || "Non classé"}</Badge>,
    },
    {
      key: "prixUnitaireTtc",
      header: "Prix TTC",
      render: (item: ArticleDto) => `${item.prixUnitaireTtc?.toFixed(2) || "0.00"} €`,
    },
    {
      key: "quantiteStock",
      header: "Stock",
      render: (item: ArticleDto) => (
        <Badge variant={item.stockFaible ? "destructive" : "secondary"}>{item.quantiteStock ?? 0}</Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Articles</h1>
          <p className="text-muted-foreground">Gérez votre catalogue d'articles</p>
        </div>
        <Button
          onClick={() => {
            setSelectedArticle(null)
            setFormData({})
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvel article
        </Button>
      </div>

      <DataTable
        data={articles}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher un article..."
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
        title={selectedArticle ? "Modifier l'article" : "Nouvel article"}
        description="Remplissez les informations de l'article"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codeArticle">Code article *</Label>
              <Input
                id="codeArticle"
                value={formData.codeArticle || ""}
                onChange={(e) => setFormData({ ...formData, codeArticle: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="categorieId">Catégorie</Label>
              <Select
                value={String(formData.categorieId || "")}
                onValueChange={(v) => setFormData({ ...formData, categorieId: Number(v) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.designation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="designation">Désignation *</Label>
            <Input
              id="designation"
              value={formData.designation || ""}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prixUnitaireHt">Prix HT *</Label>
              <Input
                id="prixUnitaireHt"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.prixUnitaireHt || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    prixUnitaireHt: Number.parseFloat(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tauxTva">Taux TVA (%)</Label>
              <Input
                id="tauxTva"
                type="number"
                step="0.1"
                min="0"
                max="100"
                value={formData.tauxTva || 20}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tauxTva: Number.parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantiteStock">Quantité en stock</Label>
              <Input
                id="quantiteStock"
                type="number"
                min="0"
                value={formData.quantiteStock || 0}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    quantiteStock: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seuilAlerte">Seuil d'alerte</Label>
              <Input
                id="seuilAlerte"
                type="number"
                min="0"
                value={formData.seuilAlerte || 10}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    seuilAlerte: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockMax">Stock maximum</Label>
              <Input
                id="stockMax"
                type="number"
                min="0"
                value={formData.stockMax || 1000}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stockMax: Number.parseInt(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">URL de la photo</Label>
            <Input
              id="photo"
              type="url"
              value={formData.photo || ""}
              onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? "Enregistrement..."
                : selectedArticle
                  ? "Modifier"
                  : "Créer"}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer l'article"
        description={`Êtes-vous sûr de vouloir supprimer l'article "${selectedArticle?.designation}" ? Cette action est irréversible.`}
        onConfirm={() => selectedArticle?.id && deleteMutation.mutate(selectedArticle.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
