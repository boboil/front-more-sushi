<script setup lang="ts">
import type { PromoDay } from '#shared/types/promo'

// Компактний «плакат» акції (діагональ + велика цифра + медальйон) — для «Акція закінчилась → завтра»
defineProps<{ day: PromoDay, image: string, ribbon: string, note: string }>()
</script>

<template>
  <div
    class="poster"
    :style="{ '--p-base': PROMO_COLORS[day.key].base, '--p-dark': PROMO_COLORS[day.key].dark }"
  >
    <PromoRibbon :text="ribbon" class="poster__ribbon" />
    <div class="poster__inner">
      <span class="poster__big">{{ day.offerType === 'percent' && day.discountPercent ? `−${day.discountPercent}%` : (day.giftBadge || 'Подарунок') }}</span>
      <span class="poster__offer">{{ day.offerTitle }}</span>
      <div class="poster__media"><img :src="image" :alt="day.offerTitle"></div>
      <span class="poster__note">{{ note }}</span>
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.poster {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  background: var(--p-dark);
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--p-base);
    clip-path: polygon(0 0, 100% 0, 100% 60%, 0 80%);
  }

  // стрічка бере колір дня з --day-base; тут — колір «завтрашнього» дня
  &__ribbon {
    --day-base: var(--p-base);
    top: 16px !important;
    left: -10px !important;
    padding: 6px 20px !important;
    font-size: 11px !important;
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding: 52px 20px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
  }

  &__big {
    font-weight: 900;
    font-size: 58px;
    line-height: 0.85;
    transform: rotate(-3deg);
    text-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
  }

  &__offer {
    font-weight: 800;
    font-size: 16px;
  }

  &__media {
    width: 84px;
    height: 84px;
    margin: 2px 0;
    border-radius: 50%;
    overflow: hidden;
    border: 5px solid #fff;
    transform: rotate(6deg);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__note {
    font-size: 12.5px;
    opacity: 0.9;
  }
}
</style>
