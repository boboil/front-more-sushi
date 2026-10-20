<script setup lang="ts">
import type { MenuHero } from '#shared/types/menu'

// eager — перший слайд: вантажимо одразу з високим пріоритетом, решту ліниво
const props = withDefaults(defineProps<{ hero: MenuHero, eager?: boolean }>(), { eager: true })
const modal = useProductModal()

const to = computed(() => props.hero.productSlug ? `/product/${props.hero.productSlug}` : (props.hero.link || '/menu/akcii'))
const external = computed(() => /^https?:\/\//.test(to.value))

function onClick(e: MouseEvent, navigate: (e: MouseEvent) => unknown) {
  if (!(props.hero.productSlug && modal.open(props.hero.productSlug, e))) navigate(e)
}
</script>

<template>
  <a v-if="external" :href="to" class="hero" target="_blank" rel="noopener">
    <img :src="hero.image" :alt="hero.title" class="hero__img" :fetchpriority="eager ? 'high' : 'auto'" :loading="eager ? 'eager' : 'lazy'">
  </a>
  <NuxtLink v-else v-slot="{ href, navigate }" :to="to" custom>
    <a :href="href ?? undefined" class="hero" @click="onClick($event, navigate)">
      <img :src="hero.image" :alt="hero.title" class="hero__img" :fetchpriority="eager ? 'high' : 'auto'" :loading="eager ? 'eager' : 'lazy'">
      <div v-if="hero.title || hero.badge" class="hero__overlay">
        <div class="hero__text">
          <span v-if="hero.badge" class="badge hero__badge">{{ hero.badge }}</span>
          <span class="hero__title">{{ hero.title }}</span>
          <span v-if="hero.subtitle" class="hero__sub">{{ hero.subtitle }}</span>
        </div>
        <span v-if="hero.price" class="hero__price">{{ formatPrice(hero.price) }}</span>
      </div>
    </a>
  </NuxtLink>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  display: block;
  height: 178px;
  border-radius: $radius-card;
  overflow: hidden;
  background: $dark;
  color: #fff;

  &:hover {
    color: #fff;
  }

  @include desktop-up {
    height: 250px;
    border-radius: $radius-card-lg;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s;
  }

  &:hover &__img {
    transform: scale(1.03);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 10px;
    padding: 14px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0) 75%);

    @include desktop-up {
      gap: 12px;
      padding: 24px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0) 70%);
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &__badge {
    align-self: flex-start;
    font-size: 11px;
    letter-spacing: 0.04em;

    @include desktop-up {
      font-size: 12px;
      padding: 5px 11px;
      letter-spacing: 0;
      margin-bottom: 2px;
    }
  }

  &__title {
    font-weight: 700;
    font-size: 26px;
    line-height: 1.05;

    @include desktop-up {
      font-weight: 800;
      font-size: 34px;
    }
  }

  &__sub {
    @include line-clamp(1);
    font-size: 13px;

    @include desktop-up {
      font-size: 14px;
    }
  }

  &__price {
    flex: none;
    font-weight: 700;
    font-size: 24px;
    white-space: nowrap;

    @include desktop-up {
      font-weight: 800;
      font-size: 28px;
    }
  }
}
</style>
