"use client"

import type React from "react"
import { createContext, useContext, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { panierApi } from "@/lib/api/panier"
import type { PanierDto } from "@/lib/types"
import { useAuth } from "./auth-context"
import { toast } from "sonner"

interface CartContextType {
  cart: PanierDto | null
  isLoading: boolean
  addToCart: (articleId: number, quantite: number) => Promise<void>
  updateQuantity: (articleId: number, quantite: number) => Promise<void>
  removeFromCart: (articleId: number) => Promise<void>
  clearCart: () => Promise<void>
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  const { data: cart, isLoading } = useQuery({
    queryKey: ["panier", user?.email],
    queryFn: () => panierApi.getPanier(user!.email),
    enabled: isAuthenticated && !!user?.email,
  })

  const addMutation = useMutation({
    mutationFn: ({ articleId, quantite }: { articleId: number; quantite: number }) =>
      panierApi.ajouterArticle(user!.email, { articleId, quantite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panier"] })
      toast.success("Article ajouté au panier")
    },
    onError: () => {
      toast.error("Erreur lors de l'ajout au panier")
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ articleId, quantite }: { articleId: number; quantite: number }) =>
      panierApi.modifierQuantite(user!.email, { articleId, quantite }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panier"] })
    },
    onError: () => {
      toast.error("Erreur lors de la modification")
    },
  })

  const removeMutation = useMutation({
    mutationFn: (articleId: number) => panierApi.supprimerArticle(user!.email, articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panier"] })
      toast.success("Article retiré du panier")
    },
    onError: () => {
      toast.error("Erreur lors de la suppression")
    },
  })

  const clearMutation = useMutation({
    mutationFn: () => panierApi.viderPanier(user!.email),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["panier"] })
      toast.success("Panier vidé")
    },
    onError: () => {
      toast.error("Erreur lors du vidage du panier")
    },
  })

  const addToCart = useCallback(
    async (articleId: number, quantite: number) => {
      await addMutation.mutateAsync({ articleId, quantite })
    },
    [addMutation],
  )

  const updateQuantity = useCallback(
    async (articleId: number, quantite: number) => {
      await updateMutation.mutateAsync({ articleId, quantite })
    },
    [updateMutation],
  )

  const removeFromCart = useCallback(
    async (articleId: number) => {
      await removeMutation.mutateAsync(articleId)
    },
    [removeMutation],
  )

  const clearCart = useCallback(async () => {
    await clearMutation.mutateAsync()
  }, [clearMutation])

  return (
    <CartContext.Provider
      value={{
        cart: cart || null,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount: cart?.totalItems || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
