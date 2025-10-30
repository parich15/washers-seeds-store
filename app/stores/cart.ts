import { defineStore } from 'pinia'
import type { CartItem, CartState, Product, AddToCartPayload } from '../types'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    discount: 0,
    total: 0,
    itemsCount: 0,
    loading: false,
    error: null
  }),

  getters: {
    cartItems: (state) => state.items,
    cartTotal: (state) => state.total,
    cartCount: (state) => state.itemsCount,
    isEmpty: (state) => state.items.length === 0,
    
    cartSummary: (state) => ({
      subtotal: state.subtotal,
      tax: state.tax,
      shipping: state.shipping,
      discount: state.discount,
      total: state.total
    })
  },

  actions: {
    addToCart(payload: AddToCartPayload) {
      // Buscar si el producto ya existe en el carrito
      const existingItemIndex = this.items.findIndex(
        item => item.product.id === payload.productId
      )

      if (existingItemIndex !== -1) {
        // Si existe, actualizar cantidad
        this.items[existingItemIndex].quantity += payload.quantity
      } else {
        // Si no existe, agregarlo (necesitamos el producto completo)
        // Por ahora, solo agregamos un placeholder
        // TODO: Obtener producto real de la API o store de productos
        const newItem: CartItem = {
          id: Date.now().toString(),
          product: {} as Product, // Placeholder
          quantity: payload.quantity,
          selectedOptions: payload.selectedOptions,
          addedAt: new Date().toISOString()
        }
        this.items.push(newItem)
      }

      this.calculateTotals()
      this.persistCart()
    },

    removeFromCart(itemId: string) {
      const index = this.items.findIndex(item => item.id === itemId)
      if (index !== -1) {
        this.items.splice(index, 1)
        this.calculateTotals()
        this.persistCart()
      }
    },

    updateQuantity(itemId: string, quantity: number) {
      const item = this.items.find(item => item.id === itemId)
      if (item) {
        if (quantity <= 0) {
          this.removeFromCart(itemId)
        } else {
          item.quantity = quantity
          this.calculateTotals()
          this.persistCart()
        }
      }
    },

    clearCart() {
      this.items = []
      this.calculateTotals()
      this.persistCart()
    },

    calculateTotals() {
      // Calcular subtotal
      this.subtotal = this.items.reduce((sum, item) => {
        return sum + (item.product.price?.amount || 0) * item.quantity
      }, 0)

      // Calcular impuestos (21% IVA en España)
      this.tax = this.subtotal * 0.21

      // Calcular envío (gratis si subtotal > 30€, sino 5€)
      this.shipping = this.subtotal > 30 ? 0 : 5

      // Calcular total
      this.total = this.subtotal + this.tax + this.shipping - this.discount

      // Calcular número de items
      this.itemsCount = this.items.reduce((sum, item) => sum + item.quantity, 0)
    },

    applyDiscount(discountAmount: number) {
      this.discount = discountAmount
      this.calculateTotals()
      this.persistCart()
    },

    persistCart() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadCart() {
      if (process.client) {
        const cartStr = localStorage.getItem('cart')
        if (cartStr) {
          try {
            this.items = JSON.parse(cartStr)
            this.calculateTotals()
          } catch (error) {
            console.error('Error al cargar carrito:', error)
            this.clearCart()
          }
        }
      }
    },

    // Método auxiliar para agregar producto completo
    addProductToCart(product: Product, quantity: number = 1, options?: Record<string, string>) {
      const existingItemIndex = this.items.findIndex(
        item => item.product.id === product.id
      )

      if (existingItemIndex !== -1) {
        this.items[existingItemIndex].quantity += quantity
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${Date.now()}`,
          product,
          quantity,
          selectedOptions: options,
          addedAt: new Date().toISOString()
        }
        this.items.push(newItem)
      }

      this.calculateTotals()
      this.persistCart()
    }
  }
})
