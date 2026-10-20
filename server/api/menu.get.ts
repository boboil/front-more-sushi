// Нормалізоване меню для SSR. Кешується на рівні Nitro, щоб не смикати бекенд на кожен запит.
export default defineCachedEventHandler(() => loadMenu(), {
  name: 'menu',
  maxAge: 60,
  staleMaxAge: 600,
  swr: true,
  shouldBypassCache: () => import.meta.dev,
})
