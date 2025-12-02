"use client"

import { useParams, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import Link from "next/link"
import { MainLayout } from "@/components/layouts/main-layout"
import { catalogueApi } from "@/lib/api/catalogue"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ShoppingCart, Minus, Plus, ArrowLeft, Package, CheckCircle } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export default function ArticleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [quantity, setQuantity] = useState(1)

  const articleId = Number(params.id)

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", articleId],
    queryFn: () => catalogueApi.getArticleById(articleId),
    enabled: !!articleId,
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price)
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter au panier")
      router.push("/login")
      return
    }
    if (article?.id) {
      await addToCart(article.id, quantity)
      setQuantity(1)
    }
  }

  const isOutOfStock = article?.quantiteStock === 0
  const maxQuantity = article?.quantiteStock || 1

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold">Article non trouvé</h1>
          <Button className="mt-4" asChild>
            <Link href="/catalogue">Retour au catalogue</Link>
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Accueil</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/catalogue">Catalogue</BreadcrumbLink>
            </BreadcrumbItem>
            {article.categorieDesignation && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href={`/catalogue?categorieId=${article.categorieId}`}>
                    {article.categorieDesignation}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.designation}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
            {article.photo ? (
              <Image
                src={article.photo || "/placeholder.svg"}
                alt={article.designation}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src={`/.jpg?height=600&width=600&query=${encodeURIComponent(article.designation)}`}
                alt={article.designation}
                fill
                className="object-cover"
              />
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="absolute top-4 left-4 text-lg px-4 py-2">
                Rupture de stock
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            {article.categorieDesignation && <Badge variant="secondary">{article.categorieDesignation}</Badge>}

            <div>
              <h1 className="text-3xl font-bold">{article.designation}</h1>
              <p className="text-sm text-muted-foreground mt-1">Réf: {article.codeArticle}</p>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary">
                {formatPrice(article.prixUnitaireTtc || article.prixUnitaireHt)}
              </p>
              {article.tauxTva && article.tauxTva > 0 && (
                <p className="text-sm text-muted-foreground">
                  Prix HT: {formatPrice(article.prixUnitaireHt)} (TVA: {article.tauxTva}%)
                </p>
              )}
            </div>

            <Separator />

            {article.description && (
              <div>
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-muted-foreground">{article.description}</p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {isOutOfStock ? (
                  <Badge variant="destructive">Rupture de stock</Badge>
                ) : article.stockFaible ? (
                  <Badge variant="secondary" className="bg-amber-500 text-white">
                    <Package className="h-3 w-3 mr-1" />
                    Stock limité ({article.quantiteStock} disponibles)
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-500 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    En stock ({article.quantiteStock} disponibles)
                  </Badge>
                )}
              </div>
            </div>

            {!isOutOfStock && (
              <>
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantité:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                      disabled={quantity >= maxQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier - {formatPrice((article.prixUnitaireTtc || article.prixUnitaireHt) * quantity)}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
