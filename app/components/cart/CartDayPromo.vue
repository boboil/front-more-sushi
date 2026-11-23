<script setup lang="ts">
// «Акція дня» в кошику: подарунок (з вибором), безкоштовні позиції, знижка в цінах і підказка, чого бракує
defineProps<{ compact?: boolean }>()
const { quote, gift } = useDayPromo()
const { productById } = useMenu()

const q = computed(() => (quote.value.active ? quote.value : null))
const free = computed(() => (q.value?.freeItems ?? [])
  .map(f => ({ name: productById(f.productId)?.name ?? 'Позиція', count: f.count }))
  .filter(f => f.count > 0))
// знижка у % уже в цінах меню — показуємо, скільки зекономлено
const inPrice = computed(() => (q.value?.applied ? (q.value.discount ?? 0) - (q.value.extraDiscount ?? 0) : 0))
const options = computed(() => q.value?.giftOptions ?? [])
const selected = computed(() => gift.value ?? q.value?.selectedGift ?? null)

function giftName(name: string, productId: number | null) {
  return productId ? productById(productId)?.name ?? name : name
}
</script>

<template>
  <div v-if="q" class="day-promo" :class="{ 'day-promo--compact': compact }">
    <div class="day-promo__title">Акція дня</div>

    <template v-if="q.applied">
      <div v-if="q.gifts?.length || free.length" class="day-promo__gift">
        <span>Подарунок додано до замовлення</span>
        <span class="day-promo__free">0 грн</span>
      </div>
      <div v-if="inPrice > 0" class="summary-row summary-row--success">
        <span>Знижка вже в цінах</span><span>−{{ formatPrice(inPrice) }}</span>
      </div>
    </template>

    <fieldset v-if="options.length > 1" class="day-promo__choice">
      <legend>{{ q.applied ? 'Оберіть подарунок' : 'Подарунок на вибір' }}</legend>
      <label v-for="o in options" :key="o.posterId" class="day-promo__option">
        <input type="radio" name="day-promo-gift" :value="o.posterId" :checked="selected === o.posterId" @change="gift = o.posterId">
        <span>{{ giftName(o.name, o.productId) }}</span>
      </label>
    </fieldset>

    <p v-if="q.hint" class="day-promo__hint">{{ q.hint }}</p>
  </div>
</template>

<style scoped lang="scss">
.day-promo {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px;
  border: 1px solid $orange-tint-border;
  border-radius: $radius-btn;
  background: $orange-tint-text;
  font-size: 14px;

  &--compact {
    padding: 10px 12px;
    font-size: 13px;
  }

  &__title {
    font-weight: 800;
    color: $orange-dark;
  }

  &__gift {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    font-weight: 600;
  }

  &__free {
    flex-shrink: 0;
    color: $green-dark;
    font-weight: 700;
  }

  &__choice {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin: 0;
    padding: 0;
    border: 0;

    legend {
      margin-bottom: 4px;
      color: $text-secondary;
    }
  }

  &__option {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;

    input {
      accent-color: $orange;
    }
  }

  &__hint {
    margin: 0;
    color: $text-body-muted;
  }
}
</style>
