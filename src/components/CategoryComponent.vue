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
          <div class="product-item" v-for="product in products" :key="product.id"
               @click="this.$router.push('/product/' + product.slug)">
            <div class="product-item-label orange" v-if="product.stock">Акція</div>
            <div class="product-item-label green" v-if="product.latest">Новинка</div>
            <div class="product-item-photo">
              <img :src="product.main_image"
                   :alt="product.title" loading="lazy">
            </div>
            <div class="product-item-info">
              <div class="product-item-title">
                {{ product.title }}
              </div>
              <div class="product-item-descr">
                <p>
                  Склад: <br>
                  рис, водорості норі, сир «Філадельфія», лосось, манго, сир чеддер.&nbsp;
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
              <button class="btn green small product-item-add">
                в кошик
              </button>
              <!-- <button class="btn orange small product-item-add">
                в кошику
              </button> -->
            </div>
          </div>

        </div>
        <!-- <button class="loadmore">
          <span>показати більше</span>
          <span class="circle"></span>
          <span class="circle"></span>
          <span class="circle"></span>
        </button> -->
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
      products: []
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
  },
  computed: {
    pageStateOptions() {
      return {
        filter: this.filter,
      };
    }
  },
  methods: {
    getCategories() {
      return this.axios.get('http://localhost/api/shop/catalog')
          .then((response) => {
            this.categories = response.data.data
          }).then(() => {
            if (this.filter.length) {
              this.category = this.categories.find(elem => elem.slug === this.filter)
            } else {
              this.category = this.categories.find(elem => elem.slug === 'roli')
            }
          }).then(() => {
            this.products = this.category.products.data
          })
    },
    setPageStateOptions(value) {
      window.history.pushState(
          null,
          document.title,
          `${window.location.pathname}?filter=${value}`
      );
      this.category = this.categories.find(elem => elem.slug === value)
      this.products = this.category.products.data
    }
  },
}
</script>

<style scoped>

</style>