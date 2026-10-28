<script setup lang="ts">
// Мобільний — окремий екран "Головна"; десктоп — одразу меню з банером (як у дизайні)
useSeoMeta({
  title: 'Дари Моря',
  description: 'Доставка суші, ролів, сетів та піци у Сумах. Замовляйте онлайн у «Дари Моря» — швидко, смачно, з акціями щотижня.',
})
</script>

<template>
  <div>
    <HomeMobile class="only-mobile" />
    <MenuView class="only-desktop" category="all" />
  </div>
</template>
