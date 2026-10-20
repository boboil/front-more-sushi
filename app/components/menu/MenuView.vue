<script setup lang="ts">
// Каталог: мобільний — верхній блок з пілюлями + список рядків;
// десктоп — сітка 220px | 1fr | 360px (категорії, товари, панель кошика).
const props = defineProps<{ category: string }>()

const { categories, category, productsIn, heroes } = useMenu()
const filters = useMenuFilters()
const cart = useCart()

const current = computed(() => category(props.category) ?? categories.value[0]!)
const results = computed(() =>
  productsIn(props.category).filter(p => filters.active.value.every(f => p.tags.includes(f))),
)
const resultLabel = computed(() => `${results.value.length} ${pluralDishes(results.value.length)}`)
const showHero = computed(() => props.category === ALL_CATEGORY_SLUG && !filters.has.value && heroes.value.length > 0)

const track = useTrack()
onMounted(() => {
  watch(() => props.category, () => track('view_item_list', {
    lines: productsIn(props.category).map(product => ({ product, qty: 1 })),
    params: { item_list_id: current.value.slug, item_list_name: current.value.name },
  }), { immediate: true })
})

function resetAll() {
  navigateTo(categoryPath(ALL_CATEGORY_SLUG))
}
</script>

<template>
  <div class="menu">
    <!-- Мобільний верхній блок -->
    <div class="menu-top only-mobile">
      <div class="menu-top__row">
        <NuxtLink to="/" class="icon-btn icon-btn--grey" aria-label="Назад"><UiIcon name="chevron-left" /></NuxtLink>
        <h1 class="menu-top__title">{{ current.name }}</h1>
        <span class="menu-top__count">{{ resultLabel }}</span>
      </div>
      <nav class="cat-pills" aria-label="Категорії">
        <NuxtLink
          v-for="c in categories"
          :key="c.slug"
          :to="categoryPath(c.slug)"
          class="cat-pill"
          :class="{ 'cat-pill--on': c.slug === current.slug }"
        >
          {{ c.shortName }}
        </NuxtLink>
      </nav>
      <MenuFilterChips />
    </div>

    <!-- Десктоп: ліва колонка -->
    <aside class="menu-side only-desktop">
      <div class="menu-side__group">
        <div class="section-label menu-side__label">Меню</div>
        <NuxtLink
          v-for="c in categories"
          :key="c.slug"
          :to="categoryPath(c.slug)"
          class="side-cat"
          :class="{ 'side-cat--on': c.slug === current.slug }"
        >
          <span>{{ c.name }}</span><span class="side-cat__count">{{ c.count }}</span>
        </NuxtLink>
      </div>
      <div v-if="filters.list.value.length" class="menu-side__group menu-side__group--filters">
        <div class="menu-side__filters-head">
          <span class="section-label">Фільтри</span>
          <button v-if="filters.has.value" type="button" class="btn btn--link menu-side__reset" @click="filters.clear()">Скинути</button>
        </div>
        <MenuFilterChips />
      </div>
      <div class="menu-side__info">
        <NuxtLink to="/delivery" class="side-cat menu-side__info-link">Доставка і самовивіз</NuxtLink>
        <NuxtLink to="/contacts" class="side-cat menu-side__info-link">Контакти</NuxtLink>
      </div>
    </aside>

    <section class="menu-main">
      <div v-if="showHero" class="menu-main__hero only-desktop" :class="{ 'menu-main__hero--solo': !cart.lastOrderLines.value.length }">
        <MenuHeroCarousel :heroes="heroes" />
        <MenuReorderCard />
      </div>

      <div class="menu-main__head only-desktop">
        <h2 class="menu-main__title">{{ current.name }}</h2>
        <span class="menu-main__count">{{ resultLabel }}</span>
      </div>

      <div v-if="!results.length" class="menu-empty">
        <div class="menu-empty__title">Нічого не знайдено</div>
        <p class="menu-empty__text">Приберіть частину фільтрів або оберіть іншу категорію.</p>
        <button type="button" class="btn btn--dark" @click="resetAll">Скинути фільтри</button>
      </div>

      <div v-else class="menu-grid">
        <MenuProductCard v-for="(p, i) in results" :key="p.id" :product="p" :eager="i < 6" />
      </div>
    </section>

    <aside class="menu-cart">
      <CartPanel />
    </aside>
  </div>
</template>

<style scoped lang="scss">
.menu {
  @include desktop-up {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 32px;
    align-items: start;
    max-width: $container-max-width;
    margin: 0 auto;
    padding: 28px $container-padding-x-desktop 40px;
  }

  @include tablet {
    gap: 24px;
    padding: 24px $container-padding-x-tablet 40px;
  }

  @include wide {
    grid-template-columns: 220px minmax(0, 1fr) 360px;
  }
}

// ---- мобільний верх ----
.menu-top {
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px $container-padding-x-mobile 10px;
  background: #fff;
  box-shadow: 0 1px 0 $divider-section;

  &__row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    flex: 1;
    min-width: 0;
    font-weight: 700;
    font-size: 24px;
    line-height: 1.1;
  }

  &__count {
    font-size: 12px;
    color: $text-secondary;
    white-space: nowrap;
  }
}

.cat-pills {
  @include hide-scrollbar;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 (-$container-padding-x-mobile);
  padding: 0 $container-padding-x-mobile;
}

.cat-pill {
  display: inline-flex;
  align-items: center;
  flex: none;
  height: 36px;
  padding: 0 14px;
  border-radius: $radius-pill;
  border: 1px solid $input-border;
  background: #fff;
  color: $black;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    color: $black;
  }

  &--on,
  &--on:hover {
    background: $dark;
    border-color: $dark;
    color: #fff;
  }
}

// ---- десктоп сайдбар ----
.menu-side {
  position: sticky;
  top: calc(#{$header-height} + 28px);
  display: flex;
  flex-direction: column;
  gap: 22px;

  &__group {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &--filters {
      gap: 10px;
    }
  }

  &__label {
    padding: 0 12px 6px;
  }

  &__filters-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 12px;
  }

  &__reset {
    font-size: 12px;
  }

  &__info {
    display: flex;
    flex-direction: column;
    padding-top: 12px;
    border-top: 1px solid $divider-section;
  }

  &__info-link {
    min-height: 36px;
    color: $text-secondary;
    font-weight: 500;

    &:hover {
      background: transparent;
      color: $orange;
    }
  }
}

.side-cat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 42px;
  padding: 8px 12px;
  border-radius: $radius-btn;
  color: $black;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.2;
  transition: background $duration;

  &:hover {
    color: $black;
    background: $stepper-bg;
  }

  &__count {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.7;
  }

  &--on,
  &--on:hover {
    background: $dark;
    color: #fff;
  }
}

// ---- центр ----
.menu-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;

  @include mobile {
    gap: 10px;
    padding: 12px $container-padding-x-mobile 0;
  }

  &__hero {
    display: grid;
    grid-template-columns: minmax(0, 1.6fr) minmax(0, 1fr);
    gap: 16px;

    &--solo {
      grid-template-columns: 1fr;
    }
  }

  &__head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    font-weight: 800;
    font-size: 30px;
    line-height: 1.1;
  }

  &__count {
    font-size: 13px;
    color: $text-secondary;
    white-space: nowrap;
  }
}

.menu-grid {
  display: grid;
  gap: 10px;

  @include desktop-up {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.menu-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 48px 12px;
  text-align: center;

  @include desktop-up {
    gap: 12px;
    padding: 60px 12px;
    background: #fff;
    border-radius: $radius-card-lg;
  }

  &__title {
    font-weight: 700;
    font-size: 22px;
  }

  &__text {
    max-width: 260px;
    color: $text-secondary;

    @include desktop-up {
      max-width: none;
    }
  }
}

// ---- кошик праворуч ----
.menu-cart {
  display: none;

  @include wide {
    display: block;
    position: sticky;
    top: calc(#{$header-height} + 28px);
  }
}
</style>
