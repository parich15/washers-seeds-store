import type { MenuResponse } from '~~/types'

/**
 * Composable para obtener y gestionar los menús desde Directus
 */
export const useMenus = () => {
  /**
   * Obtiene los menús desde la API
   */
  const fetchMenus = async () => {
    const { data, pending, error, refresh } = await useFetch<MenuResponse[]>(
      '/api/menus',
      {
        // Cache the response
        key: 'menus'
      }
    )

    return {
      menus: data,
      pending,
      error,
      refresh
    }
  }

  /**
   * Obtiene el menú del Navbar filtrando por nombre "Navbar"
   */
  const getNavbarMenu = (menus: MenuResponse[] | null): MenuResponse | null => {
    if (!menus) return null
    return menus.find(menu => menu.nombre === 'Navbar') || null
  }

  /**
   * Obtiene el menú del Footer filtrando por nombre "Footer"
   */
  const getFooterMenu = (menus: MenuResponse[] | null): MenuResponse | null => {
    if (!menus) return null
    return menus.find(menu => menu.nombre === 'Footer') || null
  }

  return {
    fetchMenus,
    getNavbarMenu,
    getFooterMenu
  }
}
