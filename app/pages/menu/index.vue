<script setup lang="ts">
useSeoMeta({
  title: 'Меню',
  description: 'Повне меню «Дари Моря»: роли, сети, піца, напої. Доставка у Сумах.',
})

const { menu } = useMenu()
const { public: { siteUrl } } = useRuntimeConfig()
useHead(() => ({ script: menu.value ? [jsonLd(menuSchema(menu.value, siteUrl))] : [] }))
</script>

<template>
  <MenuView category="all" />
</template>
