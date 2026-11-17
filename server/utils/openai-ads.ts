import type { H3Event } from 'h3'

// Conversions API реклами в ChatGPT: https://developers.openai.com/ads/conversions-api
const CAPI_URL = 'https://bzr.openai.com/v1/events'
const TIMEOUT_MS = 2000

/** цифри з кодом країни без "+" (380XXXXXXXXX) → SHA-256 hex; так само хешує піксель у браузері */
async function phoneSha256(phone: string): Promise<string | null> {
  const digits = phone.replace(/\D/g, '').replace(/^0+/, '')
  if (digits.length < 8 || digits.length > 15) return null
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(digits))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Замовлення в ChatGPT Ads напряму з сервера: не губиться через блокувальники чи закриту вкладку.
 * id = event_id пікселя (`order_<id>`), тож OpenAI рахує браузерну й серверну подію як одне замовлення.
 * Клік з реклами впізнаємо за cookie пікселя: __oppref (ідентифікатор кліку) і __obref (браузер).
 */
export async function sendOpenAiOrder(event: H3Event, order: {
  id: string
  total: number
  phone?: string
  lines: { id: number, name: string, price: number, quantity: number }[]
}): Promise<void> {
  const { openaiCapiKey, public: { openaiPixelId, siteUrl } } = useRuntimeConfig(event)
  if (!openaiCapiKey || !openaiPixelId) return

  const minor = (n: number) => Math.round(n * 100)
  const phoneHash = order.phone ? await phoneSha256(order.phone) : null
  const oppref = getCookie(event, '__oppref')
  const obref = getCookie(event, '__obref')
  const ip = getRequestIP(event, { xForwardedFor: true })
  const ua = getRequestHeader(event, 'user-agent')

  try {
    await $fetch(CAPI_URL, {
      method: 'POST',
      query: { pid: openaiPixelId },
      headers: { Authorization: `Bearer ${openaiCapiKey}` },
      timeout: TIMEOUT_MS,
      body: {
        events: [{
          id: `order_${order.id}`,
          type: 'order_created',
          timestamp_ms: Date.now(),
          action_source: 'web',
          source_url: `${siteUrl.replace(/\/$/, '')}/checkout`,
          ...(oppref ? { oppref } : {}),
          user: {
            ...(obref ? { obref } : {}),
            ...(phoneHash ? { phone_numbers_sha256: [phoneHash] } : {}),
            countries: ['UA'],
            ...(ip ? { ip_address: ip } : {}),
            ...(ua ? { user_agent: ua } : {}),
          },
          data: {
            type: 'contents',
            amount: minor(order.total),
            currency: 'UAH',
            contents: order.lines.map(l => ({
              id: String(l.id),
              name: l.name,
              content_type: 'product',
              quantity: l.quantity,
              amount: minor(l.price),
              currency: 'UAH',
            })),
          },
        }],
      },
    })
  }
  catch (e) {
    const err = e as { message?: string, data?: unknown }
    console.error('[openai-ads] order not sent', order.id, err.message, JSON.stringify(err.data ?? '').slice(0, 300))
  }
}
