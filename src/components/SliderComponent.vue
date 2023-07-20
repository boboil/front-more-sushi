<template>
  <swiper
      :modules="modules"
      :slides-per-view="3"
      :space-between="15"
      navigation
      :pagination="{ clickable: true }"
      :scrollbar="{ draggable: true }"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
  >
    <swiper-slide v-for="product in relatedProducts" :key="product.id">
      <div class="product-item">
        <div class="product-item-photo">
          <img
              :src="product.main_image"
              :alt="product.title">
        </div>
        <div class="product-item-info">
          <div class="product-item-title">
            {{ product.title }}
          </div>
          <div class="product-item-params">
            <div class="product-item-weight">
              {{ product.weight }} мл
            </div>
            <div class="product-item-price">
              {{ product.price }} <span>грн</span>
            </div>
          </div>
          <button
              class="btn green small product-item-order"
              @click="addToCart(product)"
          >
            в кошик
          </button>
        </div>
      </div>
    </swiper-slide>

  </swiper>
</template>

<script>
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default {
  name: "SliderComponent",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      relatedProducts: []
    }
  },
  setup() {
    const onSwiper = (swiper) => {
      console.log(swiper);
    };
    const onSlideChange = () => {
      console.log('slide change');
    };
    return {
      onSwiper,
      onSlideChange,
      modules: [Navigation, Pagination, Scrollbar, A11y],
    };
  },
  methods: {
    addToCart(product) {
      this.$emit('addToCart', product)
    },
    getRelatedProducts() {
      return this.axios.get(`${this.$API_URL}/api/shop/related-products`)
          .then((response) => {
            this.relatedProducts = response.data.data
          })
    }
  },
  mounted() {
    this.getRelatedProducts()
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
      max-width: 239px;
    }
  }
}
</style>
