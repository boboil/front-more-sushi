<script setup lang="ts">
import type { MenuProduct } from '#shared/types/menu'

// Мобільний: фото на всю ширину + "аркуш" з контентом + липка нижня панель.
// Десктоп: дві колонки (фото 420px | деталі) — і в модалці, і на окремій сторінці.
const props = defineProps<{ product: MenuProduct, inModal?: boolean }>()
const emit = defineEmits<{ close: [], added: [] }>()

const cart = useCart()
const qty = ref(1)
watch(() => props.product.id, () => { qty.value = 1 })

const inCart = computed(() => cart.qty(props.product.id) > 0)
const addLabel = computed(() => `${inCart.value ? 'Додати ще' : 'Додати'} · ${formatPrice(props.product.price * qty.value)}`)
const saveLabel = computed(() => props.product.oldPrice ? `−${formatPrice(props.product.oldPrice - props.product.price)}` : '')

const track = useTrack()
onMounted(() => {
  watch(() => props.product.id, () => track('view_item', { lines: [{ product: props.product, qty: 1 }] }), { immediate: true })
})

function add() {
  cart.add(props.product.id, qty.value)
  emit('added')
}
</script>

<template>
  <article class="pd" :class="{ 'pd--modal': inModal }">
    <div class="pd__media">
      <img v-if="product.image" :src="product.image" :alt="product.name" class="pd__img" fetchpriority="high">
      <button v-if="!inModal" type="button" class="icon-btn pd__back only-mobile" aria-label="Назад" @click="emit('close')">
        <UiIcon name="chevron-left" />
      </button>
      <span v-if="saveLabel" class="badge pd__badge">{{ saveLabel }}</span>
    </div>

    <div class="pd__content">
      <div class="pd__head">
        <h1 class="pd__name">{{ product.name }}</h1>
        <button type="button" class="icon-btn icon-btn--grey pd__close only-desktop" :aria-label="inModal ? 'Закрити' : 'Назад'" @click="emit('close')">
          <UiIcon :name="inModal ? 'x' : 'chevron-left'" />
        </button>
      </div>
      <div class="pd__meta">{{ productMeta(product) }}</div>

      <div class="pd__prices pd__prices--top">
        <span class="price pd__price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.oldPrice" class="price price--old pd__old">{{ formatPrice(product.oldPrice) }}</span>
      </div>

      <div v-if="product.note" class="pd__note">{{ product.note }}</div>

      <div v-if="product.ingredients.length" class="pd__comp">
        <div class="pd__comp-label">Склад</div>
        <ul class="pd__comp-list">
          <li v-for="(line, i) in product.ingredients" :key="i"><span class="pd__dot" />{{ line }}</li>
        </ul>
      </div>

      <div class="pd__prices pd__prices--bottom">
        <span class="price pd__price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.oldPrice" class="price price--old pd__old">{{ formatPrice(product.oldPrice) }}</span>
      </div>

      <div class="pd__actions">
        <UiStepper :value="qty" variant="neutral" size="lg" @dec="qty = Math.max(1, qty - 1)" @inc="qty++" />
        <button type="button" class="btn btn--primary pd__add" @click="add">{{ addLabel }}</button>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.pd {
  // ---------- спільне ----------
  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__meta {
    font-size: 13px;
    color: $text-secondary;
  }

  &__prices {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  &__note {
    font-size: 13px;
    color: $orange-dark;
    background: $orange-tint;
    padding: 10px 12px;
    border-radius: $radius-btn;
  }

  &__comp-list {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid $divider-card;
      font-size: 15px;
    }
  }

  &__dot {
    flex: none;
    width: 6px;
    height: 6px;
    border-radius: 3px;
  }

  &__add {
    flex: 1;
    border-radius: $radius-btn-lg;
    font-size: 16px;
  }

  // ---------- мобільний ----------
  @include mobile {
    padding-bottom: 110px;

    &__media {
      position: relative;
      height: 320px;
      background: $dark;
    }

    &__back {
      position: absolute;
      top: 14px;
      left: 14px;
      width: 42px;
      height: 42px;
      border-radius: $radius-btn-lg;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.12);
    }

    &__badge {
      position: absolute;
      top: 20px;
      right: 14px;
      font-size: 13px;
      padding: 5px 11px;
    }

    &__content {
      position: relative;
      margin-top: -24px;
      padding: 22px $container-padding-x-mobile 0;
      border-radius: 24px 24px 0 0;
      background: $page-bg;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    &__head {
      margin-bottom: -8px;
    }

    &__name {
      font-weight: 700;
      font-size: 28px;
      line-height: 1.1;
    }

    &__price {
      font-size: 28px;
      font-weight: 700;
      color: $dark;
    }

    &__old {
      font-size: 15px;
    }

    &__prices--bottom {
      display: none;
    }

    &__comp {
      background: #fff;
      border-radius: $radius-card;
      padding: 6px 14px;
      box-shadow: $shadow-card-mobile;
    }

    &__comp-label {
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: $text-secondary;
      padding: 10px 0 4px;
    }

    &__comp-list li {
      padding: 11px 0;

      &:last-child {
        border-bottom: 0;
      }
    }

    &__dot {
      background: $orange-badge;
    }

    &__actions {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 10;
      display: flex;
      gap: 10px;
      padding: 12px $container-padding-x-mobile calc(18px + env(safe-area-inset-bottom));
      background: #fff;
      box-shadow: $shadow-bottom-bar;
    }

    &__add {
      height: 52px;
    }
  }

  // ---------- десктоп ----------
  @include desktop-up {
    position: relative;
    display: grid;
    grid-template-columns: 420px minmax(0, 1fr);
    width: 880px;
    max-width: 100%;
    background: #fff;
    border-radius: $radius-modal;
    overflow: hidden;

    &:not(&--modal) {
      box-shadow: $shadow-card;
    }

    &__media {
      position: relative;
      height: 520px;
      background: $dark;
    }

    &__badge {
      position: absolute;
      top: 18px;
      left: 18px;
      font-size: 13px;
      padding: 5px 12px;
    }

    &__content {
      display: flex;
      flex-direction: column;
      gap: 14px;
      min-height: 0;
      max-height: 520px;
      padding: 32px 32px 28px;
    }

    &__head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }

    &__name {
      font-weight: 800;
      font-size: 28px;
      line-height: 1.15;
    }

    &__prices--top {
      display: none;
    }

    &__price {
      font-weight: 800;
      font-size: 30px;
    }

    &__old {
      font-size: 16px;
    }

    &__comp {
      flex: 1;
      min-height: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    &__comp-label {
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: $grey;
    }

    &__comp-list {
      @include hide-scrollbar;
      flex: 1;
      overflow-y: auto;
      margin-top: 4px;
    }

    &__comp-list li {
      padding: 10px 0;
    }

    &__dot {
      background: $orange;
    }

    &__actions {
      display: flex;
      gap: 10px;
    }

    &__add {
      height: 54px;
    }
  }

  @include tablet {
    grid-template-columns: 320px minmax(0, 1fr);
  }

}
</style>
