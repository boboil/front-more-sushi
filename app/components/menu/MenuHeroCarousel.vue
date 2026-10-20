<script setup lang="ts">
import type { MenuHero } from '#shared/types/menu'

const props = defineProps<{ heroes: MenuHero[] }>()

const AUTOPLAY_MS = 6000

const track = ref<HTMLElement | null>(null)
const index = ref(0)
const paused = ref(false)
const many = computed(() => props.heroes.length > 1)

function goTo(i: number) {
  const el = track.value
  if (!el) return
  const n = props.heroes.length
  const target = (i + n) % n
  el.scrollTo({ left: target * el.clientWidth, behavior: 'smooth' })
}

// активний слайд визначаємо з позиції прокрутки — так працює і свайп, і стрілки
function onScroll() {
  const el = track.value
  if (el?.clientWidth) index.value = Math.round(el.scrollLeft / el.clientWidth)
}

let timer: ReturnType<typeof setInterval> | undefined

function stop() {
  clearInterval(timer)
  timer = undefined
}

function start() {
  stop()
  if (!many.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    if (!paused.value && document.visibilityState === 'visible') goTo(index.value + 1)
  }, AUTOPLAY_MS)
}

onMounted(start)
onBeforeUnmount(stop)
watch(() => props.heroes.length, () => {
  index.value = 0
  start()
})
</script>

<template>
  <div
    class="carousel"
    :class="{ 'carousel--many': many }"
    role="region"
    aria-roledescription="carousel"
    aria-label="Акції"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @focusin="paused = true"
    @focusout="paused = false"
    @touchstart.passive="paused = true"
    @touchend.passive="paused = false"
  >
    <div ref="track" class="carousel__track" @scroll.passive="onScroll">
      <div
        v-for="(h, i) in heroes"
        :key="h.productSlug ?? h.image"
        class="carousel__slide"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${i + 1} з ${heroes.length}`"
      >
        <MenuPromoHero :hero="h" :eager="i === 0" />
      </div>
    </div>

    <template v-if="many">
      <button type="button" class="carousel__arrow carousel__arrow--prev only-desktop" aria-label="Попередня акція" @click="goTo(index - 1)">
        <UiIcon name="chevron-left" :size="20" />
      </button>
      <button type="button" class="carousel__arrow carousel__arrow--next only-desktop" aria-label="Наступна акція" @click="goTo(index + 1)">
        <UiIcon name="chevron-left" :size="20" />
      </button>
      <div class="carousel__dots">
        <button
          v-for="(h, i) in heroes"
          :key="h.productSlug ?? h.image"
          type="button"
          class="carousel__dot"
          :class="{ 'carousel__dot--on': i === index }"
          :aria-label="`Акція ${i + 1}`"
          :aria-current="i === index"
          @click="goTo(i)"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.carousel {
  position: relative;
  min-width: 0;

  &__track {
    @include hide-scrollbar;
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    overscroll-behavior-x: contain;
    border-radius: $radius-card;

    @include desktop-up {
      border-radius: $radius-card-lg;
    }
  }

  &__slide {
    flex: 0 0 100%;
    min-width: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
  }

  // точки над градієнтом, але вище тексту банера — щоб не перекривати ціну
  &--many :deep(.hero__overlay) {
    padding-bottom: 26px;

    @include desktop-up {
      padding-bottom: 34px;
    }
  }

  &__dots {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 9px;
    display: flex;
    justify-content: center;
    gap: 6px;
    pointer-events: none;

    @include desktop-up {
      bottom: 13px;
    }
  }

  &__dot {
    @include reset-button;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background: rgba(255, 255, 255, 0.5);
    pointer-events: auto;
    transition: width $duration, background $duration;

    &--on {
      width: 18px;
      background: #fff;
    }
  }

  &__arrow {
    @include reset-button;
    position: absolute;
    top: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    margin-top: -18px;
    border-radius: 18px;
    background: rgba(0, 0, 0, 0.45);
    color: #fff;
    opacity: 0;
    transition: opacity $duration, background $duration;

    &:hover {
      background: rgba(0, 0, 0, 0.65);
    }

    &--prev {
      left: 12px;
    }

    &--next {
      right: 12px;

      :deep(svg) {
        transform: rotate(180deg);
      }
    }
  }

  &:hover &__arrow,
  &__arrow:focus-visible {
    opacity: 1;
  }
}
</style>
