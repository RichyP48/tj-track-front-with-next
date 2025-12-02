"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import type { ArticleDto } from "@/lib/types"
import { toast } from "sonner"

interface ArticleCardProps {
  article: ArticleDto
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Connectez-vous pour ajouter au panier")
      return
    }
    if (article.id) {
      await addToCart(article.id, 1)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price)
  }

  const isOutOfStock = article.quantiteStock === 0
  const isLowStock = article.stockFaible && !isOutOfStock

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        {article.photo ? (
          <Image
            src={article.photo || "/placeholder.svg"}
            alt={article.designation}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src={`/.jpg?height=300&width=300&query=${encodeURIComponent(article.designation)}`}
              alt={article.designation}
              fill
              className="object-cover"
            />
          </div>
        )}
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 left-2">
            Rupture
          </Badge>
        )}
        {isLowStock && (
          <Badge variant="secondary" className="absolute top-2 left-2 bg-amber-500 text-white">
            Stock limité
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button size="icon" variant="secondary" asChild>
            <Link href={`/catalogue/${article.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
          <Button size="icon" onClick={handleAddToCart} disabled={isOutOfStock}>
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        {article.categorieDesignation && (
          <p className="text-xs text-muted-foreground mb-1">{article.categorieDesignation}</p>
        )}
        <Link href={`/catalogue/${article.id}`}>
          <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">{article.designation}</h3>
        </Link>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-primary">
            {formatPrice(article.prixUnitaireTtc || article.prixUnitaireHt)}
          </p>
          {article.tauxTva && article.tauxTva > 0 && (
            <p className="text-xs text-muted-foreground">HT: {formatPrice(article.prixUnitaireHt)}</p>
          )}
        </div>
        <Button size="sm" onClick={handleAddToCart} disabled={isOutOfStock}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </CardFooter>
    </Card>
  )
}
