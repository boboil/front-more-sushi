// Нормалізоване меню для SSR. Сам каталог кешується на рівні Nitro, щоб не смикати бекенд на кожен запит;
// ціни «Акції дня» накладаються поверх на кожен запит (server/utils/promo.ts).
const cachedMenu = defineCachedFunction(() => loadMenu(), {
  name: 'menu',
  maxAge: 60,
  staleMaxAge: 600,
  swr: true,
  getKey: () => 'menu',
  shouldBypassCache: () => import.meta.dev,
})

export default defineEventHandler(async () => applyPromoDay(await cachedMenu(), await loadPromo()))
