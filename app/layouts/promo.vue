<script setup lang="ts">
// Рекламний лендинг: шапка без навігації (лого, телефон, кошик), щоб нічого не відволікало від замовлення
const cart = useCart()
</script>

<template>
  <div class="promo-layout">
    <header class="promo-header">
      <UiLogo />
      <a :href="CONTACTS.phone.href" class="promo-header__phone" :aria-label="`Подзвонити ${CONTACTS.phone.label}`">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" /></svg>
        <span class="only-desktop">{{ CONTACTS.phone.label }}</span>
      </a>
      <NuxtLink to="/cart" class="promo-header__cart" :aria-label="`Кошик: ${cart.count.value}`">
        <UiIcon name="bag" :size="22" :stroke="1.7" />
        <span v-if="cart.count.value" class="promo-header__badge">{{ cart.count.value }}</span>
      </NuxtLink>
    </header>
    <main>
      <slot />
    </main>
    <ProductModal />
    <CookieNotice />
  </div>
</template>

<style scoped lang="scss">
.promo-layout {
  min-height: 100vh;
  background: $page-bg;
}

.promo-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px $container-padding-x-mobile;
  background: #fff;
  box-shadow: $shadow-card-mobile;

  @include desktop-up {
    padding: 16px $container-padding-x-desktop;
  }

  &__phone {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-left: auto;
    margin-right: 8px;
    padding: 6px;
    white-space: nowrap;
    font-weight: 700;
    font-size: 14px;
    color: $black;

    @include desktop-up {
      margin: 0;
      padding: 0;
      font-size: 15px;
    }
  }

  &__cart {
    position: relative;
    display: flex;
    padding: 6px;
    color: $black;
  }

  &__badge {
    position: absolute;
    top: -2px;
    right: -4px;
    min-width: 17px;
    height: 17px;
    padding: 0 4px;
    border-radius: $radius-pill;
    background: var(--day-base, #{$orange});
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
