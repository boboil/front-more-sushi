<script setup lang="ts">
import type { PromoDay } from '#shared/types/promo'

// Перший екран «акція йде»: діагональ двох відтінків дня, велика цифра, фото-медальйон, таймер
const props = defineProps<{ day: PromoDay, image: string, secondsLeft: number }>()

const big = computed(() => props.day.offerType === 'percent' && props.day.discountPercent
  ? `−${props.day.discountPercent}%`
  : (props.day.giftBadge || 'Подарунок'))
</script>

<template>
  <section class="hero">
    <PromoRibbon :text="`${day.label} · сьогодні акція`" />
    <div class="hero__inner">
      <div class="hero__text">
        <span class="hero__big" :class="{ 'hero__big--word': day.offerType !== 'percent' }">{{ big }}</span>
        <span class="hero__offer">{{ day.offerTitle }}</span>
        <div class="hero__media only-mobile">
          <img :src="image" :alt="day.offerTitle">
        </div>
        <div class="hero__timer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.7" /><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" /></svg>
          <ClientOnly>
            <span>До кінця акції: {{ formatCountdown(secondsLeft) }}</span>
            <template #fallback><span>Діє до {{ day.activeTo }}</span></template>
          </ClientOnly>
        </div>
        <a href="#products" class="hero__cta">Замовити</a>
      </div>
      <div class="hero__media only-desktop">
        <img :src="image" :alt="day.offerTitle">
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  overflow: hidden;
  background: var(--day-dark);
  color: #fff;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--day-base);
    clip-path: polygon(0 0, 100% 0, 100% 62%, 0 82%);

    @include desktop-up {
      clip-path: polygon(0 0, 100% 0, 100% 72%, 0 90%);
    }
  }

  &__inner {
    position: relative;
    z-index: 1;
    padding: 58px 20px 28px;

    @include desktop-up {
      max-width: 1344px;
      margin: 0 auto;
      padding: 118px $container-padding-x-desktop 64px;
      display: flex;
      align-items: center;
      gap: 56px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;

    @include desktop-up {
      flex: 1 1 480px;
      align-items: flex-start;
      gap: 18px;
      text-align: left;
    }
  }

  &__big {
    display: inline-block;
    font-weight: 900;
    font-size: 78px;
    line-height: 0.85;
    transform: rotate(-3deg);
    text-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);

    @include desktop-up {
      font-size: 128px;
      text-shadow: 0 10px 22px rgba(0, 0, 0, 0.25);
    }

    &--word {
      font-size: 54px;

      @include desktop-up {
        font-size: 96px;
      }
    }
  }

  &__offer {
    font-weight: 800;
    font-size: 19px;

    @include desktop-up {
      font-size: 30px;
    }
  }

  &__media {
    flex: none;
    width: 140px;
    height: 140px;
    margin: 4px 0;
    border-radius: 50%;
    overflow: hidden;
    border: 6px solid #fff;
    transform: rotate(5deg);
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);

    @include desktop-up {
      width: 380px;
      height: 380px;
      margin: 0;
      border-width: 14px;
      transform: rotate(6deg);
      box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &__timer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
    font-size: 14px;
    font-variant-numeric: tabular-nums;

    @include desktop-up {
      font-size: 16px;
      margin-top: 4px;
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 280px;
    padding: 15px 0;
    border-radius: $radius-btn-lg;
    background: #fff;
    color: var(--day-base);
    font-weight: 800;
    font-size: 16px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);

    &:hover {
      color: var(--day-dark);
    }

    @include desktop-up {
      width: auto;
      padding: 17px 36px;
      font-size: 17px;
      margin-top: 8px;
    }
  }
}
</style>
