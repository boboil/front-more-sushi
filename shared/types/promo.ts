// «Акція дня» — лендинги /promo/<день> (дані з адмінки: Магазин → Акції дня)

export type PromoDayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'

export type PromoOfferType = 'percent' | 'gift'

export interface PromoDay {
  /** 1 = понеділок … 7 = неділя */
  weekday: number
  key: PromoDayKey
  slug: string
  label: string
  short: string
  isActive: boolean
  offerType: PromoOfferType
  /** null для подарунка */
  discountPercent: number | null
  offerTitle: string
  offerShort: string
  giftBadge: string | null
  activeFrom: string
  activeTo: string
  terms: string | null
  heroImage: string | null
  productIds: number[]
  /** акція в Poster, за правилами якої рахується кошик (немає — механіку застосовує оператор) */
  posterPromotionId?: number | null
  /** товари, ціна яких у меню знижена акцією Poster; [] — знижка лише в кошику; null — акція без Poster (ціни за productIds) */
  discountProductIds?: number[] | null
  /** умови й подарунки з акції Poster (null — акція без Poster або не діє в Poster) */
  rules?: PromoRules | null
}

export interface PromoRules {
  /** умови словами: «Замовлення від 700 грн — подарунок на вибір: …» */
  text: string
  /** подарунки, які додасть заклад (кілька — на вибір) */
  gifts: PromoGift[]
  /** що купити для акції; [] — умова на суму, підходить усе меню */
  productIds: number[]
}

export interface PromoGift {
  /** товар Poster */
  posterId: number
  /** картка на сайті, якщо є */
  productId: number | null
  name: string
  price: number
  /** товари сайту, якими показати подарунок (набір «Дві піци» — дві позиції) */
  items?: { productId: number, name: string, price: number, image?: string | null }[]
}

/** Що дасть «Акція дня» кошику (рахує бекенд за правилами акції Poster) */
export interface PromoQuote {
  /** зараз діє акція дня, прив'язана до Poster */
  active: boolean
  weekday?: number
  posterPromotionId?: number
  /** умови виконано */
  applied?: boolean
  /** уся знижка акції, грн */
  discount?: number
  /** частина знижки, якої ще немає в цінах меню (безкоштовні позиції з кошика) */
  extraDiscount?: number
  /** подарунки, які додасть заклад (у кошик їх не кладемо) */
  gifts?: (PromoGift & { count: number })[]
  /** з чого обрати подарунок, якщо варіантів кілька */
  giftOptions?: PromoGift[]
  selectedGift?: number | null
  /** позиції кошика, що стають безкоштовними */
  freeItems?: { productId: number, count: number }[]
  /** що додати, щоб отримати акцію */
  hint?: string | null
}

export interface PromoData {
  /** перемикач в адмінці; вимкнено — сторінки 404, знижки не діють */
  enabled: boolean
  /** відкрито з адмінки за ключем перегляду (?preview=…) */
  preview?: boolean
  /** лише локально: підмінений час бекенду (php artisan promo:dev --clock=…), ISO */
  clock?: string
  days: PromoDay[]
}
