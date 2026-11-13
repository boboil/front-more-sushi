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

/** Київський час, що оновлюється щосекунди на клієнті (таймер, зміна стану акції) */
export function useKyivClock() {
  const now = ref(kyivNow())
  let timer: ReturnType<typeof setInterval> | undefined
  onMounted(() => {
    now.value = kyivNow()
    timer = setInterval(() => (now.value = kyivNow()), 1000)
  })
  onBeforeUnmount(() => clearInterval(timer))
  return now
}

export function formatCountdown(seconds: number): string {
  const s = Math.max(0, seconds)
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map(n => String(n).padStart(2, '0')).join(':')
}
