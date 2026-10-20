<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const is404 = computed(() => props.error.statusCode === 404)

useSeoMeta({ title: is404.value ? 'Сторінку не знайдено' : 'Помилка', robots: 'noindex' })
</script>

<template>
  <div class="error-page">
    <img src="/img/logo-big.png" alt="" width="72" height="72">
    <h1>{{ is404 ? 'Сторінку не знайдено' : 'Щось пішло не так' }}</h1>
    <p>{{ is404 ? 'Можливо, страву прибрали з меню або посилання застаріло.' : 'Спробуйте оновити сторінку трохи пізніше.' }}</p>
    <button type="button" class="btn btn--primary" @click="clearError({ redirect: '/menu' })">До меню</button>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding: 24px;
  text-align: center;

  h1 {
    font-weight: 800;
    font-size: 28px;
  }

  p {
    color: $text-secondary;
    max-width: 320px;
  }
}
</style>
