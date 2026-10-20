export default defineEventHandler((event) => {
  const { public: { siteUrl, noindex } } = useRuntimeConfig(event)
  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  if (noindex) return 'User-agent: *\nDisallow: /\n'
  return `User-agent: *\nDisallow: /cart\nDisallow: /checkout\nDisallow: /order/\nDisallow: /api/\n\nHost: ${siteUrl}\nSitemap: ${siteUrl.replace(/\/$/, '')}/sitemap.xml\n`
})
