<script setup lang="ts">
defineProps<{ compact?: boolean }>()
const { promo, applyPromo } = useCart()
</script>

<template>
  <div class="promo" :class="{ 'promo--compact': compact }">
    <div v-if="!compact" class="promo__title">Промокод</div>
    <form class="promo__row" @submit.prevent="applyPromo">
      <input
        v-model="promo.input"
        class="input promo__input"
        :placeholder="compact ? 'Промокод' : 'Введіть код'"
        aria-label="Промокод"
        autocomplete="off"
        @input="promo.error = ''"
      >
      <button type="submit" class="btn btn--dark promo__btn">Застосувати</button>
    </form>
    <div v-if="promo.code" class="promo__msg promo__msg--ok">Код {{ promo.code }} застосовано</div>
    <div v-else-if="promo.error" class="promo__msg promo__msg--err">{{ promo.error }}</div>
  </div>
</template>

<style scoped lang="scss">
.promo {
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__title {
    font-weight: 600;
  }

  &__row {
    display: flex;
    gap: 8px;
  }

  &__input {
    flex: 1;
    height: 44px;
    text-transform: uppercase;
  }

  &__btn {
    height: 44px;
    padding: 0 14px;
  }

  &__msg {
    font-size: 13px;

    &--ok {
      color: $green-dark;
    }

    &--err {
      color: $orange-dark;
    }
  }

  &--compact {
    .promo__input,
    .promo__btn {
      height: 42px;
      font-size: 14px;
    }

    .promo__btn {
      font-size: 13px;
    }

    .promo__msg {
      font-size: 12px;
    }
  }
}
</style>
