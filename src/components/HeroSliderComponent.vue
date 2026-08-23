<template>
  <section class="hero-slider" v-if="slides.length">
    <div class="container">
      <swiper
          :modules="modules"
          :slides-per-view="1"
          :loop="slides.length > 1"
          navigation
          :pagination="{ clickable: true }"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
      >
        <swiper-slide v-for="slide in slides" :key="slide.id">
          <div class="hero-slide">
            <img :src="slide.image" alt="">
            <div class="hero-slide-overlay">
              <button class="btn green hero-slide-btn" @click="goTo(slide.button_link)">
                {{ slide.button_text }}
              </button>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
  </section>
</template>

<script>
import { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default {
  name: "HeroSliderComponent",
  components: {
    Swiper,
    SwiperSlide,
  },
  data() {
    return {
      slides: [],
    }
  },
  setup() {
    return {
      modules: [Autoplay, Navigation, Pagination],
    };
  },
  methods: {
    getSlides() {
      return this.axios.get(`${this.$API_URL}/api/shop/hero-slides`)
          .then((response) => {
            this.slides = response.data.data
          })
    },
    goTo(link) {
      if (/^https?:\/\//i.test(link)) {
        window.open(link, '_blank');
      } else {
        this.$router.push(link);
      }
    },
  },
  mounted() {
    this.getSlides()
  },
}
</script>

<style lang="scss" scoped>
.hero-slider {
  width: 100%;
  padding-top: 30px;

  .swiper {
    border: 1px solid #e5e5e5;
    border-radius: 16px;
    overflow: hidden;
    --swiper-navigation-color: #f16311;
    --swiper-pagination-color: #f16311;
    --swiper-pagination-bullet-inactive-color: #f16311;
    --swiper-pagination-bullet-inactive-opacity: 0.3;
  }

  .hero-slide {
    position: relative;
    height: 50vh;
    min-height: 320px;
    max-height: 560px;

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    .hero-slide-overlay {
      position: absolute;
      left: 24px;
      bottom: 24px;
    }

    @media (max-width: 767px) {
      height: 40vh;
      min-height: 220px;

      .hero-slide-overlay {
        left: 16px;
        bottom: 16px;
      }
    }
  }
}
</style>
