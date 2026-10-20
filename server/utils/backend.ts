import type { Menu, MenuCategory, MenuFilter, MenuHero, MenuProduct, ProductTag } from '#shared/types/menu'

// ---- сирі відповіді бекенду (more-sushi, /api/shop/*) ----

interface RawProduct {
  id: number
  title: string
  slug: string
  description: string | null
  consist: string | null
  price: number
  discount: number | null
  weight: number | null
  stock: boolean
  main_image: string | null
  /** slug-и тегів з адмінки; немає, поки бекенд не оновлено */
  tags?: string[]
  /** «Показувати в головному банері» з адмінки */
  featured?: boolean
  featured_sort?: number
}

interface RawCategory {
  id: number
  title: string
  slug: string
  image: string | null
  meta_title: string | null
  meta_description: string | null
  products: { data: Record<string, RawProduct> | RawProduct[] } | RawProduct[]
}

interface RawTag {
  slug: string
  title: string
}

interface RawHeroSlide {
  id: number
  image: string
  button_text: string | null
  button_link: string | null
}

export function backendUrl(path: string): string {
  const { public: { apiUrl } } = useRuntimeConfig()
  return `${apiUrl.replace(/\/$/, '')}/api/shop/${path}`
}

const MONTHS = ['січня', 'лютого', 'березня', 'квітня', 'травня', 'червня', 'липня', 'серпня', 'вересня', 'жовтня', 'листопада', 'грудня']

function decodeEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, ' ')
    .replace(/&bull;/g, '•')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&hellip;/g, '…')
    .replace(/&([lrb]dquo|[lr]aquo);/g, '"')
    .replace(/&[lr]squo;/g, '\'')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, '\'')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}

function htmlToLines(html: string | null): string[] {
  if (!html) return []
  const text = decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|h\d|li|div)>/gi, '\n')
      .replace(/<[^>]+>/g, ''),
  )
  return text.split(/\n/).map(l => l.replace(/\s+/g, ' ').trim()).filter(Boolean)
}

export function stripHtml(html: string | null): string {
  return htmlToLines(html).join(' ')
}

function cleanIngredient(s: string): string {
  if (s.trim().endsWith(':')) return '' // підзаголовки типу "Сет «Філа 1»:"
  const v = s
    .split(/\s[–—]\s/)[0]! // "Філадельфія з тунцем – легкий та освіжаючий рол" → назва
    .replace(/^[-–—•▪·\s]+/, '')
    .replace(/[;.,\s]+$/, '')
    .replace(/\s*-\s*/g, '-')
    .trim()
  if (!v) return ''
  // прибираємо емодзі
  return v.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]+/gu, '').trim().replace(/^./, c => c.toUpperCase())
}

const NOTE_RE = /^акці/i

function parseConsist(html: string | null): { ingredients: string[], note: string | null } {
  let note: string | null = null
  const lines: string[] = []
  let prevEndsWithDash = false
  for (const line of htmlToLines(html)) {
    // "Філадельфія з лососем –" + наступний рядок з описом → опис пропускаємо
    const skip = prevEndsWithDash
    prevEndsWithDash = /[–—-]$/.test(line)
    if (skip) continue
    if (NOTE_RE.test(line)) note ??= line
    else lines.push(line)
  }
  // "Лосось, авокадо, крем-сир" в один рядок → окремі пункти;
  // список сетів через ";" також ділимо
  const parts = lines.length === 1 ? lines[0]!.split(/[,;]/) : lines.flatMap(l => l.split(';'))
  return { ingredients: parts.map(cleanIngredient).filter(Boolean), note }
}

function noteFromDescription(html: string | null): string | null {
  const m = html?.match(/<strong>([^<]*акці[^<]*)<\/strong>/i)
  return m ? decodeEntities(m[1]!).trim() : null
}

function humanizeNote(note: string | null): string | null {
  if (!note) return null
  const v = note.replace(/\s+/g, ' ').replace(/ х\. /, ' з ').trim().toLowerCase()
  return v.charAt(0).toUpperCase() + v.slice(1)
}

/** "Акція діє з 24.09 до 31.10.2026" → "до 31 жовтня" (null, якщо акція вже минула) */
export function noteToBadge(note: string | null): string | null {
  const m = note?.match(/до\s+(\d{1,2})\.(\d{1,2})(?:\.(\d{4}))?/)
  if (!m) return null
  const end = new Date(Number(m[3] ?? new Date().getFullYear()), Number(m[2]) - 1, Number(m[1]), 23, 59)
  if (end.getTime() < Date.now()) return null
  const month = MONTHS[Number(m[2]) - 1]
  return month ? `до ${Number(m[1])} ${month}` : null
}

const TAG_RULES: [ProductTag, RegExp][] = [
  ['spicy', /спайс|спайсі|гостр|халапен|чилі|чили/i],
  ['baked', /запеч/i],
  ['salmon', /лосос|червоної риби/i],
  ['tuna', /тунц|тунец|тунець/i],
  ['eel', /вугр|вугор/i],
  ['shrimp', /кревет/i],
  ['crab', /краб/i],
]

// Запасний варіант для старого бекенду без тегів: вгадуємо по тексту
function detectTags(text: string): ProductTag[] {
  return TAG_RULES.filter(([, re]) => re.test(text)).map(([tag]) => tag)
}

const DRINK_CATEGORIES = new Set(['napoyi'])

function formatWeight(weight: number | null, categorySlugs: string[]): string {
  if (!weight) return ''
  return categorySlugs.some(s => DRINK_CATEGORIES.has(s)) ? `${weight} мл` : `${weight} г`
}

function cleanTitle(title: string): string {
  return title.replace(/\s*\d+\s*г\.?$/i, '').trim()
}

function absolute(url: string | null): string {
  if (!url) return ''
  if (/^https?:\/\//.test(url)) return url
  const { public: { apiUrl } } = useRuntimeConfig()
  return `${apiUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
}

function rawProducts(c: RawCategory): RawProduct[] {
  const p = Array.isArray(c.products) ? c.products : c.products?.data
  if (!p) return []
  return Array.isArray(p) ? p : Object.values(p)
}

function normalizeProduct(raw: RawProduct, categories: string[], isPromo: boolean, useBackendTags: boolean): MenuProduct {
  const { ingredients, note } = parseConsist(raw.consist)
  const fullNote = humanizeNote(note ?? noteFromDescription(raw.description))
  const oldPrice = raw.discount && raw.discount > raw.price ? raw.discount : null
  return {
    id: raw.id,
    slug: raw.slug,
    name: cleanTitle(raw.title),
    price: raw.price,
    oldPrice,
    weight: formatWeight(raw.weight, categories),
    image: absolute(raw.main_image),
    ingredients,
    note: fullNote,
    tags: useBackendTags ? (raw.tags ?? []) : detectTags(`${raw.title} ${ingredients.join(' ')}`),
    categories,
    isPromo,
    description: stripHtml(raw.description).slice(0, 300),
  }
}

export async function loadMenu(): Promise<Menu> {
  const [catalog, stock, slides, deliveryCost, tags] = await Promise.all([
    $fetch<{ data: RawCategory[] }>(backendUrl('catalog')),
    $fetch<RawCategory[]>(backendUrl('stock')).catch(() => [] as RawCategory[]),
    $fetch<{ data: RawHeroSlide[] }>(backendUrl('hero-slides')).catch(() => ({ data: [] })),
    $fetch<number>(backendUrl('delivery-cost')).catch(() => 0),
    $fetch<{ data: RawTag[] }>(backendUrl('tags')).then(r => r.data).catch(() => null),
  ])
  const useBackendTags = Array.isArray(tags)

  const promoIds = new Set(stock.flatMap(rawProducts).map(p => p.id))
  const byId = new Map<number, { raw: RawProduct, categories: string[] }>()
  const categories: MenuCategory[] = []

  for (const c of catalog.data) {
    const items = rawProducts(c)
    for (const raw of items) {
      const entry = byId.get(raw.id)
      if (entry) entry.categories.push(c.slug)
      else byId.set(raw.id, { raw, categories: [c.slug] })
    }
    if (!items.length) continue
    categories.push({
      id: c.id,
      slug: c.slug,
      name: c.title,
      image: absolute(c.image),
      count: items.length,
      metaTitle: c.meta_title,
      metaDescription: c.meta_description,
    })
  }

  const products = [...byId.values()].map(({ raw, categories: cats }) =>
    normalizeProduct(raw, cats, promoIds.has(raw.id) || raw.stock, useBackendTags),
  )

  const allFilters: MenuFilter[] = useBackendTags ? tags!.map(t => ({ id: t.slug, label: t.title })) : DEFAULT_FILTERS
  const usedTags = new Set(products.flatMap(p => p.tags))

  return {
    categories,
    filters: allFilters.filter(f => usedTags.has(f.id)),
    products,
    heroes: buildHeroes(products, [...byId.values()].map(e => e.raw), slides.data ?? []),
    deliveryCost: Number(deliveryCost) || 0,
  }
}

function buildHeroes(products: MenuProduct[], raw: RawProduct[], slides: RawHeroSlide[]): MenuHero[] {
  const bySlug = new Map(products.map(p => [p.slug, p]))

  // 1. товари з позначкою «Показувати в головному банері», у заданому в адмінці порядку
  const featured = raw
    .filter(r => r.featured)
    .sort((a, b) => (a.featured_sort ?? 0) - (b.featured_sort ?? 0))
    .map(r => bySlug.get(r.slug))
    .filter((p): p is MenuProduct => !!p)
    .map(productHero)

  // 2. банери-картинки з розділу «Слайди» адмінки
  const banners = slides.map(slide => ({
    title: slide.button_text ?? '',
    subtitle: '',
    price: null,
    image: absolute(slide.image),
    badge: null,
    productSlug: null,
    link: slide.button_link,
  }))

  if (featured.length || banners.length) return [...featured, ...banners]

  // нічого не обрано — акційна пропозиція без старої ціни (типу "Піца 2+1"), або перша акція
  const promo = products.filter(p => p.isPromo)
  const p = promo.find(x => !x.oldPrice && noteToBadge(x.note))
    ?? promo.find(x => noteToBadge(x.note))
    ?? promo.find(x => !x.oldPrice)
    ?? promo[0]
  return p ? [productHero(p)] : []
}

function productHero(p: MenuProduct): MenuHero {
  return {
    title: p.name,
    subtitle: p.ingredients.join(', '),
    price: p.price,
    image: p.image,
    badge: noteToBadge(p.note),
    productSlug: p.slug,
    link: null,
  }
}
