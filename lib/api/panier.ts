import apiClient from "./axios"
import type { PanierDto } from "@/lib/types"

export const panierApi = {
  // Get panier
  getPanier: async (userEmail: string): Promise<PanierDto> => {
    const response = await apiClient.get(`/panier?userEmail=${encodeURIComponent(userEmail)}`)
    return response.data
  },

  // Add article to panier
  ajouterArticle: async (userEmail: string, request: Record<string, unknown>): Promise<PanierDto> => {
    const response = await apiClient.post("/panier/ajouter", { userEmail, request })
    return response.data
  },

  // Modify quantity
  modifierQuantite: async (userEmail: string, request: Record<string, unknown>): Promise<PanierDto> => {
    const response = await apiClient.put("/panier/modifier", { userEmail, request })
    return response.data
  },

  // Remove article
  supprimerArticle: async (userEmail: string, articleId: number): Promise<PanierDto> => {
    const response = await apiClient.delete(`/panier/supprimer/${articleId}`, {
      data: userEmail,
    })
    return response.data
  },

  // Empty panier
  viderPanier: async (userEmail: string): Promise<void> => {
    await apiClient.delete("/panier/vider", { data: userEmail })
  },
}
