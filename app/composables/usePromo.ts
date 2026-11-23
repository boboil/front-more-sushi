import type { PromoData } from '#shared/types/promo'

/** Акції дня (/api/promo). Вимкнені в адмінці — enabled: false; з ключем перегляду — дні навіть вимкненими */
export function usePromo() {
  const preview = usePromoPreviewKey()
  return useFetch<PromoData>('/api/promo', {
    key: preview ? 'promo-preview' : 'promo',
    query: preview ? { preview } : undefined,
    dedupe: 'defer',
  })
}

/** Ключ перегляду з адмінки (?preview=…), інакше null */
export function usePromoPreviewKey(): string | null {
  const value = useRoute().query.preview
  return typeof value === 'string' && value ? value : null
}

/** Посилання на інший день; у режимі перегляду зберігає ключ */
export function usePromoLink() {
  const preview = usePromoPreviewKey()
  return (slug: string) => preview ? { path: `/promo/${slug}`, query: { preview } } : `/promo/${slug}`
}

/**
 * Київський час, що оновлюється щосекунди на клієнті (таймер, зміна стану акції).
 * clock — підмінений час бекенду для локального тестування (заморожений, не тікає).
 */
export function useKyivClock(clock?: () => string | undefined) {
  const read = () => kyivNow(clock?.() ? new Date(clock()!) : new Date())
  const now = ref(read())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    now.value = read()
    timer = setInterval(() => (now.value = read()), 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return now
}

export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds)
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':')
}

/**
 * Посилання «Акція дня» для меню сайту: на сторінку сьогоднішнього дня, якщо акції ввімкнені в адмінці
 * і сьогоднішній день активний; інакше null. Сам лендинг показує, чи акція вже/ще діє.
 */
export function usePromoNavLink() {
  const { data } = usePromo()
  return computed(() => {
    const promo = data.value
    if (!promo?.enabled) return null
    const today = kyivNow(promoClock(promo)).weekday
    const day = promo.days.find(d => d.weekday === today && d.isActive)
    return day ? { to: `/promo/${day.slug}`, label: 'Акція дня', offer: day.offerShort, key: day.key } : null
  })
}
