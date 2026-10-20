// Заголовок для всіх відповідей (у т.ч. картинок і JSON), якщо сайт закрито від індексації
export default defineEventHandler((event) => {
  if (useRuntimeConfig(event).public.noindex) {
    setHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
  }
})
