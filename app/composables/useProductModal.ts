const DESKTOP_QUERY = '(min-width: 768px)'

/**
 * На десктопі товар відкривається модалкою поверх меню, на мобільному — окремою сторінкою.
 * Картки лишаються звичайними посиланнями на /product/:slug (SEO, відкриття в новій вкладці).
 */
export function useProductModal() {
  const slug = useState<string | null>('product-modal', () => null)

  function open(productSlug: string, event?: MouseEvent): boolean {
    if (import.meta.server) return false
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0)) return false
    if (!window.matchMedia(DESKTOP_QUERY).matches) return false
    event?.preventDefault()
    slug.value = productSlug
    return true
  }

  function close() {
    slug.value = null
  }

  return { slug, open, close }
}
