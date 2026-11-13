import type { PromoData } from '#shared/types/promo'

/** Акції дня (/api/promo). Вимкнені в адмінці — enabled: false */
export function usePromo() {
  return useFetch<PromoData>('/api/promo', { key: 'promo', dedupe: 'defer' })
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
