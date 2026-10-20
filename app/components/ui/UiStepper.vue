<script setup lang="ts">
// tint — на картках товарів (помаранчевий "+"), neutral — у кошику та на сторінці товару
withDefaults(defineProps<{
  value: number
  variant?: 'tint' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
}>(), { variant: 'tint', size: 'md' })

const emit = defineEmits<{ dec: [], inc: [] }>()
</script>

<template>
  <div class="stepper" :class="[`stepper--${variant}`, `stepper--${size}`]" @click.stop.prevent>
    <button type="button" class="stepper__btn" aria-label="Менше" @click="emit('dec')">
      <UiIcon name="minus" :size="size === 'sm' ? 14 : size === 'lg' ? 18 : 16" :stroke="2" />
    </button>
    <span class="stepper__value">{{ value }}</span>
    <button type="button" class="stepper__btn stepper__btn--inc" aria-label="Більше" @click="emit('inc')">
      <UiIcon name="plus" :size="size === 'sm' ? 14 : size === 'lg' ? 18 : 16" :stroke="2" />
    </button>
  </div>
</template>

<style scoped lang="scss">
.stepper {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  flex: none;
  padding: 2px;
  border-radius: $radius-btn;
  cursor: default;

  &__btn {
    @include reset-button;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 34px;
    border-radius: 10px;
    transition: background $duration;
  }

  &__value {
    min-width: 18px;
    text-align: center;
    font-weight: 600;
  }

  &--tint {
    background: $orange-tint;
    color: $orange-dark;

    .stepper__btn:hover {
      background: rgba($orange-dark, 0.08);
    }

    .stepper__btn--inc {
      background: $orange-gradient;
      color: #fff;

      &:hover {
        background: $orange-gradient-hover;
      }
    }

    @include desktop-up {
      padding: 3px;

      .stepper__btn {
        width: 34px;
      }

      .stepper__value {
        min-width: 20px;
        font-weight: 700;
      }
    }
  }

  &--neutral {
    background: $stepper-bg;
    color: $black;

    .stepper__btn:hover {
      background: $divider-section;
    }
  }

  &--sm {
    .stepper__btn {
      width: 30px;
      height: 32px;
    }

    .stepper__value {
      min-width: 16px;
    }

    @include desktop-up {
      border-radius: 10px;

      .stepper__btn {
        width: 28px;
        height: 30px;
        border-radius: 8px;
      }

      .stepper__value {
        font-size: 13px;
        font-weight: 700;
      }
    }
  }

  &--lg {
    padding: 3px;
    border-radius: $radius-btn-lg;

    .stepper__btn {
      width: 42px;
      height: 46px;
      border-radius: $radius-btn;
    }

    .stepper__value {
      min-width: 22px;
      font-size: 16px;
    }

    @include desktop-up {
      .stepper__btn {
        width: 44px;
        height: 48px;
      }

      .stepper__value {
        min-width: 24px;
        font-weight: 700;
      }
    }
  }
}
</style>
