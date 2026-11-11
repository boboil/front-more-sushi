<script setup lang="ts">
const route = useRoute()
const { productBySlug, menu } = useMenu()
const categories = computed(() => menu.value?.categories ?? [])
const { public: { siteUrl } } = useRuntimeConfig()
const goBack = useGoBack()

const product = computed(() => productBySlug(String(route.params.slug)))
if (!product.value) {
  throw createError({ statusCode: 404, statusMessage: 'Страву не знайдено', fatal: true })
}

useSeoMeta({
  title: () => product.value?.name,
  description: () => product.value?.description || product.value?.ingredients.join(', '),
  ogImage: () => product.value?.image,
  ogType: 'product' as never,
})

useHead(() => {
  const p = product.value
  if (!p) return {}
  const cat = categories.value.find(c => p.categories.includes(c.slug))
  return {
    script: [jsonLd(
      productSchema(p, siteUrl, cat?.name),
      breadcrumbSchema(siteUrl, [
        { name: 'Меню', path: '/menu' },
        ...(cat ? [{ name: cat.name, path: `/menu/${cat.slug}` }] : []),
        { name: p.name, path: `/product/${p.slug}` },
      ]),
    )],
  }
})
</script>

<template>
  <div v-if="product" class="product-page">
    <ProductDetails :product="product" @close="goBack" @added="goBack" />
  </div>
</template>

<style scoped lang="scss">
.product-page {
  @include desktop-up {
    display: flex;
    justify-content: center;
    padding: 40px $container-padding-x-desktop 60px;
  }
}
</style>
