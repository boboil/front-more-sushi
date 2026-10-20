<script setup lang="ts">
// "Минуле замовлення" — показується, лише якщо в cookie є попереднє замовлення
const emit = defineEmits<{ reordered: [] }>()
const cart = useCart()

const text = computed(() => cart.lastOrderLines.value.map(l => l.qty > 1 ? `${l.product.name} ×${l.qty}` : l.product.name).join(' + '))

function reorder() {
  cart.reorder()
  emit('reordered')
}
</script>

<template>
  <div v-if="cart.lastOrderLines.value.length" class="reorder card">
    <div class="reorder__icon"><UiIcon name="reorder" :size="20" :stroke="1.7" /></div>
    <div class="reorder__body">
      <div class="reorder__label">
        <span class="only-mobile">Минуле замовлення · {{ formatPrice(cart.lastOrderTotal.value) }}</span>
        <span class="only-desktop">Ваше минуле замовлення</span>
      </div>
      <div class="reorder__text">{{ text }}</div>
    </div>
    <div class="reorder__footer">
      <span class="reorder__total only-desktop">{{ formatPrice(cart.lastOrderTotal.value) }}</span>
      <button type="button" class="btn btn--dark reorder__btn" @click="reorder">Повторити</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.reorder {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;

  @include desktop-up {
    flex-direction: column;
    align-items: stretch;
    padding: 22px;
    border-radius: $radius-card-lg;
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: $radius-btn-lg;
    background: $orange-tint;
    color: $orange;

    @include desktop-up {
      width: 46px;
      height: 46px;
      color: $orange-badge;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;

    @include desktop-up {
      gap: 12px;
    }
  }

  &__label {
    font-size: 12px;
    color: $text-secondary;

    @include desktop-up {
      font-size: 13px;
    }
  }

  &__text {
    font-weight: 600;
    font-size: 14px;
    line-height: 1.3;

    @include mobile {
      @include line-clamp(2);
    }

    @include desktop-up {
      font-weight: 700;
      font-size: 17px;
    }
  }

  &__footer {
    flex: none;

    @include desktop-up {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
  }

  &__total {
    font-weight: 700;
    font-size: 18px;
  }

  &__btn {
    height: 40px;
    padding: 0 14px;
    font-size: 13px;

    @include desktop-up {
      height: 44px;
      padding: 0 18px;
      font-size: 14px;
    }
  }
}
</style>
