<script setup lang="ts">
// Плашка кошика знизу на мобільному (на /promo/* немає таб-бару, тож вона одна)
const cart = useCart()
</script>

<template>
  <div class="cartbar only-mobile">
    <template v-if="!cart.isEmpty.value">
      <span class="cartbar__sum">{{ cart.count.value }} {{ pluralDishes(cart.count.value) }} · {{ formatPrice(cart.total.value) }}</span>
      <NuxtLink to="/checkout" class="cartbar__cta">Оформити</NuxtLink>
    </template>
    <span v-else class="cartbar__hint">Додайте товари з акції, щоб оформити замовлення</span>
  </div>
</template>

<style scoped lang="scss">
.cartbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 60px;
  padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  background: $black;
  color: #fff;

  &__sum {
    font-size: 14px;
    font-weight: 700;
  }

  &__cta {
    padding: 11px 22px;
    border-radius: $radius-btn;
    background: var(--day-base);
    color: #fff;
    font-weight: 800;
    font-size: 14px;

    &:hover {
      color: #fff;
    }
  }

  &__hint {
    flex: 1;
    text-align: center;
    font-size: 12.5px;
    color: #cfcfcf;
  }
}
</style>
