<script setup lang="ts">
const route = useRoute()
const { category, rawCategory, menu } = useMenu()
const { public: { siteUrl } } = useRuntimeConfig()

const slug = computed(() => String(route.params.slug))
if (!category(slug.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Категорію не знайдено', fatal: true })
}

useSeoMeta({
  title: () => rawCategory(slug.value)?.metaTitle || category(slug.value)?.name,
  description: () => rawCategory(slug.value)?.metaDescription
    || `${category(slug.value)?.name} з доставкою у Сумах — Дари Моря.`,
})

// для «Акцій» окремого розділу в бекенді немає — там лише крихти
useHead(() => {
  const name = category(slug.value)?.name ?? ''
  const crumbs = breadcrumbSchema(siteUrl, [{ name: 'Меню', path: '/menu' }, { name, path: `/menu/${slug.value}` }])
  return { script: [rawCategory(slug.value) && menu.value ? jsonLd(menuSchema(menu.value, siteUrl, slug.value), crumbs) : jsonLd(crumbs)] }
})
</script>

<template>
  <MenuView :category="slug" />
</template>
