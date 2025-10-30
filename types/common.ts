// ==================== COMMON TYPES ====================

export interface Image {
  url: string
  alt: string
  width?: number
  height?: number
}

export interface Price {
  amount: number
  currency: string
  discount?: number
  oldPrice?: number
}

export interface Review {
  id: string
  userId: string
  userName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export interface Address {
  id?: string
  street: string
  city: string
  province: string
  postalCode: string
  country: string
  isDefault?: boolean
}

export interface FilterOption {
  id: string
  label: string
  value: string | number
  count?: number
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export interface SortOption {
  value: string
  label: string
}

export type ProductType = 'seed' | 'product'
export type SeedType = 'feminized' | 'autoflowering' | 'regular' | 'cbd'
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod = 'credit_card' | 'paypal' | 'transfer' | 'cash_on_delivery'
