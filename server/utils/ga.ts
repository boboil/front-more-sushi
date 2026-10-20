import type { H3Event } from 'h3'
import type { GaItem } from '#shared/utils/analytics'

const MP_URL = 'https://www.google-analytics.com/mp/collect'
const TIMEOUT_MS = 2000

/** "_ga" = "GA1.1.123456789.1729500000" → "123456789.1729500000" */
function clientId(event: H3Event): string | null {
  const parts = getCookie(event, '_ga')?.split('.')
  return parts && parts.length >= 4 ? parts.slice(-2).join('.') : null
}

/** "_ga_<ID>" = "GS1.1.1729500000.3.1…" (старий формат) або "GS2.1.s1729500000$o3$g1…" (новий) */
function sessionId(event: H3Event, measurementId: string): string | null {
  const raw = getCookie(event, `_ga_${measurementId.replace(/^G-/, '')}`)
  if (!raw) return null
  if (raw.startsWith('GS2.')) return raw.split('.')[2]?.split('$').find(p => p.startsWith('s'))?.slice(1) ?? null
  return raw.split('.')[2] ?? null
}

/**
 * Замовлення в GA4 напряму з сервера (Measurement Protocol): не губиться через блокувальники
 * реклами чи закриту вкладку. client_id і session_id беремо з cookie GA, тож покупка
 * прив'язується до того ж відвідувача і джерела трафіку, що й перегляди в браузері.
 * Повертає true, якщо GA прийняв подію — тоді браузер purchase у GA вже не дублює.
 */
export async function sendGaPurchase(event: H3Event, order: {
  transactionId: string
  value: number
  items: GaItem[]
  params?: Record<string, unknown>
}): Promise<boolean> {
  const { gaApiSecret, public: { gaId } } = useRuntimeConfig(event)
  if (!gaApiSecret || !gaId) return false

  const cid = clientId(event)
  const sid = sessionId(event, gaId)
  try {
    await $fetch(MP_URL, {
      method: 'POST',
      query: { measurement_id: gaId, api_secret: gaApiSecret },
      timeout: TIMEOUT_MS,
      body: {
        // без cookie (браузер блокує GA) — окремий відвідувач, але покупка й виручка все одно врахуються
        client_id: cid ?? `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`,
        events: [{
          name: 'purchase',
          params: {
            transaction_id: order.transactionId,
            currency: 'UAH',
            value: order.value,
            items: order.items,
            ...(sid ? { session_id: sid, engagement_time_msec: 1 } : {}),
            ...order.params,
          },
        }],
      },
    })
    return true
  }
  catch (e) {
    console.error('[ga] purchase not sent', order.transactionId, (e as Error).message)
    return false
  }
}
