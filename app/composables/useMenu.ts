import type { Menu, MenuProduct } from '#shared/types/menu'

export const MENU_KEY = 'menu'

export interface NavCategory {
  slug: string
  name: string
  shortName: string
  count: number
  image: string
}

// короткі назви для компактної навігації (шапка, пілюлі)
const SHORT_NAMES: Record<string, string> = {
  'premium-roli-ta-seti': 'Преміум',
}

/** Завантажує меню (викликається один раз в app.vue, дані потрапляють у SSR payload) */
export function fetchMenu() {
  return useFetch<Menu>('/api/menu', { key: MENU_KEY, dedupe: 'defer' })
}

export function useMenu() {
  const { data } = useNuxtData<Menu>(MENU_KEY)

  const products = computed<MenuProduct[]>(() => data.value?.products ?? [])
  const promoProducts = computed(() => products.value.filter(p => p.isPromo))
  const byId = computed(() => new Map(products.value.map(p => [p.id, p])))
  const bySlug = computed(() => new Map(products.value.map(p => [p.slug, p])))

  const categories = computed<NavCategory[]>(() => {
    const list: NavCategory[] = [
      { slug: ALL_CATEGORY_SLUG, name: 'Усе меню', shortName: 'Усе меню', count: products.value.length, image: '' },
    ]
    if (promoProducts.value.length) {
      list.push({
        slug: PROMO_CATEGORY_SLUG,
        name: 'Акції',
        shortName: 'Акції',
        count: promoProducts.value.length,
        image: promoProducts.value[0]?.image ?? '',
      })
    }
    for (const c of data.value?.categories ?? []) {
      list.push({ slug: c.slug, name: c.name, shortName: SHORT_NAMES[c.slug] ?? c.name, count: c.count, image: c.image })
    }
    return list
  })

  function category(slug: string) {
    return categories.value.find(c => c.slug === slug)
  }

  function productsIn(slug: string): MenuProduct[] {
    if (slug === ALL_CATEGORY_SLUG) return products.value
    if (slug === PROMO_CATEGORY_SLUG) return promoProducts.value
    return products.value.filter(p => p.categories.includes(slug))
  }

  return {
    menu: data,
    products,
    promoProducts,
    categories,
    filters: computed(() => data.value?.filters ?? []),
    heroes: computed(() => data.value?.heroes ?? []),
    deliveryCost: computed(() => data.value?.deliveryCost ?? 0),
    rawCategory: (slug: string) => data.value?.categories.find(c => c.slug === slug),
    category,
    productsIn,
    productById: (id: number) => byId.value.get(id),
    productBySlug: (slug: string) => bySlug.value.get(slug),
  }
}
