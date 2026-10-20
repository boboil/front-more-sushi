import type { ProductTag } from '#shared/types/menu'

/** Фільтри зберігаються в query (?f=spicy,salmon), тож їх видно в SSR і можна поділитися посиланням */
export function useMenuFilters() {
  const route = useRoute()
  const router = useRouter()
  const { filters } = useMenu()
  const track = useTrack()

  const active = computed(() => parseFilters(route.query.f, filters.value))

  function set(list: ProductTag[]) {
    const query = { ...route.query }
    if (list.length) query.f = list.join(',')
    else delete query.f
    router.replace({ query })
  }

  return {
    list: filters,
    active,
    has: computed(() => active.value.length > 0),
    isOn: (id: ProductTag) => active.value.includes(id),
    toggle: (id: ProductTag) => {
      const on = !active.value.includes(id)
      if (on) track('filter_use', { params: { filter: id, filter_name: filters.value.find(f => f.id === id)?.label, category: route.params.slug ?? 'all' } })
      set(on ? [...active.value, id] : active.value.filter(x => x !== id))
    },
    clear: () => set([]),
  }
}

export function categoryPath(slug: string): string {
  return slug === ALL_CATEGORY_SLUG ? '/menu' : `/menu/${slug}`
}
