"use client"

import type React from "react"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { stockApi } from "@/lib/api"
import type { CategorieDto } from "@/lib/types"
import { DataTable } from "@/components/shared/data-table"
import { ConfirmDialog } from "@/components/shared/confirm-dialog"
import { FormModal } from "@/components/shared/form-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react"

export default function CategoriesPage() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategorieDto | null>(null)
  const [formData, setFormData] = useState<Partial<CategorieDto>>({})

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: stockApi.getAllCategories,
  })

  const createMutation = useMutation({
    mutationFn: stockApi.createCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({ title: "Catégorie créée avec succès" })
      setIsFormOpen(false)
      setFormData({})
    },
    onError: () => {
      toast({ title: "Erreur lors de la création", variant: "destructive" })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategorieDto }) => stockApi.updateCategorie(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({ title: "Catégorie modifiée avec succès" })
      setIsFormOpen(false)
      setSelectedCategory(null)
      setFormData({})
    },
    onError: () => {
      toast({ title: "Erreur lors de la modification", variant: "destructive" })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: stockApi.deleteCategorie,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      toast({ title: "Catégorie supprimée avec succès" })
      setIsDeleteOpen(false)
      setSelectedCategory(null)
    },
    onError: () => {
      toast({ title: "Erreur lors de la suppression", variant: "destructive" })
    },
  })

  const handleEdit = (category: CategorieDto) => {
    setSelectedCategory(category)
    setFormData(category)
    setIsFormOpen(true)
  }

  const handleDelete = (category: CategorieDto) => {
    setSelectedCategory(category)
    setIsDeleteOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedCategory?.id) {
      updateMutation.mutate({
        id: selectedCategory.id,
        data: formData as CategorieDto,
      })
    } else {
      createMutation.mutate(formData as CategorieDto)
    }
  }

  const columns = [
    { key: "code", header: "Code" },
    { key: "designation", header: "Désignation" },
    {
      key: "description",
      header: "Description",
      render: (item: CategorieDto) => <span className="line-clamp-1 max-w-[200px]">{item.description || "-"}</span>,
    },
    {
      key: "nombreArticles",
      header: "Articles",
      render: (item: CategorieDto) => (
        <Badge variant="secondary">
          <FolderOpen className="mr-1 h-3 w-3" />
          {item.nombreArticles ?? 0}
        </Badge>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
          <p className="text-muted-foreground">Organisez vos articles par catégories</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCategory(null)
            setFormData({})
            setIsFormOpen(true)
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      <DataTable
        data={categories}
        columns={columns}
        isLoading={isLoading}
        searchPlaceholder="Rechercher une catégorie..."
        actions={(item) => (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(item)}
              disabled={(item.nombreArticles ?? 0) > 0}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        )}
      />

      <FormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        title={selectedCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
        description="Remplissez les informations de la catégorie"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              value={formData.code || ""}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
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

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
              {createMutation.isPending || updateMutation.isPending
                ? "Enregistrement..."
                : selectedCategory
                  ? "Modifier"
                  : "Créer"}
            </Button>
          </div>
        </form>
      </FormModal>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        title="Supprimer la catégorie"
        description={`Êtes-vous sûr de vouloir supprimer la catégorie "${selectedCategory?.designation}" ? Cette action est irréversible.`}
        onConfirm={() => selectedCategory?.id && deleteMutation.mutate(selectedCategory.id)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  )
}
