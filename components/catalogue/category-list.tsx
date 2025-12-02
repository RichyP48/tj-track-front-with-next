"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FolderOpen } from "lucide-react"
import type { CategorieDto } from "@/lib/types"

interface CategoryListProps {
  categories: CategorieDto[]
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/catalogue?categorieId=${category.id}`}>
          <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-4 flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <FolderOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium text-sm line-clamp-2">{category.designation}</h3>
              {category.nombreArticles !== undefined && (
                <Badge variant="secondary" className="mt-2">
                  {category.nombreArticles} articles
                </Badge>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
