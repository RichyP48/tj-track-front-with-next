import apiClient from "./axios"
import type { ArticleDto, ArticleFilters, CategorieDto } from "@/lib/types"

export const catalogueApi = {
  // Get all articles with filters
  getArticles: async (filters?: ArticleFilters): Promise<ArticleDto[]> => {
    const params = new URLSearchParams()
    if (filters?.page !== undefined) params.append("page", filters.page.toString())
    if (filters?.size !== undefined) params.append("size", filters.size.toString())
    if (filters?.sortBy) params.append("sortBy", filters.sortBy)
    if (filters?.sortDir) params.append("sortDir", filters.sortDir)
    if (filters?.categorieId) params.append("categorieId", filters.categorieId.toString())
    if (filters?.search) params.append("search", filters.search)

    const response = await apiClient.get(`/catalogue/articles?${params.toString()}`)
    return response.data
  },

  // Get article detail
  getArticleById: async (id: number): Promise<ArticleDto> => {
    const response = await apiClient.get(`/catalogue/articles/${id}`)
    return response.data
  },

  // Get categories
  getCategories: async (): Promise<CategorieDto[]> => {
    const response = await apiClient.get("/catalogue/categories")
    return response.data
  },

  // Get popular articles
  getPopularArticles: async (): Promise<ArticleDto[]> => {
    const response = await apiClient.get("/catalogue/articles/populaires")
    return response.data
  },

  // Get new articles
  getNewArticles: async (): Promise<ArticleDto[]> => {
    const response = await apiClient.get("/catalogue/articles/nouveautes")
    return response.data
  },
}
