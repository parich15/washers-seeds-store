// ==================== MENU TYPES ====================

/**
 * Menu Response from Directus
 * Contains an array of menus (Navbar, Footer, etc.)
 */
export interface MenuResponse {
  id: number
  nombre: string
  menu: MenuItem[]
}

/**
 * Menu Item - Parent element in menu structure
 */
export interface MenuItem {
  texto: string
  pagina: string
  hijos?: MenuItemChild[] | null
}

/**
 * Menu Item Child - Nested element in menu structure
 */
export interface MenuItemChild {
  texto: string
  pagina: string
}
