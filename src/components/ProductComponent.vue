<template>
  <main class="content">
    <section class="block-product">
      <div class="container">
        <div class="product">
          <div class="product-photo">
            <div class="product-label green" v-if="product.latest > 0">
                Новинка
            </div>
            <div class="product-label orange" v-if="product.stock > 0">
              Акція
            </div>
            <img :src="product.main_image"
                 :alt="product.title">
          </div>
          <div class="product-info">
            <h1 class="product-title">
              {{ product.title }}
            </h1>
            <div class="product-price">
              <div class="old-price" v-if="product.discount > 0">{{ product.discount }}</div>
              <div class="current-price">{{ product.price }}</div>
              <span>грн</span>
            </div>
            <div class="product-weight">
              / {{ product.count }} шт, {{ product.weight }} г
            </div>
            <div class="product-contain">
              <div class="product-contain-title">
                Склад:
              </div>
              <div class="product-contain-list">
                <a href="/" class="product-contain-item" target="_blank">
                  <img src="https://tokyo-sushi.com.ua/storage/ingredients/June2022/yuoDIwHhwuSOCTB5LOxP-cropped.jpg"
                       alt="">
                  <span>Монако рол </span>
                </a>
                <a href="/" class="product-contain-item" target="_blank">
                  <img src="https://tokyo-sushi.com.ua/storage/ingredients/June2022/H2mMD4gaEBx27hRXvJka-cropped.jpeg"
                       alt="">
                  <span>Сирний рол з тунцем </span>
                </a>
                <a href="/" class="product-contain-item" target="_blank">
                  <img src="https://tokyo-sushi.com.ua/storage/ingredients/June2022/jkCLEl6is78vjvS6TUX3-cropped.jpeg"
                       alt="">
                  <span>Фелікс рол з мідіями </span>
                </a>
                <a href="/" class="product-contain-item" target="_blank">
                  <img src="https://tokyo-sushi.com.ua/storage/ingredients/June2022/9xNb3Vbn2WffUzZeaydq-cropped.jpg"
                       alt="">
                  <span>Філадельфія з запечений лососем </span>
                </a>
                <a href="/" class="product-contain-item" target="_blank">
                  <img src="https://tokyo-sushi.com.ua/storage/ingredients/June2022/f7SCP2EjGsGy43Dy5ZPM-cropped.jpeg"
                       alt="">
                  <span>Філадельфія кальмар темпура </span>
                </a>
              </div>
            </div>

            <button class="btn green product-order">Замовити</button>
            <!-- <button class="btn orange product-order">В кошику</button> -->
          </div>
        </div>
      </div>
    </section>

    <section class="block-related-products">
      <div class="container">
        <h2 class="block-title">
          З цим товаром купують
        </h2>
        <div class="related-products">
          <div class="reelated-slider swiper-container js-related-swiper">
            <div class="swiper-wrapper">
              <SliderComponent/>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import SliderComponent from "@/components/SliderComponent";
export default {
  name: "ProductComponent",
  components: {SliderComponent},
  data() {
    return {
      product: {}
    }
  },
  mounted() {
    this.getProduct()
  },
  methods: {
    getProduct() {
      let slug = this.$route.params.slug;
      return this.axios.get(`${this.$API_URL}/api/shop/product/${slug}`)
          .then((response) => {
            this.product = response.data.data
          })
    }
  },
}
</script>

<style scoped>

</style>