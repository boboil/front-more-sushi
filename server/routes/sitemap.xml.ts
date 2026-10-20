import type { Menu } from '#shared/types/menu'

// Карта сайту для пошукових систем: статичні сторінки, категорії меню і всі товари.
// Меню береться з кешованого /api/menu, тож бекенд зайвий раз не смикаємо.
export default defineEventHandler(async (event) => {
  const { public: { siteUrl, noindex } } = useRuntimeConfig(event)
  if (noindex) throw createError({ statusCode: 404 })

  const menu = await $fetch<Menu>('/api/menu')
  const base = siteUrl.replace(/\/$/, '')

  const paths = [
    '/',
    '/menu',
    ...(menu.products.some(p => p.isPromo) ? [`/menu/${PROMO_CATEGORY_SLUG}`] : []),
    ...menu.categories.map(c => `/menu/${c.slug}`),
    ...menu.products.map(p => `/product/${p.slug}`),
    '/delivery',
    '/contacts',
  ]

  const urls = [...new Set(paths)]
    .map(path => `  <url><loc>${escapeXml(base + path)}</loc></url>`)
    .join('\n')

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}
