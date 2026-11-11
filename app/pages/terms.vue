<script setup lang="ts">
const goBack = useGoBack('/')

useSeoMeta({
  title: 'Умови використання',
  description: 'Умови використання сайту ресторану «Дари Моря»: замовлення, ціни, доставка й оплата.',
})
</script>

<template>
  <div class="terms">
    <div class="screen-head">
      <button type="button" class="icon-btn" aria-label="Назад" @click="goBack"><UiIcon name="chevron-left" /></button>
      <h1 class="screen-head__title">Умови використання</h1>
    </div>

    <article class="card terms__body">
      <p class="terms__updated">Оновлено 11 листопада 2026 року</p>
      <p>
        Сайт moresushi.in.ua належить ресторану «Дари Моря» ({{ CONTACTS.city }}, {{ CONTACTS.address }}).
        Користуючись сайтом або оформлюючи замовлення, ви погоджуєтеся з цими умовами.
      </p>

      <h2>Замовлення</h2>
      <ul>
        <li>Замовлення вважається прийнятим після підтвердження нашим оператором.</li>
        <li>Ми можемо зателефонувати вам, щоб уточнити склад, адресу чи час доставки.</li>
        <li>Якщо якоїсь позиції немає в наявності, ми запропонуємо заміну або скасуємо її з вашої згоди.</li>
      </ul>

      <h2>Ціни та оплата</h2>
      <ul>
        <li>Ціни на сайті вказані в гривнях. Остаточну суму оператор підтверджує під час прийняття замовлення.</li>
        <li>Онлайн-оплати на сайті немає: оплата готівкою або карткою під час отримання.</li>
        <li>Знижки та акції діють на умовах, вказаних в описі акції, і не сумуються, якщо не сказано інше.</li>
      </ul>

      <h2>Доставка і самовивіз</h2>
      <p>
        Умови, зони й час доставки описані на сторінці <NuxtLink to="/delivery">доставки і самовивозу</NuxtLink>.
        Час доставки орієнтовний і може змінюватися через погоду чи завантаженість кухні.
      </p>

      <h2>Якість і претензії</h2>
      <p>
        Якщо із замовленням щось не так, зателефонуйте нам одразу: <a :href="CONTACTS.phone.href">{{ CONTACTS.phone.label }}</a>.
        Ми розберемося і запропонуємо рішення.
      </p>

      <h2>Вміст сайту і соцмереж</h2>
      <p>
        Тексти, фото й відео на сайті та в наших соцмережах (YouTube, TikTok, Instagram) належать ресторану.
        Відеоролики з кухнею — гумористичні постановки, персонажі та історії в них вигадані.
      </p>

      <h2>Персональні дані</h2>
      <p>Як ми обробляємо ваші дані, описано в <NuxtLink to="/privacy">політиці конфіденційності</NuxtLink>.</p>

      <h2>Зміни</h2>
      <p>Ми можемо оновлювати ці умови. Нова версія діє з моменту публікації на цій сторінці.</p>
    </article>
  </div>
</template>

<style scoped lang="scss">
.terms {
  max-width: 760px;
  margin: 0 auto;
  padding: 0 $container-padding-x-mobile 40px;

  @include desktop-up {
    padding: 28px $container-padding-x-desktop 48px;
    box-sizing: content-box;
  }

  &__body {
    padding: 20px;
    line-height: 1.55;

    h2 {
      margin: 24px 0 8px;
      font-size: 18px;
    }

    p {
      margin: 0 0 10px;
    }

    ul {
      margin: 0 0 10px;
      padding-left: 20px;
    }

    li {
      margin-bottom: 6px;
    }

    a {
      color: inherit;
      text-decoration: underline;
    }
  }

  &__updated {
    opacity: .7;
    font-size: 14px;
  }
}
</style>
