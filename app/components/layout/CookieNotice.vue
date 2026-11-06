<script setup lang="ts">
const accepted = useCookie<boolean>('ms_cookie_notice', { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/', default: () => false })
</script>

<template>
  <aside v-if="!accepted" class="cookie" aria-label="Повідомлення про cookie">
    <p class="cookie__text">
      Ми використовуємо cookie для роботи кошика, аналітики та реклами.
      Детальніше в <NuxtLink to="/privacy">політиці конфіденційності</NuxtLink>.
    </p>
    <button type="button" class="btn btn--primary cookie__btn" @click="accepted = true">Зрозуміло</button>
  </aside>
</template>

<style scoped lang="scss">
.cookie {
  position: fixed;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.18);

  // унизу на мобільному вже є кошик і таб-бар
  @include mobile {
    top: 8px;
    left: 8px;
    right: 8px;
  }

  @include desktop-up {
    left: 24px;
    bottom: 24px;
    max-width: 440px;
  }

  &__text {
    margin: 0;
    font-size: 13px;
    line-height: 1.4;

    a {
      color: inherit;
      text-decoration: underline;
    }
  }

  &__btn {
    flex-shrink: 0;
  }
}
</style>
