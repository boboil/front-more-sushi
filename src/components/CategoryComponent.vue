<template>
  <main class="content">

    <section class="block-category-products">
      <div class="container">
        <!-- если на странице одной категории то н1 -->
        <h1 class="block-title">
          {{ category.title }}
        </h1>
        <div class="category-tabs">
          <a href="#" v-for="(category, key) in categories" :key="key"
             @click="setPageStateOptions(category.slug)">{{ category.title }}</a>
        </div>
        <div class="category-products-list">
          <div class="product-item" v-for="product in products" :key="product.id">
            <div class="product-item-label orange" v-if="product.stock">Акція</div>
            <div class="product-item-label green" v-if="product.latest">Новинка</div>
            <div class="product-item-photo"
                 @click="this.$router.push('/product/' + product.slug)">
              <img :src="product.main_image"
                   :alt="product.title" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                {{ product.title }}
              </div>
              <div class="product-item-descr" v-if="product.consist">
                <p>
                  Склад: <br>
                  <span v-html="product.consist" />
                </p>
              </div>
              <div class="product-item-params">
                <div class="product-item-weight">
                  {{ product.weight }} г
                </div>
                <div class="product-item-price">
                  <span class="old-price" v-if="product.discount">{{ product.discount }}</span>
                  <span class="current-price">{{ product.price }}</span>
                  <span class="currency">
												грн
											</span>
                </div>
              </div>
              <button
                  class="btn green small product-item-add"
                  @click="addToCart(product)"
              >
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>

        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: "CategoryComponent",
  data() {
    return {
      categories: [],
      filter: "",
      category: {},
      products: [],
      cart: []
    }
  },
  mounted() {
    this.getCategories()
    const windowData = Object.fromEntries(
        new URL(window.location).searchParams.entries()
    );

    const VALID_KEYS = ["filter"];

    VALID_KEYS.forEach(key => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });
    if (localStorage.getItem('products')) {
      try {
        this.cart = JSON.parse(localStorage.getItem('products'));
      } catch (e) {
        localStorage.removeItem('products');
      }
    }
  },
  computed: {
    pageStateOptions() {
      return {
        filter: this.filter,
      };
    }
  },
  methods: {
    addToCart(product) {
      this.$emit('addToCart', product)
    },
    getCategories() {
      return this.axios.get(`${this.$API_URL}/api/shop/catalog`)
          .then((response) => {
            this.categories = response.data.data
          }).then(() => {
            if (this.filter.length) {
              this.category = this.categories.find(elem => elem.slug === this.filter)
            } else {
              this.category = this.categories.find(elem => elem.slug === 'roli')
            }
            document.title = `Заказать Суши ${this.category.title} Море Суші Сумы. Суші Сети та Роли. Море Суші у Сумах. Замовити з Доставкою до 22-00`;
          }).then(() => {
            this.products = this.category.products.data
          })
    },
    setPageStateOptions(value) {
      this.category = this.categories.find(elem => elem.slug === value)
      window.history.pushState(
          null,
          document.title = `Заказать Суши ${this.category.title} Море Суші Сумы. Суші Сети та Роли. Море Суші у Сумах. Замовити з Доставкою до 22-00`,
          `${window.location.pathname}?filter=${value}`
      );
      this.products = this.category.products.data
    }
  },
}
</script>

<style lang="scss" scoped>
.product-item {
  &:hover {
    cursor: pointer;
  }
  .product-item-photo {
    img {
      max-height: 239px;
    }
  }
}
</style>
