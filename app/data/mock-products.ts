import type { SeedProduct, ParaphernaliaProduct, Category, Brand } from '../../types'

// ==================== BRANDS ====================
export const mockBrands: Brand[] = [
  {
    id: '1',
    name: 'Sensi Seeds',
    slug: 'sensi-seeds',
    description: 'Banco de semillas legendario desde 1985'
  },
  {
    id: '2',
    name: 'Barney\'s Farm',
    slug: 'barneys-farm',
    description: 'Ganadores de múltiples Cannabis Cups'
  },
  {
    id: '3',
    name: 'Royal Queen Seeds',
    slug: 'royal-queen-seeds',
    description: 'Calidad europea premium'
  },
  {
    id: '4',
    name: 'Sweet Seeds',
    slug: 'sweet-seeds',
    description: 'Especialistas en genéticas de alto CBD'
  },
  {
    id: '5',
    name: 'Washer Brand',
    slug: 'washer-brand',
    description: 'Nuestra marca propia de accesorios'
  }
]

// ==================== CATEGORIES ====================
export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Semillas Feminizadas',
    slug: 'feminizadas',
    description: '100% semillas hembra garantizadas',
    parent: 'semillas',
    productsCount: 45,
    image: {
      url: 'https://placehold.co/800x800/36A9E1/FFF?text=Semillas+Feminizadas',
      alt: 'Semillas Feminizadas'
    }
  },
  {
    id: 'cat-2',
    name: 'Semillas Autoflorecientes',
    slug: 'autoflorecientes',
    description: 'Floración automática, cultivo rápido',
    parent: 'semillas',
    productsCount: 38,
    image: {
      url: 'https://placehold.co/800x800/3AAA35/FFF?text=Autoflorecientes',
      alt: 'Semillas Autoflorecientes'
    }
  },
  {
    id: 'cat-3',
    name: 'Semillas CBD',
    slug: 'cbd',
    description: 'Alto contenido en CBD',
    parent: 'semillas',
    productsCount: 22,
    image: {
      url: 'https://placehold.co/800x800/936037/FFF?text=CBD+Seeds',
      alt: 'Semillas CBD'
    }
  },
  {
    id: 'cat-4',
    name: 'Grinders',
    slug: 'grinders',
    description: 'Picadores de alta calidad',
    parent: 'parafernalia',
    productsCount: 15,
    image: {
      url: 'https://placehold.co/800x800/36A9E1/FFF?text=Grinders',
      alt: 'Grinders'
    }
  },
  {
    id: 'cat-5',
    name: 'Papel de Liar',
    slug: 'papel',
    description: 'Papeles naturales y saborizados',
    parent: 'parafernalia',
    productsCount: 25,
    image: {
      url: 'https://placehold.co/800x800/3AAA35/FFF?text=Papel+Liar',
      alt: 'Papel de Liar'
    }
  }
]

// ==================== SEED PRODUCTS ====================
export const mockSeedProducts: SeedProduct[] = [
  {
    id: 'seed-1',
    name: 'Northern Lights',
    slug: 'northern-lights',
    description: 'Una de las variedades más famosas del mundo. Índica pura con efectos relajantes y sabor dulce. Perfecta para cultivadores principiantes.',
    shortDescription: 'Índica legendaria, fácil de cultivar',
    type: 'seed',
    seedType: 'feminized',
    images: [
      { url: 'https://placehold.co/800x800/36A9E1/FFF?text=Northern+Lights', alt: 'Northern Lights' },
      { url: 'https://placehold.co/800x800/3AAA35/FFF?text=Northern+Lights+2', alt: 'Northern Lights 2' }
    ],
    price: {
      amount: 29.90,
      currency: 'EUR',
      discount: 10,
      oldPrice: 33.00
    },
    stock: 45,
    inStock: true,
    category: mockCategories[0]!,
    brand: mockBrands[0]!,
    tags: ['índica', 'fácil', 'interior', 'clásica'],
    featured: true,
    new: false,
    onSale: true,
    rating: 4.8,
    reviewsCount: 156,
    sku: 'SS-NL-FEM-3',
    feminized: true,
    autoflowering: false,
    packSize: 3,
    genetics: {
      thc: '18-22%',
      cbd: '<1%',
      lineage: 'Afghani x Thai',
      dominance: 'indica'
    },
    growing: {
      floweringTime: '7-9 semanas',
      yield: '500-550 g/m²',
      height: '1-1.2m',
      difficulty: 'easy',
      climate: ['interior', 'exterior templado']
    },
    effects: ['Relajante', 'Eufórico', 'Somnoliento'],
    flavors: ['Dulce', 'Terroso', 'Pino'],
    medical: ['Insomnio', 'Estrés', 'Dolor crónico'],
    createdAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'seed-2',
    name: 'Gorilla Glue Auto',
    slug: 'gorilla-glue-auto',
    description: 'Versión autofloreciente de la legendaria GG#4. Produce cogollos densos cubiertos de resina con alto contenido de THC. Lista en 75 días desde la semilla.',
    shortDescription: 'Autofloreciente potente y resinosa',
    type: 'seed',
    seedType: 'autoflowering',
    images: [
      { url: 'https://placehold.co/800x800/36A9E1/FFF?text=Gorilla+Glue+Auto', alt: 'Gorilla Glue Auto' }
    ],
    price: {
      amount: 35.00,
      currency: 'EUR'
    },
    stock: 32,
    inStock: true,
    category: mockCategories[1]!,
    brand: mockBrands[1]!,
    tags: ['autofloreciente', 'potente', 'resina', 'híbrido'],
    featured: true,
    new: true,
    onSale: false,
    rating: 4.9,
    reviewsCount: 203,
    sku: 'BF-GGA-AUTO-5',
    feminized: true,
    autoflowering: true,
    packSize: 5,
    genetics: {
      thc: '24-26%',
      cbd: '<1%',
      lineage: 'Chem\'s Sister x Sour Dubb x Chocolate Diesel',
      dominance: 'hybrid'
    },
    growing: {
      floweringTime: '75-80 días totales',
      yield: '450-500 g/m²',
      height: '80-120cm',
      difficulty: 'medium',
      climate: ['interior', 'exterior', 'invernadero']
    },
    effects: ['Potente', 'Eufórico', 'Relajante'],
    flavors: ['Diesel', 'Terroso', 'Pino'],
    medical: ['Dolor', 'Ansiedad', 'Insomnio'],
    createdAt: '2025-02-01T10:00:00Z'
  },
  {
    id: 'seed-3',
    name: 'CBD Charlotte\'s Angel',
    slug: 'cbd-charlottes-angel',
    description: 'Variedad medicinal con ratio 1:1 THC:CBD. Ideal para uso terapéutico sin efectos psicoactivos intensos. Sabor suave y agradable.',
    shortDescription: 'CBD medicinal 1:1 THC:CBD',
    type: 'seed',
    seedType: 'cbd',
    images: [
      { url: 'https://placehold.co/800x800/3AAA35/FFF?text=CBD+Charlotte', alt: 'Charlotte\'s Angel' }
    ],
    price: {
      amount: 42.00,
      currency: 'EUR'
    },
    stock: 28,
    inStock: true,
    category: mockCategories[2]!,
    brand: mockBrands[3]!,
    tags: ['cbd', 'medicinal', 'terapéutico', 'bajo thc'],
    featured: true,
    new: false,
    onSale: false,
    rating: 4.7,
    reviewsCount: 89,
    sku: 'SS-CA-CBD-3',
    feminized: true,
    autoflowering: false,
    packSize: 3,
    genetics: {
      thc: '8-10%',
      cbd: '8-10%',
      lineage: 'Charlotte\'s Web x Red Angel',
      dominance: 'sativa'
    },
    growing: {
      floweringTime: '9-10 semanas',
      yield: '400-450 g/m²',
      height: '90-150cm',
      difficulty: 'easy',
      climate: ['interior', 'exterior', 'mediterráneo']
    },
    effects: ['Relajante', 'Claridad mental', 'Bienestar'],
    flavors: ['Cítrico', 'Dulce', 'Floral'],
    medical: ['Ansiedad', 'Inflamación', 'Dolor neuropático', 'Epilepsia'],
    createdAt: '2025-01-20T10:00:00Z'
  },
  {
    id: 'seed-4',
    name: 'Wedding Cake',
    slug: 'wedding-cake',
    description: 'Híbrida indica-dominante con sabor dulce y cremoso. Perfecta para relajación nocturna. Alta producción de resina y tricomas.',
    shortDescription: 'Híbrida dulce y potente',
    type: 'seed',
    seedType: 'feminized',
    images: [
      { url: 'https://placehold.co/800x800/936037/FFF?text=Wedding+Cake', alt: 'Wedding Cake' }
    ],
    price: {
      amount: 38.50,
      currency: 'EUR',
      discount: 15,
      oldPrice: 45.00
    },
    stock: 18,
    inStock: true,
    category: mockCategories[0]!,
    brand: mockBrands[2]!,
    tags: ['híbrido', 'dulce', 'potente', 'resina'],
    featured: false,
    new: false,
    onSale: true,
    rating: 4.6,
    reviewsCount: 124,
    sku: 'RQS-WC-FEM-5',
    feminized: true,
    autoflowering: false,
    packSize: 5,
    genetics: {
      thc: '20-25%',
      cbd: '<1%',
      lineage: 'Triangle Kush x Animal Mints',
      dominance: 'indica'
    },
    growing: {
      floweringTime: '8-9 semanas',
      yield: '500-550 g/m²',
      height: '1-1.3m',
      difficulty: 'medium',
      climate: ['interior', 'exterior templado']
    },
    effects: ['Relajante', 'Eufórico', 'Creativo'],
    flavors: ['Dulce', 'Vainilla', 'Terroso'],
    medical: ['Estrés', 'Insomnio', 'Dolor'],
    createdAt: '2025-01-10T10:00:00Z'
  }
]

// ==================== PARAPHERNALIA PRODUCTS ====================
export const mockParaphernaliaProducts: ParaphernaliaProduct[] = [
  {
    id: 'para-1',
    name: 'Grinder Aluminio 4 Partes',
    slug: 'grinder-aluminio-4-partes',
    description: 'Grinder de alta calidad fabricado en aluminio anodizado. 4 compartimentos con filtro de polen. Imanes de neodimio para cierre perfecto. Dientes en forma de diamante para un picado óptimo.',
    shortDescription: 'Grinder profesional 4 compartimentos',
    type: 'product',
    images: [
      { url: 'https://placehold.co/800x800/36A9E1/FFF?text=Grinder+4+Partes', alt: 'Grinder Aluminio' }
    ],
    price: {
      amount: 24.90,
      currency: 'EUR'
    },
    stock: 67,
    inStock: true,
    category: mockCategories[3]!,
    brand: mockBrands[4]!,
    tags: ['grinder', 'aluminio', 'profesional', '4 partes'],
    featured: true,
    new: false,
    onSale: false,
    rating: 4.8,
    reviewsCount: 234,
    sku: 'WB-GR4P-55',
    specifications: {
      material: 'Aluminio anodizado',
      dimensions: 'Ø 55mm x 40mm',
      weight: '120g',
      color: 'Negro'
    },
    features: [
      'Imanes de neodimio de alta potencia',
      'Dientes en forma de diamante',
      'Filtro de polen integrado',
      'Recogedor de kief',
      'Raspador incluido'
    ],
    createdAt: '2025-01-05T10:00:00Z'
  },
  {
    id: 'para-2',
    name: 'Papel RAW Orgánico King Size',
    slug: 'papel-raw-organico-king-size',
    description: 'Papel de liar 100% orgánico, sin blanquear. Combustión lenta y uniforme. Sin aditivos químicos. Goma natural de acacia. 32 hojas por librito.',
    shortDescription: 'Papel orgánico premium',
    type: 'product',
    images: [
      { url: 'https://placehold.co/800x800/3AAA35/FFF?text=Papel+RAW', alt: 'Papel RAW' }
    ],
    price: {
      amount: 2.50,
      currency: 'EUR',
      discount: 20,
      oldPrice: 3.00
    },
    stock: 145,
    inStock: true,
    category: mockCategories[4]!,
    brand: mockBrands[4]!,
    tags: ['papel', 'orgánico', 'raw', 'king size'],
    featured: true,
    new: false,
    onSale: true,
    rating: 4.9,
    reviewsCount: 567,
    sku: 'RAW-ORG-KS',
    specifications: {
      material: 'Papel orgánico sin blanquear',
      dimensions: '110mm x 44mm',
      weight: '13.5g',
      color: 'Marrón natural'
    },
    features: [
      '100% orgánico y ecológico',
      'Goma natural de acacia',
      'Combustión ultra lenta',
      'Sin cloro ni aditivos',
      '32 hojas por paquete'
    ],
    createdAt: '2025-01-08T10:00:00Z'
  },
  {
    id: 'para-3',
    name: 'Bong Cristal 30cm',
    slug: 'bong-cristal-30cm',
    description: 'Bong de cristal borosilicato de alta calidad. Base estable y cuello ergonómico. Sistema de difusión para fumadas suaves. Fácil de limpiar.',
    shortDescription: 'Bong cristal profesional',
    type: 'product',
    images: [
      { url: 'https://placehold.co/800x800/936037/FFF?text=Bong+30cm', alt: 'Bong Cristal' }
    ],
    price: {
      amount: 45.00,
      currency: 'EUR'
    },
    stock: 23,
    inStock: true,
    category: mockCategories[3]!,
    brand: mockBrands[4]!,
    tags: ['bong', 'cristal', 'difusor', '30cm'],
    featured: false,
    new: true,
    onSale: false,
    rating: 4.7,
    reviewsCount: 89,
    sku: 'WB-BG-30',
    specifications: {
      material: 'Cristal borosilicato 5mm',
      dimensions: '30cm altura',
      weight: '450g',
      capacity: '250ml'
    },
    features: [
      'Cristal borosilicato resistente',
      'Base ancha y estable',
      'Difusor integrado',
      'Cuello ergonómico',
      'Fácil limpieza'
    ],
    createdAt: '2025-02-05T10:00:00Z'
  }
]

// ==================== ALL PRODUCTS ====================
export const mockAllProducts = [...mockSeedProducts, ...mockParaphernaliaProducts]

// ==================== HELPER FUNCTIONS ====================
export const getProductById = (id: string) => {
  return mockAllProducts.find(p => p.id === id)
}

export const getProductBySlug = (slug: string) => {
  return mockAllProducts.find(p => p.slug === slug)
}

export const getProductsByCategory = (categorySlug: string) => {
  return mockAllProducts.filter(p => p.category.slug === categorySlug)
}

export const getFeaturedProducts = () => {
  return mockAllProducts.filter(p => p.featured)
}

export const getNewProducts = () => {
  return mockAllProducts.filter(p => p.new)
}

export const getOnSaleProducts = () => {
  return mockAllProducts.filter(p => p.onSale)
}
