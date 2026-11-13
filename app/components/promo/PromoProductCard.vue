<script setup lang="ts">
import type { MenuProduct } from '#shared/types/menu'

// Товар акції: на мобільному рядок, на десктопі картка в сітці 4 колонки.
// regular — сторінку відкрили не в її день: звичайна ціна, нейтральна кнопка.
const props = defineProps<{ product: MenuProduct, regular?: boolean, giftBadge?: string | null }>()

const { qty, setQty } = useCart()
const count = computed(() => qty(props.product.id))
const showOld = computed(() => !props.regular && props.product.oldPrice && props.product.oldPrice > props.product.price)
</script>

<template>
  <div class="ppc" :class="{ 'ppc--regular': regular }">
    <img :src="product.image" :alt="product.name" class="ppc__img" loading="lazy">
    <div class="ppc__body">
      <span class="ppc__name">{{ product.name }}</span>
      <span class="ppc__weight">{{ product.weight }}</span>
      <div class="ppc__prices">
        <span v-if="giftBadge && !regular" class="ppc__gift">{{ giftBadge }}</span>
        <span v-if="showOld" class="ppc__old">{{ formatPrice(product.oldPrice!) }}</span>
        <span class="ppc__price">{{ formatPrice(product.price) }}</span>
      </div>
    </div>
    <div class="ppc__action">
      <div v-if="count" class="ppc__stepper">
        <button type="button" class="ppc__step" aria-label="Зменшити кількість" @click="setQty(product.id, count - 1)">−</button>
        <span class="ppc__qty">{{ count }}</span>
        <button type="button" class="ppc__step ppc__step--inc" aria-label="Збільшити кількість" @click="setQty(product.id, count + 1)">+</button>
      </div>
      <button v-else type="button" class="ppc__add" @click="setQty(product.id, 1)">В кошик</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ppc {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1.5px solid var(--day-border);

  @include desktop-up {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
    padding: 16px;
    border-radius: $radius-card;
    box-shadow: $shadow-card;
  }

  &--regular {
    border-color: transparent;
  }

  &__img {
    flex: none;
    width: 68px;
    height: 68px;
    border-radius: $radius-img;
    object-fit: cover;

    @include desktop-up {
      width: 100%;
      height: 170px;
      border-radius: $radius-img-lg;
    }
  }

  &__body {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;

    @include desktop-up {
      gap: 8px;
    }
  }

  &__name {
    font-weight: 700;
    font-size: 13px;
    line-height: 1.3;
    color: $black;

    @include desktop-up {
      font-size: 14px;
      line-height: 1.35;
      min-height: 38px;
    }
  }

  &__weight {
    font-size: 11px;
    color: $text-secondary;

    @include desktop-up {
      font-size: 12px;
    }
  }

  &__prices {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 2px;
  }

  &__gift {
    align-self: center;
    font-size: 10px;
    font-weight: 800;
    color: #fff;
    background: var(--day-base);
    padding: 2px 8px;
    border-radius: $radius-pill;
  }

  &__old {
    font-size: 12px;
    color: $text-secondary;
    text-decoration: line-through;

    @include desktop-up {
      font-size: 13px;
    }
  }

  &__price {
    font-size: 16px;
    font-weight: 800;
    color: var(--day-base);
    white-space: nowrap;

    @include desktop-up {
      font-size: 18px;
    }
  }

  &--regular &__price {
    color: $black;
  }

  &__action {
    flex: none;
  }

  &__add {
    @include reset-button;
    padding: 10px 14px;
    border-radius: $radius-btn;
    background: var(--day-base);
    color: #fff;
    font-weight: 700;
    font-size: 12px;
    white-space: nowrap;
    min-height: 40px;

    &:hover {
      background: var(--day-dark);
    }

    @include desktop-up {
      width: 100%;
      padding: 11px 0;
      font-size: 13px;
    }
  }

  &--regular &__add {
    background: #fff;
    color: $black;
    border: 1.5px solid $input-border;

    &:hover {
      border-color: $black;
    }
  }

  &__stepper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: $stepper-bg;
    border-radius: $radius-pill;
    padding: 4px;

    @include desktop-up {
      gap: 10px;
      padding: 6px;
    }
  }

  &__step {
    @include reset-button;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #fff;
    font-weight: 800;
    font-size: 15px;
    color: $black;

    &--inc {
      background: var(--day-base);
      color: #fff;
    }
  }

  &__qty {
    min-width: 16px;
    text-align: center;
    font-weight: 700;
    font-size: 13px;
  }
}
</style>
