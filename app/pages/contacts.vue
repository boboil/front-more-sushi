<script setup lang="ts">
const goBack = useGoBack('/')

useSeoMeta({
  title: 'Контакти',
  description: `Дари Моря: ${CONTACTS.city}, ${CONTACTS.address}, ${CONTACTS.hours}. Телефон ${CONTACTS.phone.label}.`,
})

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      'name': 'Дари Моря',
      'servesCuisine': 'Japanese',
      'telephone': '+380990663511',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'вул. Троїцька, 17',
        'addressLocality': 'Суми',
        'addressCountry': 'UA',
      },
      'openingHours': 'Mo-Su 11:00-20:30',
    }),
  }],
})

const fields = reactive({ name: '', email: '', question: '' })
const errors = ref<Record<string, string>>({})
const status = ref<'idle' | 'sending' | 'sent' | 'failed'>('idle')

async function submit() {
  const e: Record<string, string> = {}
  if (!fields.name.trim()) e.name = 'Вкажіть ім\'я'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) e.email = 'Вкажіть коректний e-mail'
  if (!fields.question.trim()) e.question = 'Напишіть повідомлення'
  errors.value = e
  if (Object.keys(e).length) return

  status.value = 'sending'
  try {
    await $fetch('/api/question', { method: 'POST', body: fields })
    Object.assign(fields, { name: '', email: '', question: '' })
    status.value = 'sent'
  }
  catch (err: unknown) {
    const fieldErrors = (err as { data?: { data?: { errors?: Record<string, string> } } }).data?.data?.errors
    if (fieldErrors) {
      errors.value = fieldErrors
      status.value = 'idle'
    }
    else {
      status.value = 'failed'
    }
  }
}
</script>

<template>
  <div class="contacts">
    <div class="screen-head">
      <button type="button" class="icon-btn" aria-label="Назад" @click="goBack"><UiIcon name="chevron-left" /></button>
      <h1 class="screen-head__title">Контакти</h1>
    </div>

    <div class="contacts__grid">
      <div class="contacts__info">
        <section class="card contacts__card">
          <div class="section-label">Наше місцезнаходження</div>
          <a :href="CONTACTS.map" class="contacts__big" target="_blank" rel="noopener noreferrer">
            {{ CONTACTS.city }}, {{ CONTACTS.address }}
          </a>
          <p class="contacts__note">Працюємо {{ CONTACTS.hours }} · самовивіз і доставка</p>
        </section>

        <section class="card contacts__card">
          <div class="section-label">Телефон</div>
          <a :href="CONTACTS.phone.href" class="contacts__big">{{ CONTACTS.phone.label }}</a>
          <p class="contacts__note">Приймаємо замовлення та відповідаємо на питання</p>
        </section>

        <section class="card contacts__card">
          <div class="section-label">Instagram</div>
          <a :href="CONTACTS.instagram.href" class="contacts__big" target="_blank" rel="noopener">{{ CONTACTS.instagram.label }}</a>
        </section>

        <NuxtLink to="/delivery" class="contacts__link">Умови доставки →</NuxtLink>
      </div>

      <section class="card contacts__form-card">
        <h2 class="contacts__form-title">Зворотній зв'язок</h2>

        <div v-if="status === 'sent'" class="contacts__sent">
          <div class="contacts__sent-icon"><UiIcon name="check" :size="26" :stroke="2" /></div>
          <div class="contacts__sent-title">Дякуємо! Повідомлення надіслано</div>
          <p class="contacts__note">Ми відповімо на вказаний e-mail найближчим часом.</p>
          <button type="button" class="btn btn--outline" @click="status = 'idle'">Написати ще</button>
        </div>

        <form v-else class="contacts__form" novalidate @submit.prevent="submit">
          <label class="field">Ім'я
            <input v-model="fields.name" class="input" :class="{ 'input--invalid': errors.name }" placeholder="Як до вас звертатися" autocomplete="name">
            <span v-if="errors.name" class="field__error">{{ errors.name }}</span>
          </label>
          <label class="field">E-mail
            <input v-model="fields.email" type="email" class="input" :class="{ 'input--invalid': errors.email }" placeholder="you@example.com" autocomplete="email">
            <span v-if="errors.email" class="field__error">{{ errors.email }}</span>
          </label>
          <label class="field">Повідомлення
            <textarea v-model="fields.question" class="input contacts__textarea" :class="{ 'input--invalid': errors.question }" placeholder="Ваше питання або повідомлення" />
            <span v-if="errors.question" class="field__error">{{ errors.question }}</span>
          </label>
          <p v-if="status === 'failed'" class="contacts__error">
            Не вдалося надіслати. Спробуйте ще раз або зателефонуйте: <a :href="CONTACTS.phone.href">{{ CONTACTS.phone.label }}</a>
          </p>
          <button type="submit" class="btn btn--primary contacts__submit" :disabled="status === 'sending'">
            {{ status === 'sending' ? 'Надсилаємо…' : 'Відправити повідомлення' }}
          </button>
        </form>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
.contacts {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 $container-padding-x-mobile 40px;

  @include desktop-up {
    padding: 28px $container-padding-x-desktop 48px;
    box-sizing: content-box;
  }

  &__grid {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-top: 4px;

    @include desktop-up {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 24px;
      align-items: start;
      padding-top: 0;
    }
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;

    @include desktop-up {
      padding: 22px;
    }
  }

  &__big {
    font-weight: 700;
    font-size: 18px;
  }

  &__note {
    font-size: 13px;
    color: $text-secondary;
  }

  &__link {
    padding: 0 4px;
    font-weight: 600;
  }

  &__form-card {
    padding: 16px;

    @include desktop-up {
      padding: 22px;
    }
  }

  &__form-title {
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 14px;

    @include desktop-up {
      font-weight: 800;
    }
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  &__textarea {
    min-height: 120px;
  }

  &__error {
    font-size: 13px;
    color: $orange-dark;
  }

  &__submit {
    height: 52px;
    border-radius: $radius-btn-lg;
    font-size: 16px;
  }

  &__sent {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 24px 8px;
    text-align: center;
  }

  &__sent-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 28px;
    background: $orange-tint;
    color: $orange;
  }

  &__sent-title {
    font-weight: 700;
    font-size: 18px;
  }
}
</style>
