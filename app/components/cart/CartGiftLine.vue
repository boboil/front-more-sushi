<script setup lang="ts">
// Подарунок «Акції дня» рядком кошика: 0 грн, без кнопок — його додає заклад (у Poster — результат акції)
import type { CartGiftLine } from '~/composables/useCart'

const props = defineProps<{ gift: CartGiftLine, compact?: boolean }>()
const { productById } = useMenu()
// картка в меню — з посиланням; прихована картка подарунка — лише фото з розрахунку акції
const product = computed(() => (props.gift.productId ? productById(props.gift.productId) : undefined))
const image = computed(() => product.value?.image || props.gift.image || '')
</script>

<template>
  <div class="gift" :class="{ 'gift--compact': compact }">
    <NuxtLink v-if="product" :to="`/product/${product.slug}`" class="gift__img">
      <img v-if="image" :src="image" :alt="product.name" loading="lazy">
    </NuxtLink>
    <div v-else-if="image" class="gift__img"><img :src="image" :alt="gift.name" loading="lazy"></div>
    <div v-else class="gift__img gift__img--empty" aria-hidden="true">🎁</div>
    <div class="gift__info">
      <div class="gift__name">{{ product?.name ?? gift.name }}</div>
      <div class="gift__sum">
        <span class="gift__zero">0 грн</span>
        <s v-if="gift.price" class="gift__old">{{ formatPrice(gift.price * gift.qty) }}</s>
      </div>
    </div>
    <div class="gift__side">
      <span class="gift__badge">Подарунок</span>
      <span v-if="gift.qty > 1" class="gift__qty">× {{ gift.qty }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.gift {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr) auto;
  gap: 12px;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid $divider-card;

  &:last-child {
    border-bottom: 0;
  }

  &__img {
    width: 64px;
    height: 64px;
    border-radius: $radius-img;
    overflow: hidden;
    background: $divider-card;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &--empty {
      display: grid;
      place-items: center;
      font-size: 28px;
      background: $orange-tint;
    }
  }

  &__info {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-weight: 600;
    font-size: 16px;
    line-height: 1.15;
  }

  &__sum {
    display: flex;
    gap: 8px;
    align-items: baseline;
    font-size: 14px;
  }

  &__zero {
    font-weight: 700;
    color: $green-dark;
  }

  &__old {
    color: $grey;
  }

  &__side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  &__badge {
    padding: 4px 10px;
    border-radius: $radius-pill;
    background: $orange-tint;
    color: $orange-dark;
    font-size: 12px;
    font-weight: 700;
  }

  &__qty {
    font-size: 13px;
    color: $text-secondary;
  }

  &--compact {
    grid-template-columns: 56px minmax(0, 1fr) auto;

    .gift__img {
      width: 56px;
      height: 56px;
      border-radius: 10px;
    }

    .gift__name {
      font-size: 14px;
      line-height: 1.25;
    }
  }
}
</style>
