<script setup lang="ts">
import type { PromoDay } from '#shared/types/promo'

// Стрічка 7 днів; поточний (сьогоднішній) день — заливка кольором дня
defineProps<{ days: PromoDay[], todayWeekday: number }>()
const promoLink = usePromoLink()
</script>

<template>
  <div class="week">
    <NuxtLink
      v-for="d in days"
      :key="d.key"
      :to="promoLink(d.slug)"
      class="week__chip"
      :class="{ 'week__chip--today': d.weekday === todayWeekday }"
      :style="{
        '--chip-base': PROMO_COLORS[d.key].base,
        '--chip-tint': PROMO_COLORS[d.key].tint,
        '--chip-border': PROMO_COLORS[d.key].border,
      }"
    >
      <span class="week__short">{{ d.short }}</span>
      <span class="week__offer">{{ d.isActive ? d.offerShort : 'Без акції' }}</span>
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.week {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 2px $container-padding-x-mobile 6px;
  @include hide-scrollbar;

  @include desktop-up {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 12px;
    padding: 0;
    overflow: visible;
  }

  &__chip {
    flex: 0 0 auto;
    width: 92px;
    min-height: 64px;
    border-radius: 14px;
    padding: 10px 8px;
    background: var(--chip-tint);
    border: 1px solid var(--chip-border);
    color: var(--chip-base);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    text-align: center;

    &:hover {
      color: var(--chip-base);
      border-color: var(--chip-base);
    }

    @include desktop-up {
      width: auto;
      border-radius: 16px;
      padding: 16px 10px;
      gap: 6px;
    }

    &--today {
      background: var(--chip-base);
      border: 2px solid #fff;
      color: #fff;
      box-shadow: 0 0 0 2px var(--chip-base);

      &:hover {
        color: #fff;
      }
    }
  }

  &__short {
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.3px;

    @include desktop-up {
      font-size: 12px;
    }
  }

  &__offer {
    font-size: 10px;
    font-weight: 700;
    line-height: 1.3;

    @include desktop-up {
      font-size: 11.5px;
    }
  }
}
</style>
