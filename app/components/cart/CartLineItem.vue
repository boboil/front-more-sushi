<script setup lang="ts">
import type { CartLine } from '~/composables/useCart'

defineProps<{ line: CartLine, compact?: boolean }>()
const { setQty } = useCart()
</script>

<template>
  <div class="line" :class="{ 'line--compact': compact }">
    <NuxtLink :to="`/product/${line.product.slug}`" class="line__img">
      <img v-if="line.product.image" :src="line.product.image" :alt="line.product.name" loading="lazy">
    </NuxtLink>
    <div class="line__info">
      <div class="line__name">{{ line.product.name }}</div>
      <div v-if="!compact && line.product.weight" class="line__weight">{{ line.product.weight }}</div>
      <div class="line__sum">{{ formatPrice(line.sum) }}</div>
    </div>
    <UiStepper
      :value="line.qty"
      variant="neutral"
      size="sm"
      @dec="setQty(line.product.id, line.qty - 1)"
      @inc="setQty(line.product.id, line.qty + 1)"
    />
  </div>
</template>

<style scoped lang="scss">
.line {
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

  &__weight {
    font-size: 12px;
    color: $text-secondary;
  }

  &__sum {
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }

  &--compact {
    grid-template-columns: 56px minmax(0, 1fr) auto;

    .line__img {
      width: 56px;
      height: 56px;
      border-radius: 10px;
    }

    .line__name {
      font-size: 14px;
      line-height: 1.25;
    }

    .line__sum {
      font-weight: 700;
    }
  }
}
</style>
