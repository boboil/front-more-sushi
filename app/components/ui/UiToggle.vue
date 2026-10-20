<script setup lang="ts">
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <button type="button" class="toggle-row" role="switch" :aria-checked="model" @click="model = !model">
    <span class="toggle-row__text">
      <slot />
    </span>
    <span class="toggle" :class="{ 'toggle--on': model }"><span class="toggle__knob" /></span>
  </button>
</template>

<style scoped lang="scss">
.toggle-row {
  @include reset-button;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  text-align: left;

  &__text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
}

.toggle {
  position: relative;
  flex: none;
  width: 46px;
  height: 28px;
  border-radius: 14px;
  background: $input-border;
  transition: background $duration;

  &__knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 22px;
    height: 22px;
    border-radius: 11px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transition: left $duration;
  }

  &--on {
    background: $orange;

    .toggle__knob {
      left: 21px;
    }
  }
}
</style>
