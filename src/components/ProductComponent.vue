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
          <!-- выдели в компонент, продублирую его в чекауте -->
          <div class="reelated-slider swiper-container js-related-swiper">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/9b/9b9836b9f7dc2f50f267e0d0be0235572f52cb85151.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Горіховий соус
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-weight">
                        30мл
                      </div>
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/9f/9f51cbeaf6c8c9e33fb58f8f4c0f050415cddadb1525.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Соус Сирний
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-weight">
                        30мл
                      </div>
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/b7/b7092a18a980c647864ac60cff392f15b1b669dc200.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Соус Sweet Чилі
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-weight">
                        30мл
                      </div>
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/0a/0a01e333494a6c7f1ec442272140ac5cdbf00b64153.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Соус Унагі
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-weight">
                        30мл
                      </div>
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/18/18acbb3207d19a1c84115f87aafa190326a46dc0150.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Соус Манго-Чилі
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-weight">
                        30мл
                      </div>
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/40/401954dfbd94f2c2819dc72fb4e78b66fd70bc29149.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Імбир
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-weight">
                        30мл
                      </div>
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/f3/f3499e49a800b44658b27ed32358afb9a6031843147.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Васабі
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                      <div class="product-item-weight">
                        15г
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
              <div class="swiper-slide">
                <div class="product-item">
                  <div class="product-item-photo">
                    <img
                        src="https://tokyo-sushi.com.ua/storage/products/58/58c2656f80dbc90ab7e47c7d0e6173c20a1bb5202027.jpeg"
                        alt="">
                  </div>
                  <div class="product-item-info">
                    <div class="product-item-title">
                      Сік Sandora
                    </div>
                    <div class="product-item-params">
                      <div class="product-item-price">
                        60 <span>грн</span>
                      </div>
                      <div class="product-item-weight">
                        1л
                      </div>
                    </div>
                    <button class="btn green small product-item-order">
                      в кошик
                    </button>
                    <!-- <button class="btn orange small product-item-order">
                        в кошику
                    </button> -->
                  </div>
                </div>
              </div>
            </div>
            <div class="swiper-controls">
              <div class="swiper-pagination"></div>
              <button class="swiper-button swiper-button-prev"></button>
              <button class="swiper-button swiper-button-next"></button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "ProductComponent",
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
      return this.axios.get('http://localhost/api/shop/product/' + slug)
          .then((response) => {
            this.product = response.data.data
          })
    }
  },
}
</script>

<style scoped>

</style>