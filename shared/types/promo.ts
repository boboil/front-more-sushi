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
}

export interface PromoData {
  /** перемикач в адмінці; вимкнено — сторінки 404, знижки не діють */
  enabled: boolean
  /** відкрито з адмінки за ключем перегляду (?preview=…) */
  preview?: boolean
  days: PromoDay[]
}
