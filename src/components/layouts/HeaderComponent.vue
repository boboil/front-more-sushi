<template>
  <div :class="{ 'mobile-menu-open': mobileMenuOpen }">
    <header class="header">
      <div class="container">
        <button class="burger-btn" @click="mobileMenuOpen = !mobileMenuOpen">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div class="logo">
          <router-link to="/">
            <img :src="assetImage('logo')" alt="logo">
          </router-link>
        </div>
        <div class="collapsed">
          <nav class="menu">
            <ul>
              <li>
                <router-link
                    to="/"
                    active-class="active"
                    @click="mobileMenuOpen = !mobileMenuOpen">Головна
                </router-link>
              </li>
              <li>
                <router-link
                    to="/catalog"
                    active-class="active"
                    @click="mobileMenuOpen = !mobileMenuOpen">Меню
                </router-link>
              </li>
              <li>
                <a href="/">Акції</a>
              </li>
              <li>
                <router-link
                    to="/delivery"
                    active-class="active"
                    @click="mobileMenuOpen = !mobileMenuOpen">Доставка
                </router-link>
              </li>
              <li>
                <router-link
                    to="/contacts"
                    active-class="active"
                    @click="mobileMenuOpen = !mobileMenuOpen">Контакти
                </router-link>
              </li>
            </ul>
          </nav>

          <div class="contacts">
            <a href="https://instagram.com/darymorya.sushi.sumy" rel="nofollow noopener" class="insta" target="_blank">
              <img :src="assetIcon('icon-insta', 'png')" alt="icon-insta">
            </a>
            <a href="tel:0990663511" class="phone">
              <img :src="assetIcon('icon-phone', 'png')" alt="icon-phone">
              <span>099-066-35-11</span>
            </a>
          </div>
        </div>
        <!-- выводи корзину если есть продукты -->
        <CartComponent
            :cart-product="product"
            :clear-cart="clearCart"
            @cartAdded="cartAdded"
            @cartCleared="cartCleared"
        />
      </div>
    </header>
  </div>
</template>
<script>
import {assetIcon, assetImage} from "@/helpers/helpers";
import CartComponent from "@/components/CartComponent.vue";

export default {
  name: "HeaderComponent",
  components: {CartComponent},
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    clearCart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mobileMenuOpen: false,
      assetIcon,
      assetImage
    }
  },
  methods: {
    cartAdded() {
      this.$emit('cartAdded')
    },
    cartCleared() {
      this.$emit('cartCleared')
    }
  }
}
</script>

<style scoped>
.burger-btn {
  z-index: 3;
}
</style>