<script setup lang="ts">
const route = useRoute()
const { categories } = useMenu()
const cart = useCart()

const nav = computed(() => categories.value.filter(c => c.slug !== ALL_CATEGORY_SLUG))
const activeSlug = computed(() => (route.name === 'menu-slug' ? String(route.params.slug) : null))
const label = computed(() => cart.count.value ? `${cart.count.value} · ${formatPrice(cart.total.value)}` : 'Кошик')
</script>

<template>
  <header class="header only-desktop">
    <UiLogo />
    <nav class="header__nav" aria-label="Категорії">
      <NuxtLink
        v-for="c in nav"
        :key="c.slug"
        :to="categoryPath(c.slug)"
        class="header__link"
        :class="{ 'header__link--on': c.slug === activeSlug }"
      >
        {{ c.shortName }}
      </NuxtLink>
    </nav>
    <NuxtLink :to="cart.count.value ? '/checkout' : '/cart'" class="btn btn--primary header__cart">
      <UiIcon name="bag" :size="20" :stroke="1.8" />
      {{ label }}
    </NuxtLink>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 32px;
  height: $header-height;
  padding: 0 $container-padding-x-desktop;
  background: #fff;
  box-shadow: $shadow-header;

  @include tablet {
    gap: 16px;
    padding: 0 $container-padding-x-tablet;
  }

  &__nav {
    @include hide-scrollbar;
    flex: 1;
    min-width: 0;
    display: flex;
    gap: 4px;
    justify-content: center;
    overflow-x: auto;

    @include tablet {
      justify-content: flex-start;
    }
  }

  &__link {
    display: inline-flex;
    align-items: center;
    flex: none;
    height: 40px;
    padding: 0 14px;
    border-radius: 10px;
    color: $black;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
    transition: background $duration, color $duration;

    &:hover {
      color: $black;
      background: $stepper-bg;
    }

    &--on,
    &--on:hover {
      background: $orange-tint;
      color: $orange-dark;
    }
  }

  &__cart {
    flex: none;
    height: 48px;
    gap: 10px;
    border-radius: $radius-btn-lg;
    font-size: 15px;
    box-shadow: $shadow-cta-header;
  }
}
</style>
