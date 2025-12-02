import apiClient from "./axios"
import type {
  Fournisseur,
  Entreprise,
  Client,
  CommandeClient,
  CommandeFournisseur,
  LigneCommandeClient,
  LigneCommandeFournisseur,
  Ventes,
} from "@/lib/types"

// Fournisseurs
export const fournisseursApi = {
  getAll: async (): Promise<Fournisseur[]> => {
    const response = await apiClient.get("/api/v1.0/fournisseurs")
    return response.data
  },

  getById: async (id: number): Promise<Fournisseur> => {
    const response = await apiClient.get(`/api/v1.0/fournisseurs/${id}`)
    return response.data
  },

  create: async (data: Fournisseur): Promise<Fournisseur> => {
    const response = await apiClient.post("/api/v1.0/fournisseurs", data)
    return response.data
  },

  update: async (id: number, data: Fournisseur): Promise<Fournisseur> => {
    const response = await apiClient.put(`/api/v1.0/fournisseurs/${id}`, data)
    return response.data
  },

  delete: async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/api/v1.0/fournisseurs/${id}`)
    return response.data
  },

  search: async (nom: string): Promise<Fournisseur[]> => {
    const response = await apiClient.get(`/api/v1.0/fournisseurs/search?nom=${encodeURIComponent(nom)}`)
    return response.data
  },

  getActive: async (): Promise<Fournisseur[]> => {
    const response = await apiClient.get("/api/v1.0/fournisseurs/active")
    return response.data
  },
}

// Entreprises
export const entreprisesApi = {
  getAll: async (): Promise<Entreprise[]> => {
    const response = await apiClient.get("/api/v1.0/entreprises")
    return response.data
  },

  getById: async (id: number): Promise<Entreprise> => {
    const response = await apiClient.get(`/api/v1.0/entreprises/${id}`)
    return response.data
  },

  create: async (data: Entreprise): Promise<Entreprise> => {
    const response = await apiClient.post("/api/v1.0/entreprises", data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1.0/entreprises/${id}`)
  },
}

// Clients
export const clientsApi = {
  getAll: async (): Promise<Client[]> => {
    const response = await apiClient.get("/api/v1.0/clients")
    return response.data
  },

  getById: async (id: number): Promise<Client> => {
    const response = await apiClient.get(`/api/v1.0/clients/${id}`)
    return response.data
  },

  create: async (data: Client): Promise<Client> => {
    const response = await apiClient.post("/api/v1.0/clients", data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1.0/clients/${id}`)
  },
}

// Commandes Client
export const commandesClientApi = {
  getAll: async (): Promise<CommandeClient[]> => {
    const response = await apiClient.get("/api/v1.0/commandes-client")
    return response.data
  },

  getById: async (id: number): Promise<CommandeClient> => {
    const response = await apiClient.get(`/api/v1.0/commandes-client/${id}`)
    return response.data
  },

  getByCode: async (code: string): Promise<CommandeClient> => {
    const response = await apiClient.get(`/api/v1.0/commandes-client/code/${code}`)
    return response.data
  },

  getLignes: async (id: number): Promise<LigneCommandeClient[]> => {
    const response = await apiClient.get(`/api/v1.0/commandes-client/${id}/lignes`)
    return response.data
  },

  create: async (data: CommandeClient): Promise<CommandeClient> => {
    const response = await apiClient.post("/api/v1.0/commandes-client", data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1.0/commandes-client/${id}`)
  },
}

// Commandes Fournisseur
export const commandesFournisseurApi = {
  getAll: async (): Promise<CommandeFournisseur[]> => {
    const response = await apiClient.get("/api/v1.0/commandes-fournisseur")
    return response.data
  },

  getById: async (id: number): Promise<CommandeFournisseur> => {
    const response = await apiClient.get(`/api/v1.0/commandes-fournisseur/${id}`)
    return response.data
  },

  getByCode: async (code: string): Promise<CommandeFournisseur> => {
    const response = await apiClient.get(`/api/v1.0/commandes-fournisseur/code/${code}`)
    return response.data
  },

  getLignes: async (id: number): Promise<LigneCommandeFournisseur[]> => {
    const response = await apiClient.get(`/api/v1.0/commandes-fournisseur/${id}/lignes`)
    return response.data
  },

  create: async (data: CommandeFournisseur): Promise<CommandeFournisseur> => {
    const response = await apiClient.post("/api/v1.0/commandes-fournisseur", data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1.0/commandes-fournisseur/${id}`)
  },
}

// Ventes
export const ventesApi = {
  getAll: async (): Promise<Ventes[]> => {
    const response = await apiClient.get("/api/v1.0/ventes")
    return response.data
  },

  getById: async (id: number): Promise<Ventes> => {
    const response = await apiClient.get(`/api/v1.0/ventes/${id}`)
    return response.data
  },

  getByCode: async (code: string): Promise<Ventes> => {
    const response = await apiClient.get(`/api/v1.0/ventes/code/${code}`)
    return response.data
  },

  create: async (data: Ventes): Promise<Ventes> => {
    const response = await apiClient.post("/api/v1.0/ventes", data)
    return response.data
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1.0/ventes/${id}`)
  },
}
