"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2 } from "lucide-react"
import { useCart } from "@/context/cart-context"
import type { PanierItemDto } from "@/lib/types"

interface CartItemProps {
  item: PanierItemDto
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price)
  }

  const handleQuantityChange = async (newQuantity: number) => {
    if (item.articleId && newQuantity >= 1 && newQuantity <= (item.stockDisponible || 99)) {
      await updateQuantity(item.articleId, newQuantity)
    }
  }

  const handleRemove = async () => {
    if (item.articleId) {
      await removeFromCart(item.articleId)
    }
  }

  return (
    <div className="flex gap-4 py-4 border-b last:border-0">
      <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        {item.articlePhoto ? (
          <Image
            src={item.articlePhoto || "/placeholder.svg"}
            alt={item.articleNom || ""}
            fill
            className="object-cover"
          />
        ) : (
          <Image
            src={`/.jpg?height=96&width=96&query=${encodeURIComponent(item.articleNom || "product")}`}
            alt={item.articleNom || ""}
            fill
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <Link href={`/catalogue/${item.articleId}`} className="font-medium hover:text-primary line-clamp-2">
              {item.articleNom}
            </Link>
            <p className="text-sm text-muted-foreground">Réf: {item.articleCode}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={handleRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange((item.quantite || 1) - 1)}
              disabled={(item.quantite || 1) <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center font-medium">{item.quantite}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() => handleQuantityChange((item.quantite || 1) + 1)}
              disabled={(item.quantite || 1) >= (item.stockDisponible || 99)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <div className="text-right">
            <p className="font-semibold">{formatPrice(item.sousTotal || 0)}</p>
            <p className="text-sm text-muted-foreground">{formatPrice(item.prixUnitaire || 0)} / unité</p>
          </div>
        </div>

        {!item.disponible && (
          <Badge variant="destructive" className="mt-2">
            Indisponible
          </Badge>
        )}
      </div>
    </div>
  )
}
