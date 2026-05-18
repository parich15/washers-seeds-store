import { defineStore } from 'pinia'
import type { AddCartLinePayload, AddToCartPayload, CartItem, CartProductSnapshot, CartState, Product } from '~~/types'

const getLineKey = (product: CartProductSnapshot, selectedOptions?: Record<string, string>) => {
  const optionsKey = selectedOptions ? JSON.stringify(Object.entries(selectedOptions).sort()) : ''
  return `${product.collection}:${product.id}:${optionsKey}`
}

const legacyProductToSnapshot = (product: Product): CartProductSnapshot => ({
  id: product.id,
  collection: 'legacy',
  slug: product.slug,
  name: product.name,
  image: product.images[0]?.url || 'https://placehold.co/600x600/36A9E1/FFF?text=Sin+Imagen',
  price: product.price.amount,
  sku: product.sku,
  category: product.category?.name
})

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
      const existingItemIndex = this.items.findIndex(item => item.product.id === payload.productId)

      if (existingItemIndex !== -1) {
        // Si existe, actualizar cantidad
        this.items[existingItemIndex]!.quantity += payload.quantity
      } else {
        const newItem: CartItem = {
          id: Date.now().toString(),
          product: {
            id: payload.productId,
            collection: 'legacy',
            slug: '',
            name: 'Producto',
            image: 'https://placehold.co/600x600/36A9E1/FFF?text=Sin+Imagen',
            price: 0
          },
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
        return sum + item.product.price * item.quantity
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
      if (import.meta.client) {
        localStorage.setItem('cart', JSON.stringify(this.items))
      }
    },

    loadCart() {
      if (import.meta.client) {
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

    addCartLine(payload: AddCartLinePayload) {
      const quantity = payload.quantity || 1
      const lineKey = getLineKey(payload.product, payload.selectedOptions)
      const existingItemIndex = this.items.findIndex(item => item.id === lineKey)

      if (existingItemIndex !== -1) {
        this.items[existingItemIndex]!.quantity += quantity
      } else {
        this.items.push({
          id: lineKey,
          product: payload.product,
          quantity,
          selectedOptions: payload.selectedOptions,
          addedAt: new Date().toISOString()
        })
      }

      this.calculateTotals()
      this.persistCart()
    },

    // Método auxiliar para componentes legacy basados en mocks
    addProductToCart(product: Product, quantity: number = 1, options?: Record<string, string>) {
      this.addCartLine({
        product: legacyProductToSnapshot(product),
        quantity,
        selectedOptions: options
      })
    }
  }
})
