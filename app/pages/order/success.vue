<script setup lang="ts">
const placed = useState<{ id: number | null, total: number } | null>('placed-order', () => null)

useSeoMeta({ title: 'Замовлення прийнято', robots: 'noindex' })
</script>

<template>
  <div class="done">
    <div class="done__card">
      <div class="done__check"><UiIcon name="check" :size="38" :stroke="2" /></div>
      <h1 class="done__title">Замовлення прийнято</h1>
      <p class="done__text">
        <template v-if="placed">
          <template v-if="placed.id">№ {{ placed.id }} · </template>{{ formatPrice(placed.total) }}.
        </template>
        Оператор зателефонує для підтвердження.
      </p>
      <NuxtLink to="/" class="btn done__btn only-mobile">На головну</NuxtLink>
      <NuxtLink to="/menu" class="btn done__btn only-desktop">Повернутися до меню</NuxtLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
.done {
  @include mobile {
    min-height: 100vh;
    display: flex;
    background: $orange-gradient-diag;
  }

  @include desktop-up {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - #{$header-height});
    padding: 40px;
  }

  &__card {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 24px;
    text-align: center;
    color: #fff;

    @include desktop-up {
      flex: none;
      width: 520px;
      gap: 16px;
      padding: 48px 40px;
      border-radius: $radius-modal;
      background: $orange-gradient-diag;
      box-shadow: 0 20px 50px rgba(238, 89, 5, 0.3);
    }
  }

  &__check {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 40px;
    background: rgba(255, 255, 255, 0.25);

    @include desktop-up {
      width: 84px;
      height: 84px;
      border-radius: 42px;
    }
  }

  &__title {
    font-weight: 700;
    font-size: 28px;
    line-height: 1.15;

    @include desktop-up {
      font-weight: 800;
      font-size: 32px;
    }
  }

  &__text {
    max-width: 290px;
    color: $orange-tint-text;
    line-height: 1.45;

    @include desktop-up {
      max-width: none;
      line-height: 1.5;
    }
  }

  &__btn {
    height: 48px;
    margin-top: 8px;
    padding: 0 22px;
    border-radius: $radius-btn-lg;
    background: #fff;
    color: $orange-dark;

    &:hover {
      background: $orange-tint-text;
      color: $orange-dark;
    }

    @include desktop-up {
      height: 50px;
      padding: 0 24px;
    }
  }
}
</style>
