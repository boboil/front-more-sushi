<script setup lang="ts">
// Плаваюча панель кошика + таб-бар (лише мобільний, на Головній та в Меню)
const route = useRoute()
const cart = useCart()

const isHome = computed(() => route.path === '/')
const isMenu = computed(() => route.path.startsWith('/menu'))
</script>

<template>
  <div class="bottom only-mobile">
    <div v-if="!cart.isEmpty.value" class="bottom__cartbar">
      <NuxtLink to="/cart" class="cartbar">
        <span class="cartbar__left"><span class="cartbar__count">{{ cart.count.value }}</span>Кошик</span>
        <span>{{ formatPrice(cart.total.value) }}</span>
      </NuxtLink>
    </div>
    <nav class="tabs" aria-label="Навігація">
      <NuxtLink to="/" class="tabs__item" :class="{ 'tabs__item--on': isHome }">
        <UiIcon name="home" :size="22" :stroke="1.7" /><span>Головна</span>
      </NuxtLink>
      <NuxtLink to="/menu" class="tabs__item" :class="{ 'tabs__item--on': isMenu }">
        <UiIcon name="grid" :size="22" :stroke="1.7" /><span>Меню</span>
      </NuxtLink>
      <NuxtLink to="/cart" class="tabs__item">
        <UiIcon name="bag" :size="22" :stroke="1.7" /><span>{{ cart.count.value ? `Кошик · ${cart.count.value}` : 'Кошик' }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped lang="scss">
.bottom {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  pointer-events: none;

  &__cartbar {
    padding: 0 12px 10px;
    pointer-events: auto;
  }
}

.cartbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  border-radius: 16px;
  background: $orange-gradient;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  box-shadow: $shadow-cta;

  &:hover {
    color: #fff;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__count {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 26px;
    height: 26px;
    padding: 0 6px;
    border-radius: 13px;
    background: rgba(255, 255, 255, 0.22);
    font-size: 13px;
  }
}

.tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding-bottom: env(safe-area-inset-bottom);
  background: #fff;
  box-shadow: 0 -1px 0 $divider-section;
  pointer-events: auto;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: $tabbar-height;
    color: $text-secondary;
    font-size: 11px;
    font-weight: 500;

    &:hover {
      color: $text-secondary;
    }

    &--on,
    &--on:hover {
      color: $orange;
    }
  }
}
</style>
