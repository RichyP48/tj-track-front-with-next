"use client"

import { useQuery } from "@tanstack/react-query"
import { MainLayout } from "@/components/layouts/main-layout"
import { CategoryList } from "@/components/catalogue/category-list"
import { catalogueApi } from "@/lib/api/catalogue"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: catalogueApi.getCategories,
  })

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Catégories</h1>
          <p className="text-muted-foreground mt-2">Parcourez nos catégories de produits</p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-32 rounded-lg" />
              </div>
            ))}
          </div>
        ) : (
          <CategoryList categories={categories || []} />
        )}
      </div>
    </MainLayout>
  )
}
