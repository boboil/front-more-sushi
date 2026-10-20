<script setup lang="ts">
const { categories, promoProducts, heroes } = useMenu()
const cart = useCart()

const tiles = computed(() => categories.value.filter(c => c.slug !== ALL_CATEGORY_SLUG))
// товари з банера не дублюємо в "Акціях тижня"
const promos = computed(() => {
  const inHero = new Set(heroes.value.map(h => h.productSlug))
  return promoProducts.value.filter(p => !inHero.has(p.slug))
})
</script>

<template>
  <div class="home">
    <div class="home__top">
      <div class="home__bar">
        <UiLogo />
        <NuxtLink to="/cart" class="home__cart" aria-label="Кошик">
          <UiIcon name="bag" :size="20" :stroke="1.7" />
          <span v-if="cart.count.value" class="home__cart-count">{{ cart.count.value }}</span>
        </NuxtLink>
      </div>
      <MenuHeroCarousel v-if="heroes.length" :heroes="heroes" />
    </div>

    <div class="home__body">
      <MenuReorderCard @reordered="navigateTo('/cart')" />

      <section class="home__section">
        <h1 class="home__h">Меню</h1>
        <div class="tiles">
          <NuxtLink v-for="c in tiles" :key="c.slug" :to="categoryPath(c.slug)" class="tile">
            <div class="tile__img">
              <img v-if="c.image" :src="c.image" :alt="c.name" loading="lazy">
            </div>
            <div class="tile__foot">
              <span class="tile__name">{{ c.shortName }}</span>
              <span class="tile__count">{{ c.count }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <section v-if="promos.length" class="home__section">
        <div class="home__section-head">
          <h2 class="home__h">Акції тижня</h2>
          <NuxtLink :to="categoryPath(PROMO_CATEGORY_SLUG)" class="home__all">Усі акції</NuxtLink>
        </div>
        <div class="promos">
          <NuxtLink v-for="p in promos" :key="p.id" :to="`/product/${p.slug}`" class="promo">
            <div class="promo__img">
              <img v-if="p.image" :src="p.image" :alt="p.name" loading="lazy">
              <span v-if="p.oldPrice" class="badge promo__badge">−{{ formatPrice(p.oldPrice - p.price) }}</span>
            </div>
            <div class="promo__name">{{ p.name }}</div>
            <div class="promo__foot">
              <div class="promo__prices">
                <span class="price promo__price">{{ formatPrice(p.price) }}</span>
                <span v-if="p.oldPrice" class="price price--old promo__old">{{ formatPrice(p.oldPrice) }}</span>
              </div>
              <span class="promo__weight">{{ p.weight }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>

      <div class="home__infos">
        <NuxtLink to="/delivery" class="card home__info">
          <span>
            <span class="home__info-title">Доставка і самовивіз</span>
            <span class="home__info-sub">Умови, години роботи</span>
          </span>
          <UiIcon name="chevron-left" class="home__info-arrow" />
        </NuxtLink>
        <NuxtLink to="/contacts" class="card home__info">
          <span>
            <span class="home__info-title">Контакти</span>
            <span class="home__info-sub">Адреса, телефон, зворотній зв'язок</span>
          </span>
          <UiIcon name="chevron-left" class="home__info-arrow" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.home {
  &__top {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: 18px $container-padding-x-mobile 22px;
    background: #fff;
    border-radius: 0 0 28px 28px;
    box-shadow: $shadow-header;
  }

  &__bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__cart {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: $radius-btn-lg;
    background: $orange-tint;
    color: $orange-badge;
  }

  &__cart-count {
    position: absolute;
    top: -5px;
    right: -5px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 5px;
    border-radius: 10px;
    background: $orange-badge;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 18px $container-padding-x-mobile 0;
  }

  &__section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__section-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  &__h {
    font-weight: 700;
    font-size: 24px;
    line-height: 1.1;
  }

  &__all {
    font-weight: 600;
    font-size: 13px;
  }

  &__infos {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 14px;
    color: $black;

    > span {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  }

  &__info-title {
    font-weight: 600;
  }

  &__info-sub {
    font-size: 12px;
    color: $text-secondary;
  }

  &__info-arrow {
    transform: rotate(180deg);
    color: $text-secondary;
  }
}

.tiles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-radius: $radius-card;
  box-shadow: $shadow-card-mobile;
  color: $black;

  &:hover {
    color: $black;
  }

  &__img {
    height: 92px;
    border-radius: $radius-img;
    overflow: hidden;
    background: $divider-card;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__foot {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 6px;
    padding: 0 6px 4px;
  }

  &__name {
    font-weight: 600;
    font-size: 18px;
    line-height: 1.1;
    min-width: 0;
  }

  &__count {
    font-size: 12px;
    color: $text-secondary;
  }
}

.promos {
  @include hide-scrollbar;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  margin: 0 (-$container-padding-x-mobile);
  padding: 2px $container-padding-x-mobile 10px;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 $container-padding-x-mobile;
}

.promo {
  flex: none;
  width: 236px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-radius: $radius-card;
  box-shadow: $shadow-card-mobile;
  color: $black;
  scroll-snap-align: start;

  &:hover {
    color: $black;
  }

  &__img {
    position: relative;
    height: 132px;
    border-radius: $radius-img;
    overflow: hidden;
    background: $divider-card;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__badge {
    position: absolute;
    top: 8px;
    left: 8px;
  }

  &__name {
    padding: 0 6px;
    font-weight: 600;
    font-size: 18px;
    line-height: 1.15;
  }

  &__foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;
    padding: 0 6px 6px;
  }

  &__prices {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__price {
    font-weight: 600;
    font-size: 16px;
  }

  &__old {
    font-size: 12px;
  }

  &__weight {
    font-size: 12px;
    color: $text-secondary;
  }
}
</style>
