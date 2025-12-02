import apiClient from "./axios"
import type {
  ArticleDto,
  CategorieDto,
  MouvementStockDto,
  AlerteStock,
  Article,
  StockAdjustmentRequest,
  ApiResponseVoid,
} from "@/lib/types"

export const stockApi = {
  // Articles
  getAllArticles: async (): Promise<ArticleDto[]> => {
    const response = await apiClient.get("/stock/articles")
    return response.data
  },

  getArticleById: async (id: number): Promise<ArticleDto> => {
    const response = await apiClient.get(`/stock/articles/${id}`)
    return response.data
  },

  createArticle: async (data: ArticleDto): Promise<ArticleDto> => {
    const response = await apiClient.post("/stock/articles", data)
    return response.data
  },

  updateArticle: async (id: number, data: ArticleDto): Promise<ArticleDto> => {
    const response = await apiClient.put(`/stock/articles/${id}`, data)
    return response.data
  },

  deleteArticle: async (id: number): Promise<void> => {
    await apiClient.delete(`/stock/articles/${id}`)
  },

  getArticlesByCategorie: async (categorieId: number): Promise<ArticleDto[]> => {
    const response = await apiClient.get(`/stock/articles/categorie/${categorieId}`)
    return response.data
  },

  getArticlesStockFaible: async (): Promise<ArticleDto[]> => {
    const response = await apiClient.get("/stock/articles/stock-faible")
    return response.data
  },

  ajusterStock: async (id: number, request: StockAdjustmentRequest, utilisateur: string): Promise<ApiResponseVoid> => {
    const response = await apiClient.post(`/stock/articles/${id}/ajuster-stock`, { request, utilisateur })
    return response.data
  },

  // Categories
  getAllCategories: async (): Promise<CategorieDto[]> => {
    const response = await apiClient.get("/stock/categories")
    return response.data
  },

  getCategorieById: async (id: number): Promise<CategorieDto> => {
    const response = await apiClient.get(`/stock/categories/${id}`)
    return response.data
  },

  createCategorie: async (data: CategorieDto): Promise<CategorieDto> => {
    const response = await apiClient.post("/stock/categories", data)
    return response.data
  },

  updateCategorie: async (id: number, data: CategorieDto): Promise<CategorieDto> => {
    const response = await apiClient.put(`/stock/categories/${id}`, data)
    return response.data
  },

  deleteCategorie: async (id: number): Promise<void> => {
    await apiClient.delete(`/stock/categories/${id}`)
  },

  // Stats
  getStockStats: async (): Promise<Record<string, unknown>> => {
    const response = await apiClient.get("/stock/stats")
    return response.data
  },

  // Mouvements
  getAllMouvements: async (): Promise<MouvementStockDto[]> => {
    const response = await apiClient.get("/stock/mouvements")
    return response.data
  },

  getMouvementsByPeriode: async (dateDebut: string, dateFin: string): Promise<MouvementStockDto[]> => {
    const response = await apiClient.get(`/stock/mouvements/periode?dateDebut=${dateDebut}&dateFin=${dateFin}`)
    return response.data
  },

  getMouvementsByArticle: async (articleId: number): Promise<MouvementStockDto[]> => {
    const response = await apiClient.get(`/stock/mouvements/article/${articleId}`)
    return response.data
  },

  // Inventory
  getDashboardStats: async (): Promise<Record<string, unknown>> => {
    const response = await apiClient.get("/stock/inventory/dashboard")
    return response.data
  },

  getUnreadAlerts: async (): Promise<AlerteStock[]> => {
    const response = await apiClient.get("/stock/inventory/alerts/unread")
    return response.data
  },

  getLowStockArticles: async (): Promise<Article[]> => {
    const response = await apiClient.get("/stock/inventory/alerts/low-stock")
    return response.data
  },

  getOutOfStockArticles: async (): Promise<Article[]> => {
    const response = await apiClient.get("/stock/inventory/alerts/out-of-stock")
    return response.data
  },

  reserveStock: async (articleId: number, quantity: number): Promise<ApiResponseVoid> => {
    const response = await apiClient.post(`/stock/inventory/reserve-stock?articleId=${articleId}&quantity=${quantity}`)
    return response.data
  },

  releaseStock: async (articleId: number, quantity: number): Promise<ApiResponseVoid> => {
    const response = await apiClient.post(`/stock/inventory/release-stock?articleId=${articleId}&quantity=${quantity}`)
    return response.data
  },

  adjustStock: async (
    articleId: number,
    quantity: number,
    reason: string,
    userId: number,
  ): Promise<ApiResponseVoid> => {
    const response = await apiClient.post(
      `/stock/inventory/adjust-stock?articleId=${articleId}&quantity=${quantity}&reason=${encodeURIComponent(reason)}&userId=${userId}`,
    )
    return response.data
  },
}
