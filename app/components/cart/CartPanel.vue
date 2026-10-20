<script setup lang="ts">
// Липка панель кошика праворуч у меню (лише широкий десктоп)
const cart = useCart()
const { public: { features } } = useRuntimeConfig()
</script>

<template>
  <div class="panel">
    <div class="panel__head">
      <h2 class="panel__title">Кошик</h2>
      <button v-if="!cart.isEmpty.value" type="button" class="btn btn--link" @click="cart.clear()">Очистити</button>
    </div>

    <div v-if="cart.isEmpty.value" class="panel__empty">
      <p>Тут поки порожньо. Додайте страви з меню<template v-if="cart.lastOrderLines.value.length"> або повторіть минуле замовлення</template>.</p>
      <button v-if="cart.lastOrderLines.value.length" type="button" class="btn btn--outline" @click="cart.reorder()">
        Повторити минуле
      </button>
    </div>

    <template v-else>
      <div class="panel__lines">
        <CartLineItem v-for="l in cart.lines.value" :key="l.product.id" :line="l" compact />
      </div>
      <div class="panel__foot">
        <CartPromoBox v-if="features.promo" compact />
        <div class="summary-row panel__row"><span>Страви</span><span>{{ formatPrice(cart.subtotal.value) }}</span></div>
        <div v-if="cart.discount.value" class="summary-row summary-row--success panel__row">
          <span>Знижка</span><span>−{{ formatPrice(cart.discount.value) }}</span>
        </div>
        <NuxtLink to="/checkout" class="btn btn--primary btn--cta panel__cta">
          <span>Оформити</span><span>{{ formatPrice(cart.total.value) }}</span>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - #{$header-height} - 56px);
  background: #fff;
  border-radius: $radius-card-lg;
  box-shadow: $shadow-card;

  &__head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 20px 12px;
  }

  &__title {
    font-weight: 800;
    font-size: 22px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 16px 20px 24px;
    color: $text-secondary;
    line-height: 1.5;
  }

  &__lines {
    @include hide-scrollbar;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 20px;
  }

  &__foot {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px 20px 20px;
  }

  &__row {
    font-size: 13px;
  }

  &__cta {
    margin-top: 4px;
  }
}
</style>
