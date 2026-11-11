// Запам'ятовує, звідки прийшов відвідувач, щоб в адмінці бачити джерело замовлення.
// Виграє останній непрямий візит (UTM-мітки, click-id реклами або зовнішній реферер), живе 30 днів;
// прямий захід старий запис не перезаписує. Зберігається лише в цьому браузері, іде із замовленням як `attribution`.
import type { OrderAttribution } from '#shared/types/menu'

const STORAGE_KEY = 'ms_attribution'
const TTL_MS = 30 * 24 * 60 * 60 * 1000
const UTM_KEYS = ['source', 'medium', 'campaign', 'content', 'term'] as const
const CLICK_IDS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid']
const OWN_HOSTS = /(^|\.)moresushi\.[a-z.]+$/i

function readAttribution(): OrderAttribution | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const value = JSON.parse(raw) as OrderAttribution
    if (!value.touched_at || Date.now() - Date.parse(value.touched_at) > TTL_MS) return null
    return value
  }
  catch {
    return null
  }
}

function externalReferrerHost(): string | undefined {
  try {
    if (!document.referrer) return undefined
    const host = new URL(document.referrer).hostname.toLowerCase()
    return host && !OWN_HOSTS.test(host) ? host : undefined
  }
  catch {
    return undefined
  }
}

/** Викликати один раз на завантаження сторінки. */
export function captureAttribution(): void {
  try {
    const url = new URL(window.location.href)
    const params = url.searchParams
    const touch: OrderAttribution = {}
    for (const key of UTM_KEYS) {
      const value = params.get(`utm_${key}`)?.trim()
      if (value) touch[key] = value.slice(0, 200)
    }
    const clickId = CLICK_IDS.find(key => params.has(key))
    if (clickId) touch.click_id_type = clickId
    const referrer = externalReferrerHost()
    if (referrer) touch.referrer = referrer

    // прямий захід: залишаємо попередній візит з мітками; новий запис — лише якщо його ще немає
    if (!touch.source && !touch.click_id_type && !touch.referrer && readAttribution()) return

    // тільки шлях: у query можуть бути персональні дані
    touch.landing_page = url.pathname.slice(0, 200)
    touch.touched_at = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(touch))
  }
  catch {
    // сховище заблоковане (приватний режим тощо) — замовлення просто без мітки
  }
}

export function getAttribution(): OrderAttribution | undefined {
  return readAttribution() ?? undefined
}
