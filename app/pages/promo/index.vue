<script setup lang="ts">
// /promo/ → сторінка дня з активною акцією: сьогоднішня, а якщо сьогодні акції немає — найближча наступна.
// Лендинги вимкнені в адмінці або жодного активного дня — 404. Query (utm, preview) зберігаємо.
definePageMeta({ layout: 'promo' })

const route = useRoute()
const { data: promo } = await usePromo()
const data = promo.value
const preview = !!data?.preview

const today = kyivNow(promoClock(data)).weekday
const active = (data?.enabled || preview) ? (data?.days ?? []).filter(d => d.isActive) : []
// найближчий активний день, починаючи з сьогодні
const target = [...active].sort((a, b) => ((a.weekday - today + 7) % 7) - ((b.weekday - today + 7) % 7))[0]

if (!target) {
  throw createError({ statusCode: 404, statusMessage: 'Сторінку не знайдено', fatal: true })
}

await navigateTo({ path: `/promo/${target.slug}`, query: route.query }, { redirectCode: 302, replace: true })
</script>

<template>
  <div />
</template>
