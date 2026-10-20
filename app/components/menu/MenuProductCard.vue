<script setup lang="ts">
import type { MenuProduct } from '#shared/types/menu'

// Мобільний: рядок (фото 104px ліворуч). Десктоп: картка в сітці (фото 180px зверху).
const props = defineProps<{ product: MenuProduct, eager?: boolean }>()

const { qty, setQty } = useCart()
const modal = useProductModal()

const count = computed(() => qty(props.product.id))
const saveLabel = computed(() => props.product.oldPrice ? `−${formatPrice(props.product.oldPrice - props.product.price)}` : '')
</script>

<template>
  <NuxtLink v-slot="{ href, navigate }" :to="`/product/${product.slug}`" custom>
    <a :href="href ?? undefined" class="pcard" @click="modal.open(product.slug, $event) || navigate($event)">
      <div class="pcard__media">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          :loading="eager ? 'eager' : 'lazy'"
          class="pcard__img"
        >
        <span v-if="saveLabel" class="badge pcard__badge">{{ saveLabel }}</span>
      </div>
      <div class="pcard__body">
        <div class="pcard__info">
          <h3 class="pcard__name">{{ product.name }}</h3>
          <p v-if="product.ingredients.length" class="pcard__comp">{{ product.ingredients.join(', ') }}</p>
        </div>
        <div class="pcard__footer">
          <div class="pcard__prices">
            <div class="pcard__price-row">
              <span class="price pcard__price">{{ formatPrice(product.price) }}</span>
              <span v-if="product.oldPrice" class="price price--old pcard__old">{{ formatPrice(product.oldPrice) }}</span>
            </div>
            <span class="pcard__meta">{{ productMeta(product) }}</span>
          </div>
          <button
            v-if="!count"
            type="button"
            class="pcard__add"
            :aria-label="`Додати ${product.name}`"
            @click.stop.prevent="setQty(product.id, 1)"
          >
            <UiIcon name="plus" :size="18" :stroke="2" />
          </button>
          <UiStepper
            v-else
            :value="count"
            @dec="setQty(product.id, count - 1)"
            @inc="setQty(product.id, count + 1)"
          />
        </div>
      </div>
    </a>
  </NuxtLink>
</template>

<style scoped lang="scss">
.pcard {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr);
  gap: 12px;
  padding: 8px;
  background: #fff;
  border-radius: $radius-card;
  box-shadow: $shadow-card-mobile;
  color: $black;
  transition: box-shadow $duration, transform $duration;

  &:hover {
    color: $black;
  }

  @include desktop-up {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    border-radius: 20px;
    box-shadow: $shadow-card;

    &:hover {
      box-shadow: $shadow-card-hover;
      transform: translateY(-2px);
    }
  }

  &__media {
    position: relative;
    width: 104px;
    height: 104px;
    border-radius: $radius-img;
    overflow: hidden;
    background: $divider-card;

    @include desktop-up {
      width: 100%;
      height: 180px;
      border-radius: $radius-img-lg;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__badge {
    position: absolute;
    top: 6px;
    left: 6px;
    font-size: 11px;
    padding: 3px 7px;

    @include desktop-up {
      top: 10px;
      left: 10px;
      font-size: 12px;
      padding: 4px 10px;
    }
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    padding: 2px 4px 2px 0;

    @include desktop-up {
      flex: 1;
      gap: 10px;
      padding: 0;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    @include desktop-up {
      flex: 1;
      gap: 6px;
      padding: 0 6px;
    }
  }

  &__name {
    font-weight: 600;
    font-size: 17px;
    line-height: 1.15;

    @include desktop-up {
      font-weight: 700;
      font-size: 16px;
      line-height: 1.25;
    }
  }

  &__comp {
    @include line-clamp(2);
    font-size: 12px;
    line-height: 1.35;
    color: $text-secondary;

    @include desktop-up {
      line-height: 1.4;
    }
  }

  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: auto;

    @include desktop-up {
      margin-top: 0;
      padding: 0 6px 6px;
    }
  }

  &__prices {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0 6px;
  }

  &__price {
    font-weight: 600;
    font-size: 16px;

    @include desktop-up {
      font-weight: 700;
      font-size: 17px;
    }
  }

  &__old {
    font-size: 11px;

    @include desktop-up {
      font-size: 12px;
    }
  }

  &__meta {
    font-size: 11px;
    color: $text-secondary;

    @include desktop-up {
      font-size: 12px;
    }
  }

  &__add {
    @include reset-button;
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: $radius-btn;
    background: $orange-gradient;
    color: #fff;
    transition: background $duration;

    &:hover {
      background: $orange-gradient-hover;
    }

    @include desktop-up {
      width: 42px;
      height: 42px;
    }
  }
}
</style>
