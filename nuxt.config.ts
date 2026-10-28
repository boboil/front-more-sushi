// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-08-01',
  ssr: true,
  devtools: { enabled: true },

  // імена компонентів = імена файлів (UiIcon, MenuView, AppHeader…)
  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/scss/main.scss'],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/variables" as *; @use "~/assets/scss/mixins" as *;',
        },
      },
    },
  },

  runtimeConfig: {
    // NUXT_GA_API_SECRET — секрет Measurement Protocol (GA → Адміністратор → Потоки даних → веб-потік);
    // з ним замовлення йдуть у GA4 із сервера. Без нього — лише з браузера
    gaApiSecret: '',
    public: {
      // NUXT_PUBLIC_API_URL
      apiUrl: 'https://bot.moresushi.in.ua',
      // NUXT_PUBLIC_SITE_URL
      siteUrl: 'https://moresushi.in.ua',
      // NUXT_PUBLIC_NOINDEX=true — закрити сайт від індексації (тестові/промо-домени)
      noindex: false,
      // Промокоди та бонуси поки не підтримуються бекендом — вмикати через env, коли з'явиться API
      // NUXT_PUBLIC_FEATURES_PROMO / NUXT_PUBLIC_FEATURES_BONUS
      features: {
        promo: false,
        bonus: false,
      },
      fbPixelId: '609569568020994',
      gtmId: 'GTM-T76VSG8S',
      gaId: 'G-39S6Y7MJQ3',
      tiktokPixelId: 'DA5D9CJC77UES973TFTG',
    },
  },

  routeRules: {
    // старі адреси з попереднього фронту
    '/catalog': { redirect: { to: '/menu', statusCode: 301 } },
    '/stock': { redirect: { to: '/menu/akcii', statusCode: 301 } },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'uk' },
      title: 'Дари Моря — доставка суші у Сумах',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'theme-color', content: '#ffffff' },
        { name: 'msapplication-TileColor', content: '#da532c' },
      ],
      link: [
        { rel: 'icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '144x144', href: '/apple-touch-icon.png' },
        { rel: 'manifest', href: '/site.webmanifest' },
        { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})
