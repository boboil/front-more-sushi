<template>
  <NuxtLink to="/" class="logo" aria-label="Море Суші — на головну">
    <img src="/img/logo-big.png" alt="" class="logo__img" width="54" height="54">
    <span class="logo__text">
      <span class="logo__wordmark">МОРЕ <span>СУШІ</span></span>
      <span class="logo__sub">Суми · доставка до {{ CONTACTS.deliveryUntil }}</span>
    </span>
  </NuxtLink>
</template>

<style scoped lang="scss">
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: $black;

  &:hover {
    color: $black;
  }

  @include desktop-up {
    gap: 12px;
  }

  &__img {
    width: 46px;
    height: 46px;
    object-fit: contain;
    flex: none;

    @include desktop-up {
      width: 54px;
      height: 54px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  &__wordmark {
    font-weight: 800;
    font-size: 21px;
    letter-spacing: 0.03em;
    line-height: 1;
    white-space: nowrap;

    span {
      color: $orange;
    }

    @include desktop-up {
      font-size: 22px;
    }
  }

  &__sub {
    font-size: 12px;
    color: $text-secondary;
    white-space: nowrap;
  }
}
</style>
