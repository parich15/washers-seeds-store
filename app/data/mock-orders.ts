import type { OrderStatus } from '../../types/common'

// Tipo simplificado para los pedidos mock
export interface MockOrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  image: string
}

export interface MockOrder {
  id: string
  orderNumber: string
  userId: string
  date: string
  status: OrderStatus
  items: MockOrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: {
    street: string
    city: string
    province: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  trackingNumber?: string
}

export const mockOrders: MockOrder[] = [
  {
    id: 'ord-001',
    orderNumber: 'ORD-2024-001',
    userId: 'test-user-001',
    date: '2024-10-15T14:30:00Z',
    status: 'delivered',
    items: [
      {
        productId: '1',
        productName: 'Northern Lights Feminizada',
        quantity: 1,
        price: 8.50,
        image: 'https://placehold.co/100x100/36a9e1/ffffff?text=NL'
      },
      {
        productId: '4',
        productName: 'Grinder Metálico Premium',
        quantity: 1,
        price: 12.99,
        image: 'https://placehold.co/100x100/3aaa35/ffffff?text=Grinder'
      }
    ],
    subtotal: 21.49,
    tax: 4.51,
    shipping: 4.95,
    total: 30.95,
    shippingAddress: {
      street: 'Calle Ejemplo 123',
      city: 'Madrid',
      province: 'Madrid',
      postalCode: '28001',
      country: 'España'
    },
    paymentMethod: 'Tarjeta de Crédito',
    paymentStatus: 'completed',
    trackingNumber: 'ES1234567890'
  },
  {
    id: 'ord-002',
    orderNumber: 'ORD-2024-002',
    userId: 'test-user-001',
    date: '2024-10-28T10:15:00Z',
    status: 'processing',
    items: [
      {
        productId: '2',
        productName: 'Gorilla Glue Auto CBD',
        quantity: 2,
        price: 7.50,
        image: 'https://placehold.co/100x100/36a9e1/ffffff?text=GG'
      },
      {
        productId: '5',
        productName: 'Papel OCB Premium Slim',
        quantity: 3,
        price: 1.99,
        image: 'https://placehold.co/100x100/3aaa35/ffffff?text=OCB'
      }
    ],
    subtotal: 20.97,
    tax: 4.40,
    shipping: 0,
    total: 25.37,
    shippingAddress: {
      street: 'Calle Ejemplo 123',
      city: 'Madrid',
      province: 'Madrid',
      postalCode: '28001',
      country: 'España'
    },
    paymentMethod: 'PayPal',
    paymentStatus: 'completed',
    trackingNumber: 'ES0987654321'
  },
  {
    id: 'ord-003',
    orderNumber: 'ORD-2024-003',
    userId: 'test-user-001',
    date: '2024-11-01T16:45:00Z',
    status: 'pending',
    items: [
      {
        productId: '3',
        productName: 'AK-47 Feminizada',
        quantity: 1,
        price: 9.99,
        image: 'https://placehold.co/100x100/36a9e1/ffffff?text=AK47'
      }
    ],
    subtotal: 9.99,
    tax: 2.10,
    shipping: 4.95,
    total: 17.04,
    shippingAddress: {
      street: 'Calle Ejemplo 123',
      city: 'Madrid',
      province: 'Madrid',
      postalCode: '28001',
      country: 'España'
    },
    paymentMethod: 'Transferencia Bancaria',
    paymentStatus: 'pending'
  }
]

export const getOrdersByUserId = (userId: string): MockOrder[] => {
  return mockOrders.filter(order => order.userId === userId)
}

export const getOrderById = (orderId: string): MockOrder | undefined => {
  return mockOrders.find(order => order.id === orderId)
}

export const getOrderStatusLabel = (status: OrderStatus): string => {
  const labels = {
    pending: 'Pendiente',
    processing: 'En Proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    cancelled: 'Cancelado'
  }
  return labels[status]
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  const colors = {
    pending: 'warning',
    processing: 'primary',
    shipped: 'secondary',
    delivered: 'success',
    cancelled: 'danger'
  }
  return colors[status]
}
