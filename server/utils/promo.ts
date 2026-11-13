import type { Menu } from '#shared/types/menu'
import type { PromoData } from '#shared/types/promo'

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
export function applyPromoDay(menu: Menu, promo: PromoData, now = kyivNow()): Menu {
  const day = currentPromoDay(promo, now)
  if (!day || day.offerType !== 'percent' || !day.discountPercent || !day.productIds.length) return menu
  const ids = new Set(day.productIds)
  return {
    ...menu,
    products: menu.products.map(p => ids.has(p.id)
      ? { ...p, oldPrice: p.oldPrice ?? p.price, price: promoPrice(p.price, day), isPromo: true }
      : p),
  }
}
