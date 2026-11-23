import type { Menu } from '#shared/types/menu'
import type { OrderLine } from '#shared/types/menu'
import type { PromoData, PromoQuote } from '#shared/types/promo'

const EMPTY: PromoData = { enabled: false, days: [] }

/** Акції дня з бекенду; кеш на хвилину — перемикач в адмінці діє протягом хвилини */
export const loadPromo = defineCachedFunction(
  (): Promise<PromoData> => $fetch<PromoData>(backendUrl('promo-days')).catch(() => EMPTY),
  { name: 'promo-days', maxAge: 60, staleMaxAge: 600, swr: true, getKey: () => 'all', shouldBypassCache: () => import.meta.dev },
)

/**
 * Ціни «Акції дня» в меню: у години акції товари дня дешевшають на всьому сайті —
 * у каталозі, кошику й при оформленні (order.post рахує суму з цього ж меню).
 * Рахується на кожен запит, щоб початок і кінець акції спрацьовували вчасно, а не з кешем меню.
 */
export function applyPromoDay(menu: Menu, promo: PromoData, now = kyivNow(promoClock(promo))): Menu {
  const day = currentPromoDay(promo, now)
  // з акцією Poster — лише товари, які Poster знижує поштучно (напр. «-15% на всі сети»)
  const discounted = day?.discountProductIds ?? day?.productIds ?? []
  if (!day || day.offerType !== 'percent' || !day.discountPercent || !discounted.length) return menu
  const ids = new Set(discounted)
  return {
    ...menu,
    products: menu.products.map(p => ids.has(p.id)
      ? { ...p, oldPrice: p.oldPrice ?? p.price, price: promoPrice(p.price, day), isPromo: true }
      : p),
  }
}

/** «Акція дня» для кошика за правилами Poster (бекенд /promo-quote); при збої — як без акції */
export function fetchPromoQuote(lines: OrderLine[], gift?: number | null): Promise<PromoQuote> {
  const clean = lines
    .map(l => ({ id: Math.floor(Number(l.id)), quantity: Math.min(99, Math.floor(Number(l.quantity))) }))
    .filter(l => l.id > 0 && l.quantity > 0)
  if (!clean.length) return Promise.resolve({ active: false })
  return $fetch<PromoQuote>(backendUrl('promo-quote'), { method: 'POST', body: { lines: clean, gift: gift ?? null } })
    .catch((): PromoQuote => ({ active: false }))
}
