// ==================== PRODUCT TYPES ====================

import type { Image, Price, Review, ProductType, SeedType } from './common'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: Image
  parent?: string
  productsCount?: number
}

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: Image
  description?: string
}

// Base product interface
export interface BaseProduct {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  images: Image[]
  price: Price
  stock: number
  inStock: boolean
  category: Category
  brand?: Brand
  tags?: string[]
  featured?: boolean
  new?: boolean
  onSale?: boolean
  rating?: number
  reviewsCount?: number
  reviews?: Review[]
  type: ProductType
  sku?: string
  createdAt?: string
  updatedAt?: string
}

// Seed-specific properties
export interface SeedProduct extends BaseProduct {
  type: 'seed'
  seedType: SeedType
  genetics: {
    thc?: string
    cbd?: string
    lineage?: string
    dominance?: 'indica' | 'sativa' | 'hybrid'
  }
  growing: {
    floweringTime?: string
    yield?: string
    height?: string
    difficulty?: 'easy' | 'medium' | 'hard'
    climate?: string[]
  }
  effects?: string[]
  flavors?: string[]
  medical?: string[]
  feminized?: boolean
  autoflowering?: boolean
  packSize?: number // número de semillas en el pack
}

// Paraphernalia product
export interface ParaphernaliaProduct extends BaseProduct {
  type: 'product'
  specifications: {
    material?: string
    dimensions?: string
    weight?: string
    color?: string
    capacity?: string
    [key: string]: string | undefined
  }
  features?: string[]
  instructions?: string
}

// Union type for all products
export type Product = SeedProduct | ParaphernaliaProduct

// Product filters
export interface ProductFilters {
  categories?: string[]
  brands?: string[]
  priceRange?: {
    min: number
    max: number
  }
  seedTypes?: SeedType[]
  inStock?: boolean
  onSale?: boolean
  rating?: number
  tags?: string[]
  search?: string
}

// Product sort options
export type ProductSortBy = 
  | 'newest' 
  | 'oldest' 
  | 'price-asc' 
  | 'price-desc' 
  | 'name-asc' 
  | 'name-desc' 
  | 'popular' 
  | 'rating'

export interface ProductQuery {
  filters?: ProductFilters
  sortBy?: ProductSortBy
  page?: number
  perPage?: number
}
