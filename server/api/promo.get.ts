// Акції дня для лендингів /promo/<день>; вимкнені в адмінці — { enabled: false }.
// ?preview=<ключ> — перегляд з адмінки: йде на бекенд без кешу, бекенд сам перевіряє ключ.
export default defineEventHandler((event) => {
  const preview = getQuery(event).preview
  if (typeof preview === 'string' && preview) {
    return $fetch<PromoData>(backendUrl('promo-days'), { query: { preview } })
      .catch((): PromoData => ({ enabled: false, days: [] }))
  }
  return loadPromo()
})
