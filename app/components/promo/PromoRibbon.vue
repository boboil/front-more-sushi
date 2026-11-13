<script setup lang="ts">
defineProps<{ text: string }>()
</script>

<template>
  <div class="ribbon"><span>{{ text }}</span></div>
</template>

<style scoped lang="scss">
// «плакатна» стрічка під кутом; колір тексту — колір дня
.ribbon {
  position: absolute;
  z-index: 2;
  top: 18px;
  left: -10px;
  transform: rotate(-7deg);
  background: #fff;
  padding: 7px 22px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.3px;
  color: var(--day-base);
  text-transform: uppercase;

  @include desktop-up {
    top: 44px;
    left: -18px;
    padding: 11px 32px;
    font-size: 15px;
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.2);
  }
}
</style>
