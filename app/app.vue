<script setup lang="ts">
// Меню вантажимо один раз на рівні застосунку — воно потрібне шапці, кошику й усім сторінкам
const { error } = await fetchMenu()
if (error.value) {
  throw createError({ statusCode: 503, statusMessage: 'Меню тимчасово недоступне', fatal: true })
}

const { public: { siteUrl, noindex } } = useRuntimeConfig()
const route = useRoute()

useSeoMeta({
  ogSiteName: 'Море Суші',
  ogType: 'website',
  ogLocale: 'uk_UA',
  ogImage: `${siteUrl}/img/logo-big.png`,
})
if (noindex) useSeoMeta({ robots: 'noindex, nofollow' })

useHead(() => ({
  titleTemplate: t => (t && t !== 'Море Суші' ? `${t} — Море Суші` : 'Море Суші — доставка суші у Сумах'),
  link: [{ rel: 'canonical', href: `${siteUrl}${route.path}` }],
}))
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
