/* eslint-disable */
import type { TrackLine } from '#shared/utils/analytics'

// Пікселі зі старого фронту: Facebook, TikTok, Google Tag Manager, Google Analytics 4; плюс піксель реклами в ChatGPT
// Подію називаємо як у GA4, а Facebook і TikTok отримують свої стандартні відповідники (де вони є)
const PIXEL_EVENTS = {
  view_item_list: null,
  view_item: 'ViewContent',
  add_to_cart: 'AddToCart',
  remove_from_cart: null,
  view_cart: null,
  begin_checkout: 'InitiateCheckout',
  add_shipping_info: null,
  add_payment_info: 'AddPaymentInfo',
  purchase: 'Purchase',
  phone_click: 'Contact',
  filter_use: null,
} as const

// стандартні події пікселя ChatGPT Ads; конверсія в кабінеті прив'язана до order_created
const OPENAI_EVENTS: Partial<Record<keyof typeof PIXEL_EVENTS, string>> = {
  view_item: 'contents_viewed',
  add_to_cart: 'items_added',
  begin_checkout: 'checkout_started',
  purchase: 'order_created',
}

export type TrackEvent = keyof typeof PIXEL_EVENTS

export interface TrackData {
  lines?: TrackLine[]
  /** за замовчуванням — сума рядків */
  value?: number
  /** додаткові параметри GA4 (transaction_id, payment_type, ...) */
  params?: Record<string, unknown>
  /** purchase уже відправив у GA сервер (Measurement Protocol) — у GA з браузера не дублюємо */
  skipGa?: boolean
}

// у списку категорії (особливо "Усе меню") товарів більше сотні — GA вистачить перших
const MAX_LIST_ITEMS = 30

export default defineNuxtPlugin(() => {
  const { public: { fbPixelId, tiktokPixelId, gtmId, gaId, openaiPixelId } } = useRuntimeConfig()
  const w = window as any

  if (fbPixelId) {
    ;(function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
      if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
      if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []
      t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
    })(w, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
    w.fbq('init', fbPixelId)
  }

  if (tiktokPixelId) {
    ;(function (w: any, d: Document, t: string) {
      w.TiktokAnalyticsObject = t; const ttq = w[t] = w[t] || []
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie', 'holdConsent', 'revokeConsent', 'grantConsent']
      ttq.setAndDefer = function (t: any, e: string) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }
      for (let i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i])
      ttq.load = function (e: string) {
        const r = 'https://analytics.tiktok.com/i18n/pixel/events.js'
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date
        const n = d.createElement('script'); n.type = 'text/javascript'; n.async = !0; n.src = `${r}?sdkid=${e}&lib=${t}`
        const s = d.getElementsByTagName('script')[0]!; s.parentNode!.insertBefore(n, s)
      }
      ttq.load(tiktokPixelId)
    })(w, document, 'ttq')
  }

  if (openaiPixelId) {
    ;(function (w: any, d: Document, s: string, u: string) {
      if (w.oaiq) return
      const q: any = function () { q.q.push(arguments) }
      q.q = []; w.oaiq = q
      const js = d.createElement(s) as HTMLScriptElement; js.async = true; js.src = u
      const f = d.getElementsByTagName(s)[0]!; f.parentNode!.insertBefore(js, f)
    })(w, document, 'script', 'https://bzrcdn.openai.com/sdk/oaiq.min.js')
    w.oaiq('init', { pixelId: openaiPixelId })
  }

  if (gtmId) {
    w.dataLayer = w.dataLayer || []
    w.dataLayer.push({ 'gtm.start': Date.now(), 'event': 'gtm.js' })
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`
    document.head.appendChild(s)
  }

  if (gaId) {
    w.dataLayer = w.dataLayer || []
    w.gtag = function () { w.dataLayer.push(arguments) }
    w.gtag('js', new Date())
    // перегляди сторінок при переходах SPA GA4 рахує сам (enhanced measurement, history changes)
    w.gtag('config', gaId)
    const s = document.createElement('script'); s.async = true; s.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    document.head.appendChild(s)
  }

  // дзвінок за номером — важливий лід для доставки, ловимо всі посилання tel: на сайті
  document.addEventListener('click', (e) => {
    const link = (e.target as Element | null)?.closest?.('a[href^="tel:"]')
    if (link) track('phone_click', { params: { phone: link.getAttribute('href')!.slice(4), page_path: location.pathname } })
  }, { capture: true })

  const { rawCategory } = useMenu()
  const categoryName = (slug: string) => rawCategory(slug)?.name

  function track(event: TrackEvent, data: TrackData = {}) {
    const lines = data.lines ?? []
    const ecommerce = lines.length || data.value !== undefined
    const value = data.value ?? linesValue(lines)

    if (gaId && !data.skipGa) {
      const isList = event === 'view_item_list'
      const items = gaItems(isList ? lines.slice(0, MAX_LIST_ITEMS) : lines, categoryName)
      w.gtag?.('event', event, {
        // сума всього списку категорії нічого не означає — для списку лише товари
        ...(isList ? { items } : ecommerce ? { currency: 'UAH', value, items } : {}),
        ...data.params,
      })
    }

    const oai = OPENAI_EVENTS[event]
    if (oai && openaiPixelId) {
      // суми — цілі числа в копійках
      const minor = (n: number) => Math.round(n * 100)
      const orderId = event === 'purchase' ? data.params?.transaction_id : undefined
      w.oaiq?.('measure', oai, {
        type: 'contents',
        ...(ecommerce ? { amount: minor(value), currency: 'UAH' } : {}),
        contents: lines.map(l => ({
          id: String(l.product.id),
          name: l.product.name,
          content_type: 'product',
          quantity: l.qty,
          amount: minor(l.product.price),
          currency: 'UAH',
        })),
      }, ...(orderId ? [{ event_id: `order_${orderId}` }] : []))
    }

    const pixel = PIXEL_EVENTS[event]
    if (!pixel) return
    const ids = lines.map(l => String(l.product.id))
    w.fbq?.('track', pixel, ecommerce ? { currency: 'UAH', value, content_ids: ids, content_type: 'product' } : {})
    w.ttq?.track?.(pixel === 'Purchase' ? 'CompletePayment' : pixel, ecommerce
      ? {
          currency: 'UAH',
          value,
          content_type: 'product',
          contents: lines.map(l => ({ content_id: String(l.product.id), content_name: l.product.name, price: l.product.price, quantity: l.qty })),
        }
      : {})
  }

  const router = useRouter()
  const pageView = () => { w.fbq?.('track', 'PageView'); w.ttq?.page?.(); w.oaiq?.('measure', 'page_viewed', { type: 'contents' }) }
  pageView()
  router.afterEach((to, from) => { if (to.path !== from.path) pageView() })

  return {
    provide: {
      track,
    },
  }
})
