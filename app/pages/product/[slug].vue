<script setup lang="ts">
const route = useRoute()
const { productBySlug } = useMenu()
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

useHead(() => ({
  script: product.value
    ? [{
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          'name': product.value.name,
          'image': product.value.image,
          'description': product.value.description || product.value.ingredients.join(', '),
          'url': `${siteUrl}/product/${product.value.slug}`,
          'offers': {
            '@type': 'Offer',
            'price': product.value.price,
            'priceCurrency': 'UAH',
            'availability': 'https://schema.org/InStock',
          },
        }),
      }]
    : [],
}))
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
