<script setup lang="ts">
const route = useRoute()
// таб-бар і плаваючий кошик — тільки на Головній та в Меню (мобільний)
const withTabs = computed(() => route.path === '/' || route.path.startsWith('/menu'))
</script>

<template>
  <div class="layout" :class="{ 'layout--tabs': withTabs }">
    <AppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <MobileBottomBar v-if="withTabs" />
    <ProductModal />
  </div>
</template>

<style scoped lang="scss">
.layout {
  min-height: 100vh;

  &--tabs .layout__main {
    @include mobile {
      padding-bottom: calc(150px + env(safe-area-inset-bottom));
    }
  }
}
</style>
