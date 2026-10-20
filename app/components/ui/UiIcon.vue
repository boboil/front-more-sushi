<script setup lang="ts">
// Lucide-іконки інлайном (shopping-bag, chevron-left, plus, minus, x, rotate-ccw, check, home, grid)
const props = withDefaults(defineProps<{
  name: 'bag' | 'chevron-left' | 'plus' | 'minus' | 'x' | 'reorder' | 'check' | 'home' | 'grid'
  size?: number
  stroke?: number
}>(), { size: 20, stroke: 1.8 })

const paths: Record<typeof props.name, string> = {
  'bag': '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  'chevron-left': '<path d="m15 18-6-6 6-6"/>',
  'plus': '<path d="M5 12h14"/><path d="M12 5v14"/>',
  'minus': '<path d="M5 12h14"/>',
  'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  'reorder': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  'check': '<path d="M20 6 9 17l-5-5"/>',
  'home': '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  'grid': '<rect width="7" height="7" x="3" y="3" rx="2"/><rect width="7" height="7" x="14" y="3" rx="2"/><rect width="7" height="7" x="14" y="14" rx="2"/><rect width="7" height="7" x="3" y="14" rx="2"/>',
}
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="stroke"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    v-html="paths[name]"
  />
</template>
