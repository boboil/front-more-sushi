/** slug тегу з адмінки (Магазин → Фільтри), напр. "spicy" */
export type ProductTag = string

export interface MenuFilter {
  id: ProductTag
  label: string
}

export interface MenuProduct {
  id: number
  slug: string
  /** назва без ваги в кінці ("Сет Найкращий 1250 г" → "Сет Найкращий") */
  name: string
  price: number
  /** стара ціна, якщо є знижка (поле `discount` у бекенді) */
  oldPrice: number | null
  /** "1250 г", "330 мл" */
  weight: string
  image: string
  ingredients: string[]
  /** промо-примітка, напр. "Акція діє з 24.09 до 31.10.2026" */
  note: string | null
  tags: ProductTag[]
  categories: string[]
  isPromo: boolean
  /** опис без HTML — для SEO */
  description: string
}

export interface MenuCategory {
  id: number
  slug: string
  name: string
  image: string
  count: number
  metaTitle: string | null
  metaDescription: string | null
}

export interface MenuHero {
  title: string
  subtitle: string
  price: number | null
  image: string
  badge: string | null
  /** slug товару або зовнішнє/внутрішнє посилання */
  productSlug: string | null
  link: string | null
}

export interface Menu {
  categories: MenuCategory[]
  /** фільтри, до яких прив'язаний хоча б один товар */
  filters: MenuFilter[]
  products: MenuProduct[]
  /** слайди головного банера на першому екрані */
  heroes: MenuHero[]
  deliveryCost: number
}

export interface OrderLine {
  id: number
  quantity: number
}

export interface OrderRequest {
  mode: 'delivery' | 'pickup'
  name: string
  phone: string
  address: string
  entrance: string
  when: 'asap' | 'time'
  /** Y-m-d, для доставки на час */
  date: string
  /** H:i */
  time: string
  /** як у старому фронті: готівка або термінал кур'єра (онлайн-оплати немає) */
  payment: 'cash' | 'terminal'
  sticks: { standard: number, educational: number }
  promoCode?: string
  useBonus?: boolean
  lines: OrderLine[]
}

export interface OrderResponse {
  id: number | null
  total: number
  /** purchase уже відправлено в GA4 із сервера */
  gaSent?: boolean
}
