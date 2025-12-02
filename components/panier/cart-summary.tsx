"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { ShoppingBag, CreditCard } from "lucide-react"
import Link from "next/link"

export function CartSummary() {
  const { cart } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XOF",
    }).format(price)
  }

  const hasUnavailableItems = cart?.items?.some((item) => !item.disponible)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          Résumé de la commande
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Sous-total HT</span>
          <span>{formatPrice(cart?.montantHT || 0)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">TVA</span>
          <span>{formatPrice(cart?.montantTVA || 0)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total TTC</span>
          <span className="text-primary">{formatPrice(cart?.montantTotal || 0)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <Button className="w-full" size="lg" disabled={hasUnavailableItems || !cart?.items?.length}>
          <CreditCard className="h-4 w-4 mr-2" />
          Passer la commande
        </Button>
        {hasUnavailableItems && (
          <p className="text-sm text-destructive text-center">Certains articles sont indisponibles</p>
        )}
        <Button variant="outline" className="w-full bg-transparent" asChild>
          <Link href="/catalogue">Continuer vos achats</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
