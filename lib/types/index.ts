// ============================================
// TYPES GÉNÉRÉS DEPUIS L'API OPENAPI TJ-TRACK
// ============================================

// Auth Types
export interface AuthRequest {
  email: string
  password: string
}

export interface ResetPasswordRequest {
  newPassword: string
  otp: string
  email: string
}

export interface ProfileRequest {
  name: string
  email: string
  password: string
  role: UserRole
  merchantInfo?: MerchantInfo
  supplierInfo?: SupplierInfo
  deliveryInfo?: DeliveryInfo
  clientInfo?: ClientInfo
}

export interface ProfileResponse {
  userId: string
  name: string
  email: string
  isAccountVerified: boolean
  isApproved: boolean
  roles: string[]
  phoneNumber?: string
  enterpriseName?: string
  town?: string
  address?: string
}

export type UserRole = "CLIENT" | "COMMERCANT" | "FOURNISSEUR" | "LIVREUR" | "ADMIN" | "MANAGER"

export interface MerchantInfo {
  shopName: string
  town: string
  address: string
  phoneNumber: string
  latitude?: number
  longitude?: number
}

export interface SupplierInfo {
  shopName: string
  town: string
  address: string
  phoneNumber: string
  latitude?: number
  longitude?: number
}

export interface DeliveryInfo {
  town: string
  address: string
  phoneNumber: string
  latitude?: number
  longitude?: number
}

export interface ClientInfo {
  town: string
  address: string
  phoneNumber: string
  latitude?: number
  longitude?: number
}

export interface Roles {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

// Adresse
export interface Adresse {
  id?: number
  adresse1?: string
  adresse2?: string
  ville?: string
  codePostal?: string
  pays?: string
}

// Entreprise
export interface Entreprise {
  id?: number
  nom?: string
  description?: string
  codeFiscal?: string
  email?: string
  telephone?: string
  siteWeb?: string
  adresse?: Adresse
  createdAt?: string
}

// Categorie
export interface Categorie {
  id?: number
  code?: string
  designation?: string
  description?: string
  articles?: Article[]
  createdAt?: string
  updatedAt?: string
}

export interface CategorieDto {
  id?: number
  code?: string
  designation?: string
  description?: string
  nombreArticles?: number
}

// Article
export interface Article {
  id?: number
  codeArticle?: string
  designation?: string
  description?: string
  prixUnitaireHt?: number
  tauxTva?: number
  prixUnitaireTtc?: number
  photo?: string
  categorie?: Categorie
  fournisseur?: Fournisseur
  entreprise?: Entreprise
  quantiteStock?: number
  stockReserve?: number
  seuilAlerte?: number
  stockMax?: number
  unite?: string
  codeBarres?: string
  statut?: "ACTIF" | "INACTIF" | "DISCONTINUE"
  createdAt?: string
  updatedAt?: string
  stockDisponible?: number
  ruptureStock?: boolean
  stockFaible?: boolean
}

export interface ArticleDto {
  id?: number
  codeArticle: string
  designation: string
  description?: string
  prixUnitaireHt: number
  tauxTva?: number
  prixUnitaireTtc?: number
  photo?: string
  quantiteStock?: number
  seuilAlerte?: number
  stockMax?: number
  stockReserve?: number
  categorieId?: number
  categorieDesignation?: string
  stockFaible?: boolean
  createdAt?: string
  updatedAt?: string
}

// Fournisseur
export interface Fournisseur {
  id?: number
  nom?: string
  email?: string
  telephone?: string
  contact?: string
  adresse?: Adresse
  entreprise?: Entreprise
  statut?: "ACTIF" | "INACTIF"
  createdAt?: string
}

// Client
export interface Client {
  id?: number
  nom?: string
  prenom?: string
  email?: string
  telephone?: string
  dateNaissance?: string
  adresse?: Adresse
  entreprise?: Entreprise
  createdAt?: string
}

// Panier
export interface PanierDto {
  id?: number
  userId?: string
  items?: PanierItemDto[]
  totalItems?: number
  montantTotal?: number
  montantHT?: number
  montantTVA?: number
}

export interface PanierItemDto {
  id?: number
  articleId?: number
  articleCode?: string
  articleNom?: string
  articlePhoto?: string
  quantite?: number
  prixUnitaire?: number
  sousTotal?: number
  stockDisponible?: number
  disponible?: boolean
}

// Commandes
export interface CommandeClient {
  id?: number
  code?: string
  client?: Client
  ligneCommandeClients?: LigneCommandeClient[]
  dateCommande?: string
  dateLivraison?: string
  statut?: CommandeClientStatut
  totalHt?: number
  totalTtc?: number
  entreprise?: Entreprise
}

export type CommandeClientStatut = "EN_ATTENTE" | "CONFIRMEE" | "EXPEDIEE" | "LIVREE" | "ANNULEE"

export interface LigneCommandeClient {
  id?: number
  commandeClient?: CommandeClient
  article?: Article
  quantite?: number
  prixUnitaire?: number
  prixTotal?: number
  entrepriseId?: number
}

export interface CommandeFournisseur {
  id?: number
  code?: string
  fournisseur?: Fournisseur
  ligneCommandeFournisseurs?: LigneCommandeFournisseur[]
  dateCommande?: string
  dateLivraisonPrevue?: string
  dateLivraisonReelle?: string
  statut?: CommandeFournisseurStatut
  totalHt?: number
  totalTtc?: number
  entreprise?: Entreprise
}

export type CommandeFournisseurStatut = "EN_ATTENTE" | "CONFIRMEE" | "EXPEDIEE" | "RECUE" | "ANNULEE"

export interface LigneCommandeFournisseur {
  id?: number
  commandeFournisseur?: CommandeFournisseur
  article?: Article
  quantiteCommandee?: number
  quantiteRecue?: number
  prixUnitaire?: number
  prixTotal?: number
}

// Ventes
export interface Ventes {
  id?: number
  code?: string
  client?: Client
  ligneVentes?: LigneVente[]
  commandeClient?: CommandeClient
  commentaire?: string
  dateVente?: string
  totalHt?: number
  totalTva?: number
  totalTtc?: number
  entreprise?: Entreprise
  entrepriseId?: number
}

export interface LigneVente {
  id?: number
  vente?: Ventes
  article?: Article
  quantite?: number
  prixUnitaire?: number
  prixTotal?: number
  entrepriseId?: number
}

// Stock
export interface MouvementStockDto {
  id?: number
  articleId?: number
  articleDesignation?: string
  typeMouvement?: TypeMouvement
  quantite?: number
  prixUnitaire?: number
  motif?: string
  dateMouvement?: string
  createdBy?: string
}

export type TypeMouvement = "ENTREE" | "SORTIE" | "CORRECTION_POSITIVE" | "CORRECTION_NEGATIVE"

export interface AlerteStock {
  id?: number
  article?: Article
  type?: AlerteStockType
  seuil?: number
  stockActuel?: number
  message?: string
  lu?: boolean
  createdAt?: string
}

export type AlerteStockType = "STOCK_FAIBLE" | "RUPTURE_STOCK" | "SURSTOCK"

export interface StockAdjustmentRequest {
  quantite: number
  motif: string
}

export interface ApiResponseVoid {
  success?: boolean
  message?: string
  data?: object
  error?: string
}

// Pagination & Filters
export interface ArticleFilters {
  page?: number
  size?: number
  sortBy?: string
  sortDir?: "asc" | "desc"
  categorieId?: number
  search?: string
}
