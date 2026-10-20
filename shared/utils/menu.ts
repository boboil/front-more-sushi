import type { MenuFilter, MenuProduct, ProductTag } from '../types/menu'

export const PROMO_CATEGORY_SLUG = 'akcii'
export const ALL_CATEGORY_SLUG = 'all'

/** Безкоштовна доставка від цієї суми (логіка зі старого фронту) */
export const FREE_DELIVERY_FROM = 500

/** Запасний набір, поки бекенд не віддає /api/shop/tags */
export const DEFAULT_FILTERS: MenuFilter[] = [
  { id: 'spicy', label: 'Гостре' },
  { id: 'baked', label: 'Запечене' },
  { id: 'salmon', label: 'Лосось' },
  { id: 'tuna', label: 'Тунець' },
  { id: 'eel', label: 'Вугор' },
  { id: 'shrimp', label: 'Креветка' },
  { id: 'crab', label: 'Краб' },
]

export function parseFilters(value: unknown, allowed: MenuFilter[]): ProductTag[] {
  const raw = Array.isArray(value) ? value.join(',') : typeof value === 'string' ? value : ''
  const ids = new Set(allowed.map(f => f.id))
  return raw.split(',').filter(f => ids.has(f))
}

/** Слова, які показуються в мета-рядку картки поряд з вагою */
const TAG_WORDS: Record<ProductTag, string> = { spicy: 'гостре', baked: 'запечене' }

export function productMeta(p: MenuProduct): string {
  return [p.weight, ...p.tags.map(t => TAG_WORDS[t]).filter(Boolean)].filter(Boolean).join(' · ')
}

export function formatPrice(n: number): string {
  return `${Math.round(n).toLocaleString('uk-UA')} грн`
}

export function pluralDishes(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'страва'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'страви'
  return 'страв'
}

// ---- Промокоди та бонуси (демо, доки бекенд не має API) ----
// Вмикаються прапорцями runtimeConfig.public.features.*; та сама логіка застосовується
// на сервері при оформленні, тож сума на клієнті й у замовленні збігаються.

const DEMO_PROMO_CODES: Record<string, number> = { MORE10: 0.1 }
export const DEMO_BONUS_BALANCE = 85

export function normalizePromoCode(code: string | null | undefined): string {
  return (code ?? '').trim().toUpperCase()
}

export function isValidPromoCode(code: string | null | undefined): boolean {
  return normalizePromoCode(code) in DEMO_PROMO_CODES
}

export function promoDiscount(code: string | null | undefined, subtotal: number): number {
  const rate = DEMO_PROMO_CODES[normalizePromoCode(code)]
  return rate ? Math.round(subtotal * rate) : 0
}

export function deliveryFee(cost: number, subtotal: number): number {
  return cost > 0 && subtotal < FREE_DELIVERY_FROM ? cost : 0
}
