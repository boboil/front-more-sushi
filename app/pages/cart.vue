<script setup lang="ts">
const cart = useCart()
const goBack = useGoBack('/')
const { public: { features } } = useRuntimeConfig()

useSeoMeta({ title: 'Кошик', robots: 'noindex' })

const track = useTrack()
onMounted(() => track('view_cart', { lines: cart.lines.value, value: cart.total.value }))

function reorder() {
  cart.reorder()
}
</script>

<template>
  <div class="cart-page">
    <div class="screen-head">
      <button type="button" class="icon-btn" aria-label="Назад" @click="goBack"><UiIcon name="chevron-left" /></button>
      <h1 class="screen-head__title">Кошик</h1>
      <button v-if="!cart.isEmpty.value" type="button" class="btn btn--link" @click="cart.clear()">Очистити</button>
    </div>

    <div v-if="cart.isEmpty.value" class="cart-empty">
      <div class="cart-empty__title">Кошик порожній</div>
      <p class="cart-empty__text">
        Додайте страви з меню<template v-if="cart.lastOrderLines.value.length"> або повторіть минуле замовлення</template>.
      </p>
      <div class="cart-empty__actions">
        <NuxtLink to="/menu" class="btn btn--dark">До меню</NuxtLink>
        <button v-if="cart.lastOrderLines.value.length" type="button" class="btn btn--outline" @click="reorder">Повторити минуле</button>
      </div>
    </div>

    <div v-else class="cart-body">
      <div class="card cart-lines">
        <CartLineItem v-for="l in cart.lines.value" :key="l.product.id" :line="l" />
      </div>

      <div v-if="features.promo" class="card cart-promo">
        <CartPromoBox />
      </div>

      <div class="cart-summary">
        <div class="summary-row"><span>Страви</span><span>{{ formatPrice(cart.subtotal.value) }}</span></div>
        <div v-if="cart.discount.value" class="summary-row summary-row--success">
          <span>Знижка за промокодом</span><span>−{{ formatPrice(cart.discount.value) }}</span>
        </div>
        <div class="summary-row summary-row--muted">
          <span>Доставка</span>
          <span>{{ cart.delivery.value ? formatPrice(cart.delivery.value) : 'уточнює оператор' }}</span>
        </div>
        <div class="summary-row summary-row--total"><span>Разом</span><span>{{ formatPrice(cart.total.value) }}</span></div>
      </div>

      <div class="sticky-cta">
        <NuxtLink to="/checkout" class="btn btn--primary btn--cta">
          <span>Оформити замовлення</span><span>{{ formatPrice(cart.total.value) }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cart-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 $container-padding-x-mobile 110px;

  @include desktop-up {
    padding: 28px $container-padding-x-desktop 48px;
  }
}

.cart-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 12px;
  text-align: center;

  &__title {
    font-weight: 700;
    font-size: 24px;
  }

  &__text {
    color: $text-secondary;
  }

  &__actions {
    display: flex;
    gap: 8px;
  }
}

.cart-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding-top: 4px;
}

.cart-lines {
  padding: 4px 12px;

  @include desktop-up {
    padding: 4px 20px;
  }
}

.cart-promo {
  padding: 14px;
}

.cart-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 4px;
}
</style>
