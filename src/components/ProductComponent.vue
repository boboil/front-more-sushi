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
                Опис:
              </div>
              <div class="product-contain-list" v-html="product.consist"></div>
            </div>

            <button
                class="btn green product-order"
                @click="addToCart">Замовити
            </button>
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
    addToCart() {
      this.$emit('addToCart', this.product)
    },
    getProduct() {
      let slug = this.$route.params.slug;
      return this.axios.get(`${this.$API_URL}/api/shop/product/${slug}`)
          .then((response) => {
            this.product = response.data.data
          }).then(() => {
            document.title = `Море Суші - ${this.product.title}`;
          })
    }
  }
}
</script>

<style scoped>

</style>