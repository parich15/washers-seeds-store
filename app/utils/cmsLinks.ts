const LEGACY_COLLECTIONS: Record<string, string> = {
  semillas: 'semillas',
  ropa: 'ropa',
  parafernalia: 'ropa',
  productos: 'semillas'
}

export const normalizeCmsPath = (path?: string | null): string => {
  if (!path) return '/'

  if (/^(https?:|mailto:|tel:|#)/.test(path)) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  const parts = normalized.split('/').filter(Boolean)

  if (parts[0] === 'categories' || parts[0] === 'categorias') {
    const collection = LEGACY_COLLECTIONS[parts[1] || ''] || parts[1] || 'semillas'
    const slug = parts[2]

    return slug ? `/products/${collection}/${slug}` : `/products/${collection}`
  }

  return normalized
}
