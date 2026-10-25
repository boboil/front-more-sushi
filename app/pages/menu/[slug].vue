<script setup lang="ts">
const route = useRoute()
const { category, rawCategory } = useMenu()

const slug = computed(() => String(route.params.slug))
if (!category(slug.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Категорію не знайдено', fatal: true })
}

useSeoMeta({
  title: () => rawCategory(slug.value)?.metaTitle || category(slug.value)?.name,
  description: () => rawCategory(slug.value)?.metaDescription
    || `${category(slug.value)?.name} з доставкою у Сумах — Дари Моря.`,
})
</script>

<template>
  <MenuView :category="slug" />
</template>
