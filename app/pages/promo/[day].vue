<script setup lang="ts">
import type { MenuProduct } from '#shared/types/menu'

// Лендинг «Акція дня» для реклами: /promo/ponedilok … /promo/nedilia (спека: docs/promo-day-landing-spec.md).
// Вмикається в адмінці (Магазин → Акції дня → «Увімкнути лендинги»); вимкнено — 404.
definePageMeta({ layout: 'promo' })

const route = useRoute()
const { data: promo } = await usePromo()
const promoLink = usePromoLink()
const dayKey = PROMO_SLUG_TO_DAY[String(route.params.day)]
const day = computed(() => promo.value?.days.find(d => d.key === dayKey))
// перегляд з адмінки (кнопка «Переглянути»): працює й з вимкненими лендингами, у будь-який день і годину
const preview = computed(() => !!promo.value?.preview)
if (!(promo.value?.enabled || preview.value) || !day.value) {
  throw createError({ statusCode: 404, statusMessage: 'Сторінку не знайдено', fatal: true })
}

const { productById, deliveryCost } = useMenu()
const now = useKyivClock()
const colors = computed(() => PROMO_COLORS[day.value!.key])

const menuProducts = computed<MenuProduct[]>(() =>
  (day.value?.productIds ?? []).map(id => productById(id)).filter((p): p is MenuProduct => !!p))
const image = computed(() => day.value?.heroImage || products.value[0]?.image || '/img/logo-big.png')

const days = computed(() => promo.value?.days ?? [])
const today = computed(() => days.value.find(d => d.weekday === now.value.weekday))
const tomorrow = computed(() => days.value.find(d => d.weekday === (now.value.weekday % 7) + 1))

type PageState = 'active' | 'soon' | 'ended' | 'wrong-day'
const PREVIEW_STATES: { state: PageState, label: string }[] = [
  { state: 'active', label: 'Акція діє' },
  { state: 'soon', label: 'Ще не почалась' },
  { state: 'ended', label: 'Завершилась' },
  { state: 'wrong-day', label: 'Інший день' },
]
const previewState = computed<PageState>(() =>
  PREVIEW_STATES.find(s => s.state === route.query.as)?.state ?? 'active')

const state = computed<PageState>(() => {
  const d = day.value!
  if (preview.value) return previewState.value
  if (!d.isActive || d.weekday !== now.value.weekday) return 'wrong-day'
  if (now.value.time < d.activeFrom) return 'soon'
  if (now.value.time >= d.activeTo) return 'ended'
  return 'active'
})
const secondsLeft = computed(() => {
  const d = day.value!
  // у перегляді поза годинами акції таймер показує всю тривалість
  if (preview.value && !(d.weekday === now.value.weekday && isWithinHours(d, now.value))) return toSeconds(d.activeTo) - toSeconds(d.activeFrom)
  return toSeconds(d.activeTo) - now.value.seconds
})

// у перегляді знижка поза годинами акції лише показана на картках; у кошику — ціни з меню (звичайні)
const products = computed<MenuProduct[]>(() => menuProducts.value.map(p =>
  preview.value && state.value === 'active' && !p.isPromo && day.value!.offerType === 'percent'
    ? { ...p, oldPrice: p.price, price: promoPrice(p.price, day.value!) }
    : p))

// акція почалась/закінчилась, поки сторінка відкрита — підтягуємо меню з новими цінами (кошик рахує з нього)
watch(state, () => refreshNuxtData(MENU_KEY))

const terms = computed(() => {
  const d = day.value!
  return `Діє ${PROMO_EVERY[d.key]} з ${d.activeFrom} до ${d.activeTo}. ${d.terms ?? ''}`.trim()
})

useHead(() => ({
  // кольори дня потрібні й шапці лейаута, тож ставимо змінні на <html>
  htmlAttrs: { style: `--day-base:${colors.value.base};--day-dark:${colors.value.dark};--day-tint:${colors.value.tint};--day-border:${colors.value.border}` },
}))
useSeoMeta({
  title: () => `${day.value!.label}: ${day.value!.offerShort}`,
  description: () => `${day.value!.label} в «Дари Моря»: ${day.value!.offerTitle}. ${terms.value}`,
  ogImage: () => image.value,
  // сторінки для реклами, не для пошуку
  robots: 'noindex, follow',
})
</script>

<template>
  <div v-if="day" class="promo" :class="`promo--${state}`">
    <!-- Панель перегляду з адмінки; відвідувачі її не бачать -->
    <div v-if="preview" class="preview">
      <span class="preview__title">Перегляд{{ promo?.enabled ? '' : ' · лендинги вимкнені, сторінку бачите лише ви' }}</span>
      <nav class="preview__states" aria-label="Стан сторінки">
        <NuxtLink
          v-for="s in PREVIEW_STATES"
          :key="s.state"
          :to="{ query: { ...route.query, as: s.state === 'active' ? undefined : s.state } }"
          class="preview__state"
          :class="{ 'preview__state--on': s.state === state }"
          replace
        >
          {{ s.label }}
        </NuxtLink>
      </nav>
      <span v-if="state === 'active' && !day.isActive" class="preview__note">Цей день вимкнений в адмінці — відвідувачі побачать «Інший день».</span>
      <span v-if="state === 'active'" class="preview__note">Знижка тут лише для показу: у кошику ціни звичайні, поки акція не діє насправді.</span>
    </div>
    <!-- 1. Перший екран: завжди як під час акції (з картинкою дня), стан — рядком у ньому -->
    <PromoHero v-if="day.isActive" :day="day" :image="image" :seconds-left="secondsLeft" :state="state" />

    <!-- пояснення під першим екраном, коли знижка зараз не діє -->
    <section v-if="state === 'soon'" class="banner">
      <span class="banner__text">Зараз ціни звичайні — можна вже обрати товари, знижка з {{ day.activeFrom }}.</span>
    </section>

    <section v-else-if="state === 'wrong-day'" class="banner">
      <span v-if="!day.isActive" class="banner__title">{{ day.label }}: зараз без акції</span>
      <span class="banner__text">Сьогодні {{ today?.label.toLowerCase() }} — нижче показані звичайні ціни.</span>
    </section>

    <section v-else-if="state === 'ended'" class="ended">
      <span v-if="tomorrow?.isActive" class="banner__text">Завтра — нова акція:</span>
      <PromoPoster
        v-if="tomorrow?.isActive"
        :day="tomorrow"
        :image="tomorrow.heroImage || productById(tomorrow.productIds[0] ?? 0)?.image || image"
        :ribbon="`Завтра — ${tomorrow.label}`"
        :note="`Старт о ${tomorrow.activeFrom}`"
        class="ended__poster"
      >
        <NuxtLink :to="promoLink(tomorrow.slug)" class="ended__link">Подивитись акцію</NuxtLink>
      </PromoPoster>
      <NuxtLink to="/menu" class="ended__menu">А поки — повне меню →</NuxtLink>
    </section>

    <!-- 2. Товари -->
    <section v-if="products.length" id="products" class="block">
      <h2 class="block__title">{{ state === 'active' ? 'Товари акції' : `${day.offerTitle.charAt(0).toUpperCase()}${day.offerTitle.slice(1)} — звичайна ціна` }}</h2>
      <div class="grid">
        <PromoProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
          :regular="state !== 'active'"
          :gift-badge="day.offerType === 'gift' ? day.giftBadge : null"
        />
      </div>
    </section>

    <!-- «А сьогодні — …» для тих, хто прийшов не в той день -->
    <section v-if="state === 'wrong-day' && today?.isActive" class="block">
      <div class="today" :style="{ background: PROMO_COLORS[today.key].base }">
        <span class="today__pill" :style="{ color: PROMO_COLORS[today.key].base }">А сьогодні — {{ today.label.toLowerCase() }}</span>
        <span class="today__offer">{{ today.offerType === 'percent' && today.discountPercent ? `−${today.discountPercent}% ` : '' }}{{ today.offerTitle }}</span>
        <NuxtLink :to="promoLink(today.slug)" class="today__cta" :style="{ color: PROMO_COLORS[today.key].base }">Перейти до акції дня</NuxtLink>
      </div>
    </section>

    <!-- 3. Умови -->
    <section v-if="state !== 'wrong-day'" class="block">
      <div class="terms">
        <span class="terms__title">Умови акції</span>
        <span class="terms__text">{{ terms }}</span>
      </div>
    </section>

    <!-- 4. Доставка -->
    <section class="block">
      <h2 class="block__title">Доставка</h2>
      <div class="facts">
        <div class="fact">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" stroke="currentColor" stroke-width="1.6" /><circle cx="12" cy="9" r="2.4" stroke="currentColor" stroke-width="1.6" /></svg>
          <span class="fact__title">Куди</span>
          <span class="fact__text">Доставка по Сумах або самовивіз: {{ CONTACTS.address }}</span>
        </div>
        <div class="fact">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" /><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg>
          <span class="fact__title">Коли</span>
          <span class="fact__text">Працюємо щодня {{ CONTACTS.hours }}</span>
        </div>
        <!-- вартість доставки з адмінки (Магазин → Доставка); 0 — доставка безкоштовна -->
        <div v-if="deliveryCost" class="fact">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="7" width="18" height="12" rx="2" stroke="currentColor" stroke-width="1.6" /><path d="M3 11h18" stroke="currentColor" stroke-width="1.6" /></svg>
          <span class="fact__title">Вартість</span>
          <span class="fact__text">{{ formatPrice(deliveryCost) }} по місту</span>
        </div>
        <div class="fact">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 12v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-7" stroke="currentColor" stroke-width="1.6" /><path d="M2 7h20v5H2z" stroke="currentColor" stroke-width="1.6" /></svg>
          <span class="fact__title">Безкоштовно</span>
          <span class="fact__text">{{ deliveryCost ? `При замовленні від ${formatPrice(FREE_DELIVERY_FROM)}` : 'Доставка по місту безкоштовна' }}</span>
        </div>
      </div>
    </section>

    <!-- 5. Акції інших днів -->
    <section class="block block--wide">
      <h2 class="block__title block__title--pad">Акції інших днів</h2>
      <PromoWeekStrip :days="days" :today-weekday="now.weekday" />
    </section>

    <!-- 6. Підвал -->
    <footer class="footer">
      <div class="footer__inner">
        <a v-if="products.length" href="#products" class="footer__cta">Замовити</a>
        <NuxtLink v-else to="/menu" class="footer__cta">Відкрити меню</NuxtLink>
        <a :href="CONTACTS.phone.href" class="footer__phone">{{ CONTACTS.phone.label }}</a>
        <span class="footer__addr">{{ CONTACTS.city }}, {{ CONTACTS.address }}</span>
        <div class="footer__links">
          <NuxtLink to="/terms">Умови</NuxtLink>
          <NuxtLink to="/privacy">Приватність</NuxtLink>
        </div>
      </div>
    </footer>

    <PromoCartBar />
  </div>
</template>

<style scoped lang="scss">
.preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px $container-padding-x-mobile;
  background: #1c1c1c;
  color: #fff;
  font-size: 13px;

  @include desktop-up {
    padding: 10px $container-padding-x-desktop;
  }

  &__title {
    font-weight: 800;
  }

  &__states {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &__state {
    padding: 5px 10px;
    border: 1px solid rgba(255, 255, 255, 0.35);
    border-radius: $radius-pill;
    color: #fff;
    font-weight: 600;

    &:hover {
      color: #fff;
    }

    &--on {
      background: #fff;
      color: #1c1c1c;
      border-color: #fff;

      &:hover {
        color: #1c1c1c;
      }
    }
  }

  &__note {
    color: rgba(255, 255, 255, 0.7);
  }
}

.promo {
  --block-x: #{$container-padding-x-mobile};

  @include desktop-up {
    --block-x: #{$container-padding-x-desktop};
  }
}

.banner,
.ended {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 24px 20px 18px;
  text-align: center;
  background: #ececec;
  color: $text-secondary;

  @include desktop-up {
    padding: 48px;
  }

  &__title {
    font-weight: 800;
    font-size: 18px;
    color: $black;

    @include desktop-up {
      font-size: 24px;
    }
  }

  &__text {
    max-width: 520px;
    font-size: 13px;
    line-height: 1.5;
  }
}

.ended {
  background: transparent;
  padding-top: 40px;

  &__poster {
    width: 100%;
    max-width: 380px;
    margin-top: 12px;
  }

  &__link {
    width: 100%;
    margin-top: 4px;
    padding: 14px 0;
    border-radius: $radius-btn;
    background: #fff;
    color: var(--p-base);
    font-weight: 800;
    font-size: 14px;
  }

  &__menu {
    margin-top: 8px;
    font-weight: 700;
    font-size: 13px;
    color: var(--day-base);
  }
}

.block {
  max-width: 1344px;
  margin: 0 auto;
  padding: 24px var(--block-x) 8px;

  @include desktop-up {
    padding-top: 48px;
  }

  &--wide {
    padding-left: 0;
    padding-right: 0;

    @include desktop-up {
      padding-left: var(--block-x);
      padding-right: var(--block-x);
    }
  }

  &__title {
    margin: 0 0 14px;
    font-size: 18px;
    font-weight: 800;
    color: $black;

    @include desktop-up {
      margin-bottom: 24px;
      font-size: 26px;
    }

    &--pad {
      padding: 0 var(--block-x);

      @include desktop-up {
        padding: 0;
      }
    }
  }
}

.block .banner__title {
  color: $black;
}

.grid {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include desktop-up {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 20px;
  }
}

.today {
  border-radius: 20px;
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  color: #fff;

  &__pill {
    padding: 6px 14px;
    border-radius: $radius-pill;
    background: #fff;
    font-weight: 800;
    font-size: 11px;
    letter-spacing: 0.3px;
    text-transform: uppercase;
  }

  &__offer {
    font-size: 20px;
    font-weight: 800;
    line-height: 1.25;
  }

  &__cta {
    width: 100%;
    max-width: 360px;
    padding: 14px 0;
    border-radius: $radius-btn;
    background: #fff;
    font-weight: 800;
    font-size: 15px;
  }
}

.terms {
  background: var(--day-tint);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;

  @include desktop-up {
    flex-direction: row;
    align-items: center;
    gap: 24px;
    padding: 22px 28px;
    border-radius: $radius-card;
  }

  &__title {
    flex: none;
    font-weight: 800;
    font-size: 13px;
    color: var(--day-dark);

    @include desktop-up {
      font-size: 14px;
    }
  }

  &__text {
    font-size: 12.5px;
    line-height: 1.6;
    color: $text-body-muted;

    @include desktop-up {
      font-size: 13.5px;
    }
  }
}

.facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;

  @include desktop-up {
    grid-template-columns: none;
    grid-auto-columns: minmax(0, 1fr);
    grid-auto-flow: column;
    gap: 16px;
  }
}

.fact {
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: var(--day-base);

  @include desktop-up {
    border-radius: 16px;
    padding: 20px;
    gap: 8px;
  }

  &__title {
    font-size: 12px;
    font-weight: 700;
    color: $black;

    @include desktop-up {
      font-size: 13.5px;
    }
  }

  &__text {
    font-size: 11.5px;
    line-height: 1.4;
    color: $text-secondary;

    @include desktop-up {
      font-size: 12.5px;
    }
  }
}

.footer {
  margin-top: 32px;
  background: $dark;
  padding: 24px $container-padding-x-mobile calc(90px + env(safe-area-inset-bottom));

  @include desktop-up {
    padding: 32px $container-padding-x-desktop;
  }

  &__inner {
    max-width: 1344px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    @include desktop-up {
      flex-direction: row;
      justify-content: space-between;
      flex-wrap: wrap;
    }
  }

  &__cta {
    width: 100%;
    max-width: 280px;
    display: inline-flex;
    justify-content: center;
    padding: 15px 0;
    border-radius: $radius-btn-lg;
    background: var(--day-base);
    color: #fff;
    font-weight: 800;
    font-size: 16px;

    &:hover {
      color: #fff;
      background: var(--day-dark);
    }

    @include desktop-up {
      order: 2;
      width: auto;
      padding: 13px 28px;
      font-size: 14px;
    }
  }

  &__phone {
    font-weight: 700;
    font-size: 13px;
    color: #fff;
  }

  &__addr {
    font-size: 12px;
    color: $grey;
  }

  &__links {
    display: flex;
    gap: 16px;

    @include desktop-up {
      order: 3;
    }

    a {
      font-size: 11.5px;
      color: $grey;
    }
  }
}
</style>
