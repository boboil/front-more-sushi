<template>
  <main class="content">
    <section class="block-delivery">
      <div class="container">
        <div class="delivery-banner">
          <img :src="assetImage('delivery', 'png')" alt="delivery-banner">
        </div>
        <div class="delivery-text">
          <h1>
            Умови доставки:
          </h1>
          <p>
            до <b>400 грн</b> вартість <b>40 грн</b>
            <br>
            <br>
            <span>від 400 грн безкоштовно</span>
            <br>
            <br>
            <a href="https://maps.google.com/maps?daddr=50.915289473323675,34.814197684261224" rel="noindex nofollow noreferrer" target="_blank">Вул. Троїцька 17</a> з 9:00 до 21:00
            <br>
            самовивіз, доставка до 21:00
            <br>
            <br>
            <a href="https://maps.google.com/maps?daddr=50.91035241605848,34.82046892659989" rel="noindex nofollow noreferrer" target="_blank">Вул. Лушпи 13</a> з 8:00 до 20:00
            <br>
            <br>
            <a href="https://maps.google.com/maps?daddr=50.913232348724726,34.79626734670682" rel="noindex nofollow noreferrer" target="_blank">Центральний ринок</a> з 8:00 до 16:00
            <br>
            самовивіз
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import {assetImage} from '@/helpers/helpers'

export default {
  name: "DeliveryComponent",
  data() {
    return {
      assetImage
    }
  },
}
</script>