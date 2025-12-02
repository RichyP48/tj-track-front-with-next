"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { CartItem } from "@/components/panier/cart-item"
import { CartSummary } from "@/components/panier/cart-summary"
import { useCart } from "@/context/cart-context"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function PanierPage() {
  const { cart, isLoading, clearCart, itemCount } = useCart()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) {
    return null
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <Skeleton className="h-64" />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!cart?.items?.length) {
    return (
      <MainLayout>
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Votre panier est vide</h2>
              <p className="text-muted-foreground mb-6">
                Découvrez notre catalogue et ajoutez des articles à votre panier
              </p>
              <Button asChild>
                <Link href="/catalogue">Voir le catalogue</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Mon Panier</h1>
            <p className="text-muted-foreground">{itemCount} article(s)</p>
          </div>
          <Button variant="outline" onClick={clearCart}>
            <Trash2 className="h-4 w-4 mr-2" />
            Vider le panier
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-24 h-fit">
            <CartSummary />
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
