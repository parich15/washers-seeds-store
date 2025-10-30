// ==================== CART TYPES ====================

import type { Product } from './product'
import type { Address, OrderStatus, PaymentStatus, PaymentMethod } from './common'
import type { User } from './user'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedOptions?: Record<string, string>
  addedAt: string
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  itemsCount: number
}

export interface CartState extends Cart {
  loading: boolean
  error: string | null
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
}

export interface CheckoutData {
  shippingAddress: Address
  billingAddress?: Address
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  notes?: string
}

export interface Order {
  id: string
  orderNumber: string
  user: User
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  shippingAddress: Address
  billingAddress?: Address
  shippingMethod: ShippingMethod
  paymentMethod: PaymentMethod
  status: OrderStatus
  paymentStatus: PaymentStatus
  notes?: string
  createdAt: string
  updatedAt?: string
  estimatedDelivery?: string
  trackingNumber?: string
}

export interface OrderHistory {
  orders: Order[]
  totalOrders: number
}

export interface AddToCartPayload {
  productId: string
  quantity: number
  selectedOptions?: Record<string, string>
}

export interface UpdateCartItemPayload {
  itemId: string
  quantity: number
}

export interface ApplyCouponPayload {
  code: string
}

export interface Coupon {
  code: string
  discount: number
  type: 'percentage' | 'fixed'
  validUntil?: string
  minAmount?: number
}
