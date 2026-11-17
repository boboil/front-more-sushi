import type { Menu } from '#shared/types/menu'

// Товарний фід для реклами в ChatGPT (ads.openai.com → Товарні фіди → URL розміщеного фіду).
// Формат: https://developers.openai.com/commerce/specs/file-upload/products
// Ціни — звичайні, без «Акції дня»: фід забирають рідко, і денна знижка в рекламі швидко застаріла б.
const BRAND = 'Дари Моря'

const COLUMNS = [
  'item_id', 'title', 'description', 'url', 'brand', 'seller_name', 'seller_url', 'image_url',
  'availability', 'price', 'sale_price', 'product_category', 'condition',
  'target_countries', 'store_country', 'is_ads_eligible',
] as const

const menuCache = defineCachedFunction(() => loadMenu(), {
  name: 'feed-menu',
  maxAge: 600,
  getKey: () => 'feed-menu',
})

export default defineEventHandler(async (event) => {
  const { public: { siteUrl } } = useRuntimeConfig(event)
  const base = siteUrl.replace(/\/$/, '')
  const menu: Menu = await menuCache()
  const categoryName = new Map(menu.categories.map(c => [c.slug, c.name]))
  const money = (n: number) => `${n.toFixed(2)} UAH`

  const rows = menu.products
    .filter(p => p.price > 0 && p.image)
    .map((p) => {
      const sale = p.oldPrice && p.oldPrice > p.price
      const category = p.categories.map(s => categoryName.get(s)).find(Boolean)
      const description = [
        `${p.name}${p.weight ? `, ${p.weight}` : ''}.`,
        p.ingredients.length ? `Склад: ${p.ingredients.join(', ')}.` : '',
        'Доставка по Сумах і самовивіз.',
      ].filter(Boolean).join(' ')

      const row: Record<typeof COLUMNS[number], string> = {
        item_id: String(p.id),
        title: p.weight ? `${p.name} ${p.weight}` : p.name,
        description,
        url: `${base}/product/${p.slug}`,
        brand: BRAND,
        seller_name: BRAND,
        seller_url: base,
        image_url: p.image,
        availability: 'in_stock',
        price: money(sale ? p.oldPrice! : p.price),
        sale_price: sale ? money(p.price) : '',
        product_category: category ? `Їжа > ${category}` : 'Їжа',
        condition: 'new',
        target_countries: '["UA"]',
        store_country: 'UA',
        is_ads_eligible: 'true',
      }
      return COLUMNS.map(c => csvCell(row[c])).join(',')
    })

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=600')
  return `${COLUMNS.join(',')}\n${rows.join('\n')}\n`
})

function csvCell(v: string): string {
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
}
