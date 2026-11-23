<script setup lang="ts">
import type { PromoGift } from '#shared/types/promo'

// Подарунок акції Poster на лендингу: що отримає клієнт (не купується окремо — каса додає сама).
// menuCta — умова на суму замовлення: окремих «товарів акції» немає, ведемо в меню.
const props = defineProps<{ gifts: PromoGift[], text: string, menuCta?: boolean }>()

const options = computed(() => props.gifts.map(g => ({
  key: g.posterId,
  name: g.name,
  price: g.price,
  images: (g.items ?? []).map(i => i.image).filter((i): i is string => !!i),
})))
</script>

<template>
  <div class="gifts">
    <h2 class="gifts__title">{{ gifts.length > 1 ? 'Подарунок на вибір' : 'Подарунок' }}</h2>
    <p class="gifts__text">{{ text }}</p>
    <div class="gifts__list">
      <template v-for="(o, i) in options" :key="o.key">
        <span v-if="i > 0" class="gifts__or">або</span>
        <div class="gift">
          <div class="gift__media" :class="{ 'gift__media--pair': o.images.length > 1 }">
            <img v-for="src in o.images" :key="src" :src="src" :alt="o.name" loading="lazy">
            <span v-if="!o.images.length" class="gift__emoji" aria-hidden="true">🎁</span>
          </div>
          <div class="gift__body">
            <span class="gift__name">{{ o.name }}</span>
            <span class="gift__prices">
              <span v-if="o.price" class="gift__old">{{ formatPrice(o.price) }}</span>
              <span class="gift__free">0 грн</span>
            </span>
          </div>
        </div>
      </template>
    </div>
    <NuxtLink v-if="menuCta" to="/menu" class="gifts__cta">Обрати страви в меню</NuxtLink>
  </div>
</template>

<style scoped lang="scss">
.gifts {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 16px;
  border: 1px solid var(--day-border);
  border-radius: 20px;
  background: var(--day-tint);

  @include desktop-up {
    padding: 32px;
    gap: 18px;
  }

  &__title {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: $black;

    @include desktop-up {
      font-size: 26px;
    }
  }

  &__text {
    margin: 0;
    max-width: 720px;
    font-size: 14px;
    line-height: 1.5;
    color: $text-body-muted;

    @include desktop-up {
      font-size: 16px;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 10px;

    @include desktop-up {
      flex-direction: row;
      align-items: center;
      gap: 16px;
    }
  }

  &__or {
    align-self: center;
    font-weight: 800;
    font-size: 13px;
    text-transform: uppercase;
    color: var(--day-dark);
  }

  &__cta {
    align-self: flex-start;
    padding: 14px 22px;
    border-radius: $radius-btn;
    background: var(--day-base);
    color: #fff;
    font-weight: 800;
    font-size: 15px;

    &:hover {
      color: #fff;
      opacity: 0.92;
    }

    @include mobile {
      align-self: stretch;
      text-align: center;
    }
  }
}

.gift {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 16px;
  background: #fff;

  @include desktop-up {
    flex: 1;
    flex-direction: column;
    align-items: stretch;
    max-width: 360px;
    padding: 14px;
  }

  &__media {
    display: flex;
    flex: none;
    width: 96px;
    height: 72px;
    border-radius: 12px;
    overflow: hidden;
    background: $stepper-bg;

    @include desktop-up {
      width: 100%;
      height: 180px;
    }

    img {
      flex: 1;
      min-width: 0;
      height: 100%;
      object-fit: cover;
    }

    &--pair img + img {
      border-left: 2px solid #fff;
    }
  }

  &__emoji {
    margin: auto;
    font-size: 32px;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__name {
    font-weight: 700;
    font-size: 15px;
    line-height: 1.25;
    color: $black;
  }

  &__prices {
    display: flex;
    align-items: baseline;
    gap: 8px;
  }

  &__old {
    font-size: 13px;
    color: $text-secondary;
    text-decoration: line-through;
  }

  &__free {
    padding: 2px 8px;
    border-radius: $radius-pill;
    background: var(--day-base);
    color: #fff;
    font-weight: 800;
    font-size: 13px;
  }
}
</style>
