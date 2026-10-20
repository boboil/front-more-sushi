<script setup lang="ts">
const { deliveryCost } = useMenu()
const goBack = useGoBack('/')

useSeoMeta({
  title: 'Доставка',
  description: () => deliveryCost.value > 0
    ? `Доставка суші у Сумах: до ${FREE_DELIVERY_FROM} грн — ${deliveryCost.value} грн, від ${FREE_DELIVERY_FROM} грн — безкоштовно. Самовивіз: ${CONTACTS.address}.`
    : `Безкоштовна доставка суші у Сумах. Самовивіз: ${CONTACTS.address}, ${CONTACTS.hours}.`,
})
</script>

<template>
  <div class="delivery">
    <div class="screen-head">
      <button type="button" class="icon-btn" aria-label="Назад" @click="goBack"><UiIcon name="chevron-left" /></button>
      <h1 class="screen-head__title">Доставка</h1>
    </div>

    <div class="delivery__grid">
      <div class="delivery__media">
        <img src="/img/delivery.webp" alt="Кур'єр Море Суші" width="635" height="635">
      </div>

      <div class="delivery__cards">
        <section class="card delivery__card">
          <div class="section-label">Умови доставки</div>
          <template v-if="deliveryCost > 0">
            <div class="delivery__row">
              <span>Замовлення до {{ formatPrice(FREE_DELIVERY_FROM) }}</span>
              <span class="delivery__value">{{ formatPrice(deliveryCost) }}</span>
            </div>
            <div class="delivery__row">
              <span>Від {{ formatPrice(FREE_DELIVERY_FROM) }}</span>
              <span class="delivery__value delivery__value--free">безкоштовно</span>
            </div>
          </template>
          <div v-else class="delivery__row">
            <span>По місту</span>
            <span class="delivery__value delivery__value--free">безкоштовно</span>
          </div>
          <p class="delivery__note">Доставка до {{ CONTACTS.deliveryUntil }}. Точний час оператор підтвердить після оформлення.</p>
        </section>

        <section class="card delivery__card">
          <div class="section-label">Самовивіз</div>
          <a :href="CONTACTS.map" class="delivery__address" target="_blank" rel="noopener noreferrer">{{ CONTACTS.address }}</a>
          <p class="delivery__note">Працюємо {{ CONTACTS.hours }}</p>
        </section>

        <section class="card delivery__card">
          <div class="section-label">Є питання?</div>
          <a :href="CONTACTS.phone.href" class="delivery__phone">{{ CONTACTS.phone.label }}</a>
        </section>

        <NuxtLink to="/menu" class="btn btn--primary delivery__cta">До меню</NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.delivery {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 $container-padding-x-mobile 40px;

  @include desktop-up {
    padding: 28px $container-padding-x-desktop 48px;
    box-sizing: content-box;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 4px;

    @include desktop-up {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 32px;
      align-items: center;
      padding-top: 0;
    }
  }

  &__media img {
    width: 100%;
    max-width: 260px;
    height: auto;
    margin: 0 auto;

    @include desktop-up {
      max-width: 440px;
    }
  }

  &__cards {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 16px;

    @include desktop-up {
      padding: 22px;
    }
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 12px;
    font-size: 15px;
  }

  &__value {
    font-weight: 700;
    font-size: 17px;
    white-space: nowrap;

    &--free {
      color: $green-dark;
    }
  }

  &__note {
    font-size: 13px;
    color: $text-secondary;
  }

  &__address,
  &__phone {
    font-weight: 700;
    font-size: 18px;
  }

  &__cta {
    height: 52px;
    border-radius: $radius-btn-lg;
    font-size: 16px;
  }
}
</style>
