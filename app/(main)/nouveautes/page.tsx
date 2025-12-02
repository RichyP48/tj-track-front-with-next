"use client"

import { useQuery } from "@tanstack/react-query"
import { MainLayout } from "@/components/layouts/main-layout"
import { ArticleGrid } from "@/components/catalogue/article-grid"
import { catalogueApi } from "@/lib/api/catalogue"

export default function NouveautesPage() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["nouveautes"],
    queryFn: catalogueApi.getNewArticles,
  })

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Nouveautés</h1>
          <p className="text-muted-foreground mt-2">Découvrez nos derniers produits ajoutés</p>
        </div>

        <ArticleGrid articles={articles || []} isLoading={isLoading} />
      </div>
    </MainLayout>
  )
}
