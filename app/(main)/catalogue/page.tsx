"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { MainLayout } from "@/components/layouts/main-layout"
import { ArticleGrid } from "@/components/catalogue/article-grid"
import { CatalogueFilters } from "@/components/catalogue/catalogue-filters"
import { catalogueApi } from "@/lib/api/catalogue"
import type { ArticleFilters } from "@/lib/types"

function CatalogueContent() {
  const searchParams = useSearchParams()
  const initialCategorieId = searchParams.get("categorieId")

  const [filters, setFilters] = useState<ArticleFilters>({
    categorieId: initialCategorieId ? Number(initialCategorieId) : undefined,
  })

  const { data: articles, isLoading } = useQuery({
    queryKey: ["catalogue-articles", filters],
    queryFn: () => catalogueApi.getArticles(filters),
  })

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Catalogue</h1>
        <p className="text-muted-foreground mt-2">Découvrez notre sélection de produits</p>
      </div>

      <div className="mb-8">
        <CatalogueFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <ArticleGrid articles={articles || []} isLoading={isLoading} />
    </div>
  )
}

export default function CataloguePage() {
  return (
    <MainLayout>
      <Suspense fallback={<div className="container py-8">Chargement...</div>}>
        <CatalogueContent />
      </Suspense>
    </MainLayout>
  )
}
