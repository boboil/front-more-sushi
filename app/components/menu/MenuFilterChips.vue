<script setup lang="ts">
const filters = useMenuFilters()
</script>

<template>
  <div v-if="filters.list.value.length" class="chips">
    <button
      v-for="f in filters.list.value"
      :key="f.id"
      type="button"
      class="chip"
      :class="{ 'chip--on': filters.isOn(f.id) }"
      :aria-pressed="filters.isOn(f.id)"
      @click="filters.toggle(f.id)"
    >
      {{ f.label }}
    </button>
    <button v-if="filters.has.value" type="button" class="chips__reset only-mobile" @click="filters.clear()">
      Скинути
    </button>
  </div>
</template>

<style scoped lang="scss">
.chips {
  display: flex;
  gap: 6px;

  @include mobile {
    @include hide-scrollbar;
    overflow-x: auto;
    margin: 0 (-$container-padding-x-mobile);
    padding: 0 $container-padding-x-mobile;
  }

  @include desktop-up {
    flex-wrap: wrap;
    padding: 0 6px;
  }

  &__reset {
    @include reset-button;
    flex: none;
    height: 30px;
    padding: 0 10px;
    color: $orange;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.chip {
  flex: none;
  height: 30px;
  padding: 0 11px;
  border-radius: $radius-pill;
  border: 1px solid $divider-section;
  background: $input-bg;
  color: $text-secondary;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  transition: background $duration, color $duration, border-color $duration;

  &:hover {
    border-color: $orange-tint-border;
  }

  @include desktop-up {
    height: 34px;
    padding: 0 12px;
    font-size: 13px;
  }

  &--on {
    background: $orange-tint;
    border-color: $orange-tint-border;
    color: $orange-dark;
  }
}
</style>
