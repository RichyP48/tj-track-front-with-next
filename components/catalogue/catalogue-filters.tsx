"use client"

import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { catalogueApi } from "@/lib/api/catalogue"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, SlidersHorizontal, X } from "lucide-react"
import type { ArticleFilters } from "@/lib/types"

interface CatalogueFiltersProps {
  filters: ArticleFilters
  onFiltersChange: (filters: ArticleFilters) => void
}

export function CatalogueFilters({ filters, onFiltersChange }: CatalogueFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.search || "")

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogueApi.getCategories,
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFiltersChange({ ...filters, search: searchInput || undefined })
      }
    }, 300)

    return () => clearTimeout(timeout)
  }, [searchInput])

  const handleCategoryChange = (value: string) => {
    onFiltersChange({
      ...filters,
      categorieId: value === "all" ? undefined : Number(value),
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split("-")
    onFiltersChange({
      ...filters,
      sortBy,
      sortDir: sortDir as "asc" | "desc",
    })
  }

  const clearFilters = () => {
    setSearchInput("")
    onFiltersChange({})
  }

  const hasActiveFilters = filters.search || filters.categorieId || filters.sortBy

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un article..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.categorieId?.toString() || "all"} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id!.toString()}>
                {cat.designation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.sortBy ? `${filters.sortBy}-${filters.sortDir}` : "designation-asc"}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="designation-asc">Nom A-Z</SelectItem>
            <SelectItem value="designation-desc">Nom Z-A</SelectItem>
            <SelectItem value="prixUnitaireHt-asc">Prix croissant</SelectItem>
            <SelectItem value="prixUnitaireHt-desc">Prix décroissant</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Effacer
          </Button>
        )}
      </div>
    </div>
  )
}
