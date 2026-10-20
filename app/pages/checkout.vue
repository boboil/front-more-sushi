<script setup lang="ts">
const cart = useCart()
const { form, errors, submitting, failed, submit } = useCheckout()
const { deliveryCost } = useMenu()
const { public: { features } } = useRuntimeConfig()

useSeoMeta({ title: 'Оформлення замовлення', robots: 'noindex' })

if (cart.isEmpty.value) {
  await navigateTo('/cart', { redirectCode: 302 })
}

// Онлайн-оплати на сайті немає — лише ті варіанти, що були в старому оформленні
const payOptions = computed(() => [
  { id: 'cash', label: 'Готівкою', note: '' },
  { id: 'terminal', label: 'Карткою через термінал', note: isDelivery.value ? 'кур\'єру при доставці' : 'при отриманні' },
] as const)

const sticksOptions = [
  { id: 'standard', label: 'Звичайні' },
  { id: 'educational', label: 'Навчальні' },
] as const

const track = useTrack()
onMounted(() => {
  if (!cart.isEmpty.value) track('begin_checkout', { lines: cart.lines.value, value: cart.total.value })
})

const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Kyiv' }).format(new Date())

function setWhen(when: 'asap' | 'time') {
  form.value.when = when
  if (when === 'time' && !form.value.date) form.value.date = today
}

function setSticks(id: 'standard' | 'educational', n: number) {
  form.value.sticks[id] = Math.min(Math.max(n, 0), 20)
}

const isDelivery = computed(() => form.value.mode === 'delivery')
const bonus = computed(() => (features.bonus && form.value.useBonus ? Math.min(DEMO_BONUS_BALANCE, cart.total.value) : 0))
const delivery = computed(() => (isDelivery.value ? deliveryFee(deliveryCost.value, cart.subtotal.value) : 0))
const total = computed(() => cart.total.value - bonus.value + delivery.value)
const deliveryLabel = computed(() => {
  if (!isDelivery.value) return 'самовиніс'
  return delivery.value ? formatPrice(delivery.value) : 'уточнює оператор'
})

function onPhone(e: Event) {
  form.value.phone = formatPhone((e.target as HTMLInputElement).value)
}

async function onSubmit() {
  if (await submit()) await navigateTo('/order/success')
}
</script>

<template>
  <form class="checkout" novalidate @submit.prevent="onSubmit">
    <div class="screen-head">
      <NuxtLink to="/cart" class="icon-btn" aria-label="Назад"><UiIcon name="chevron-left" /></NuxtLink>
      <h1 class="screen-head__title">
        <span class="only-mobile">Оформлення</span>
        <span class="only-desktop">Оформлення замовлення</span>
      </h1>
    </div>

    <div class="checkout__grid">
      <div class="checkout__main">
        <div class="segmented only-mobile-segment" role="radiogroup" aria-label="Спосіб отримання">
          <button type="button" role="radio" :aria-checked="isDelivery" :class="{ on: isDelivery }" @click="form.mode = 'delivery'">Доставка</button>
          <button type="button" role="radio" :aria-checked="!isDelivery" :class="{ on: !isDelivery }" @click="form.mode = 'pickup'">Самовиніс</button>
        </div>

        <div class="card co-card co-card--contacts">
          <div class="segmented segmented--in-card" role="radiogroup" aria-label="Спосіб отримання">
            <button type="button" role="radio" :aria-checked="isDelivery" :class="{ on: isDelivery }" @click="form.mode = 'delivery'">Доставка</button>
            <button type="button" role="radio" :aria-checked="!isDelivery" :class="{ on: !isDelivery }" @click="form.mode = 'pickup'">Самовиніс</button>
          </div>

          <div class="co-row co-row--2">
            <label class="field">Ім'я
              <input v-model="form.name" class="input" :class="{ 'input--invalid': errors.name }" placeholder="Як до вас звертатися" autocomplete="given-name" required>
              <span v-if="errors.name" class="field__error">{{ errors.name }}</span>
            </label>
            <label class="field">Телефон
              <input
                :value="form.phone"
                type="tel"
                inputmode="tel"
                class="input"
                :class="{ 'input--invalid': errors.phone }"
                placeholder="+380 __ ___ __ __"
                autocomplete="tel"
                required
                @input="onPhone"
              >
              <span v-if="errors.phone" class="field__error">{{ errors.phone }}</span>
            </label>
          </div>

          <template v-if="isDelivery">
            <div class="co-row co-row--address">
              <label class="field">Адреса
                <input v-model="form.address" class="input" :class="{ 'input--invalid': errors.address }" placeholder="Вулиця, будинок" autocomplete="street-address" required>
                <span v-if="errors.address" class="field__error">{{ errors.address }}</span>
              </label>
              <label class="field">Під'їзд
                <input v-model="form.entrance" class="input" placeholder="№">
              </label>
            </div>
          </template>
          <p v-else class="co-hint">Оператор підтвердить адресу видачі та час готовності.</p>
        </div>

        <div class="co-row co-row--cards">
          <div class="card co-card">
            <div class="co-card__title">{{ isDelivery ? 'Коли доставити' : 'Коли заберете' }}</div>
            <div class="co-when">
              <button type="button" class="co-when__opt" :class="{ on: form.when === 'asap' }" @click="setWhen('asap')">Якнайшвидше</button>
              <button type="button" class="co-when__opt" :class="{ on: form.when === 'time' }" @click="setWhen('time')">На час</button>
            </div>
            <div v-if="form.when === 'time'" class="co-when__datetime">
              <label class="field">Дата
                <input v-model="form.date" type="date" :min="today" class="input" :class="{ 'input--invalid': errors.date }">
                <span v-if="errors.date" class="field__error">{{ errors.date }}</span>
              </label>
              <label class="field">Час
                <input v-model="form.time" type="time" class="input" :class="{ 'input--invalid': errors.time }">
                <span v-if="errors.time" class="field__error">{{ errors.time }}</span>
              </label>
            </div>
          </div>

          <div class="card co-card co-card--pay">
            <div class="co-card__title co-card__title--pay">Оплата</div>
            <div role="radiogroup" aria-label="Оплата">
              <button
                v-for="o in payOptions"
                :key="o.id"
                type="button"
                role="radio"
                class="co-radio"
                :aria-checked="form.payment === o.id"
                @click="form.payment = o.id"
              >
                <span class="co-radio__ring" :class="{ on: form.payment === o.id }"><span /></span>
                <span>{{ o.label }}<template v-if="o.note">{{ ' ' }}<span class="co-radio__note">({{ o.note }})</span></template></span>
              </button>
            </div>
            <UiToggle v-if="features.bonus" v-model="form.useBonus" class="only-mobile">
              <span class="co-bonus__title">Списати бонуси</span>
              <span class="co-bonus__sub">На рахунку {{ formatPrice(DEMO_BONUS_BALANCE) }}</span>
            </UiToggle>
          </div>
        </div>

        <div class="card co-card">
          <div class="co-card__title">Палички</div>
          <div v-for="o in sticksOptions" :key="o.id" class="co-sticks">
            <span>{{ o.label }}</span>
            <UiStepper
              :value="form.sticks[o.id]"
              variant="neutral"
              size="sm"
              @dec="setSticks(o.id, form.sticks[o.id] - 1)"
              @inc="setSticks(o.id, form.sticks[o.id] + 1)"
            />
          </div>
        </div>
      </div>

      <aside class="checkout__side">
        <div class="co-summary">
          <div class="co-summary__title only-desktop">Ваше замовлення</div>
          <div class="co-summary__lines only-desktop">
            <div v-for="l in cart.lines.value" :key="l.product.id" class="co-summary__line">
              <span>{{ l.product.name }} × {{ l.qty }}</span><span>{{ formatPrice(l.sum) }}</span>
            </div>
          </div>
          <UiToggle v-if="features.bonus" v-model="form.useBonus" class="co-summary__bonus only-desktop">
            <span class="co-bonus__title">Списати бонуси</span>
            <span class="co-bonus__sub">На рахунку {{ formatPrice(DEMO_BONUS_BALANCE) }}</span>
          </UiToggle>
          <div class="summary-row only-mobile"><span>Страви ({{ cart.count.value }})</span><span>{{ formatPrice(cart.subtotal.value) }}</span></div>
          <div v-if="cart.discount.value" class="summary-row summary-row--success">
            <span>Промокод {{ cart.promo.value.code }}</span><span>−{{ formatPrice(cart.discount.value) }}</span>
          </div>
          <div v-if="bonus" class="summary-row summary-row--success"><span>Бонуси</span><span>−{{ formatPrice(bonus) }}</span></div>
          <div class="summary-row summary-row--muted"><span>Доставка</span><span>{{ deliveryLabel }}</span></div>
          <div class="summary-row summary-row--total co-summary__total"><span>Разом</span><span>{{ formatPrice(total) }}</span></div>

          <p v-if="failed" class="co-error">Не вдалося оформити замовлення. Спробуйте ще раз або зателефонуйте нам: <a href="tel:0990663511">099-066-35-11</a></p>

          <div class="sticky-cta">
            <button type="submit" class="btn btn--primary btn--cta co-submit" :disabled="submitting">
              <span>{{ submitting ? 'Відправляємо…' : 'Підтвердити замовлення' }}</span>
              <span class="only-mobile">{{ formatPrice(total) }}</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  </form>
</template>

<style scoped lang="scss">
.checkout {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 $container-padding-x-mobile 110px;

  @include desktop-up {
    padding: 28px $container-padding-x-desktop 48px;
    box-sizing: content-box;
  }

  @include tablet {
    padding: 24px $container-padding-x-tablet 48px;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 4px;

    @include desktop-up {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 380px;
      gap: 24px;
      align-items: start;
      padding-top: 0;
    }

    @include tablet {
      grid-template-columns: minmax(0, 1fr) 320px;
    }
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 14px;

    @include desktop-up {
      gap: 16px;
    }
  }

  &__side {
    @include desktop-up {
      position: sticky;
      top: calc(#{$header-height} + 28px);
    }
  }
}

// сегмент Доставка / Самовиніс: на мобільному — над карткою, на десктопі — всередині
.segmented {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
  padding: 4px;
  border-radius: $radius-btn-lg;
  background: $segment-bg;

  button {
    @include reset-button;
    height: 42px;
    border-radius: 11px;
    font-weight: 600;
    font-size: 14px;
    color: $text-secondary;
    transition: background $duration, color $duration;

    &.on {
      background: #fff;
      color: $black;
    }
  }

  &--in-card {
    max-width: 360px;

    @include mobile {
      display: none;
    }
  }
}

.only-mobile-segment {
  @include desktop-up {
    display: none;
  }
}

.co-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;

  @include desktop-up {
    padding: 22px;
  }

  &--contacts {
    @include desktop-up {
      gap: 16px;
    }
  }

  &--pay {
    gap: 0;
    padding: 6px 14px;

    @include desktop-up {
      padding: 12px 22px;
    }
  }

  &__title {
    font-weight: 600;

    @include desktop-up {
      font-weight: 700;
      font-size: 16px;
    }

    &--pay {
      padding: 10px 0 4px;
    }
  }
}

.co-row {
  display: grid;
  gap: 12px;

  &--2 {
    @include desktop-up {
      grid-template-columns: 1fr 1fr;
    }
  }

  // доставляємо до під'їзду — поверх і квартира не потрібні
  &--address {
    grid-template-columns: minmax(0, 1fr) 100px;
    gap: 8px;

    @include desktop-up {
      grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
      gap: 12px;
    }
  }

  &--cards {
    gap: 14px;

    @include desktop-up {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
  }
}

.co-hint {
  font-size: 13px;
  color: $text-secondary;

  @include desktop-up {
    font-size: 14px;
  }
}

.co-when {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;

  &__opt {
    height: 44px;
    border-radius: $radius-btn;
    border: 1px solid $divider-section;
    background: $input-bg;
    font-weight: 500;
    font-size: 14px;
    transition: background $duration, border-color $duration;

    @include desktop-up {
      height: 46px;
    }

    &.on {
      background: $orange-tint;
      border-color: $orange;
    }
  }
}

.co-radio {
  @include reset-button;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  padding: 6px 0;
  border-bottom: 1px solid $divider-card;
  font-size: 15px;
  text-align: left;

  @include desktop-up {
    min-height: 44px;
    font-size: 14px;

    &:last-child {
      border-bottom: 0;
    }
  }

  &__note {
    color: $text-secondary;
    font-size: 0.9em;
    white-space: nowrap;
  }

  &__ring {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid $radio-off;

    &.on {
      border-color: $orange;

      span {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: $orange;
      }
    }
  }
}

.co-bonus {
  &__title {
    font-size: 15px;

    @include desktop-up {
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__sub {
    font-size: 12px;
    color: $text-secondary;
  }
}

.co-when__datetime {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.co-sticks {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 15px;

  @include desktop-up {
    font-size: 14px;
  }
}

.co-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 4px;

  @include desktop-up {
    gap: 12px;
    padding: 22px;
    background: #fff;
    border-radius: 20px;
    box-shadow: $shadow-card;
    font-size: 14px;
  }

  &__title {
    font-weight: 800;
    font-size: 20px;
  }

  &__lines {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__line {
    display: flex;
    justify-content: space-between;
    gap: 12px;

    > :first-child {
      color: $text-body-muted;
    }

    > :last-child {
      font-weight: 600;
      white-space: nowrap;
    }
  }

  &__bonus {
    border-top: 1px solid $divider-card;
  }

  &__total {
    @include desktop-up {
      padding-top: 12px;

      > :first-child {
        font-size: 18px;
      }

      > :last-child {
        font-size: 26px;
      }
    }
  }
}

.co-error {
  font-size: 13px;
  color: $orange-dark;
}

.co-submit {
  @include desktop-up {
    height: 56px;
    justify-content: center;
    margin-top: 4px;
  }
}
</style>
